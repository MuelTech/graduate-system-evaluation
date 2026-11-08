"use client";

import { useSyncExternalStore, useCallback } from "react";

export type ScenarioPageKey =
  | "student-dashboard"
  | "title-defense"
  | "adviser-request"
  | "proposal-defense"
  | "strike"
  | "final-defense"
  | "defense-workspace"
  | "advisees"
  | "repository-submit";

export interface ScenarioOption {
  id: string;
  label: string;
  badge?: string;
  description: string;
}

export const SCENARIO_DEFINITIONS: Record<ScenarioPageKey, ScenarioOption[]> = {
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
      label: "2. Under Admin Review",
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
      label: "4. Completed & RAP Result",
      badge: "Passed",
      description:
        "Title Defense concluded with approved official title and finalized Committee RAP Report.",
    },
    {
      id: "REJECTED",
      label: "5. Returned for Correction",
      badge: "Action Needed",
      description:
        "Application returned by Admin with remarks so the student can replace specific documents.",
    },
  ],
  "adviser-request": [
    {
      id: "READY",
      label: "1. Select Adviser & Sign GS-020",
      badge: "GS-020 Form",
      description:
        "Browse eligible Graduate Faculty candidates from the Title Defense panel and sign Official GS Form No. 020.",
    },
    {
      id: "PENDING",
      label: "2. Awaiting Signatures",
      badge: "Routing",
      description:
        "GS-020 submitted and routing through the requested Adviser (CONFORME) and Graduate School Dean.",
    },
    {
      id: "APPROVED",
      label: "3. Adviser Officially Assigned",
      badge: "Completed",
      description:
        "Adviser confirmed and Dean approved. Official signed GS-020 PDF record is available for preview and download.",
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
      badge: "Endorsement",
      description:
        "Upload the Proposal Manuscript (Chapters 1–3) for Adviser review and pre-defense certification.",
    },
    {
      id: "READY_TO_APPLY",
      label: "2. Submit Proposal Application",
      badge: "Certified",
      description:
        "Adviser Certification issued! Student can now submit COR and defense-fee receipt to apply for Proposal Defense.",
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
      label: "4. Completed & RAP Result",
      badge: "Passed",
      description:
        "Proposal Defense passed with finalized RAP report and committee recommendations.",
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
        "Submit revised manuscript for institutional STRIKE / Plagiarism & Similarity verification before Final Defense.",
    },
    {
      id: "WAITING",
      label: "2. Verification in Progress",
      badge: "Scanning",
      description:
        "Manuscript is queued for Turnitin / STRIKE similarity analysis by the Graduate School Research Unit.",
    },
    {
      id: "COMPLETED",
      label: "3. Cleared (Similarity Index: 9%)",
      badge: "9% Similarity",
      description:
        "Manuscript passed institutional similarity threshold (<15%) with downloadable Official STRIKE Clearance Certificate.",
    },
  ],
  "final-defense": [
    {
      id: "FINAL_ADVISER_REVIEW",
      label: "1. Final Adviser Endorsement",
      badge: "Endorsement",
      description:
        "Upload the complete Final Manuscript (Chapters 1–5) for Adviser pre-defense review and certification.",
    },
    {
      id: "READY_TO_APPLY",
      label: "2. Submit Final Application",
      badge: "Certified",
      description:
        "Final Adviser Certification issued and STRIKE cleared. Student can submit Final Defense application.",
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
      label: "4. Completed & Passed",
      badge: "Passed",
      description:
        "Final Oral Defense passed with finalized RAP Report and eligibility to archive in the Research Databank.",
    },
  ],
  "defense-workspace": [
    {
      id: "CHAIRMAN_ACTIVE",
      label: "1. Committee Chairperson Mode",
      badge: "Full Authority",
      description:
        "Live session view as Defense Committee Chairman (PDF Annotation, Rubric Scoring, RAP Review, E-Sign, & Record Verdict).",
    },
    {
      id: "PANELIST_ACTIVE",
      label: "2. Panel Member / Rapporteur Mode",
      badge: "Authoring & Scoring",
      description:
        "Live session view with rich-text Committee RAP Report authoring, manuscript annotation, and oral rubric scoring.",
    },
    {
      id: "CONCLUDED_READONLY",
      label: "3. Concluded Session View",
      badge: "Read-Only",
      description:
        "Completed defense session with finalized rubric scores, signed RAP report, and recorded PASSED verdict.",
    },
  ],
  advisees: [
    {
      id: "PENDING_REQUESTS",
      label: "1. Pending GS-020 & Reviews",
      badge: "Actionable",
      description:
        "View active advisees, incoming GS-020 Adviser Requests awaiting CONFORME, and manuscripts awaiting certification.",
    },
    {
      id: "MANUSCRIPT_REVIEW",
      label: "2. Changes Requested State",
      badge: "Revision",
      description:
        "Preview how advisee manuscript tasks appear after requesting revisions or issuing certification.",
    },
  ],
  "repository-submit": [
    {
      id: "ELIGIBLE_FORM",
      label: "1. Eligible — Submit Archival Package",
      badge: "Form View",
      description:
        "Final Defense passed and RAP finalized. Student can upload the 4 required archival artifacts.",
    },
    {
      id: "SUBMITTED_ARCHIVE",
      label: "2. Registered in Databank",
      badge: "Submitted",
      description:
        "Archival package submitted and registered in the private Graduate School Databank (DL-9).",
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
  "student-dashboard": "PROPOSAL_SCHEDULED",
  "title-defense": "NOT_SUBMITTED",
  "adviser-request": "READY",
  "proposal-defense": "ADVISER_REVIEW",
  strike: "SUBMIT_MANUSCRIPT",
  "final-defense": "FINAL_ADVISER_REVIEW",
  "defense-workspace": "CHAIRMAN_ACTIVE",
  advisees: "PENDING_REQUESTS",
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
