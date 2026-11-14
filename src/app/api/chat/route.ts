import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  buildGroundedResponseFallback,
  cleanAssistantReply,
  retrieveKnowledgeChunks,
  type RetrievalResult,
  type UserLiveStateContext,
} from "@/lib/chatbot-rag";

interface ChatHistoryMessage {
  role: "user" | "bot";
  content: string;
}

interface ChatRequestBody {
  message?: unknown;
  role?: unknown;
  pathname?: unknown;
  history?: unknown;
  userContext?: unknown;
}

const GEMINI_MODEL = "gemini-4-hydrogen";

function parseUserContext(raw: unknown): UserLiveStateContext | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const obj = raw as Record<string, unknown>;
  const pick = (key: string, maxLen = 400): string | undefined =>
    typeof obj[key] === "string" && obj[key].trim()
      ? obj[key].trim().slice(0, maxLen)
      : undefined;

  const ctx: UserLiveStateContext = {
    userName: pick("userName", 120),
    program: pick("program", 160),
    pageTitle: pick("pageTitle", 120),
    activeScenarioLabel: pick("activeScenarioLabel", 140),
    activeScenarioDescription: pick("activeScenarioDescription", 280),
    thesisSummary: pick("thesisSummary", 700),
  };

  return Object.values(ctx).some(Boolean) ? ctx : undefined;
}

function buildLivePortalStateBlock(
  activeRole: string,
  pathname: string,
  userContext?: UserLiveStateContext,
): string {
  const lines = [
    `- Active Portal Role: ${activeRole || "public"}`,
    `- Current Page: ${userContext?.pageTitle || pathname || "Public Portal"}`,
  ];

  if (userContext?.userName) {
    lines.push(`- Signed-in User: ${userContext.userName}`);
  }
  if (userContext?.program) {
    lines.push(`- Program: ${userContext.program}`);
  }
  if (userContext?.activeScenarioLabel) {
    const desc = userContext.activeScenarioDescription
      ? ` — ${userContext.activeScenarioDescription}`
      : "";
    lines.push(
      `- Active Status / View on This Page: ${userContext.activeScenarioLabel}${desc}`,
    );
  }
  if (userContext?.thesisSummary) {
    lines.push(`- Current Thesis / Milestone State: ${userContext.thesisSummary}`);
  }

  return lines.join("\n");
}

function buildSystemInstruction(
  retrieval: RetrievalResult,
  activeRole: string,
  pathname: string,
  userContext?: UserLiveStateContext,
): string {
  const knowledgeContext =
    retrieval.hits.length > 0
      ? retrieval.hits
          .slice(0, 4)
          .map((hit, idx) => {
            const cleanEn = cleanAssistantReply(hit.chunk.answerEn);
            const cleanTl = cleanAssistantReply(hit.chunk.answerTl);
            return [
              `[Source ${idx + 1}: ${hit.chunk.title}]`,
              `English: ${cleanEn}`,
              `Tagalog/Taglish: ${cleanTl}`,
            ].join("\n");
          })
          .join("\n\n---\n\n")
      : "No specific EARIST Manual of Operations section matched this message directly.";

  const languageRule =
    retrieval.language === "tl"
      ? "Respond naturally in polite, everyday Tagalog like a helpful university office staff member."
      : retrieval.language === "taglish"
        ? "Respond naturally in friendly, clear Taglish matching the user's conversational tone."
        : "Respond clearly, politely, and concisely in plain English like a helpful university staff member.";

  const livePortalState = buildLivePortalStateBlock(
    activeRole,
    pathname,
    userContext,
  );

  return `You are the official EARIST Graduate School Assistant — a warm, helpful Graduate School Office staff guide for EARIST.

<LIVE_USER_PORTAL_STATE>
${livePortalState}
</LIVE_USER_PORTAL_STATE>

Language Instruction:
- ${languageRule}

Strict Response Format & Persona Rules:
1. PLAIN TEXT ONLY: Never use Markdown symbols (*, **, #, ###, ---, or backticks). For numbered steps, use simple plain lines like "1. Title Defense - ...".
2. CONCISE YET COMPLETE ("sakto lang"): Keep your answer focused, direct, and easy to scan (2 to 4 short sentences for simple questions, or a clean numbered list). Answer only what was asked without dumping unrelated background, BUT never omit or truncate items when the user asks for the list of graduate programs, admission/enrollment requirements, eligibility rules, or process steps — include all official items from <RETRIEVED_KNOWLEDGE_BASE>.
3. HUMAN-READABLE STAFF TONE: Never mention internal handbook codes or policy citations (no "Manual Sec. 7.10", "Sec. 7.18", "CMO No. 15", etc.), and refer to pages by plain name (e.g., "Proposal Defense page", "Student Dashboard") rather than raw URL paths like /student/thesis.
4. MODEL & IDENTITY GUARDRAIL: Never mention Gemini, Google, Hydrogen, OpenAI, GPT, or being a large language model. If asked who or what you are, state only that you are the EARIST Graduate School Assistant.
5. LIVE PORTAL STATE AWARENESS: Only include the user's <LIVE_USER_PORTAL_STATE> details when they explicitly ask about their own current status, step, title, adviser, or what to do on the current page. Do NOT add unsolicited summaries of their dashboard status or extra topic suggestions if they did not ask for them.
6. KNOWLEDGE BOUNDARY: For factual Graduate School inquiries, rely ONLY on <LIVE_USER_PORTAL_STATE> and <RETRIEVED_KNOWLEDGE_BASE> (and recent conversation context). Never invent fees, dates, or rules. If a substantive factual question is not answered in those sources, politely say it is outside your Graduate School information and refer them to earistofficial1945@gmail.com or (02) 7738 5059.
7. CONVERSATIONAL & PRE-QUESTION MESSAGES: If the user sends a greeting, thank-you message (e.g., "Thanks for the information!", "Salamat sa iyong impormasyon!"), pause ("Wait lang"), closing, acknowledgment ("Ok", "Noted"), or pre-question opener ("May tanong ako sa thesis"), reply warmly and naturally in ONLY ONE short sentence without refusing them, without summarizing their dashboard, and without extra paragraphs.

<RETRIEVED_KNOWLEDGE_BASE>
${knowledgeContext}
</RETRIEVED_KNOWLEDGE_BASE>`;
}

