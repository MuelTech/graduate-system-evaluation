import { getActiveEvaluationRole } from "@/lib/evaluation-session";
import type { CollaborationAnnotation } from "@/lib/pdf-annotation/annotations";
import type { OralEvaluation } from "@/types/defense-workspace";
import {
  buildAdviseeDetail,
  buildAdviserReviewTaskDetail,
  buildAdviserWorkspace,
  buildCommitteeReport,
  buildConclusionReadiness,
  buildCurrentDefenseApplication,
  buildDatabankArchiveContext,
  buildDefenseHistory,
  buildDefenseHistoryAttempt,
  buildDefenseWorkspace,
  buildExamRecordDetail,
  buildFinalAdviserReview,
  buildOralEvaluation,
  buildProposalAdviserReview,
  buildStudentRapAccess,
  buildStudentThesisJourney,
  INITIAL_ANNOTATIONS,
  INITIAL_EXAM_APPLICATIONS,
  INITIAL_PANELIST_NOTIFICATIONS,
  INITIAL_PENDING_RAP_SIGNATURES,
  INITIAL_STUDENT_NOTIFICATIONS,
  MOCK_ADVISER_CANDIDATES_RESPONSE,
  MOCK_ADVISER_CERTIFICATION_RECORDS,
  MOCK_ADVISER_REQUEST_RECORDS,
  MOCK_MEMOS,
  MOCK_PANELIST_ASSIGNMENTS,
  MOCK_PANELIST_DASHBOARD,
  MOCK_PUBLICATIONS,
  MOCK_STUDENT_OVERVIEW,
  OFFICIAL_APPROVED_TITLE,
} from "./dataset";
import {
  APPLICANT_EXAM_ESSAY_QUESTION,
  APPLICANT_EXAM_MCQ_QUESTIONS,
  APPLICANT_EXAM_QUESTIONS,
  SAMPLE_APPLICANT_ESSAY_RESPONSE,
} from "./applicant-exam-questions";
import { getScenario, setScenario } from "./scenario-store";
import type { SavedDraft } from "@/lib/exam-drafts";
import type { ExamExecution, ExamFinalizationReceipt } from "@/lib/exam-execution";

// In-memory interactive state so mutations persist during the evaluation session
let studentNotifications = [...INITIAL_STUDENT_NOTIFICATIONS];
let panelistNotifications = [...INITIAL_PANELIST_NOTIFICATIONS];
let applicantNotifications = [
  {
    id: "app-notif-01",
    title: "Entrance Exam Schedule Confirmed",
    message:
      "Your Graduate School Entrance Examination is confirmed for December 5, 2026 at 9:00 AM (MAEd in Administration & Supervision).",
    type: "EXAM_SCHEDULE",
    isRead: false,
    createdAt: "2026-11-11T10:30:00.000Z",
  },
  {
    id: "app-notif-02",
    title: "Program Alignment Cleared",
    message:
      "Your undergraduate degree (Bachelor of Secondary Education major in English) is aligned with your target Master's program.",
    type: "ALIGNMENT",
    isRead: false,
    createdAt: "2026-11-10T15:15:00.000Z",
  },
  {
    id: "app-notif-03",
    title: "Entrance Exam Instructions & Coverage",
    message:
      "The online Entrance Examination includes 72 multiple-choice items and 1 Graduate Essay (90 minutes total duration).",
    type: "EXAM_INFO",
    isRead: false,
    createdAt: "2026-11-10T09:00:00.000Z",
  },
  {
    id: "app-notif-04",
    title: "Applicant Portal Account Activated",
    message:
      "Welcome to the EARIST Graduate School Applicant Portal! Your Applicant ID is APP-2026-0142.",
    type: "REGISTRATION",
    isRead: true,
    createdAt: "2026-11-09T14:20:00.000Z",
  },
  {
    id: "app-notif-05",
    title: "COR Verification & Enrollment Reminder",
    message:
      "Once you pass the Entrance Examination and complete enrollment in EARIST Pinnacle, upload your Certificate of Registration (COR) to unlock your Student Portal.",
    type: "COR_REMINDER",
    isRead: true,
    createdAt: "2026-11-09T14:25:00.000Z",
  },
];

let applicantProfileState = {
  id: "applicant-eval-01",
  applicantId: "APP-2026-0142",
  pinnacleApplicantId: "APP-2026-0142",
  firstName: "Maria Lourdes",
  middleName: "Gomez",
  lastName: "Villanueva",
  email: "mlgvillanueva@applicant.earist.edu.ph",
  cellphone: "+63 917 842 5109",
  dateOfBirth: "1996-08-14",
  address: "245 Pureza St., Sta. Mesa, Manila",
  undergraduateDegree: "Bachelor of Secondary Education major in English (BSEd)",
  undergraduateSchool:
    "Eulogio 'Amang' Rodriguez Institute of Science and Technology (EARIST)",
  yearGraduated: "2019",
  gwa: "1.45 (Cum Laude)",
  currentAffiliation: "Public Secondary School Teacher III — DepEd Manila",
  programId: "prog-maed-as",
  program:
    "Master of Arts in Education major in Administration and Supervision",
  programType: "MASTERS",
  strikeCount: 0,
};

let waiverDownloadedAt: string | null = null;

const AVAILABLE_EXAM_SLOTS = [
  {
    id: "slot-eval-01",
    programId: "prog-maed-as",
    examDate: "2026-12-05T00:00:00.000Z",
    examTime: "1970-01-01T09:00:00.000Z",
    maxSlots: 30,
    slotsTaken: 12,
    isActive: true,
    program: {
      programName:
        "Master of Arts in Education major in Administration and Supervision",
    },
  },
  {
    id: "slot-eval-02",
    programId: "prog-maed-as",
    examDate: "2026-12-05T00:00:00.000Z",
    examTime: "1970-01-01T13:30:00.000Z",
    maxSlots: 30,
    slotsTaken: 26,
    isActive: true,
    program: {
      programName:
        "Master of Arts in Education major in Administration and Supervision",
    },
  },
  {
    id: "slot-eval-03",
    programId: "prog-maed-as",
    examDate: "2026-12-12T00:00:00.000Z",
    examTime: "1970-01-01T09:00:00.000Z",
    maxSlots: 25,
    slotsTaken: 8,
    isActive: true,
    program: {
      programName:
        "Master of Arts in Education major in Administration and Supervision",
    },
  },
  {
    id: "slot-eval-04",
    programId: "prog-maed-as",
    examDate: "2026-12-19T00:00:00.000Z",
    examTime: "1970-01-01T09:00:00.000Z",
    maxSlots: 25,
    slotsTaken: 25,
    isActive: true,
    program: {
      programName:
        "Master of Arts in Education major in Administration and Supervision",
    },
  },
  {
    id: "slot-eval-05",
    programId: "prog-maed-as",
    examDate: "2027-01-09T00:00:00.000Z",
    examTime: "1970-01-01T09:00:00.000Z",
    maxSlots: 30,
    slotsTaken: 5,
    isActive: true,
    program: {
      programName:
        "Master of Arts in Education major in Administration and Supervision",
    },
  },
];

let bookedExamSlot = {
  id: "slot-eval-01",
  examDate: "2026-12-05T00:00:00.000Z",
  examTime: "1970-01-01T09:00:00.000Z",
  programName:
    "Master of Arts in Education major in Administration and Supervision",
};

let applicantMissedAppeal: { reason: string; status: string } | null = null;

