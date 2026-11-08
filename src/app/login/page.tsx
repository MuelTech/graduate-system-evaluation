"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Presentation,
  ArrowRight,
  CheckCircle2,
  Compass,
  Sparkles,
  ArrowLeft,
  Eye,
  FileCheck2,
} from "lucide-react";
import {
  EVALUATION_PERSONAS,
  setActiveEvaluationRole,
  type EvaluationRole,
} from "@/lib/evaluation-session";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageGuideTrigger } from "@/components/evaluation/page-guide-overlay";

export default function RespondentEvaluationLoginPage() {
  const router = useRouter();
  const student = EVALUATION_PERSONAS.student;
  const panelist = EVALUATION_PERSONAS.panelist;

  const handleEnterRole = (role: EvaluationRole) => {
    setActiveEvaluationRole(role);
    router.push(
      role === "panelist" ? "/panelist/dashboard" : "/student/dashboard",
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-(--earist-surface-gray)">
      {/* Top Institutional Bar */}
      <header className="border-b border-(--earist-border-gray) bg-(--earist-primary) text-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <GraduationCap className="h-8 w-8 text-(--earist-accent)" />
            <div className="flex flex-col">
              <span className="text-base leading-tight font-bold tracking-wide text-white">
                EARIST Graduate School
              </span>
              <span className="text-xs leading-tight text-white/80">
                Information System — UI/UX Evaluation Edition
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2.5">
            <PageGuideTrigger />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Landing Page
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex flex-1 flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Heading Banner */}
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-(--earist-accent) bg-amber-50 px-4 py-1 text-xs font-semibold text-(--earist-primary)">
              <Sparkles className="h-3.5 w-3.5 text-(--earist-secondary)" />
              Instant Respondent Sign-In · Zero Password Friction
            </div>
            <h1
              className="text-3xl font-bold text-(--earist-primary) sm:text-4xl"
              style={{ fontFamily: '"Calibri", sans-serif' }}
            >
              Select Your Evaluation Role
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-(--earist-body-text) sm:text-base">
              Choose a pre-configured EARIST persona below to enter the portal
              immediately. You can switch between{" "}
              <strong className="font-semibold text-(--earist-primary)">
                Graduate Student
              </strong>{" "}
              and{" "}
              <strong className="font-semibold text-(--earist-primary)">
                Faculty / Panelist
              </strong>{" "}
              views at any time from the top navigation bar.
            </p>
          </div>

          {/* Two Role Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Card 1: Graduate Student */}
            <Card
              data-guide="login-student-card"
              className="flex flex-col justify-between border-t-4 border-t-(--earist-primary) bg-white shadow-md transition-all hover:shadow-xl"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-(--earist-surface-light-red) text-(--earist-primary)">
                    <GraduationCap className="h-7 w-7" />
                  </div>
                  <Badge className="bg-(--earist-primary) text-white">
                    Respondent Role 1
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-xl text-(--earist-primary)">
                    Evaluate as Graduate Student
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs font-medium text-(--earist-secondary)">
                    Pre-loaded Persona: {student.name} ({student.studentNumber})
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between space-y-6">
                <div className="space-y-4 text-sm text-(--earist-body-text)">
                  <div className="rounded-lg border border-(--earist-border-gray) bg-(--earist-surface-gray)/60 p-3 text-xs">
                    <p className="font-semibold text-(--earist-primary)">
                      {student.program}
                    </p>
                    <p className="mt-0.5 text-(--earist-body-text)">
                      Email: {student.email} · Adviser: Dr. Maria Clara R.
                      Santos, EdD
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-wider text-(--earist-secondary) uppercase">
                      Unlocked Features to Evaluate:
                    </p>
                    <ul className="space-y-1.5 text-xs">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>
                          <strong>All 5 Thesis Journey Steps Unlocked:</strong>{" "}
                          Freely inspect Title Defense, GS-020 Adviser Request,
                          Proposal Defense, STRIKE Plagiarism, and Final
                          Defense.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>
                          <strong>Interactive Scenario Switcher:</strong> Toggle
                          each page between <em>Submit Form</em>,{" "}
                          <em>Under Review</em>, <em>Scheduled</em>,{" "}
                          <em>Completed &amp; RAP</em>, and{" "}
                          <em>Returned for Correction</em>.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>
                          <strong>Curriculum, Academic Journey &amp; Databank:</strong>{" "}
                          Review completed coursework, official PDF records, and
                          archival submission.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={() => handleEnterRole("student")}
                  className="w-full bg-(--earist-primary) font-semibold text-white hover:bg-(--earist-primary)/90"
                >
                  Enter Student Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Card 2: Faculty / Panelist */}
            <Card
              data-guide="login-panelist-card"
              className="flex flex-col justify-between border-t-4 border-t-(--earist-accent) bg-white shadow-md transition-all hover:shadow-xl"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-(--earist-primary)">
                    <Presentation className="h-7 w-7" />
                  </div>
                  <Badge className="bg-(--earist-accent) text-(--earist-primary)">
                    Respondent Role 2
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-xl text-(--earist-primary)">
                    Evaluate as Faculty / Panelist
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs font-medium text-(--earist-secondary)">
                    Pre-loaded Persona: {panelist.name} ({panelist.facultyId})
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between space-y-6">
                <div className="space-y-4 text-sm text-(--earist-body-text)">
                  <div className="rounded-lg border border-(--earist-border-gray) bg-(--earist-surface-gray)/60 p-3 text-xs">
                    <p className="font-semibold text-(--earist-primary)">
                      {panelist.academicRank} · {panelist.officeAffiliation}
                    </p>
                    <p className="mt-0.5 text-(--earist-body-text)">
                      Specialization: {panelist.specialization}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-wider text-(--earist-secondary) uppercase">
                      Unlocked Features to Evaluate:
                    </p>
                    <ul className="space-y-1.5 text-xs">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>
                          <strong>Collaborative Defense Workspace:</strong>{" "}
                          Split-screen Manuscript PDF Annotation, 1.00–2.50
                          Institutional Rubric Matrix, Rich-Text RAP Editor, and
                          Chairman Verdict panel.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>
                          <strong>My Advisees &amp; Pre-Defense Review:</strong>{" "}
                          Respond to incoming GS-020 Adviser Requests and issue
                          signed Proposal/Final Pre-Defense Certifications.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>
                          <strong>Digital Signatures &amp; Workload:</strong>{" "}
                          Sign pending RAP reports and filter unified defense
                          assignments across Title, Proposal, and Final stages.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={() => handleEnterRole("panelist")}
                  className="w-full bg-(--earist-accent) font-semibold text-(--earist-primary) hover:bg-(--earist-accent)/90"
                >
                  Enter Faculty / Panelist Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Evaluation Tips Footer Card */}
          <div
            data-guide="login-eval-tips"
            className="grid gap-4 rounded-xl border border-(--earist-border-gray) bg-white p-5 sm:grid-cols-3"
          >
            <div className="flex items-start gap-3">
              <Compass className="mt-0.5 h-5 w-5 shrink-0 text-(--earist-primary)" />
              <div className="text-xs">
                <p className="font-semibold text-(--earist-primary)">
                  Interactive Arrow Guides
                </p>
                <p className="mt-0.5 text-(--earist-body-text)">
                  Click the <strong>? Page Guide</strong> button in the header
                  on any screen to see spotlight callouts and directional arrows
                  explaining each feature.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="mt-0.5 h-5 w-5 shrink-0 text-(--earist-primary)" />
              <div className="text-xs">
                <p className="font-semibold text-(--earist-primary)">
                  Scenario Switcher Bar
                </p>
                <p className="mt-0.5 text-(--earist-body-text)">
                  Multi-stage pages include a top Scenario Switcher bar so you
                  can preview every workflow status in one click.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-(--earist-primary)" />
              <div className="text-xs">
                <p className="font-semibold text-(--earist-primary)">
                  Built-In Sample PDFs
                </p>
                <p className="mt-0.5 text-(--earist-body-text)">
                  All document viewers, GS-020 forms, certifications, and
                  manuscript annotation tools come pre-loaded with sample
                  institutional PDFs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
