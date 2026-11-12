"use client";

import { useSyncExternalStore, useCallback } from "react";

export type ScenarioPageKey =
  | "applicant-dashboard"
  | "applicant-alignment"
  | "applicant-schedule"
  | "applicant-exam"
  | "applicant-results"
  | "applicant-cor-upload"
  | "student-dashboard"
  | "title-defense"
  | "adviser-request"
  | "proposal-defense"
  | "strike"
  | "final-defense"
  | "defense-workspace"
  | "advisees"
  | "essay-evaluation-detail"
  | "repository-submit";

export interface ScenarioOption {
  id: string;
  label: string;
  badge?: string;
  description: string;
}

export const SCENARIO_DEFINITIONS: Record<ScenarioPageKey, ScenarioOption[]> = {
  "applicant-dashboard": [
    {
      id: "STEP_1_ALIGN",
      label: "1. New Applicant — Alignment",
      badge: "Step 1",
      description:
        "Applicant has registered and is awaiting or reviewing undergraduate program alignment before booking an exam slot.",
    },
    {
      id: "STEP_2_EXAM_SCHEDULED",
      label: "2. Exam Scheduled & Ready",
      badge: "Step 2",
      description:
        "Program alignment is cleared and the applicant has a confirmed Entrance Examination schedule ready to start.",
    },
    {
      id: "STEP_3_PASSED_COR",
      label: "3. Exam Passed & COR Upload",
      badge: "Step 3",
      description:
        "Applicant passed the Graduate School Entrance Examination and is ready to upload their Certificate of Registration (COR).",
    },
  ],
  "applicant-alignment": [
    {
      id: "ALIGNED",
      label: "1. Aligned — Cleared for Exam",
      badge: "Cleared",
      description:
        "Applicant's undergraduate degree aligns with the target Master's program, unlocking Entrance Exam scheduling.",
    },
    {
      id: "PENDING_WAIVER",
      label: "2. Bridging Waiver Required",
      badge: "Action Needed",
      description:
        "Undergraduate degree is non-aligned; applicant must download, sign, and submit the Bridging Course Waiver PDF.",
    },
  ],
  "applicant-schedule": [
    {
      id: "SELECT_SLOT",
      label: "1. Select Exam Slot",
      badge: "Booking Open",
      description:
        "Browse available entrance examination schedules in Table or Calendar view and book a confirmed seat.",
    },
    {
      id: "CONFIRMED_SLOT",
      label: "2. Confirmed Schedule",
      badge: "Scheduled",
      description:
        "View the locked, confirmed Entrance Examination appointment with date, time, and target graduate program.",
    },
    {
      id: "WAIVER_LOCKED",
      label: "3. Locked — Pending Bridging Waiver",
      badge: "Locked Gate",
      description:
        "Preview how exam slot booking is locked until the applicant's Bridging Course Waiver is validated.",
    },
  ],
  "applicant-exam": [
    {
      id: "READY",
      label: "1. Ready to Begin — Instructions",
      badge: "Pre-Exam",
      description:
        "Scheduled examination appointment screen where the applicant reviews instructions and clicks Start Examination.",
    },
    {
      id: "ACTIVE",
      label: "2. Active Exam — 72 MCQs & Essay",
      badge: "Live Exam",
      description:
        "Interactive examination with live countdown timer, all 72 OLSAT Multiple-Choice questions, Question Navigator, and Graduate Essay.",
    },
    {
      id: "TERMINAL",
      label: "3. Submitted — Finalization Receipt",
      badge: "Submitted",
      description:
        "Official examination submission receipt showing timestamp, answered item count, and reference ID.",
    },
    {
      id: "BLOCKED",
      label: "4. Missed Exam Appeal Gate",
      badge: "Appeal",
      description:
        "Missed examination appointment view where the applicant can submit a formal appeal for rescheduling.",
    },
  ],
  "applicant-results": [
    {
      id: "PASSED",
      label: "1. Passed Examination",
      badge: "Passed (86.36%)",
      description:
        "Applicant passed the entrance examination (64/72 MCQ + 31/38 Essay = 95/110) and can proceed to Pinnacle enrollment & COR upload.",
    },
    {
      id: "PENDING_ESSAY",
      label: "2. Awaiting Essay Evaluation",
      badge: "Evaluating",
      description:
        "Examination submitted; MCQ is auto-scored while the Graduate Essay is pending evaluation by a Faculty evaluator.",
    },
    {
      id: "PASSED_RECONSIDERED",
      label: "3. Passed — Reconsidered",
      badge: "Reconsidered",
      description:
        "Original computed score was below threshold, but an official institutional reconsideration decision granted admission.",
    },
    {
      id: "FAILED",
      label: "4. Did Not Meet Threshold",
      badge: "Failed",
      description:
        "Computed total score did not reach the passing threshold; displays score breakdown and re-application guidance.",
    },
  ],
  "applicant-cor-upload": [
    {
      id: "READY_TO_UPLOAD",
      label: "1. Ready to Upload COR",
      badge: "Upload Form",
      description:
        "Applicant has passed the entrance exam and can drag-and-drop their Certificate of Registration (COR) PDF/image.",
    },
    {
      id: "PENDING_VERIFICATION",
      label: "2. Verification Pending",
      badge: "Under Review",
      description:
        "COR file has been uploaded and is awaiting Graduate School verification to activate the Student Portal account.",
    },
    {
      id: "VERIFIED",
      label: "3. Verified — Enrolled Student",
      badge: "Verified",
      description:
        "COR has been verified by the Graduate School Office and Student Portal credentials have been issued.",
    },
  ],
  "student-dashboard": [
    {
      id: "PROPOSAL_SCHEDULED",
      label: "1. Scheduled Proposal Defense",
      badge: "Scheduled",
      description:
        "Student has passed Title Defense & Adviser Request, and has an upcoming Proposal Defense scheduled.",
    },
    {
      id: "TITLE_ACTIVE",
      label: "2. Active Title Defense",
      badge: "Step 1 Action",
      description:
        "Student is at Step 1 (Title Defense) and needs to submit their 3-Title Proposal Package.",
    },
    {
      id: "COMPLETED_JOURNEY",
      label: "3. Completed Thesis Journey",
      badge: "All 5 Passed",
      description:
        "All 5 Thesis Journey milestones are completed and the student is ready for Research Databank archival.",
    },
  ],
  "title-defense": [
    {
      id: "NOT_SUBMITTED",
      label: "1. Ready to Submit",
      badge: "Form View",
      description:
        "Student uploads 3 proposed thesis titles, Proposal Package PDF, current COR, and defense-fee receipt.",
    },
    {
      id: "APPLICATION_UNDER_REVIEW",
      label: "2. Under Graduate School Review",
      badge: "Reviewing",
      description:
        "Application submitted and awaiting Graduate School verification and scheduling.",
    },
    {
      id: "SCHEDULED",
      label: "3. Defense Scheduled",
      badge: "Scheduled",
      description:
        "Title Defense session scheduled with date, time, venue/link, and official application PDF.",
    },
    {
      id: "COMPLETED",
      label: "4. Completed & Rapporteur Report",
      badge: "Passed",
      description:
        "Title Defense concluded with approved official title and finalized Rapporteur Report.",
    },
    {
      id: "REJECTED",
      label: "5. Returned for Correction",
      badge: "Action Needed",
      description:
        "Application returned by the Graduate School with remarks so the student can replace specific documents.",
    },
  ],
  "adviser-request": [
    {
      id: "READY",
      label: "1. Select Adviser & Sign Request Form",
      badge: "Adviser Request Form",
      description:
        "Browse eligible Graduate Faculty candidates from the Title Defense panel and sign the official Thesis Adviser Request Form.",
    },
    {
      id: "PENDING",
      label: "2. Awaiting Signatures",
      badge: "Routing",
      description:
        "Adviser Request Form submitted and routing through the requested Adviser and Graduate School Dean.",
    },
    {
      id: "APPROVED",
      label: "3. Adviser Officially Assigned",
      badge: "Completed",
      description:
        "Adviser confirmed and Dean approved. Official signed Adviser Request Form PDF is available for preview and download.",
    },
    {
      id: "DECLINED_RETRY",
      label: "4. Declined / Re-select Adviser",
      badge: "Retry",
      description:
        "Requested adviser declined or returned the request — student can select another eligible Title Defense panel member.",
    },
  ],
  "proposal-defense": [
    {
      id: "ADVISER_REVIEW",
      label: "1. Pre-Defense Adviser Review",
      badge: "Step 1: Review",
      description:
        "Step 1 of 2: Upload the Proposal Manuscript (Chapters 1–3) for Adviser review and pre-defense certification.",
    },
    {
      id: "READY_TO_APPLY",
      label: "2. Submit Proposal Application",
      badge: "Step 2: Apply",
      description:
        "Step 2 of 2: Adviser Certification issued! Student can now submit COR and defense-fee receipt to apply for Proposal Defense.",
    },
    {
      id: "SCHEDULED",
      label: "3. Defense Scheduled",
      badge: "Scheduled",
      description:
        "Proposal Defense scheduled with assigned panel, venue/link, and official Defense Application record.",
    },
    {
      id: "COMPLETED",
      label: "4. Completed & Rapporteur Report",
      badge: "Passed",
      description:
        "Proposal Defense passed with finalized Rapporteur Report and committee recommendations.",
    },
    {
      id: "REVISION_REQUIRED",
      label: "5. Revisions Required",
      badge: "Revisions",
      description:
        "Adviser or Committee requested manuscript revisions with detailed remarks before proceeding.",
    },
  ],
  strike: [
    {
      id: "SUBMIT_MANUSCRIPT",
      label: "1. Submit Manuscript",
      badge: "Upload",
      description:
        "Submit revised manuscript for institutional Plagiarism & Similarity Check before Final Defense.",
    },
    {
      id: "WAITING",
      label: "2. Verification in Progress",
      badge: "Scanning",
      description:
        "Manuscript is queued for plagiarism and similarity analysis by the Graduate School Research Unit.",
    },
    {
      id: "COMPLETED",
      label: "3. Cleared (Similarity Index: 9%)",
      badge: "9% Similarity",
      description:
        "Manuscript passed institutional similarity threshold (<15%) with downloadable Official Plagiarism Clearance Certificate.",
    },
  ],
  "final-defense": [
    {
      id: "FINAL_ADVISER_REVIEW",
      label: "1. Final Adviser Endorsement",
      badge: "Step 1: Review",
      description:
        "Step 1 of 2: Upload the complete Final Manuscript (Chapters 1–5) for Adviser pre-defense review and certification.",
    },
    {
      id: "READY_TO_APPLY",
      label: "2. Submit Final Application",
      badge: "Step 2: Apply",
      description:
        "Step 2 of 2: Final Adviser Certification issued and Plagiarism Check cleared. Student can submit Final Defense application.",
    },
    {
      id: "SCHEDULED",
      label: "3. Final Defense Scheduled",
      badge: "Scheduled",
      description:
        "Final Oral Defense scheduled with full Examination Committee and official Defense Application PDF.",
    },
    {
      id: "COMPLETED",
      label: "4. Completed & Rapporteur Report",
      badge: "Passed",
      description:
        "Final Oral Defense passed with finalized Rapporteur Report and eligibility to archive in the Research Databank.",
    },
  ],
  "defense-workspace": [
    {
      id: "CHAIRMAN_ACTIVE",
      label: "1. Committee Chairperson Mode",
      badge: "Full Authority",
      description:
        "Live session view as Defense Committee Chairman (PDF Annotation, Rubric Scoring, Rapporteur Report Review, E-Sign, & Record Verdict).",
    },
    {
      id: "PANELIST_ACTIVE",
      label: "2. Panel Member / Rapporteur Mode",
      badge: "Authoring & Scoring",
      description:
        "Live session view with rich-text Rapporteur Report authoring, manuscript annotation, and oral rubric scoring.",
    },
    {
      id: "CONCLUDED_READONLY",
      label: "3. Concluded Session View",
      badge: "Read-Only",
      description:
        "Completed defense session with finalized rubric scores, signed Rapporteur Report, and recorded PASSED verdict.",
    },
  ],
  advisees: [
    {
      id: "PENDING_REQUESTS",
      label: "1. Pending Adviser Requests & Reviews",
      badge: "Actionable",
      description:
        "View active advisees, incoming Adviser Request Forms awaiting signature, and manuscripts awaiting certification.",
    },
    {
      id: "MANUSCRIPT_REVIEW",
      label: "2. Changes Requested State",
      badge: "Revision",
      description:
        "Preview how advisee manuscript tasks appear after requesting revisions or issuing certification.",
    },
  ],
  "essay-evaluation-detail": [
    {
      id: "PENDING_EVALUATION",
      label: "1. Pending Essay Grading",
      badge: "Needs Grading",
      description:
        "Applicant's entrance examination essay is awaiting Faculty evaluation and score entry (0–38 points).",
    },
    {
      id: "EVALUATED",
      label: "2. Graded & Final Score Computed",
      badge: "Evaluated",
      description:
        "Essay score has been recorded and the combined Multiple Choice + Essay examination result is computed.",
    },
  ],
  "repository-submit": [
    {
      id: "ELIGIBLE_FORM",
      label: "1. Eligible — Submit Archival Package",
      badge: "Form View",
      description:
        "Final Defense passed and Rapporteur Report finalized. Student can upload the 4 required archival documents.",
    },
    {
      id: "SUBMITTED_ARCHIVE",
      label: "2. Registered in Databank",
      badge: "Submitted",
      description:
        "Final Thesis Archival Documents submitted and registered in the Graduate School Research Databank.",
    },
    {
      id: "INELIGIBLE",
      label: "3. Prerequisite Gate View",
      badge: "Locked Preview",
      description:
        "Preview how the Databank page explains missing prerequisites before Final Defense completion.",
    },
  ],
};