// Pre-seed a few answered MCQs + sample essay in drafts so respondents can immediately evaluate progress & navigator
const applicantExamDrafts = new Map<string, SavedDraft>([
  [
    APPLICANT_EXAM_MCQ_QUESTIONS[0].id,
    {
      questionId: APPLICANT_EXAM_MCQ_QUESTIONS[0].id,
      selectedOptionId: APPLICANT_EXAM_MCQ_QUESTIONS[0].correctOptionId,
      revision: 1,
    },
  ],
  [
    APPLICANT_EXAM_MCQ_QUESTIONS[1].id,
    {
      questionId: APPLICANT_EXAM_MCQ_QUESTIONS[1].id,
      selectedOptionId: APPLICANT_EXAM_MCQ_QUESTIONS[1].correctOptionId,
      revision: 1,
    },
  ],
  [
    APPLICANT_EXAM_MCQ_QUESTIONS[2].id,
    {
      questionId: APPLICANT_EXAM_MCQ_QUESTIONS[2].id,
      selectedOptionId: APPLICANT_EXAM_MCQ_QUESTIONS[2].correctOptionId,
      revision: 1,
    },
  ],
  [
    APPLICANT_EXAM_ESSAY_QUESTION.id,
    {
      questionId: APPLICANT_EXAM_ESSAY_QUESTION.id,
      essayAnswer: SAMPLE_APPLICANT_ESSAY_RESPONSE,
      revision: 1,
    },
  ],
]);

let lastFinalizationReceipt: ExamFinalizationReceipt = {
  receiptId: "EXAM-RCPT-2026-0142-A9F3",
  applicationId: "exam-app-eval-01",
  finalizedAt: "2026-11-11T10:24:18.000Z",
  finalizationReason: "APPLICANT_SUBMITTED",
  actualStartedAt: "2026-11-11T09:00:00.000Z",
  deadlineAt: "2026-11-11T10:30:00.000Z",
  contentRevisionId: "olsat-v2-rev-01",
  answeredCount: 73,
  unansweredCount: 0,
  questionCount: 73,
};

let annotationsState: CollaborationAnnotation[] = [...INITIAL_ANNOTATIONS];
let pendingRapSignatures = [...INITIAL_PENDING_RAP_SIGNATURES];

let panelistProfileState = {
  id: "panelist-eval-01",
  isExternal: false,
  isAvailableAsAdviser: true,
  canAdvise: true,
  canEvaluateEssays: true,
  specialization:
    "Educational Leadership, Curriculum Development, & Policy Research",
  officeAffiliation: "EARIST Graduate School — College of Education",
  academicRank: "Associate Professor V",
  highestEducationalAttainment:
    "Doctor of Education (EdD) in Educational Administration",
  facultyId: "FAC-GS-0089",
  user: {
    id: "panelist-eval-01",
    title: "Dr.",
    firstName: "Maria Clara",
    lastName: "Santos",
    suffix: "EdD",
    email: "mcrsantos@earist.edu.ph",
  },
};

const examGradedScores: Record<
  string,
  { essayScore: number; gradedAt: string }
> = {};

const customEvaluations = new Map<string, OralEvaluation>();
const customReports = new Map<
  string,
  ReturnType<typeof buildCommitteeReport>
>();
const customTaskStatuses = new Map<
  string,
  { reviewStatus: "NONE" | "AWAITING_REVIEW" | "CHANGES_REQUESTED" | "ISSUED"; remarks: string | null }
>();
let studentProposalUploaded = false;
let studentFinalUploaded = false;

function parseBody(body: BodyInit | null | undefined): Record<string, unknown> {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return {};
}

