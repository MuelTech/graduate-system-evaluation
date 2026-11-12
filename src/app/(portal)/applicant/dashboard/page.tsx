"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClientRequest } from "@/lib/api.client";
import { useScenario } from "@/lib/evaluation-mock/scenario-store";
import { ScenarioSwitcherBar } from "@/components/evaluation/scenario-switcher-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ClipboardCheck,
  CalendarClock,
  BadgeCheck,
  Upload,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";

interface ApplicantProfileData {
  firstName: string;
  lastName: string;
  program: string;
  applicantId: string;
  alignmentStatus: "aligned" | "pending_waiver" | "cleared";
  currentStep: number;
  examDate: string;
  examTime: string;
  strikeCount: number;
}

export default function ApplicantDashboard() {
  const { scenario } = useScenario("applicant-dashboard");

  const { data: applicant, isLoading } = useQuery<ApplicantProfileData>({
    queryKey: ["applicant-profile", scenario],
    queryFn: () => apiClientRequest("/applicant/profile"),
  });

  if (isLoading || !applicant) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        Loading your applicant dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScenarioSwitcherBar
        pageKey="applicant-dashboard"
        title="Applicant Journey Stage Preview:"
        helperText="Toggle between the 3 admission milestones to evaluate how the Applicant Dashboard updates across Registration & Alignment, Entrance Exam, and COR Upload."
      />

      {/* Welcome Header */}
      <div data-guide="applicant-welcome">
        <h1 className="text-2xl font-bold tracking-tight text-[#333333]">
          Welcome, {applicant.firstName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{applicant.program}</p>
        <p className="text-xs text-gray-500">
          Applicant ID: {applicant.applicantId}
        </p>
      </div>

      {/* Progress Stepper */}
      <div
        data-guide="applicant-progress-stepper"
        className="rounded-xl border border-gray-100 bg-white px-6 py-5 shadow-sm"
      >
        <p className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
          Applicant Progress
        </p>
        <div className="relative">
          {/* Connector lines */}
          <div className="absolute top-4 right-4 left-4 h-1 -translate-y-1/2 rounded bg-gray-100" />
          <div
            className="absolute top-4 left-4 h-1 -translate-y-1/2 rounded bg-[#e02b20] transition-all duration-300"
            style={{
              width: `calc(${applicant.currentStep / 2} * (100% - 2rem))`,
            }}
          />
          {/* Steps */}
          <div className="relative flex justify-between">
            {[
              { label: "Register & Align", icon: ClipboardCheck },
              { label: "Schedule & Take Exam", icon: CalendarClock },
              { label: "Upload COR", icon: Upload },
            ].map((step, i) => {
              const isCompleted = i < applicant.currentStep;
              const isCurrent = i === applicant.currentStep;

              return (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      isCompleted
                        ? "bg-[#e02b20] text-white"
                        : isCurrent
                          ? "bg-[#f9a825] text-[#333333] ring-2 ring-[#f9a825]/30"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <span
                    className={`mt-1.5 text-center text-[11px] font-medium ${
                      isCurrent
                        ? "font-semibold text-[#333333]"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div
        data-guide="applicant-status-cards"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Program Alignment — spans 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-[#333333]">
                Program Alignment
              </CardTitle>
              <Badge
                variant={
                  applicant.alignmentStatus === "pending_waiver"
                    ? "destructive"
                    : "default"
                }
                className={
                  applicant.alignmentStatus === "aligned"
                    ? "bg-green-100 text-green-700"
                    : applicant.alignmentStatus === "cleared"
                      ? "bg-blue-100 text-blue-700"
                      : ""
                }
              >
                {applicant.alignmentStatus === "aligned" && (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                )}
                {applicant.alignmentStatus === "pending_waiver" && (
                  <AlertTriangle className="mr-1 h-3 w-3" />
                )}
                {applicant.alignmentStatus === "cleared" && (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                )}
                {applicant.alignmentStatus === "aligned"
                  ? "Aligned"
                  : applicant.alignmentStatus === "pending_waiver"
                    ? "Pending Waiver"
                    : "Cleared"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {applicant.alignmentStatus === "pending_waiver" && (
              <Alert className="mb-3 border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-700 font-semibold">
                  Action Required: You have a pending Bridging Waiver.
                </AlertDescription>
              </Alert>
            )}
            <p className="mb-4 text-sm text-gray-600">
              {applicant.alignmentStatus === "aligned"
                ? "Your undergraduate program is aligned. You may proceed to schedule your exam."
                : applicant.alignmentStatus === "cleared"
                  ? "Your waiver has been cleared. You may schedule your exam."
                  : "Exam scheduling is locked until your waiver is submitted and validated."}
            </p>
            {applicant.alignmentStatus === "aligned" ||
            applicant.alignmentStatus === "cleared" ? (
              <Link
                href="/applicant/schedule"
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#333333] shadow-xs transition-colors hover:bg-gray-50"
              >
                Proceed to Exam Schedule Page <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/applicant/alignment"
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#333333] shadow-xs transition-colors hover:bg-gray-50"
              >
                Proceed to Program Alignment Page{" "}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Current Status — compact */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold text-[#333333]">
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applicant.currentStep === 2 ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Exam Passed
                  </Badge>
                  <p className="mt-1 text-xs text-gray-500">
                    Congratulations! You may now upload your COR.
                  </p>
                </div>
              </div>
            ) : applicant.currentStep === 1 ? (
              applicant.examDate &&
              applicant.examDate !== "Not yet scheduled" ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e02b20]/10">
                      <Clock className="h-5 w-5 text-[#e02b20]" />
                    </div>
                    <div>
                      <Badge className="bg-[#f9a825]/20 text-amber-900 hover:bg-[#f9a825]/20">
                        Exam Scheduled
                      </Badge>
                      <p className="mt-1 text-xs text-gray-500">
                        Your entrance exam is scheduled and ready.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/applicant/exam"
                    className="inline-flex items-center gap-1 rounded-lg bg-[#e02b20] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#c62828]"
                  >
                    Open Entrance Exam <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <CalendarClock className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      Ready to Schedule
                    </Badge>
                    <p className="mt-1 text-xs text-gray-500">
                      You may now select your exam schedule.
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                  <AlertTriangle className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                    Alignment & Schedule Setup
                  </Badge>
                  <p className="mt-1 text-xs text-gray-500">
                    Review your program alignment and select an entrance exam
                    schedule.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exam Schedule — spans 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-[#333333]">
                Exam Schedule
              </CardTitle>
              <CalendarClock className="h-5 w-5 text-[#e02b20]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-3 rounded-lg border border-gray-100 bg-gray-50/70 p-3">
              <p className="text-sm font-semibold text-[#333333]">
                {applicant.examDate}
              </p>
              <p className="text-xs text-gray-500">{applicant.examTime}</p>
              <p className="text-xs text-gray-500">{applicant.program}</p>
            </div>
            {applicant.strikeCount > 0 && (
              <Alert className="mb-3 border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-700">
                  Warning: You have {applicant.strikeCount} missed attempt(s).
                  Two missed attempts result in disqualification.
                </AlertDescription>
              </Alert>
            )}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/applicant/schedule"
                className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  applicant.alignmentStatus === "pending_waiver"
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : "bg-[#e02b20] text-white hover:bg-[#c62828]"
                }`}
              >
                Select Exam Schedule
              </Link>
              <Link
                href="/applicant/exam"
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#333333] transition-colors hover:bg-gray-50"
              >
                Take Entrance Exam
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Exam Results — spans 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-[#333333]">
                Exam Results
              </CardTitle>
              <BadgeCheck className="h-5 w-5 text-[#e02b20]" />
            </div>
          </CardHeader>
          <CardContent>
            {applicant.currentStep === 2 ? (
              <div className="mb-3 flex items-center justify-between rounded-lg border border-green-200 bg-green-50/70 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-bold text-green-800">
                      PASSED — 86.36% Total Score
                    </p>
                    <p className="text-xs text-green-700">
                      64 / 72 MCQ · 31 / 38 Essay · 95 / 110 Total
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">Passed</Badge>
              </div>
            ) : (
              <div className="mb-3 flex items-center justify-center rounded-lg border border-gray-100 bg-gray-50/70 py-6">
                <div className="text-center">
                  <FileText className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    Results will appear here after your exam
                  </p>
                </div>
              </div>
            )}
            <Link
              href="/applicant/results"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#e02b20] transition-colors hover:underline"
            >
              View Detailed Results <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* COR Upload — spans 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-[#333333]">
                Certificate of Registration (COR)
              </CardTitle>
              <Upload className="h-5 w-5 text-[#e02b20]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50/70 p-4">
              <div>
                <p className="text-sm text-gray-600">
                  Upload your COR after passing the exam and completing
                  enrollment.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Accepted formats: PDF, JPG, PNG (max 5MB)
                </p>
              </div>
              <Link
                href="/applicant/cor-upload"
                className="shrink-0 rounded-lg bg-[#e02b20] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c62828]"
              >
                Upload COR
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Notifications — spans 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-[#333333]">
                Recent Notifications
              </CardTitle>
              <Link
                href="/applicant/notifications"
                className="text-xs font-semibold text-[#e02b20] transition-colors hover:underline"
              >
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                {
                  title: "Exam schedule confirmed",
                  desc: "Your entrance exam is scheduled for December 5, 2026 at 9:00 AM.",
                  time: "2 hours ago",
                  unread: true,
                },
                {
                  title: "Alignment check passed",
                  desc: "Your undergraduate program is aligned with your intended graduate program.",
                  time: "5 hours ago",
                  unread: true,
                },
                {
                  title: "Registration successful",
                  desc: "Your applicant account has been created successfully.",
                  time: "1 day ago",
                  unread: true,
                },
                {
                  title: "Welcome to EARIST GS",
                  desc: "Thank you for registering. Schedule your entrance exam to proceed.",
                  time: "1 day ago",
                  unread: false,
                },
                {
                  title: "Account created",
                  desc: "Your applicant portal is now active.",
                  time: "2 days ago",
                  unread: false,
                },
              ].map((notif, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-lg border border-gray-100 p-3 ${
                    notif.unread ? "bg-[#FFF8F0]" : "bg-gray-50/50"
                  }`}
                >
                  <div
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      notif.unread ? "bg-[#e02b20]" : "bg-transparent"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#333333]">
                      {notif.title}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {notif.desc}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">
                    {notif.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