function buildConversationInput(
  message: string,
  history: ChatHistoryMessage[],
): string {
  const recentHistory = history.slice(-4);
  if (recentHistory.length === 0) {
    return message;
  }

  const transcript = recentHistory
    .map(
      (turn) =>
        `${turn.role === "user" ? "User" : "Assistant"}: ${turn.content.slice(0, 400)}`,
    )
    .join("\n");

  return `Recent conversation context:\n${transcript}\n\nCurrent user question: ${message}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const rawMessage =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!rawMessage) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    const message = rawMessage.slice(0, 1000);
    const activeRole =
      typeof body.role === "string" ? body.role.trim() : "public";
    const pathname =
      typeof body.pathname === "string" ? body.pathname.trim() : "/";
    const userContext = parseUserContext(body.userContext);
    const history: ChatHistoryMessage[] = Array.isArray(body.history)
      ? body.history.filter(
          (item): item is ChatHistoryMessage =>
            Boolean(item) &&
            typeof item === "object" &&
            (item.role === "user" || item.role === "bot") &&
            typeof item.content === "string",
        )
      : [];

    // Retrieve top chunks for the current query
    let retrieval = retrieveKnowledgeChunks(message, activeRole, 4, userContext);

    // For brief conversational follow-ups (e.g. "How about Doctoral?"), enrich with last user message
    const wordCount = message.split(/\s+/).filter(Boolean).length;
    const isShortFollowUp =
      wordCount <= 6 &&
      /\b(how about|what about|eh yung|eh sa|paano naman|how long|magkano|ilan|doctoral|masters)\b/i.test(
        message,
      );
    if (
      !retrieval.isGreeting &&
      !retrieval.isConversational &&
      !retrieval.isIdentityQuery &&
      retrieval.isOutOfScope &&
      isShortFollowUp
    ) {
      const lastUserTurn = [...history]
        .reverse()
        .find((turn) => turn.role === "user");
      if (lastUserTurn) {
        const combinedRetrieval = retrieveKnowledgeChunks(
          `${lastUserTurn.content} ${message}`,
          activeRole,
          4,
          userContext,
        );
        if (!combinedRetrieval.isOutOfScope) {
          retrieval = {
            ...combinedRetrieval,
            query: message,
            language: retrieval.language,
          };
        }
      }
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // Only identity guardrail and explicit off-topic queries short-circuit before Gemini.
    // Greetings, conversational messages (thanks/ok/wait), and borderline queries are processed by Gemini
    // when an API key is configured; offline/no-key environments use the deterministic local fallback.
    if (
      !apiKey ||
      retrieval.isIdentityQuery ||
      retrieval.isExplicitOutOfScope
    ) {
      const fallback = buildGroundedResponseFallback(
        retrieval,
        activeRole,
        userContext,
      );
      return NextResponse.json({
        reply: fallback.reply,
        citations: [],
        relatedRoutes: [],
        language: retrieval.language,
        mode: "local-rag",
        isOutOfScope:
          retrieval.isOutOfScope &&
          !retrieval.isConversational &&
          !retrieval.isGreeting,
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = buildSystemInstruction(
      retrieval,
      activeRole,
      pathname,
      userContext,
    );
    const input = buildConversationInput(message, history);

    try {
      const interaction = await ai.interactions.create({
        model: GEMINI_MODEL,
        input,
        system_instruction: systemInstruction,
        store: false,
      });

      const geminiText = interaction.output_text?.trim();
      if (geminiText) {
        return NextResponse.json({
          reply: cleanAssistantReply(geminiText),
          citations: [],
          relatedRoutes: [],
          language: retrieval.language,
          mode: "gemini-rag",
          isOutOfScope: false,
        });
      }
    } catch (interactionErr) {
      // Fallback to generateContent before falling back to deterministic local RAG
      try {
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: input,
          config: {
            systemInstruction,
            temperature: 0.2,
          },
        });

        const generatedText = response.text?.trim();
        if (generatedText) {
          return NextResponse.json({
            reply: cleanAssistantReply(generatedText),
            citations: [],
            relatedRoutes: [],
            language: retrieval.language,
            mode: "gemini-rag",
            isOutOfScope: false,
          });
        }
      } catch (fallbackErr) {
        console.warn(
          "Gemini API call failed, serving deterministic RAG fallback:",
          interactionErr,
          fallbackErr,
        );
      }
    }

    // Deterministic Local RAG Fallback (used if Gemini returns empty or hits quota limits)
    const fallback = buildGroundedResponseFallback(
      retrieval,
      activeRole,
      userContext,
    );
    return NextResponse.json({
      reply: fallback.reply,
      citations: [],
      relatedRoutes: [],
      language: retrieval.language,
      mode: "local-rag",
      isOutOfScope:
        retrieval.isOutOfScope &&
        !retrieval.isConversational &&
        !retrieval.isGreeting,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply:
          "Sorry, I encountered a temporary issue processing your request. Please try again or visit the System FAQ page.",
        citations: [],
        relatedRoutes: [],
        language: "en",
        mode: "local-rag",
        isOutOfScope: false,
      },
      { status: 200 },
    );
  }
}
