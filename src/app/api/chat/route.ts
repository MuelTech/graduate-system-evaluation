import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  buildGroundedResponseFallback,
  retrieveKnowledgeChunks,
  type RelatedRoute,
  type RetrievalResult,
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
}

const GEMINI_MODEL = "gemini-4-hydrogen";

function buildSystemInstruction(
  retrieval: RetrievalResult,
  activeRole: string,
  pathname: string,
): string {
  const knowledgeContext = retrieval.hits
    .map((hit, idx) => {
      const routes = hit.chunk.relatedRoutes
        .map((r) => `${r.label} (${r.href})`)
        .join(", ");
      return [
        `[Source ${idx + 1}: ${hit.chunk.section} | Title: ${hit.chunk.title}]`,
        `English Policy/Guide: ${hit.chunk.answerEn}`,
        `Tagalog/Taglish Policy/Guide: ${hit.chunk.answerTl}`,
        routes ? `Related System Routes: ${routes}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n---\n\n");

  const languageRule =
    retrieval.language === "tl"
      ? "Respond naturally in polite Tagalog (may use official English academic terms where standard, e.g., Title Defense, Comprehensive Exam)."
      : retrieval.language === "taglish"
        ? "Respond naturally in friendly, professional Taglish matching the user's conversational style."
        : "Respond clearly and concisely in professional English.";

  return `You are the official EARIST Graduate School AI Assistant for the Eulogio "Amang" Rodriguez Institute of Science and Technology (EARIST) Graduate School Information System.

Active User Context:
- Portal Role: ${activeRole || "public"}
- Current Page Path: ${pathname || "/"}

Language Instruction:
- ${languageRule}

Strict Knowledge Boundary & Grounding Rules:
1. Answer ONLY using facts explicitly stated in the <RETRIEVED_KNOWLEDGE_BASE> below.
2. NEVER fabricate, guess, or extrapolate tuition amounts, dates, rules, policies, or system URLs not present in the retrieved sources.
3. Cite the official Manual section (e.g., "Manual Sec. 7.15") or relevant system route (e.g., "/applicant/schedule") naturally in your answer when applicable.
4. If the user's specific question is not covered by the retrieved sources, politely explain in their language that it is outside the official EARIST Graduate School Manual of Operations and System FAQs, and advise contacting earistofficial1945@gmail.com or (02) 7738 5059.
5. Keep your reply concise, helpful, and structured with bullet points when listing steps or requirements.

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
    let retrieval = retrieveKnowledgeChunks(message, activeRole, 4);

    // For brief conversational follow-ups (e.g. "How about Doctoral?"), enrich with last user message
    const wordCount = message.split(/\s+/).filter(Boolean).length;
    const isShortFollowUp =
      wordCount <= 6 &&
      /\b(how about|what about|eh yung|eh sa|paano naman|how long|magkano|ilan|doctoral|masters)\b/i.test(
        message,
      );
    if (retrieval.isOutOfScope && isShortFollowUp) {
      const lastUserTurn = [...history]
        .reverse()
        .find((turn) => turn.role === "user");
      if (lastUserTurn) {
        const combinedRetrieval = retrieveKnowledgeChunks(
          `${lastUserTurn.content} ${message}`,
          activeRole,
          4,
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

    // Immediate deterministic response for greetings and out-of-scope boundary enforcement
    if (retrieval.isGreeting || retrieval.isOutOfScope) {
      const fallback = buildGroundedResponseFallback(retrieval, activeRole);
      return NextResponse.json({
        reply: fallback.reply,
        citations: fallback.citations,
        relatedRoutes: fallback.relatedRoutes,
        language: retrieval.language,
        mode: "local-rag",
        isOutOfScope: retrieval.isOutOfScope,
      });
    }

    const citations = Array.from(
      new Set(retrieval.hits.slice(0, 3).map((h) => h.chunk.section)),
    );
    const routeMap = new Map<string, RelatedRoute>();
    for (const hit of retrieval.hits.slice(0, 2)) {
      for (const route of hit.chunk.relatedRoutes) {
        if (!routeMap.has(route.href)) {
          routeMap.set(route.href, route);
        }
      }
    }
    const relatedRoutes = Array.from(routeMap.values()).slice(0, 3);

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = buildSystemInstruction(
        retrieval,
        activeRole,
        pathname,
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
            reply: geminiText,
            citations,
            relatedRoutes,
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
              reply: generatedText,
              citations,
              relatedRoutes,
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
    }

    // Deterministic Local RAG Fallback (works offline, without API key, or during quota limits)
    const fallback = buildGroundedResponseFallback(retrieval, activeRole);
    return NextResponse.json({
      reply: fallback.reply,
      citations: fallback.citations,
      relatedRoutes: fallback.relatedRoutes,
      language: retrieval.language,
      mode: "local-rag",
      isOutOfScope: false,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply:
          "Sorry, I encountered a temporary issue processing your request. Please try again or visit /faq for Graduate School information.",
        citations: [],
        relatedRoutes: [{ label: "System FAQ", href: "/faq" }],
        language: "en",
        mode: "local-rag",
        isOutOfScope: false,
      },
      { status: 200 },
    );
  }
}
