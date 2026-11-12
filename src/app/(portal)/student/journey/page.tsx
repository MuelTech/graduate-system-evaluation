"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClientRequest } from "@/lib/api.client";
import { useStudentThesisJourney } from "@/hooks/use-student-thesis-journey";
import {
  JOURNEY_STEP_ORDER,
  formatJourneyCopy,
  journeyLabelFor,
  journeyRouteFor,
} from "@/lib/student-thesis-journey";
import { PageHeader } from "@/components/ui/page-header";
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
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  Library,
  Milestone,
  UserPlus,
} from "lucide-react";

const PHASES = [
  {
    label: "Admissions / Enrollment",
    icon: UserPlus,
    href: "/student/profile",
    actionLabel: "View Student Profile",
    blurb: "Application, acceptance, and official enrollment records.",
    statusBadge: "Completed",
  },
  {
    label: "Coursework / Curriculum",
    icon: BookOpen,
    href: "/student/curriculum",
    actionLabel: "Open Curriculum Checklist",
    blurb: "Graduate courses and program unit requirements (30 / 36 units earned).",
    statusBadge: "In Progress",
  },
  {
    label: "Comprehensive Examination",
    icon: ClipboardList,
    href: "/student/dashboard",
    actionLabel: "View Exam Standing",
    blurb: "Comprehensive examination result (required before Title Defense).",
    statusBadge: "Passed",
  },
  {
    label: "Thesis / Dissertation Phase",
    icon: FileCheck2,
    href: "/student/thesis",
    actionLabel: "Open Thesis Journey",
    blurb: "Open Thesis Journey for Title Defense, Adviser Request Form, Proposal Defense, Plagiarism Check, and Final Defense.",
    statusBadge: "Active Stage",
  },
  {
    label: "Research Completion & Archival Submission",
    icon: Library,
    href: "/student/repository/submit",
    actionLabel: "Open Final Thesis Archival Documents",
    blurb: "Final manuscript completion and Graduate School Research Databank submission.",
    statusBadge: "Unlocked Preview",
  },
  {
    label: "Graduation / Completion",
    icon: GraduationCap,
    href: "/student/dashboard",
    actionLabel: "View Dashboard",
    blurb: "Final clearance and completion of the graduate degree program.",
    statusBadge: "Target Milestone",
  },
];

function compExamLabel(status?: string): string {
  const s = (status || "").toLowerCase();
  if (s === "passed") return "Passed (First Take — 88.50%)";
  if (s === "failed") return "Failed";
  if (s === "pending") return "Pending";
  return "Passed";
}

export default function StudentAcademicJourneyPage() {
  const { data: overview, isError: loadFailed } = useQuery({
    queryKey: ["student", "journey-overview"],
    queryFn: async () =>
      (await apiClientRequest("/student/journey")) as {
        compExamRecords?: Array<{ status?: string }>;
      },
  });

  const { data: thesisJourney } = useStudentThesisJourney();

  const compExamStatus = overview?.compExamRecords?.[0]?.status;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Journey"
        description="High-level graduate progress. Detailed defense steps are under Thesis Journey."
      />

      {loadFailed && (
        <Card>
          <CardContent className="pt-6 text-sm text-gray-500">
            Unable to load your Academic Journey. Please try again later.
          </CardContent>
        </Card>
      )}

      {/* High-Level Program Progress Stepper */}
      <Card data-guide="journey-stepper">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold text-[#333333]">
            <Milestone className="h-4 w-4 text-[#e02b20]" />
            Program progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {PHASES.map((phase, idx) => (
              <li
                key={phase.label}
                className="flex flex-wrap items-start justify-between gap-3.5 rounded-xl border border-gray-100 bg-gray-50/40 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e02b20]/10 text-[#e02b20]">
                    <phase.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Phase {idx + 1}
                      </span>
                      <p className="font-semibold text-[#333333]">
                        {phase.label}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-[11px] bg-white border-gray-200 text-gray-600"
                      >
                        {phase.statusBadge}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {phase.blurb}
                    </p>
                    {phase.label === "Comprehensive Examination" && (
                      <p className="mt-1.5 text-xs font-medium text-[#333333]">
                        Status:{" "}
                        <span className="text-emerald-700">
                          {loadFailed
                            ? "Unavailable"
                            : compExamLabel(compExamStatus)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  href={phase.href}
                  className={`${buttonVariants({ variant: "outline", size: "sm" })} shrink-0 text-xs`}
                >
                  {phase.actionLabel}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Direct Thesis Stage Navigation Cards */}
      <Card data-guide="journey-action-cards">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-bold text-[#333333]">
                <FileCheck2 className="h-4 w-4 text-[#e02b20]" />
                Unlocked 5-Step Thesis Journey Workspaces
              </CardTitle>
              <p className="mt-1 text-xs text-gray-500">
                Click any milestone below to jump directly into its interactive forms, schedules, and official EARIST PDF records.
              </p>
            </div>
            <Link
              href="/student/thesis"
              className={buttonVariants({ size: "sm" })}
            >
              Open Thesis Hub
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {JOURNEY_STEP_ORDER.map((key, index) => {
              const step = thesisJourney?.steps.find((s) => s.key === key);
              const label = journeyLabelFor(key, step?.label);
              const href = journeyRouteFor(key);
              const detailText =
                formatJourneyCopy(step?.detail) ||
                formatJourneyCopy(step?.nextAction) ||
                "Interactive forms, schedule, & official PDFs";
              return (
                <Link
                  key={key}
                  href={href}
                  className="group flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-3.5 transition-all hover:border-[#e02b20] hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Step {index + 1}
                      </span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <p className="mt-1 text-sm font-bold text-[#333333] group-hover:text-[#e02b20] group-hover:underline">
                      {label}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {detailText}
                    </p>
                  </div>
                  <span className="mt-3 inline-flex items-center text-xs font-semibold text-[#e02b20]">
                    Evaluate Step {index + 1}
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