export async function evaluationMockRouter(
  rawUrl: string,
  options: RequestInit = {},
): Promise<unknown> {
  const method = (options.method ?? "GET").toUpperCase();
  const parsedUrl = new URL(rawUrl, "http://localhost");
  const pathname = parsedUrl.pathname.replace(/^\/api(?=\/)/, "");
  const searchParams = parsedUrl.searchParams;
  const activeRole = getActiveEvaluationRole();
  const currentBrowserPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  // 1. Shared Memos & Notifications
  if (pathname === "/memos" && method === "GET") {
    return MOCK_MEMOS;
  }

  if (pathname === "/notifications" && method === "GET") {
    if (activeRole === "applicant" || currentBrowserPath.startsWith("/applicant")) {
      return applicantNotifications;
    }
    return activeRole === "panelist"
      ? panelistNotifications
      : studentNotifications;
  }

  if (pathname === "/notifications/read-all" && (method === "PUT" || method === "POST" || method === "PATCH")) {
    applicantNotifications = applicantNotifications.map((n) => ({ ...n, isRead: true }));
    studentNotifications = studentNotifications.map((n) => ({ ...n, isRead: true }));
    panelistNotifications = panelistNotifications.map((n) => ({ ...n, isRead: true }));
    return { success: true };
  }

  const notifReadMatch = /^\/notifications\/([^/]+)\/read$/.exec(pathname);
  if (notifReadMatch && (method === "PUT" || method === "POST" || method === "PATCH")) {
    const id = decodeURIComponent(notifReadMatch[1]);
    applicantNotifications = applicantNotifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n,
    );
    studentNotifications = studentNotifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n,
    );
    panelistNotifications = panelistNotifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n,
    );
    return { success: true, id };
  }

  // 2. Research Repository Publications
  if (
    (pathname === "/databank/publications" || pathname === "/repository") &&
    method === "GET"
  ) {
    const q = (searchParams.get("q") ?? searchParams.get("search") ?? "")
      .trim()
      .toLowerCase();
    const program = (searchParams.get("program") ?? "").trim().toLowerCase();
    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const pageSize = Math.max(
      1,
      Number(searchParams.get("pageSize") ?? "10") || 10,
    );

    const filtered = MOCK_PUBLICATIONS.filter((pub) => {
      const matchesQuery =
        !q ||
        pub.title.toLowerCase().includes(q) ||
        (pub.author ?? "").toLowerCase().includes(q) ||
        (pub.abstract ?? "").toLowerCase().includes(q) ||
        pub.keywords.some((kw) => kw.toLowerCase().includes(q));
      const matchesProgram =
        !program ||
        program === "all" ||
        (pub.program ?? "").toLowerCase().includes(program);
      return matchesQuery && matchesProgram;
    });

    if (pathname === "/repository") {
      return filtered;
    }

    const start = (page - 1) * pageSize;
    return {
      data: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  }

  // 3. Student Overview & Thesis Journey
  if (pathname === "/student/journey" && method === "GET") {
    return MOCK_STUDENT_OVERVIEW;
  }

  if (pathname === "/thesis/journey" && method === "GET") {
    return buildStudentThesisJourney({
      studentDashboard: getScenario("student-dashboard"),
      titleDefense: getScenario("title-defense"),
      adviserRequest: getScenario("adviser-request"),
      proposalDefense: getScenario("proposal-defense"),
      strike: getScenario("strike"),
      finalDefense: getScenario("final-defense"),
      activePathname: currentBrowserPath,
    });
  }

  // 4. Title Defense & Current Defense Application
  if (pathname === "/thesis/defense/current" && method === "GET") {
    const stageParam = (searchParams.get("stage") ?? "TITLE").toUpperCase();
    const stageScenario =
      stageParam === "PROPOSAL"
        ? getScenario("proposal-defense")
        : stageParam === "FINAL"
          ? getScenario("final-defense")
          : getScenario("title-defense");
    return buildCurrentDefenseApplication(stageScenario, stageParam);
  }

  if (pathname === "/thesis/defense/title" && method === "POST") {
    setScenario("title-defense", "APPLICATION_UNDER_REVIEW");
    return {
      success: true,
      thesisId: "thesis-eval-01",
      status: "APPLICATION_UNDER_REVIEW",
    };
  }

  const resubmitMatch = /^\/thesis\/defense\/([^/]+)\/resubmit$/.exec(pathname);
  if (resubmitMatch && (method === "POST" || method === "PUT")) {
    setScenario("title-defense", "APPLICATION_UNDER_REVIEW");
    return {
      success: true,
      thesisId: resubmitMatch[1],
      status: "APPLICATION_UNDER_REVIEW",
    };
  }

  // 5. Adviser Request (GS-020)
  if (pathname === "/thesis/adviser/candidates" && method === "GET") {
    return MOCK_ADVISER_CANDIDATES_RESPONSE;
  }

  if (pathname === "/thesis/adviser/request" && method === "POST") {
    setScenario("adviser-request", "PENDING");
    return {
      id: "adv-req-01",
      status: "PENDING",
      adviserStatus: "CONFORMED",
      deanStatus: "PENDING",
    };
  }

  if (pathname === "/thesis/adviser/requests/records" && method === "GET") {
    return MOCK_ADVISER_REQUEST_RECORDS;
  }

  // 6. Proposal & Final Pre-Defense Adviser Review (Student side)
  if (pathname === "/thesis/proposal-adviser-review" && method === "GET") {
    const scenario = getScenario("proposal-defense");
    const review = buildProposalAdviserReview(scenario);
    if (scenario === "ADVISER_REVIEW" && studentProposalUploaded) {
      return {
        ...review,
        reviewStatus: "AWAITING_REVIEW",
      };
    }
    return review;
  }

  if (
    pathname === "/thesis/proposal-adviser-review/manuscript" &&
    method === "POST"
  ) {
    studentProposalUploaded = true;
    setScenario("proposal-defense", "READY_TO_APPLY");
    return buildProposalAdviserReview("READY_TO_APPLY");
  }

  if (pathname === "/thesis/final-adviser-review" && method === "GET") {
    const scenario = getScenario("final-defense");
    const review = buildFinalAdviserReview(scenario);
    if (scenario === "FINAL_ADVISER_REVIEW" && studentFinalUploaded) {
      return {
        ...review,
        reviewStatus: "AWAITING_REVIEW",
      };
    }
    return review;
  }

  if (
    pathname === "/thesis/final-adviser-review/manuscript" &&
    method === "POST"
  ) {
    studentFinalUploaded = true;
    setScenario("final-defense", "READY_TO_APPLY");
    return buildFinalAdviserReview("READY_TO_APPLY");
  }

  if (pathname === "/thesis/strike/manuscript" && method === "POST") {
    setScenario("strike", "WAITING");
    return {
      success: true,
      status: "WAITING",
    };
  }

  if (pathname === "/thesis/adviser-certifications" && method === "GET") {
    const stageFilter = searchParams.get("stage");
    if (stageFilter === "PROPOSAL" || stageFilter === "FINAL") {
      return MOCK_ADVISER_CERTIFICATION_RECORDS.filter(
        (r) => r.stage === stageFilter,
      );
    }
    return MOCK_ADVISER_CERTIFICATION_RECORDS;
  }

  // 7. Proposal & Final Defense Eligibility & Submission
  const eligibilityMatch = /^\/thesis\/eligibility\/([^/]+)$/.exec(pathname);
  if (eligibilityMatch && method === "GET") {
    return {
      eligible: true,
      missing: [],
      missingRequirements: [],
    };
  }

  if (pathname === "/thesis/defense/proposal" && method === "POST") {
    setScenario("proposal-defense", "SCHEDULED");
    return {
      success: true,
      scheduleId: "sched-proposal-01",
      status: "SCHEDULED",
    };
  }

  if (pathname === "/thesis/defense/final" && method === "POST") {
    setScenario("final-defense", "SCHEDULED");
    return {
      success: true,
      scheduleId: "sched-final-01",
      status: "SCHEDULED",
    };
  }

  // 8. Official Defense Application & Student RAP Report
  const studentAppMatch =
    /^\/thesis\/(?:student\/defense|defense)\/([^/]+)\/(?:application|official-application)$/.exec(
      pathname,
    );
  if (studentAppMatch && method === "GET") {
    const scheduleId = decodeURIComponent(studentAppMatch[1]);
    return {
      scheduleId,
      defenseType: scheduleId.includes("final")
        ? "FINAL_DEFENSE"
        : scheduleId.includes("proposal")
          ? "PROPOSAL_DEFENSE"
          : "TITLE_DEFENSE",
      available: true,
      unavailableReason: null,
      pdfUrl: "/sample-docs/sample-defense-application.pdf",
    };
  }

  const studentRapMatch =
    /^\/thesis\/(?:student\/defense\/([^/]+)\/rap|defense\/student\/rap-report)$/.exec(
      pathname,
    );
  if (studentRapMatch && method === "GET") {
    const scheduleId = decodeURIComponent(
      studentRapMatch[1] ?? searchParams.get("scheduleId") ?? "sched-title-01",
    );
    return buildStudentRapAccess(scheduleId);
  }

  // 9. Research Databank Archival Submission
  if (pathname === "/databank/archive/me" && method === "GET") {
    return buildDatabankArchiveContext(getScenario("repository-submit"));
  }

  if (pathname === "/databank/archive" && method === "POST") {
    setScenario("repository-submit", "SUBMITTED_ARCHIVE");
    return buildDatabankArchiveContext("SUBMITTED_ARCHIVE");
  }

  // 10. Panelist Dashboard, Profile, & Defense Assignments
  if (pathname === "/thesis/defense/panelist/dashboard" && method === "GET") {
    const pendingEssays = INITIAL_EXAM_APPLICATIONS.filter(
      (app) => !app.essayEvaluationCompleted && !examGradedScores[app.id],
    ).length;
    return {
      ...MOCK_PANELIST_DASHBOARD,
      kpis: {
        ...MOCK_PANELIST_DASHBOARD.kpis,
        pendingEssayEvaluationsCount: pendingEssays,
      },
    };
  }

  if (pathname === "/panelists/me" && method === "GET") {
    return panelistProfileState;
  }

  if (
    pathname === "/panelists/me/availability" &&
    (method === "PUT" || method === "PATCH" || method === "POST")
  ) {
    const body = parseBody(options.body);
    if (typeof body.isAvailable === "boolean") {
      panelistProfileState = {
        ...panelistProfileState,
        isAvailableAsAdviser: body.isAvailable,
      };
    } else {
      panelistProfileState = {
        ...panelistProfileState,
        isAvailableAsAdviser: !panelistProfileState.isAvailableAsAdviser,
      };
    }
    return panelistProfileState;
  }

  if (pathname === "/thesis/defense/panelist/assignments" && method === "GET") {
    return MOCK_PANELIST_ASSIGNMENTS;
  }

  // 11. Collaborative Defense Workspace
  const workspaceMatch = /^\/thesis\/defense\/([^/]+)\/workspace$/.exec(
    pathname,
  );
  if (workspaceMatch && method === "GET") {
    const scheduleId = decodeURIComponent(workspaceMatch[1]);
    return buildDefenseWorkspace(
      scheduleId,
      getScenario("defense-workspace"),
    );
  }

  const startDefenseMatch = /^\/thesis\/defense\/([^/]+)\/start$/.exec(
    pathname,
  );
  if (startDefenseMatch && method === "POST") {
    return {
      scheduleId: decodeURIComponent(startDefenseMatch[1]),
      sessionStatus: "IN_PROGRESS",
    };
  }

  const evalMatch =
    /^\/thesis\/defense\/([^/]+)\/evaluation(?:\/(?:me|draft))?$/.exec(pathname);
  if (evalMatch && method === "GET") {
    const scheduleId = decodeURIComponent(evalMatch[1]);
    const scenario = getScenario("defense-workspace");
    const cached = customEvaluations.get(`${scheduleId}:${scenario}`);
    return cached ?? buildOralEvaluation(scheduleId, scenario);
  }

  if (evalMatch && (method === "PUT" || method === "POST")) {
    const scheduleId = decodeURIComponent(evalMatch[1]);
    const scenario = getScenario("defense-workspace");
    const current =
      customEvaluations.get(`${scheduleId}:${scenario}`) ??
      buildOralEvaluation(scheduleId, scenario);
    const body = parseBody(options.body);
    const nextCriteria =
      body.criteria && typeof body.criteria === "object"
        ? { ...current.criteria, ...(body.criteria as Record<string, number | null>) }
        : current.criteria;
    const numericVals = Object.values(nextCriteria).filter(
      (v): v is number => typeof v === "number" && !Number.isNaN(v),
    );
    const avg =
      numericVals.length > 0
        ? Number(
            (
              numericVals.reduce((acc, v) => acc + v, 0) / numericVals.length
            ).toFixed(2),
          )
        : 1.25;

    const updated: OralEvaluation = {
      ...current,
      criteria: nextCriteria,
      groupIValue: avg,
      groupIIValue: avg,
      overallValue: avg,
      rating:
        typeof body.rating === "string"
          ? body.rating
          : avg <= 1.25
            ? "Outstanding"
            : avg <= 1.5
              ? "Very Good"
              : avg <= 1.75
                ? "Good"
                : avg <= 2.0
                  ? "Fair"
                  : "Failed",
      recommendations:
        typeof body.recommendations === "string"
          ? body.recommendations
          : current.recommendations,
      updatedAt: new Date().toISOString(),
    };
    customEvaluations.set(`${scheduleId}:${scenario}`, updated);
    return updated;
  }

  const evalFinalizeMatch =
    /^\/thesis\/defense\/([^/]+)\/evaluation\/finalize$/.exec(pathname);
  if (evalFinalizeMatch && method === "POST") {
    const scheduleId = decodeURIComponent(evalFinalizeMatch[1]);
    const scenario = getScenario("defense-workspace");
    const current =
      customEvaluations.get(`${scheduleId}:${scenario}`) ??
      buildOralEvaluation(scheduleId, scenario);
    const now = new Date().toISOString();
    const finalized: OralEvaluation = {
      ...current,
      status: "FINALIZED",
      signedAt: now,
      finalizedAt: now,
      updatedAt: now,
      isLocked: true,
    };
    customEvaluations.set(`${scheduleId}:${scenario}`, finalized);
    return finalized;
  }

  // 12. PDF Annotations & Comments
  const annotationsMatch =
    /^\/thesis\/defense\/([^/]+)\/collaboration\/annotations$/.exec(pathname);
  if (annotationsMatch && method === "GET") {
    const scheduleId = decodeURIComponent(annotationsMatch[1]);
    const documentId = searchParams.get("documentId") ?? "doc-prop-ms-01";
    return annotationsState.map((a) => ({
      ...a,
      scheduleId,
      thesisDocumentId: documentId,
    }));
  }

  if (annotationsMatch && method === "POST") {
    const scheduleId = decodeURIComponent(annotationsMatch[1]);
    const body = parseBody(options.body);
    const now = new Date().toISOString();
    const newId = `annot-${Date.now()}`;
    const anchor = (body.anchor as CollaborationAnnotation["anchor"]) ?? {
      anchorVersion: 1,
      pageNumber: 1,
      rects: [{ x: 0.15, y: 0.3, width: 0.6, height: 0.04 }],
      selectedText: "Highlighted manuscript passage",
      prefix: "",
      suffix: "",
    };
    const initialCommentText =
      typeof body.initialComment === "string" ? body.initialComment.trim() : "";

    const newAnnotation: CollaborationAnnotation = {
      id: newId,
      scheduleId,
      thesisDocumentId:
        (body.thesisDocumentId as string) ?? "doc-prop-ms-01",
      pageNumber: anchor.pageNumber ?? 1,
      selectedText: anchor.selectedText ?? "Highlighted manuscript passage",
      anchor,
      author: {
        assignmentId: "assign-01",
        userId: "panelist-eval-01",
        name: "Dr. Roberto M. Santos, DIT",
        role: "CHAIRMAN",
      },
      createdAt: now,
      updatedAt: now,
      comments: initialCommentText
        ? [
            {
              id: `comment-${Date.now()}`,
              annotationId: newId,
              parentCommentId: null,
              body: initialCommentText,
              author: {
                assignmentId: "assign-01",
                userId: "panelist-eval-01",
                name: "Dr. Roberto M. Santos, DIT",
                role: "CHAIRMAN",
              },
              createdAt: now,
              updatedAt: now,
            },
          ]
        : [],
    };
    annotationsState = [...annotationsState, newAnnotation];
    return { ...newAnnotation, annotation: newAnnotation };
  }

  const commentCreateMatch =
    /^\/thesis\/defense\/([^/]+)\/collaboration\/annotations\/([^/]+)\/comments$/.exec(
      pathname,
    );
  if (commentCreateMatch && method === "POST") {
    const annotationId = decodeURIComponent(commentCreateMatch[2]);
    const body = parseBody(options.body);
    const now = new Date().toISOString();
    const newComment = {
      id: `comment-${Date.now()}`,
      annotationId,
      parentCommentId:
        typeof body.parentCommentId === "string" ? body.parentCommentId : null,
      body: typeof body.body === "string" ? body.body : "",
      author: {
        assignmentId: "assign-01",
        userId: "panelist-eval-01",
        name: "Dr. Roberto M. Santos, DIT",
        role: "CHAIRMAN",
      },
      createdAt: now,
      updatedAt: now,
    };
    annotationsState = annotationsState.map((annot) =>
      annot.id === annotationId
        ? {
            ...annot,
            updatedAt: now,
            comments: [...annot.comments, newComment],
          }
        : annot,
    );
    return newComment;
  }

  const annotationDeleteMatch =
    /^\/thesis\/defense\/([^/]+)\/collaboration\/annotations\/([^/]+)$/.exec(
      pathname,
    );
  if (annotationDeleteMatch && method === "DELETE") {
    const annotationId = decodeURIComponent(annotationDeleteMatch[2]);
    annotationsState = annotationsState.filter((a) => a.id !== annotationId);
    return { deleted: true, id: annotationId };
  }

  // 13. Committee RAP Report & Rapporteur Notes
  const reportMatch =
    /^\/thesis\/defense\/([^/]+)\/(?:collaboration\/report|rapporteur-notes)$/.exec(
      pathname,
    );
  if (reportMatch && method === "GET") {
    const scheduleId = decodeURIComponent(reportMatch[1]);
    const scenario = getScenario("defense-workspace");
    return (
      customReports.get(`${scheduleId}:${scenario}`) ??
      buildCommitteeReport(scheduleId, scenario)
    );
  }

  if (reportMatch && (method === "PUT" || method === "POST")) {
    const scheduleId = decodeURIComponent(reportMatch[1]);
    const scenario = getScenario("defense-workspace");
    const current =
      customReports.get(`${scheduleId}:${scenario}`) ??
      buildCommitteeReport(scheduleId, scenario);
    const body = parseBody(options.body);
    const updated = {
      ...current,
      bodyVersion: current.bodyVersion + 1,
      body: (body.body as typeof current.body) ?? current.body,
    };
    customReports.set(`${scheduleId}:${scenario}`, updated);
    return updated;
  }

  const reportFreezeMatch =
    /^\/thesis\/defense\/([^/]+)\/(?:collaboration\/report\/(?:finalize|freeze)|rapporteur-notes\/finalize)$/.exec(
      pathname,
    );
  if (reportFreezeMatch && method === "POST") {
    const scheduleId = decodeURIComponent(reportFreezeMatch[1]);
    const scenario = getScenario("defense-workspace");
    const current =
      customReports.get(`${scheduleId}:${scenario}`) ??
      buildCommitteeReport(scheduleId, scenario);
    const now = new Date().toISOString();
    const updated = {
      ...current,
      reportStatus: "FOR_SIGNATURE",
      freeze: { frozenAt: now },
      canEditBody: false,
      canFreeze: false,
      canSign: true,
    };
    customReports.set(`${scheduleId}:${scenario}`, updated);
    return updated;
  }

  const reportSignMatch =
    /^\/thesis\/defense\/([^/]+)\/collaboration\/report\/sign$/.exec(pathname);
  if (reportSignMatch && method === "POST") {
    const scheduleId = decodeURIComponent(reportSignMatch[1]);
    const scenario = getScenario("defense-workspace");
    const current =
      customReports.get(`${scheduleId}:${scenario}`) ??
      buildCommitteeReport(scheduleId, scenario);
    const now = new Date().toISOString();
    const updated = {
      ...current,
      reportStatus: "FINALIZED",
      signatures: current.signatures.map((sig) =>
        sig.userId === "panelist-eval-01"
          ? { ...sig, isSigned: true, signedAt: now }
          : sig,
      ),
      signatureProgress: { required: 3, signed: 3 },
      mySignature: {
        ...current.mySignature,
        isSigned: true,
        signedAt: now,
      },
      canSign: false,
    };
    customReports.set(`${scheduleId}:${scenario}`, updated);
    return updated;
  }

  // 14. Chairman Verdict & Conclusion Readiness
  const readinessMatch =
    /^\/thesis\/defense\/([^/]+)\/collaboration\/conclusion-readiness$/.exec(
      pathname,
    );
  if (readinessMatch && method === "GET") {
    const scheduleId = decodeURIComponent(readinessMatch[1]);
    return buildConclusionReadiness(
      scheduleId,
      getScenario("defense-workspace"),
    );
  }

  const conclusionMatch = /^\/thesis\/defense\/([^/]+)\/conclusion$/.exec(
    pathname,
  );
  if (conclusionMatch && method === "GET") {
    return {
      scheduleId: decodeURIComponent(conclusionMatch[1]),
      outcome: "PASSED",
      selectedTitle: OFFICIAL_APPROVED_TITLE,
    };
  }
  if (conclusionMatch && method === "POST") {
    setScenario("defense-workspace", "CONCLUDED_SESSION");
    return {
      scheduleId: decodeURIComponent(conclusionMatch[1]),
      outcome: "PASSED",
      concludedAt: new Date().toISOString(),
    };
  }

  // 15. Defense History
  const historyMatch = /^\/thesis\/defense\/([^/]+)\/history$/.exec(pathname);
  if (historyMatch && method === "GET") {
    return buildDefenseHistory(decodeURIComponent(historyMatch[1]));
  }

  const historyAttemptMatch =
    /^\/thesis\/defense\/([^/]+)\/history\/([^/]+)$/.exec(pathname);
  if (historyAttemptMatch && method === "GET") {
    return buildDefenseHistoryAttempt(
      decodeURIComponent(historyAttemptMatch[1]),
      decodeURIComponent(historyAttemptMatch[2]),
    );
  }

  // 16. Adviser Workspace & Advisees
  if (pathname === "/thesis/adviser/workspace" && method === "GET") {
    return buildAdviserWorkspace(getScenario("advisees"));
  }

  const adviseeDetailMatch =
    /^\/thesis\/adviser\/(?:workspace\/)?advisees\/([^/]+)$/.exec(pathname);
  if (adviseeDetailMatch && method === "GET") {
    return buildAdviseeDetail(
      decodeURIComponent(adviseeDetailMatch[1]),
      getScenario("advisees"),
    );
  }

  const adviserReqResponseMatch =
    /^\/thesis\/adviser\/requests\/([^/]+)\/(?:adviser-response|approve|decline)$/.exec(
      pathname,
    );
  if (adviserReqResponseMatch && method === "POST") {
    setScenario("advisees", "MANUSCRIPT_REVIEW");
    return {
      id: decodeURIComponent(adviserReqResponseMatch[1]),
      adviserStatus: "CONFORMED",
      status: "PENDING",
    };
  }

  const reviewTaskMatch =
    /^\/thesis\/(proposal-adviser-review|final-adviser-review|adviser-reviews)\/(?:tasks\/|PROPOSAL\/|FINAL\/)?([^/]+)$/.exec(
      pathname,
    );
  if (reviewTaskMatch && method === "GET") {
    const isFinal = reviewTaskMatch[1].includes("final") || pathname.includes("FINAL");
    const stage = isFinal ? "FINAL" : "PROPOSAL";
    const thesisId = decodeURIComponent(reviewTaskMatch[2]);
    const detail = buildAdviserReviewTaskDetail(stage, thesisId);
    const custom = customTaskStatuses.get(`${stage}:${thesisId}`);
    if (custom) {
      return {
        ...detail,
        reviewStatus: custom.reviewStatus,
        reviewRemarks: custom.remarks,
        certification:
          custom.reviewStatus === "ISSUED"
            ? {
                issued: true,
                adviserName: "Dr. Maria Clara R. Santos, EdD",
                signedAt: new Date().toISOString(),
                defenseStage: stage,
              }
            : null,
      };
    }
    return detail;
  }

  const reviewActionMatch =
    /^\/thesis\/(proposal-adviser-review|final-adviser-review|adviser-reviews)\/(?:tasks\/|PROPOSAL\/|FINAL\/)?([^/]+)\/(certify|issue|request-changes)$/.exec(
      pathname,
    );
  if (reviewActionMatch && method === "POST") {
    const isFinal = reviewActionMatch[1].includes("final") || pathname.includes("FINAL");
    const stage = isFinal ? "FINAL" : "PROPOSAL";
    const thesisId = decodeURIComponent(reviewActionMatch[2]);
    const action = reviewActionMatch[3];
    const body = parseBody(options.body);
    const remarks = typeof body.remarks === "string" ? body.remarks : null;
    const nextStatus = action === "request-changes" ? "CHANGES_REQUESTED" : "ISSUED";
    customTaskStatuses.set(`${stage}:${thesisId}`, {
      reviewStatus: nextStatus,
      remarks,
    });
    return {
      thesisId,
      stage,
      reviewStatus: nextStatus,
      reviewRemarks: remarks,
    };
  }

  // 17. Pending RAP Signatures
  if (pathname === "/thesis/defense/rap-reports/pending" && method === "GET") {
    return pendingRapSignatures;
  }

  const rapSignByIdMatch =
    /^\/thesis\/defense\/rap-reports\/([^/]+)\/sign$/.exec(pathname);
  if (rapSignByIdMatch && method === "POST") {
    const id = decodeURIComponent(rapSignByIdMatch[1]);
    pendingRapSignatures = pendingRapSignatures.filter((r) => r.id !== id);
    return { id, signed: true, signedAt: new Date().toISOString() };
  }

  // 17b. Faculty Entrance Exam Essay Evaluations (/exam/applications & /exam/scores/:id/grade)
  if (pathname === "/exam/applications" && method === "GET") {
    return INITIAL_EXAM_APPLICATIONS.map((app) => {
      const custom = examGradedScores[app.id];
      if (!custom) return app;
      const mcq = app.id === "app-eval-002" ? 58 : 64;
      const total = mcq + custom.essayScore;
      const passed = (total / 110) * 100 >= 75;
      return {
        ...app,
        status: passed ? "PASSED" : "FAILED",
        essayEvaluationCompleted: true,
      };
    });
  }

  const examAppDetailMatch = /^\/exam\/applications\/([^/]+)$/.exec(pathname);
  if (examAppDetailMatch && method === "GET") {
    const appId = decodeURIComponent(examAppDetailMatch[1]);
    const app =
      INITIAL_EXAM_APPLICATIONS.find((item) => item.id === appId) ??
      INITIAL_EXAM_APPLICATIONS[0];
    return buildExamRecordDetail(
      app,
      getScenario("essay-evaluation-detail"),
      examGradedScores,
    );
  }

  const examGradeMatch = /^\/exam\/scores\/([^/]+)\/grade$/.exec(pathname);
  if (examGradeMatch && method === "POST") {
    const appId = decodeURIComponent(examGradeMatch[1]);
    const body = parseBody(options.body);
    const rawScore = Number(body.essayScore);
    const essayScore = Number.isFinite(rawScore)
      ? Math.max(0, Math.min(38, rawScore))
      : 31;
    examGradedScores[appId] = {
      essayScore,
      gradedAt: new Date().toISOString(),
    };
    setScenario("essay-evaluation-detail", "EVALUATED");
    const app =
      INITIAL_EXAM_APPLICATIONS.find((item) => item.id === appId) ??
      INITIAL_EXAM_APPLICATIONS[0];
    const detail = buildExamRecordDetail(app, "EVALUATED", examGradedScores);
    return {
      ...detail.essayEvaluation,
      result: detail.result!,
    };
  }

  // 18. Programs & Applicant Registration
  if (pathname === "/programs" && method === "GET") {
    const graduatePrograms = [
      {
        id: "prog-maed-as",
        programCode: "MAEd-AS",
        programName:
          "Master of Arts in Education major in Administration and Supervision",
        programType: "MASTERS",
        degreeLevel: "MASTERAL" as const,
      },
      {
        id: "prog-maed-gc",
        programCode: "MAEd-GC",
        programName:
          "Master of Arts in Education major in Guidance and Counseling",
        programType: "MASTERS",
        degreeLevel: "MASTERAL" as const,
      },
      {
        id: "prog-maed-se",
        programCode: "MAEd-SE",
        programName: "Master of Arts in Education major in Special Education",
        programType: "MASTERS",
        degreeLevel: "MASTERAL" as const,
      },
      {
        id: "prog-mpa",
        programCode: "MPA",
        programName: "Master in Public Administration",
        programType: "MASTERS",
        degreeLevel: "MASTERAL" as const,
      },
      {
        id: "prog-mba",
        programCode: "MBA",
        programName: "Master in Business Administration",
        programType: "MASTERS",
        degreeLevel: "MASTERAL" as const,
      },
      {
        id: "prog-mat-math",
        programCode: "MAT-Math",
        programName: "Master of Arts in Teaching major in Mathematics",
        programType: "MASTERS",
        degreeLevel: "MASTERAL" as const,
      },
      {
        id: "prog-msie",
        programCode: "MSIE",
        programName:
          "Master of Science in Industrial Education major in Educational Technology",
        programType: "MASTERS",
        degreeLevel: "MASTERAL" as const,
      },
      {
        id: "prog-edd-as",
        programCode: "EdD-AS",
        programName:
          "Doctor of Education major in Administration and Supervision",
        programType: "DOCTORAL",
        degreeLevel: "DOCTORAL" as const,
      },
      {
        id: "prog-edd-ci",
        programCode: "EdD-CI",
        programName:
          "Doctor of Education major in Curriculum and Instruction",
        programType: "DOCTORAL",
        degreeLevel: "DOCTORAL" as const,
      },
      {
        id: "prog-dpa",
        programCode: "DPA",
        programName: "Doctor in Public Administration",
        programType: "DOCTORAL",
        degreeLevel: "DOCTORAL" as const,
      },
      {
        id: "prog-dba",
        programCode: "DBA",
        programName: "Doctor in Business Administration",
        programType: "DOCTORAL",
        degreeLevel: "DOCTORAL" as const,
      },
    ];
    return {
      graduatePrograms,
      undergraduatePrograms: [
        {
          id: "ugrad-bsed",
          programName: "Bachelor of Secondary Education (BSEd)",
        },
        {
          id: "ugrad-beed",
          programName: "Bachelor of Elementary Education (BEEd)",
        },
        {
          id: "ugrad-btled",
          programName:
            "Bachelor of Technology and Livelihood Education (BTLEd)",
        },
        {
          id: "ugrad-bsba",
          programName: "Bachelor of Science in Business Administration (BSBA)",
        },
        {
          id: "ugrad-bpa",
          programName: "Bachelor of Public Administration (BPA)",
        },
        {
          id: "ugrad-bsit",
          programName: "Bachelor of Science in Information Technology (BSIT)",
        },
        {
          id: "ugrad-bscs",
          programName: "Bachelor of Science in Computer Science (BSCS)",
        },
      ],
    };
  }

  if (pathname === "/programs/check-alignment" && method === "POST") {
    return {
      aligned: true,
      alignmentStatus: "ALIGNED",
      message:
        "Your prerequisite degree is aligned with your selected graduate program.",
    };
  }

  if (pathname === "/auth/register" && method === "POST") {
    const body = parseBody(options.body);
    return {
      success: true,
      applicantId:
        typeof body.applicantId === "string" && body.applicantId.trim()
          ? body.applicantId.trim()
          : "APP-2026-0142",
      alignmentStatus: "ALIGNED",
      message: "Applicant registration completed successfully.",
    };
  }

  // 19. Applicant Profile & Program Alignment Waiver
  if (pathname === "/applicant/profile" && method === "GET") {
    const dashScenario = getScenario("applicant-dashboard");
    const alignScenario = getScenario("applicant-alignment");
    const onAlignmentPage = currentBrowserPath.startsWith("/applicant/alignment");

    const alignmentStatus = onAlignmentPage
      ? alignScenario === "PENDING_WAIVER"
        ? "pending_waiver"
        : "aligned"
      : dashScenario === "STEP_1_ALIGN" && alignScenario === "PENDING_WAIVER"
        ? "pending_waiver"
        : "aligned";

    const currentStep =
      dashScenario === "STEP_3_PASSED_COR"
        ? 2
        : dashScenario === "STEP_2_EXAM_SCHEDULED"
          ? 1
          : 0;

    return {
      ...applicantProfileState,
      alignmentStatus,
      currentStep,
      examDate:
        dashScenario === "STEP_1_ALIGN"
          ? "Not yet scheduled"
          : "December 5, 2026",
      examTime:
        dashScenario === "STEP_1_ALIGN"
          ? "Select an available examination slot"
          : "9:00 AM – 10:30 AM",
    };
  }

  if (
    pathname === "/applicant/profile" &&
    (method === "PUT" || method === "PATCH" || method === "POST")
  ) {
    const body = parseBody(options.body);
    applicantProfileState = {
      ...applicantProfileState,
      ...(typeof body.firstName === "string" ? { firstName: body.firstName } : {}),
      ...(typeof body.middleName === "string" ? { middleName: body.middleName } : {}),
      ...(typeof body.lastName === "string" ? { lastName: body.lastName } : {}),
      ...(typeof body.email === "string" ? { email: body.email } : {}),
      ...(typeof body.cellphone === "string" ? { cellphone: body.cellphone } : {}),
      ...(typeof body.dateOfBirth === "string" ? { dateOfBirth: body.dateOfBirth } : {}),
      ...(typeof body.address === "string" ? { address: body.address } : {}),
      ...(typeof body.undergraduateDegree === "string"
        ? { undergraduateDegree: body.undergraduateDegree }
        : {}),
      ...(typeof body.undergraduateSchool === "string"
        ? { undergraduateSchool: body.undergraduateSchool }
        : {}),
      ...(typeof body.yearGraduated === "string"
        ? { yearGraduated: body.yearGraduated }
        : {}),
      ...(typeof body.gwa === "string" ? { gwa: body.gwa } : {}),
      ...(typeof body.currentAffiliation === "string"
        ? { currentAffiliation: body.currentAffiliation }
        : {}),
    };
    return applicantProfileState;
  }

  if (pathname === "/waivers/me" && method === "GET") {
    return {
      id: "waiver-eval-01",
      createdAt: "2026-11-09T14:20:00.000Z",
      status: "PENDING",
      waiverFormDownloadedAt: waiverDownloadedAt,
      adminNotes:
        "Complete 6 units of foundational Educational Management bridging coursework during your first semester.",
      validatedAt: null,
      student: {
        pinnacleApplicantId: applicantProfileState.applicantId,
        user: {
          firstName: applicantProfileState.firstName,
          lastName: applicantProfileState.lastName,
          email: applicantProfileState.email,
        },
      },
      undergraduateProgram: {
        programName: "Bachelor of Science in Information Technology (BSIT)",
      },
      intendedProgram: {
        programName: applicantProfileState.program,
      },
      validatedBy: null,
    };
  }

  if (pathname === "/waivers/me/download" && method === "GET") {
    waiverDownloadedAt = new Date().toISOString();
    return { downloaded: true, waiverFormDownloadedAt: waiverDownloadedAt };
  }

  // 20. Applicant Exam Status & Slot Booking
  if (pathname === "/exam/status" && method === "GET") {
    if (currentBrowserPath.startsWith("/applicant/cor-upload")) {
      return {
        applicationId: "exam-app-eval-01",
        examStatus: "passed",
        canBookExam: false,
        canAppealMissedExam: false,
        alignmentStatus: "ALIGNED",
        programId: "prog-maed-as",
        confirmedSlot: bookedExamSlot,
        amendment: null,
      };
    }

    if (currentBrowserPath.startsWith("/applicant/exam")) {
      const examScenario = getScenario("applicant-exam");
      if (examScenario === "BLOCKED") {
        return {
          applicationId: "exam-app-eval-01",
          examStatus: applicantMissedAppeal ? "appealed" : "scheduled",
          canBookExam: false,
          canAppealMissedExam: !applicantMissedAppeal,
          alignmentStatus: "ALIGNED",
          programId: "prog-maed-as",
          confirmedSlot: {
            id: "slot-missed-01",
            examDate: "2026-10-15T00:00:00.000Z",
            examTime: "1970-01-01T09:00:00.000Z",
            programName: applicantProfileState.program,
          },
          amendment: applicantMissedAppeal,
        };
      }
      return {
        applicationId: "exam-app-eval-01",
        examStatus: examScenario === "TERMINAL" ? "taken" : "approved",
        canBookExam: false,
        canAppealMissedExam: false,
        alignmentStatus: "ALIGNED",
        programId: "prog-maed-as",
        confirmedSlot: bookedExamSlot,
        amendment: null,
      };
    }

    const schedScenario = getScenario("applicant-schedule");
    if (schedScenario === "WAIVER_LOCKED") {
      return {
        applicationId: null,
        examStatus: "none",
        canBookExam: false,
        canAppealMissedExam: false,
        alignmentStatus: "PENDING_WAIVER",
        programId: "prog-maed-as",
        confirmedSlot: null,
        amendment: null,
      };
    }
    if (schedScenario === "CONFIRMED_SLOT") {
      return {
        applicationId: "exam-app-eval-01",
        examStatus: "approved",
        canBookExam: false,
        canAppealMissedExam: false,
        alignmentStatus: "ALIGNED",
        programId: "prog-maed-as",
        confirmedSlot: bookedExamSlot,
        amendment: null,
      };
    }
    return {
      applicationId: null,
      examStatus: "none",
      canBookExam: true,
      canAppealMissedExam: false,
      alignmentStatus: "ALIGNED",
      programId: "prog-maed-as",
      confirmedSlot: null,
      amendment: null,
    };
  }

  if (pathname === "/exam/slots/available" && method === "GET") {
    return AVAILABLE_EXAM_SLOTS;
  }

  if (pathname === "/exam/schedule" && method === "POST") {
    const body = parseBody(options.body);
    const slotId = typeof body.slotId === "string" ? body.slotId : "slot-eval-01";
    const found = AVAILABLE_EXAM_SLOTS.find((s) => s.id === slotId) ?? AVAILABLE_EXAM_SLOTS[0];
    bookedExamSlot = {
      id: found.id,
      examDate: found.examDate,
      examTime: found.examTime,
      programName:
        found.program?.programName ?? applicantProfileState.program,
    };
    setScenario("applicant-schedule", "CONFIRMED_SLOT");
    return {
      applicationId: "exam-app-eval-01",
      slotId: found.id,
      confirmedSlot: bookedExamSlot,
    };
  }

  // 21. Interactive Entrance Examination Engine (/exam-engine/**)
  const isExecutionGet =
    method === "GET" &&
    (pathname === "/exam-engine/execution" ||
      /^\/exam-engine\/applications\/[^/]+\/execution$/.exec(pathname));

  if (isExecutionGet) {
    const examScenario = getScenario("applicant-exam");
    const nowIso = new Date().toISOString();
    const startedIso = new Date(Date.now() - 8 * 60_000).toISOString();
    const deadlineIso = new Date(Date.now() + 82 * 60_000).toISOString();

    if (examScenario === "TERMINAL") {
      const terminalExecution: ExamExecution = {
        applicationId: "exam-app-eval-01",
        applicationStatus: "TAKEN",
        state: "TERMINAL",
        reason: null,
        canStart: false,
        serverNow: nowIso,
        actualStartedAt: lastFinalizationReceipt.actualStartedAt,
        deadlineAt: lastFinalizationReceipt.deadlineAt,
        remainingSeconds: 0,
        durationMinutes: 90,
        contentRevisionId: "olsat-v2-rev-01",
        finalization: lastFinalizationReceipt,
        authorization: {
          authorizedAt: lastFinalizationReceipt.actualStartedAt,
          authorizedBy: {
            id: "admin-eval-01",
            firstName: "Graduate School",
            lastName: "Proctor",
          },
        },
        appointment: {
          examDate: bookedExamSlot.examDate,
          examTime: bookedExamSlot.examTime,
          programName: bookedExamSlot.programName,
        },
      };
      return terminalExecution;
    }

    if (examScenario === "READY" || examScenario === "BLOCKED") {
      const readyExecution: ExamExecution = {
        applicationId: "exam-app-eval-01",
        applicationStatus: "APPROVED",
        state: "READY",
        reason: null,
        canStart: examScenario === "READY",
        serverNow: nowIso,
        actualStartedAt: null,
        deadlineAt: null,
        remainingSeconds: 5400,
        durationMinutes: 90,
        contentRevisionId: "olsat-v2-rev-01",
        finalization: null,
        authorization: {
          authorizedAt: nowIso,
          authorizedBy: {
            id: "admin-eval-01",
            firstName: "Graduate School",
            lastName: "Proctor",
          },
        },
        appointment: {
          examDate:
            examScenario === "BLOCKED"
              ? "2026-10-15T00:00:00.000Z"
              : bookedExamSlot.examDate,
          examTime: bookedExamSlot.examTime,
          programName: bookedExamSlot.programName,
        },
      };
      return readyExecution;
    }

    const activeExecution: ExamExecution = {
      applicationId: "exam-app-eval-01",
      applicationStatus: "APPROVED",
      state: "ACTIVE",
      reason: null,
      canStart: false,
      serverNow: nowIso,
      actualStartedAt: startedIso,
      deadlineAt: deadlineIso,
      remainingSeconds: 82 * 60,
      durationMinutes: 90,
      contentRevisionId: "olsat-v2-rev-01",
      finalization: null,
      authorization: {
        authorizedAt: startedIso,
        authorizedBy: {
          id: "admin-eval-01",
          firstName: "Graduate School",
          lastName: "Proctor",
        },
      },
      appointment: {
        examDate: bookedExamSlot.examDate,
        examTime: bookedExamSlot.examTime,
        programName: bookedExamSlot.programName,
      },
    };
    return activeExecution;
  }

  if (
    /^\/exam-engine\/applications\/[^/]+\/start$/.exec(pathname) &&
    method === "POST"
  ) {
    setScenario("applicant-exam", "ACTIVE");
    const nowIso = new Date().toISOString();
    const deadlineIso = new Date(Date.now() + 90 * 60_000).toISOString();
    return {
      applicationId: "exam-app-eval-01",
      state: "ACTIVE",
      actualStartedAt: nowIso,
      deadlineAt: deadlineIso,
    };
  }

  if (
    /^\/exam-engine\/applications\/[^/]+\/questions$/.exec(pathname) &&
    method === "GET"
  ) {
    return APPLICANT_EXAM_QUESTIONS;
  }

  if (
    /^\/exam-engine\/applications\/[^/]+\/drafts$/.exec(pathname) &&
    method === "GET"
  ) {
    return Array.from(applicantExamDrafts.values());
  }

  if (
    /^\/exam-engine\/applications\/[^/]+\/drafts$/.exec(pathname) &&
    (method === "PATCH" || method === "POST" || method === "PUT")
  ) {
    const body = parseBody(options.body);
    const questionId =
      typeof body.questionId === "string" ? body.questionId : "";
    const prev = applicantExamDrafts.get(questionId);
    const nextRevision = (prev?.revision ?? 0) + 1;

    const updated: SavedDraft =
      "essayAnswer" in body
        ? {
            questionId,
            essayAnswer:
              typeof body.essayAnswer === "string" ? body.essayAnswer : "",
            revision: nextRevision,
          }
        : {
            questionId,
            selectedOptionId:
              typeof body.selectedOptionId === "string"
                ? body.selectedOptionId
                : null,
            revision: nextRevision,
          };

    if (questionId) {
      applicantExamDrafts.set(questionId, updated);
    }
    return updated;
  }

  if (
    /^\/exam-engine\/applications\/[^/]+\/submit$/.exec(pathname) &&
    method === "POST"
  ) {
    let answered = 0;
    for (const q of APPLICANT_EXAM_QUESTIONS) {
      const draft = applicantExamDrafts.get(q.id);
      if (!draft) continue;
      if (
        q.type === "ESSAY" &&
        "essayAnswer" in draft &&
        draft.essayAnswer.trim().length > 0
      ) {
        answered++;
      } else if (
        q.type === "MULTIPLE_CHOICE" &&
        "selectedOptionId" in draft &&
        draft.selectedOptionId
      ) {
        answered++;
      }
    }
    const nowIso = new Date().toISOString();
    lastFinalizationReceipt = {
      receiptId: `EXAM-RCPT-2026-0142-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      applicationId: "exam-app-eval-01",
      finalizedAt: nowIso,
      finalizationReason: "APPLICANT_SUBMITTED",
      actualStartedAt: new Date(Date.now() - 25 * 60_000).toISOString(),
      deadlineAt: new Date(Date.now() + 65 * 60_000).toISOString(),
      contentRevisionId: "olsat-v2-rev-01",
      answeredCount: answered,
      unansweredCount: Math.max(0, APPLICANT_EXAM_QUESTIONS.length - answered),
      questionCount: APPLICANT_EXAM_QUESTIONS.length,
    };
    setScenario("applicant-exam", "TERMINAL");
    return lastFinalizationReceipt;
  }

  if (
    /^\/exam-engine\/applications\/[^/]+\/finalization$/.exec(pathname) &&
    method === "GET"
  ) {
    return {
      receipt:
        getScenario("applicant-exam") === "TERMINAL"
          ? lastFinalizationReceipt
          : null,
    };
  }

  if (
    /^\/exam\/applications\/[^/]+\/missed-appeal$/.exec(pathname) &&
    method === "POST"
  ) {
    const body = parseBody(options.body);
    applicantMissedAppeal = {
      reason:
        typeof body.reason === "string" && body.reason.trim()
          ? body.reason.trim()
          : "Medical emergency prevented attendance on the scheduled examination date.",
      status: "PENDING",
    };
    return {
      applicationId: "exam-app-eval-01",
      examStatus: "appealed",
      amendment: applicantMissedAppeal,
    };
  }

  // 22. Entrance Examination Results (/exam/result)
  if (pathname === "/exam/result" && method === "GET") {
    const resultScenario = getScenario("applicant-results");
    if (resultScenario === "PENDING_ESSAY") {
      return {
        status: "pending",
        computedStatus: "PENDING",
        effectiveStatus: "pending",
        provenance: "B8",
        mcqScore: "64",
        mcqTotal: "72",
        mcqCorrectCount: 64,
        mcqQuestionCount: 72,
        essayScore: null,
        essayTotal: "38",
        totalScore: null,
        totalPossible: "110",
        percentage: null,
        passingThreshold: "75",
        scoredAt: null,
        examDate: "2026-11-08T00:00:00.000Z",
        institutionalDecision: null,
      };
    }
    if (resultScenario === "PASSED_RECONSIDERED") {
      return {
        status: "failed",
        computedStatus: "FAILED",
        effectiveStatus: "passed_reconsidered",
        provenance: "B8",
        mcqScore: "50",
        mcqTotal: "72",
        mcqCorrectCount: 50,
        mcqQuestionCount: 72,
        essayScore: "28",
        essayTotal: "38",
        totalScore: "78",
        totalPossible: "110",
        percentage: "70.91",
        passingThreshold: "75",
        scoredAt: "2026-11-10T14:30:00.000Z",
        examDate: "2026-11-08T00:00:00.000Z",
        institutionalDecision: {
          decision: "PASSED_RECONSIDERED",
          decidedAt: "2026-11-11T10:15:00.000Z",
        },
      };
    }
    if (resultScenario === "FAILED") {
      return {
        status: "failed",
        computedStatus: "FAILED",
        effectiveStatus: "failed",
        provenance: "B8",
        mcqScore: "45",
        mcqTotal: "72",
        mcqCorrectCount: 45,
        mcqQuestionCount: 72,
        essayScore: "22",
        essayTotal: "38",
        totalScore: "67",
        totalPossible: "110",
        percentage: "60.91",
        passingThreshold: "75",
        scoredAt: "2026-11-10T14:30:00.000Z",
        examDate: "2026-11-08T00:00:00.000Z",
        institutionalDecision: null,
      };
    }
    return {
      status: "passed",
      computedStatus: "PASSED",
      effectiveStatus: "passed",
      provenance: "B8",
      mcqScore: "64",
      mcqTotal: "72",
      mcqCorrectCount: 64,
      mcqQuestionCount: 72,
      essayScore: "31",
      essayTotal: "38",
      totalScore: "95",
      totalPossible: "110",
      percentage: "86.36",
      passingThreshold: "75",
      scoredAt: "2026-11-10T14:30:00.000Z",
      examDate: "2026-11-08T00:00:00.000Z",
      institutionalDecision: null,
    };
  }

  // 23. Certificate of Registration (COR) Upload (/cor/**)
  if (pathname === "/cor/my-upload" && method === "GET") {
    const corScenario = getScenario("applicant-cor-upload");
    if (corScenario === "VERIFIED") {
      return {
        id: "cor-upload-eval-01",
        status: "VERIFIED",
        originalFilename:
          "EARIST_COR_Villanueva_MariaLourdes_1stSem_2026.pdf",
        uploadedAt: "2026-11-11T09:20:00.000Z",
        verifiedAt: "2026-11-11T15:45:00.000Z",
      };
    }
    if (corScenario === "PENDING_VERIFICATION") {
      return {
        id: "cor-upload-eval-01",
        status: "PENDING",
        originalFilename:
          "EARIST_COR_Villanueva_MariaLourdes_1stSem_2026.pdf",
        uploadedAt: "2026-11-11T09:20:00.000Z",
      };
    }
    return {
      status: "NONE",
    };
  }

  if (pathname === "/cor/upload" && method === "POST") {
    setScenario("applicant-cor-upload", "PENDING_VERIFICATION");
    return {
      id: "cor-upload-eval-01",
      status: "PENDING",
      uploadedAt: new Date().toISOString(),
    };
  }

  // Default fallback so no unexpected endpoint ever throws a network error
  return { ok: true, evaluationMode: true, endpoint: pathname };
}