const DEFAULT_SCENARIOS: Record<ScenarioPageKey, string> = {
  "applicant-dashboard": "STEP_2_EXAM_SCHEDULED",
  "applicant-alignment": "ALIGNED",
  "applicant-schedule": "SELECT_SLOT",
  "applicant-exam": "ACTIVE",
  "applicant-results": "PASSED",
  "applicant-cor-upload": "READY_TO_UPLOAD",
  "student-dashboard": "PROPOSAL_SCHEDULED",
  "title-defense": "NOT_SUBMITTED",
  "adviser-request": "READY",
  "proposal-defense": "ADVISER_REVIEW",
  strike: "SUBMIT_MANUSCRIPT",
  "final-defense": "FINAL_ADVISER_REVIEW",
  "defense-workspace": "CHAIRMAN_ACTIVE",
  advisees: "PENDING_REQUESTS",
  "essay-evaluation-detail": "PENDING_EVALUATION",
  "repository-submit": "ELIGIBLE_FORM",
};

const STORAGE_KEY = "earist-eval-scenarios-v1";

let scenarioState: Record<ScenarioPageKey, string> = { ...DEFAULT_SCENARIOS };
let hydrated = false;
const listeners = new Set<() => void>();

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Record<ScenarioPageKey, string>>;
      scenarioState = { ...DEFAULT_SCENARIOS, ...parsed };
    }
  } catch {
    // Ignore localStorage parse errors
  }
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function getScenario(pageKey: ScenarioPageKey): string {
  ensureHydrated();
  return scenarioState[pageKey] ?? DEFAULT_SCENARIOS[pageKey];
}

export function setScenario(pageKey: ScenarioPageKey, scenarioId: string): void {
  ensureHydrated();
  if (scenarioState[pageKey] === scenarioId) return;
  scenarioState = {
    ...scenarioState,
    [pageKey]: scenarioId,
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarioState));
    } catch {
      // Ignore storage write errors
    }
  }
  notify();
}

export function resetAllScenarios(): void {
  scenarioState = { ...DEFAULT_SCENARIOS };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
  notify();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useScenario(pageKey: ScenarioPageKey): {
  scenario: string;
  setScenario: (scenarioId: string) => void;
  options: ScenarioOption[];
} {
  const scenario = useSyncExternalStore(
    subscribe,
    () => getScenario(pageKey),
    () => DEFAULT_SCENARIOS[pageKey],
  );

  const update = useCallback(
    (scenarioId: string) => {
      setScenario(pageKey, scenarioId);
    },
    [pageKey],
  );

  return {
    scenario,
    setScenario: update,
    options: SCENARIO_DEFINITIONS[pageKey] ?? [],
  };
}
