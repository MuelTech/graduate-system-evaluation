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
  buildFinalAdviserReview,
  buildOralEvaluation,
  buildProposalAdviserReview,
  buildStudentRapAccess,
  buildStudentThesisJourney,
  INITIAL_ANNOTATIONS,
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
import { getScenario, setScenario } from "./scenario-store";

// In-memory interactive state so mutations persist during the evaluation session
let studentNotifications = [...INITIAL_STUDENT_NOTIFICATIONS];
let panelistNotifications = [...INITIAL_PANELIST_NOTIFICATIONS];
let annotationsState: CollaborationAnnotation[] = [...INITIAL_ANNOTATIONS];
let pendingRapSignatures = [...INITIAL_PENDING_RAP_SIGNATURES];

let panelistProfileState = {
  id: "panelist-eval-01",
  isExternal: false,
  isAvailableAsAdviser: true,
  specialization:
    "Educational Leadership, Curriculum Development, & Policy Research",
  officeAffiliation: "EARIST Graduate School — College of Education",
  academicRank: "Associate Professor V",
  highestEducationalAttainment:
    "Doctor of Education (EdD) in Educational Administration",
  facultyId: "FAC-GS-0089",
};

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
    return activeRole === "panelist"
      ? panelistNotifications
      : studentNotifications;
  }

  const notifReadMatch = /^\/notifications\/([^/]+)\/read$/.exec(pathname);
  if (notifReadMatch && (method === "PUT" || method === "POST" || method === "PATCH")) {
    const id = decodeURIComponent(notifReadMatch[1]);
    studentNotifications = studentNotifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n,
    );
    panelistNotifications = panelistNotifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n,
    );
    return { success: true, id };
  }

  // 2. Research Repository Publications
  if (pathname === "/databank/publications" && method === "GET") {
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
    return buildCurrentDefenseApplication(getScenario("title-defense"));
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
    setScenario("adviser-request", "PENDING_SIGNATURES");
    return {
      id: "adv-req-01",
      status: "PENDING",
      adviserStatus: "PENDING",
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
    return MOCK_PANELIST_DASHBOARD;
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

  const evalMatch = /^\/thesis\/defense\/([^/]+)\/evaluation$/.exec(pathname);
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
          : `${avg.toFixed(2)} — Passed`,
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
        name: "Dr. Maria Clara R. Santos, EdD",
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
                name: "Dr. Maria Clara R. Santos, EdD",
                role: "CHAIRMAN",
              },
              createdAt: now,
              updatedAt: now,
            },
          ]
        : [],
    };
    annotationsState = [...annotationsState, newAnnotation];
    return newAnnotation;
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
        name: "Dr. Maria Clara R. Santos, EdD",
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
    setScenario("defense-workspace", "CONCLUDED_READONLY");
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
    /^\/thesis\/adviser\/workspace\/advisees\/([^/]+)$/.exec(pathname);
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

  // Default fallback so no unexpected endpoint ever throws a network error
  return { ok: true, evaluationMode: true, endpoint: pathname };
}
