"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import {
  buildGroundedResponseFallback,
  retrieveKnowledgeChunks,
  type RelatedRoute,
  type UserLiveStateContext,
} from "@/lib/chatbot-rag";
import {
  useEvaluationRole,
  type EvaluationUser,
} from "@/lib/evaluation-session";
import {
  getScenario,
  SCENARIO_DEFINITIONS,
  type ScenarioPageKey,
} from "@/lib/evaluation-mock/scenario-store";

type PortalContextRole = "public" | "applicant" | "student" | "faculty";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date | null;
  relatedRoutes?: RelatedRoute[];
  isOutOfScope?: boolean;
}

interface ChatApiResponse {
  reply: string;
  relatedRoutes?: RelatedRoute[];
  isOutOfScope?: boolean;
}

const APPROVED_THESIS_TITLE =
  "Data-Driven Instructional Supervision and Digital Readiness of Public Secondary School Heads in the Division of Manila";
const ASSIGNED_ADVISER = "Dr. Maria Clara R. Santos, EdD";

function resolvePageMeta(pathname: string): {
  pageTitle: string;
  pageKey?: ScenarioPageKey;
} {
  if (pathname.startsWith("/applicant/dashboard")) {
    return { pageTitle: "Applicant Dashboard", pageKey: "applicant-dashboard" };
  }
  if (pathname.startsWith("/applicant/alignment")) {
    return { pageTitle: "Program Alignment", pageKey: "applicant-alignment" };
  }
  if (pathname.startsWith("/applicant/schedule")) {
    return { pageTitle: "Entrance Exam Schedule", pageKey: "applicant-schedule" };
  }
  if (pathname.startsWith("/applicant/exam")) {
    return { pageTitle: "Entrance Examination", pageKey: "applicant-exam" };
  }
  if (pathname.startsWith("/applicant/results")) {
    return { pageTitle: "Entrance Exam Results", pageKey: "applicant-results" };
  }
  if (pathname.startsWith("/applicant/cor-upload")) {
    return { pageTitle: "COR Upload", pageKey: "applicant-cor-upload" };
  }
  if (pathname.startsWith("/applicant/profile")) {
    return { pageTitle: "Applicant Profile" };
  }
  if (pathname.startsWith("/applicant/notifications")) {
    return { pageTitle: "Applicant Notifications" };
  }
  if (pathname.startsWith("/student/dashboard")) {
    return { pageTitle: "Student Dashboard", pageKey: "student-dashboard" };
  }
  if (pathname.startsWith("/student/thesis/title-defense")) {
    return { pageTitle: "Title Defense", pageKey: "title-defense" };
  }
  if (pathname.startsWith("/student/thesis/adviser-request")) {
    return { pageTitle: "Thesis Adviser Request", pageKey: "adviser-request" };
  }
  if (pathname.startsWith("/student/thesis/proposal-defense")) {
    return { pageTitle: "Proposal Defense", pageKey: "proposal-defense" };
  }
  if (pathname.startsWith("/student/thesis/strike")) {
    return { pageTitle: "Plagiarism Check", pageKey: "strike" };
  }
  if (pathname.startsWith("/student/thesis/final-defense")) {
    return { pageTitle: "Final Defense", pageKey: "final-defense" };
  }
  if (pathname.startsWith("/student/thesis")) {
    return { pageTitle: "Thesis Journey Hub" };
  }
  if (pathname.startsWith("/student/repository/submit")) {
    return {
      pageTitle: "Research Databank Submission",
      pageKey: "repository-submit",
    };
  }
  if (pathname.startsWith("/student/repository")) {
    return { pageTitle: "Student Thesis Repository" };
  }
  if (pathname.startsWith("/student/curriculum")) {
    return { pageTitle: "Student Curriculum" };
  }
  if (pathname.startsWith("/student/journey")) {
    return { pageTitle: "Academic Journey" };
  }
  if (pathname.startsWith("/student/profile")) {
    return { pageTitle: "Student Profile" };
  }
  if (pathname.startsWith("/student/announcements")) {
    return { pageTitle: "Student Announcements" };
  }
  if (pathname.startsWith("/student/notifications")) {
    return { pageTitle: "Student Notifications" };
  }
  if (
    pathname.startsWith("/faculty/defense-workspace") ||
    pathname.startsWith("/panelist/defense-workspace")
  ) {
    return { pageTitle: "Defense Workspace", pageKey: "defense-workspace" };
  }
  if (
    pathname.startsWith("/faculty/advisees") ||
    pathname.startsWith("/panelist/advisees")
  ) {
    return { pageTitle: "My Advisees", pageKey: "advisees" };
  }
  if (
    pathname.startsWith("/faculty/essay-evaluations/") ||
    pathname.startsWith("/panelist/essay-evaluations/")
  ) {
    return {
      pageTitle: "Essay Evaluation",
      pageKey: "essay-evaluation-detail",
    };
  }
  if (
    pathname.startsWith("/faculty/defenses") ||
    pathname.startsWith("/panelist/defenses")
  ) {
    return { pageTitle: "Assigned Defenses" };
  }
  if (
    pathname.startsWith("/faculty/signatures") ||
    pathname.startsWith("/panelist/signatures")
  ) {
    return { pageTitle: "E-Signatures" };
  }
  if (pathname.startsWith("/faculty") || pathname.startsWith("/panelist")) {
    return { pageTitle: "Faculty Portal" };
  }
  if (pathname.startsWith("/programs")) return { pageTitle: "Graduate Programs" };
  if (pathname.startsWith("/about")) {
    return { pageTitle: "About EARIST Graduate School" };
  }
  if (pathname.startsWith("/repository")) {
    return { pageTitle: "Public Research Repository" };
  }
  if (pathname.startsWith("/faq")) {
    return { pageTitle: "Frequently Asked Questions" };
  }
  if (pathname.startsWith("/login")) return { pageTitle: "Portal Sign In" };
  if (pathname.startsWith("/register")) {
    return { pageTitle: "Applicant Registration" };
  }
  return { pageTitle: "EARIST Graduate School Home" };
}

