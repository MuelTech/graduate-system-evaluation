"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Info,
  ArrowRight,
  UserCheck,
  BookOpen,
  Award,
  CheckCircle2,
} from "lucide-react";
import {
  EVALUATION_PERSONAS,
  setActiveEvaluationRole,
  type EvaluationRole,
} from "@/lib/evaluation-session";
import { PageGuideTrigger } from "@/components/evaluation/page-guide-overlay";

type SelectablePortalRole = "applicant" | "student" | "faculty";

const ROLE_OPTIONS: {
  value: SelectablePortalRole;
  evalRole: EvaluationRole;
  label: string;
  badge: string;
  targetPath: string;
  icon: typeof UserCheck;
  credentialLabel: string;
  credentialValue: string;
  name: string;
  subtitle: string;
  highlights: string[];
  guideAttr: string;
}[] = [
  {
    value: "applicant",
    evalRole: "applicant",
    label: "Applicant",
    badge: "Admissions & Entrance Exam",
    targetPath: "/applicant/dashboard",
    icon: UserCheck,
    credentialLabel: "Applicant ID",
    credentialValue: EVALUATION_PERSONAS.applicant.applicantId ?? "APP-2026-0142",
    name: EVALUATION_PERSONAS.applicant.name,
    subtitle:
      EVALUATION_PERSONAS.applicant.program ??
      "Master of Arts in Education major in Administration and Supervision",
    highlights: [
      "Program Alignment & Bridging Course Waiver status",
      "Entrance Examination Slot Booking & Interactive Exam (MCQ + Essay)",
      "Entrance Exam Score Breakdown & Certificate of Registration (COR) Upload",
    ],
    guideAttr: "login-applicant-card",
  },
  {
    value: "student",
    evalRole: "student",
    label: "Graduate Student",
    badge: "5-Step Thesis Journey",
    targetPath: "/student/dashboard",
    icon: BookOpen,
    credentialLabel: "Student Number",
    credentialValue:
      EVALUATION_PERSONAS.student.studentNumber ?? "2025-GS-00142",
    name: EVALUATION_PERSONAS.student.name,
    subtitle:
      EVALUATION_PERSONAS.student.program ??
      "MAEd Major in Administration and Supervision",
    highlights: [
      "All 5 Thesis Journey stages unlocked (Title, Adviser Request, Proposal, Plagiarism Check, Final)",
      "Interactive Scenario Switcher to inspect Form, Review, Scheduled, & Completed states",
      "Academic Curriculum, Official Defense Records, & Research Repository Archival",
    ],
    guideAttr: "login-student-card",
  },
  {
    value: "faculty",
    evalRole: "panelist",
    label: "Faculty",
    badge: "Adviser & Defense Panelist",
    targetPath: "/faculty/dashboard",
    icon: Award,
    credentialLabel: "Institutional Email",
    credentialValue: EVALUATION_PERSONAS.panelist.email,
    name: EVALUATION_PERSONAS.panelist.name,
    subtitle: `${EVALUATION_PERSONAS.panelist.academicRank} · ${EVALUATION_PERSONAS.panelist.officeAffiliation}`,
    highlights: [
      "Collaborative Defense Workspace (PDF Manuscript Annotation, Rubric Scoring & Rapporteur Report)",
      "My Advisees (Thesis Adviser Requests & Pre-Defense Manuscript Endorsements)",
      "My Defenses, Digital E-Signatures & Graduate Research Repository",
    ],
    guideAttr: "login-panelist-card",
  },
];

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF8F0]" />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] =
    useState<SelectablePortalRole>("student");
  const [isLoading, setIsLoading] = useState(false);

  const activeConfig =
    ROLE_OPTIONS.find((opt) => opt.value === selectedRole) ?? ROLE_OPTIONS[1];

  const handleSignIn = (roleOption = activeConfig) => {
    setIsLoading(true);
    setActiveEvaluationRole(roleOption.evalRole);
    router.push(roleOption.targetPath);
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#FFF8F0] px-4 py-8 text-[#333333]">
      {/* Top Bar */}
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-gray-600 transition-colors hover:text-[#e02b20]"
        >
          ← Back to Home
        </Link>
        <PageGuideTrigger label="Page Guide" />
      </div>

      {/* Main Sign-In Card */}
      <div className="mx-auto my-6 w-full max-w-2xl">
        <Card className="border-gray-200/80 bg-white shadow-xl">
          <CardHeader className="pb-4 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e02b20]/10">
              <GraduationCap className="h-9 w-9 text-[#e02b20]" />
            </div>
            <CardTitle className="text-xl font-bold text-[#333333]">
              Sign In to Your Portal
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              EARIST Graduate School Management System
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* System Evaluation & Testing Environment Notice */}
            <Alert
              data-guide="login-eval-notice"
              className="border-amber-200 bg-[#FFF8F0] text-[#333333]"
            >
              <Info className="h-4 w-4 text-[#e02b20]" />
              <AlertDescription className="text-xs leading-relaxed text-gray-700">
                <strong className="font-semibold text-[#333333]">
                  System Evaluation &amp; Testing Mode:
                </strong>{" "}
                This environment is pre-configured with sample academic records
                for evaluation purposes. Select your participant role below (
                <strong>Applicant</strong>, <strong>Graduate Student</strong>, or{" "}
                <strong>Faculty</strong>) to sign in immediately—no password is
                required.
              </AlertDescription>
            </Alert>

            {/* Role Selector Tabs / Cards */}
            <div data-guide="login-role-selector" className="space-y-3">
              <label className="block text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Select Your Participant Role
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                {ROLE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedRole === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      data-guide={option.guideAttr}
                      onClick={() => setSelectedRole(option.value)}
                      className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? "border-[#e02b20] bg-[#e02b20]/5 ring-2 ring-[#e02b20]/20"
                          : "border-gray-200 bg-white hover:border-[#e02b20]/40 hover:bg-gray-50/70"
                      }`}
                    >
                      <div className="mb-2 flex w-full items-center justify-between">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            isSelected
                              ? "bg-[#e02b20] text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        {isSelected && (
                          <Badge className="bg-[#e02b20] text-[10px] text-white">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm font-bold text-[#333333]">
                        {option.label}
                      </span>
                      <span className="mt-0.5 text-[11px] text-gray-500">
                        {option.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Role Pre-filled Account Summary */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSignIn(activeConfig);
              }}
              className="space-y-5"
            >
              <div
                data-guide="login-eval-tips"
                className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/80 pb-3">
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                      Pre-Configured Evaluation Account
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[#333333]">
                      {activeConfig.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {activeConfig.subtitle}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-gray-300 bg-white text-xs">
                    {activeConfig.label} Portal
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                      {activeConfig.credentialLabel}
                    </label>
                    <Input
                      type="text"
                      value={activeConfig.credentialValue}
                      readOnly
                      className="bg-white text-xs font-medium text-[#333333]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                      Authentication Status
                    </label>
                    <Input
                      type="text"
                      value="Pre-Authenticated (No Password Required)"
                      readOnly
                      className="bg-emerald-50/70 text-xs font-medium text-emerald-800 border-emerald-200"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                    Included Workflows for {activeConfig.label}:
                  </p>
                  <ul className="space-y-1">
                    {activeConfig.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-xs text-gray-600"
                      >
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-[#e02b20] font-semibold text-white hover:bg-[#c62828]"
              >
                {isLoading
                  ? "Signing In..."
                  : `Sign In as ${activeConfig.label}`}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-semibold text-[#333333] transition-colors hover:border-[#e02b20]/40 hover:bg-[#e02b20]/5 hover:text-[#e02b20]"
            >
              New applicant? Create an Applicant Account
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500">
        Eulogio &ldquo;Amang&rdquo; Rodriguez Institute of Science and Technology · Graduate School
      </div>
    </div>
  );
}
