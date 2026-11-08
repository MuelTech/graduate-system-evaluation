"use client";

import Link from "next/link";
import { useStudentThesisJourney } from "@/hooks/use-student-thesis-journey";
import {
  JOURNEY_STEP_ORDER,
  journeyLabelFor,
  journeyRouteFor,
} from "@/lib/student-thesis-journey";
import { milestoneStateLabel } from "@/lib/student-dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  FileText,
  GraduationCap,
  LockOpen,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import type { JourneyStepKey } from "@/types/student-thesis-journey";

const STEP_DESCRIPTIONS: Record<
  JourneyStepKey,
  {
    subtitle: string;
    scenariosCount: number;
    keyFeatures: string[];
  }
> = {
  TITLE_DEFENSE: {
    subtitle: "3-Title Proposal Package, Schedule, & Official RAP Result",
    scenariosCount: 5,
    keyFeatures: [
      "Upload 3 proposed titles, Proposal Package PDF, COR, and Official Receipt",
      "Inspect Defense Schedule, Committee Roster, and Official Defense Application PDF",
      "View finalized Title Defense RAP Report andReturned-for-Correction workflow",
    ],
  },
  ADVISER_REQUEST: {
    subtitle: "Official GS Form No. 020 Adviser Selection & Digital Signing",
    scenariosCount: 4,
    keyFeatures: [
      "Browse eligible Graduate Faculty advisers from your Title Defense panel",
      "Affix digital e-signature to submit Official GS Form No. 020",
      "Track Adviser CONFORME & Dean sign-off and preview the signed GS-020 PDF",
    ],
  },
  PROPOSAL_DEFENSE: {
    subtitle: "Pre-Defense Adviser Certification, Proposal Application, & RAP",
    scenariosCount: 5,
    keyFeatures: [
      "Upload Proposal Manuscript (Chapters 1–3) for Adviser Pre-Defense Certification",
      "File Proposal Defense application once Adviser Certification is issued",
      "Review Proposal Defense schedule, committee, and finalized RAP Report",
    ],
  },
  STRIKE: {
    subtitle: "Institutional Similarity & Plagiarism Clearance (<15% Limit)",
    scenariosCount: 3,
    keyFeatures: [
      "Submit revised manuscript PDF for Turnitin / STRIKE similarity verification",
      "Track verification queue status with the Graduate School Research Unit",
      "View verified 9% similarity score and Official STRIKE Clearance Certificate PDF",
    ],
  },
  FINAL_DEFENSE: {
    subtitle: "Final Adviser Endorsement, Oral Defense, & Archival Clearance",
    scenariosCount: 4,
    keyFeatures: [
      "Upload complete Final Manuscript (Chapters 1–5) for Final Adviser Certification",
      "Submit Final Oral Defense application and inspect Examination Committee schedule",
      "View signed Final Defense RAP Report and proceed to Research Databank archival",
    ],
  },
};

export default function StudentThesisIndexPage() {
  const { data: journey, isLoading, isError, refetch } =
    useStudentThesisJourney();

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-(--earist-body-text)">
        Loading Thesis Journey Hub…
      </div>
    );
  }

  if (isError || !journey) {
    return (
      <div className="mx-auto max-w-md space-y-3 p-8 text-center">
        <p className="text-sm text-red-600">
          Unable to load your Thesis Journey.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg border border-(--earist-border-gray) px-4 py-2 text-sm text-(--earist-primary)"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Unlocked Evaluation Notice */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className="text-2xl font-bold text-(--earist-primary)"
            style={{ fontFamily: '"Calibri", sans-serif' }}
          >
            Thesis Journey Hub
          </h2>
          <p className="text-sm text-(--earist-body-text)">
            Explore and evaluate all 5 institutional Thesis Defense milestones from Title Defense to Final Oral Defense.
          </p>
        </div>
        <Badge className="w-fit bg-amber-100 text-amber-900 border-amber-300 gap-1.5 px-3 py-1">
          <LockOpen className="h-3.5 w-3.5 text-(--earist-primary)" />
          All 5 Steps Unlocked for Evaluation
        </Badge>
      </div>

      {/* Overview Summary Card */}
      <Card
        data-guide="thesis-hub-overview"
        className="border-t-4 border-t-(--earist-primary) shadow-xs"
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-(--earist-primary)">
            <GraduationCap className="h-5 w-5 text-(--earist-secondary)" />
            Active Thesis Research Context
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-(--earist-border-gray) bg-(--earist-surface-light-red)/40 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-(--earist-secondary)">
              <FileText className="h-3.5 w-3.5" />
              Official Approved Research Title
            </p>
            <p className="mt-1 text-sm font-bold leading-snug text-(--earist-primary)">
              {journey.selectedTitle?.titleText ??
                "Data-Driven Instructional Supervision and Digital Readiness of Public Secondary School Heads in the Division of Manila"}
            </p>
          </div>

          <div className="rounded-lg border border-(--earist-border-gray) bg-white p-3.5 flex flex-col justify-between">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-(--earist-body-text)">
                <UserCheck className="h-3.5 w-3.5 text-(--earist-secondary)" />
                Assigned Thesis Adviser (GS Form No. 020)
              </p>
              <p className="mt-1 text-sm font-bold text-foreground">
                {journey.activeAdviser?.name ??
                  "Dr. Maria Clara R. Santos, EdD"}
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-(--earist-body-text)">
              <span>STRIKE Plagiarism Policy: Mandatory (&lt;15%)</span>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]"
              >
                <ShieldCheck className="mr-1 h-3 w-3" /> Active Record
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All 5 Step Cards */}
      <div data-guide="thesis-step-cards" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-(--earist-primary)">
            5-Step Thesis Journey Workspaces
          </h3>
          <span className="text-xs text-(--earist-body-text)">
            Each step includes an interactive <strong>Scenario Switcher Bar</strong> to preview all workflow states
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {JOURNEY_STEP_ORDER.map((key, index) => {
            const step = journey.steps.find((s) => s.key === key);
            const label = journeyLabelFor(key, step?.label);
            const href = journeyRouteFor(key);
            const meta = STEP_DESCRIPTIONS[key];
            const stateLabel = step
              ? milestoneStateLabel(step, journey.policy.strikeRequired)
              : "Unlocked";

            return (
              <Card
                key={key}
                className="flex flex-col justify-between border-(--earist-border-gray) transition-all hover:border-(--earist-primary) hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-(--earist-primary) px-2.5 py-0.5 text-[11px] font-bold text-white">
                      Step {index + 1} of 5
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className="border-amber-300 bg-amber-50 text-[10px] font-semibold text-amber-900"
                      >
                        <Sparkles className="mr-1 h-2.5 w-2.5 text-(--earist-accent)" />
                        {meta.scenariosCount} Scenarios
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        {stateLabel}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="mt-2 text-lg font-bold text-(--earist-primary)">
                    {label}
                  </CardTitle>
                  <p className="text-xs font-medium text-(--earist-secondary)">
                    {meta.subtitle}
                  </p>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-between space-y-4 pt-2">
                  <ul className="space-y-1.5 text-xs text-(--earist-body-text)">
                    {meta.keyFeatures.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-(--earist-border-gray)">
                    <Link
                      href={href}
                      className={`${buttonVariants({ size: "sm" })} w-full justify-center`}
                    >
                      <FileCheck2 className="mr-1.5 h-4 w-4" />
                      Open {label}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