function getScenarioLabel(pageKey: ScenarioPageKey): string {
  const id = getScenario(pageKey);
  const opt = SCENARIO_DEFINITIONS[pageKey]?.find((o) => o.id === id);
  return opt?.label ?? id;
}

function buildLiveUserContext(
  pathname: string,
  portalRole: PortalContextRole,
  persona: EvaluationUser,
): UserLiveStateContext {
  const { pageTitle, pageKey } = resolvePageMeta(pathname);
  const activeScenarioId = pageKey ? getScenario(pageKey) : undefined;
  const activeOption =
    pageKey && activeScenarioId
      ? SCENARIO_DEFINITIONS[pageKey]?.find((o) => o.id === activeScenarioId)
      : undefined;

  let thesisSummary: string | undefined;

  if (portalRole === "student") {
    const dashId = getScenario("student-dashboard");
    if (pathname.startsWith("/student/dashboard") && dashId === "TITLE_ACTIVE") {
      thesisSummary =
        "Current Step: Title Defense (not yet submitted). Student needs to submit 3 proposed titles, Proposal Package PDF, current COR, and defense-fee receipt. Title not yet approved and adviser not yet assigned.";
    } else if (
      pathname.startsWith("/student/dashboard") &&
      dashId === "COMPLETED_JOURNEY"
    ) {
      thesisSummary = `All 5 Thesis Journey milestones (Title Defense, Adviser Request, Proposal Defense, Plagiarism Check, Final Defense) are completed under approved title "${APPROVED_THESIS_TITLE}" with adviser ${ASSIGNED_ADVISER}. Ready for Research Databank archival.`;
    } else {
      const stepStates = [
        `Title Defense: ${getScenarioLabel("title-defense")}`,
        `Adviser Request: ${getScenarioLabel("adviser-request")}`,
        `Proposal Defense: ${getScenarioLabel("proposal-defense")}`,
        `Plagiarism Check: ${getScenarioLabel("strike")}`,
        `Final Defense: ${getScenarioLabel("final-defense")}`,
      ].join(" | ");
      const overview = pathname.startsWith("/student/dashboard")
        ? `Dashboard milestone view shows Title Defense and Adviser Request completed, and Proposal Defense scheduled under adviser ${ASSIGNED_ADVISER}. `
        : "";
      thesisSummary = `${overview}Approved Title: "${APPROVED_THESIS_TITLE}". Adviser: ${ASSIGNED_ADVISER}. Current step states — ${stepStates}.`;
    }
  } else if (portalRole === "applicant") {
    thesisSummary = [
      `Program Alignment: ${getScenarioLabel("applicant-alignment")}`,
      `Exam Schedule: ${getScenarioLabel("applicant-schedule")}`,
      `Entrance Exam: ${getScenarioLabel("applicant-exam")}`,
      `Exam Results: ${getScenarioLabel("applicant-results")}`,
      `COR Upload: ${getScenarioLabel("applicant-cor-upload")}`,
    ].join(" | ");
  }

  return {
    userName: portalRole !== "public" ? persona.name : undefined,
    program: portalRole !== "public" ? persona.program : undefined,
    pageTitle,
    activeScenarioLabel: activeOption?.label,
    activeScenarioDescription: activeOption?.description,
    thesisSummary,
  };
}

const ROLE_LABELS: Record<PortalContextRole, string> = {
  public: "Public & Admissions Guide",
  applicant: "Applicant Portal Mode",
  student: "Graduate Student Mode",
  faculty: "Faculty / Panelist Mode",
};

const QUICK_QUESTIONS_BY_ROLE: Record<PortalContextRole, string[]> = {
  public: [
    "Paano mag-apply sa EARIST GS?",
    "Anong programs ang available?",
    "May online class ba?",
    "Contact details ng GS Office",
  ],
  applicant: [
    "Paano mag-schedule ng exam?",
    "Ano ang Program Alignment waiver?",
    "Ilang items ang Entrance Exam?",
    "Paano mag-upload ng COR?",
  ],
  student: [
    "Ilang units max per semester?",
    "Compre exam rules & passing rate",
    "Thesis defense steps & 7-day rule",
    "Anong kulay ng toga per program?",
  ],
  faculty: [
    "Paano gamitin ang Defense Workspace?",
    "Saan mag-grade ng Applicant essays?",
    "Ano ang 1:5 adviser ratio rule?",
    "Saan pipirma ng Rapporteur Report?",
  ],
};

function generateId(): string {
  // Only called after client interaction — never for SSR initial markup.
  return Math.random().toString(36).substring(2, 9);
}

function getWelcomeMessage(portalRole: PortalContextRole): string {
  switch (portalRole) {
    case "applicant":
      return "Kumusta! Ako ang EARIST GS Assistant. Ask me in English, Tagalog, or Taglish about Pinnacle registration, Program Alignment waivers, Entrance Exam scheduling, or COR upload.";
    case "student":
      return "Kumusta! Ako ang EARIST GS Assistant. Tanungin mo ako tungkol sa units load, Comprehensive Exam, Grading Scale, 5-Step Thesis Journey, STRIKE check, o graduation requirements.";
    case "faculty":
      return "Hello! I'm the EARIST GS Assistant. Ask me about the Collaborative Defense Workspace, Entrance Exam essay grading, advisee caps (1:5), Rapporteur Reports, or Faculty policies.";
    default:
      return "Hello! I'm the EARIST GS Assistant. You can ask me in English, Tagalog, or Taglish about graduate programs, admission requirements, thesis defense policies, or portal navigation.";
  }
}

export function ChatbotWidget() {
  const pathname = usePathname() || "/";
  const { persona } = useEvaluationRole();

  const portalRole: PortalContextRole = useMemo(() => {
    if (pathname.startsWith("/applicant")) return "applicant";
    if (pathname.startsWith("/student")) return "student";
    if (pathname.startsWith("/faculty") || pathname.startsWith("/panelist")) {
      return "faculty";
    }
    return "public";
  }, [pathname]);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      // Stable across server/client so hydration stays deterministic.
      id: "welcome",
      role: "bot",
      content: getWelcomeMessage("public"),
      timestamp: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync the welcome greeting when the user navigates between portals before chatting
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0]?.id === "welcome") {
        return [
          {
            ...prev[0],
            content: getWelcomeMessage(portalRole),
          },
        ];
      }
      return prev;
    });
  }, [portalRole]);

  const openChat = () => {
    setIsOpen(true);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === "welcome" && !m.timestamp ? { ...m, timestamp: new Date() } : m,
      ),
    );
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "bot",
        content: getWelcomeMessage(portalRole),
        timestamp: new Date(),
      },
    ]);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isTyping) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    const historySnapshot = messages
      .filter((m) => m.id !== "welcome")
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const userContext = buildLiveUserContext(pathname, portalRole, persona);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          role: portalRole,
          pathname,
          history: historySnapshot,
          userContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API responded with ${response.status}`);
      }

      const data = (await response.json()) as ChatApiResponse;
      const botMessage: Message = {
        id: generateId(),
        role: "bot",
        content: data.reply,
        timestamp: new Date(),
        relatedRoutes: data.relatedRoutes ?? [],
        isOutOfScope: data.isOutOfScope ?? false,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      // Offline / client-only fallback using the exact same deterministic RAG knowledge store
      const retrieval = retrieveKnowledgeChunks(trimmed, portalRole, 4);
      const fallback = buildGroundedResponseFallback(
        retrieval,
        portalRole,
        userContext,
      );
      const botMessage: Message = {
        id: generateId(),
        role: "bot",
        content: fallback.reply,
        timestamp: new Date(),
        relatedRoutes: fallback.relatedRoutes,
        isOutOfScope: retrieval.isOutOfScope,
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    void sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = QUICK_QUESTIONS_BY_ROLE[portalRole];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-(--earist-primary) text-white shadow-lg transition-all hover:scale-105 hover:bg-(--earist-primary)/90 hover:shadow-xl"
          aria-label="Open chatbot"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-(--earist-accent)" />
          </div>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed right-4 bottom-4 z-50 flex h-[520px] w-[calc(100vw-2rem)] max-w-[390px] flex-col rounded-xl border border-(--earist-border-gray) bg-white shadow-2xl sm:right-6 sm:bottom-6">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-xl bg-(--earist-primary) px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Sparkles className="h-4 w-4 text-(--earist-accent)" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  GS Assistant
                </h3>
                <p className="text-[11px] text-white/80">
                  {ROLE_LABELS[portalRole]} • EN / TL
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 1 && (
                <button
                  onClick={resetChat}
                  title="Reset conversation"
                  className="rounded-full p-1.5 text-white/75 transition-colors hover:bg-white/20 hover:text-white"
                  aria-label="Reset conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-white/75 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Close chatbot"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-sm ${
                      message.role === "user"
                        ? "bg-(--earist-primary) text-white"
                        : message.isOutOfScope
                          ? "border border-amber-200 bg-amber-50/70 text-(--earist-body-text)"
                          : "bg-(--earist-surface-gray) text-(--earist-body-text)"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">
                      {message.content}
                    </p>

                    {/* Clickable Navigation Links */}
                    {message.role === "bot" &&
                      message.relatedRoutes &&
                      message.relatedRoutes.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {message.relatedRoutes.map((route) => (
                            <Link
                              key={route.href}
                              href={route.href}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 rounded-full border border-(--earist-primary)/30 bg-white px-2.5 py-1 text-[11px] font-medium text-(--earist-primary) transition-colors hover:bg-(--earist-surface-light-red)"
                            >
                              {route.label}
                              <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          ))}
                        </div>
                      )}

                    <p
                      suppressHydrationWarning
                      className={`mt-1.5 text-[10px] ${
                        message.role === "user"
                          ? "text-white/60"
                          : "text-(--earist-body-text)/50"
                      }`}
                    >
                      {message.timestamp
                        ? message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-xl bg-(--earist-surface-gray) px-3.5 py-2.5">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-(--earist-body-text)/40 [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-(--earist-body-text)/40 [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-(--earist-body-text)/40" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="border-t border-(--earist-border-gray) px-4 py-2.5">
              <p className="mb-1.5 text-[11px] font-medium text-gray-500">
                Quick questions ({portalRole}):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => void sendMessage(question)}
                    disabled={isTyping}
                    className="rounded-full border border-(--earist-border-gray) bg-white px-2.5 py-1 text-left text-xs text-(--earist-body-text) transition-colors hover:border-(--earist-accent) hover:text-(--earist-primary)"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-(--earist-border-gray) p-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask in English, Tagalog, or Taglish..."
                className="flex-1 rounded-lg border border-(--earist-border-gray) px-3 py-2 text-sm transition-colors focus:border-(--earist-primary) focus:ring-1 focus:ring-(--earist-primary) focus:outline-none"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--earist-primary) text-white transition-colors hover:bg-(--earist-primary)/90 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
