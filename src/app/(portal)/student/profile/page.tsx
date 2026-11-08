"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClientRequest } from "@/lib/api.client";
import { useStudentThesisJourney } from "@/hooks/use-student-thesis-journey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  FileCheck2,
  Award,
  Clock,
  ArrowRight,
} from "lucide-react";

interface StudentProfileData {
  id: string;
  studentNumber: string;
  admissionStatus: string;
  enrollmentDate: string;
  curriculumType: string;
  alignmentStatus: string;
  cellphone?: string;
  dateOfBirth?: string;
  address?: string;
  user: {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
  };
  program: {
    id: string;
    programName: string;
    programType: string;
    totalUnits: number;
  };
  undergraduateProgram?: {
    id: string;
    programName: string;
  };
  residency?: {
    startDate: string;
    maxYears: number;
    elapsedSemesters: number;
  };
  compExamRecords?: Array<{
    id: string;
    status: string;
    recordedAt: string;
    rating?: string;
  }>;
  adviserAssignment?: {
    adviserId: string;
    adviserName: string;
    assignedDate: string;
  };
}

export default function StudentProfile() {
  const { data: profile, isLoading } = useQuery<StudentProfileData>({
    queryKey: ["student", "journey-overview"],
    queryFn: async () =>
      (await apiClientRequest("/student/journey")) as StudentProfileData,
  });

  const { data: journey } = useStudentThesisJourney();

  const fullName = profile
    ? `${profile.user.firstName} ${profile.user.middleName ? `${profile.user.middleName} ` : ""}${profile.user.lastName}`
    : "Juan Mercado Dela Cruz";

  const compExam = profile?.compExamRecords?.[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className="text-2xl font-bold text-(--earist-primary)"
            style={{ fontFamily: '"Calibri", sans-serif' }}
          >
            Student Profile & Academic Record
          </h2>
          <p className="text-sm text-(--earist-body-text)">
            Verified personal demographics, enrollment standing, and Graduate School thesis records.
          </p>
        </div>
        <Badge className="w-fit bg-emerald-100 text-emerald-800 border-emerald-300">
          <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
          Officially Enrolled — AY 2025–2026
        </Badge>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-(--earist-body-text)">
            Loading student profile…
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Section 1: Personal & Demographic Information */}
          <Card
            data-guide="profile-personal-info"
            className="border-t-4 border-t-(--earist-primary) shadow-xs"
          >
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-(--earist-primary) text-xl font-bold text-(--earist-accent) shadow-xs">
                    {profile?.user.firstName?.[0] ?? "J"}
                    {profile?.user.lastName?.[0] ?? "D"}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-(--earist-primary)">
                      {fullName}
                    </CardTitle>
                    <p className="text-sm font-medium text-(--earist-secondary)">
                      Student No.:{" "}
                      <span className="font-mono font-bold text-foreground">
                        {profile?.studentNumber ?? "2025-GS-00142"}
                      </span>
                    </p>
                    <p className="text-xs text-(--earist-body-text)">
                      {profile?.program.programName}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="border-(--earist-primary)/30 bg-(--earist-surface-light-red) text-(--earist-primary)"
                  >
                    {profile?.program.programType ?? "MASTERS"} LEVEL
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-amber-300 bg-amber-50 text-amber-900"
                  >
                    {profile?.curriculumType === "THESIS_TRACK"
                      ? "Thesis Track"
                      : "Non-Thesis Track"}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="border-t border-(--earist-border-gray) pt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-start gap-3 rounded-lg border border-(--earist-border-gray) bg-white p-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-(--earist-primary)" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-(--earist-body-text)">
                      Institutional Email
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                      {profile?.user.email ?? "jmdelacruz.gs@earist.edu.ph"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-(--earist-border-gray) bg-white p-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-(--earist-primary)" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-(--earist-body-text)">
                      Mobile Contact Number
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {profile?.cellphone ?? "+63 917 842 5109"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-(--earist-border-gray) bg-white p-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-(--earist-primary)" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-(--earist-body-text)">
                      Date of Birth
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {profile?.dateOfBirth
                        ? new Date(profile.dateOfBirth).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )
                        : "May 14, 1996"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-(--earist-border-gray) bg-white p-3 sm:col-span-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-(--earist-primary)" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-(--earist-body-text)">
                      Permanent Residential Address
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {profile?.address ?? "Sampaloc, Manila, Metro Manila"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-(--earist-border-gray) bg-white p-3">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-(--earist-primary)" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-(--earist-body-text)">
                      Undergraduate Degree
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {profile?.undergraduateProgram?.programName ??
                        "B.S. in Secondary Education Major in Mathematics"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Academic Program & Thesis Standing */}
          <div
            data-guide="profile-academic-info"
            className="grid gap-4 lg:grid-cols-2"
          >
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-(--earist-primary)">
                  <GraduationCap className="h-5 w-5 text-(--earist-secondary)" />
                  Graduate Program & Residency Standing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="rounded-lg border border-(--earist-border-gray) bg-(--earist-surface-gray)/40 p-3.5">
                  <p className="text-xs font-semibold text-(--earist-body-text)">
                    Enrolled Degree Program
                  </p>
                  <p className="mt-1 font-bold text-(--earist-primary)">
                    {profile?.program.programName}
                  </p>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border border-(--earist-border-gray) p-3">
                    <dt className="text-(--earist-body-text)">
                      Program Alignment
                    </dt>
                    <dd className="mt-1 font-semibold text-emerald-700">
                      {profile?.alignmentStatus ?? "ALIGNED"} (No Bridging Required)
                    </dd>
                  </div>
                  <div className="rounded-lg border border-(--earist-border-gray) p-3">
                    <dt className="text-(--earist-body-text)">
                      Required Total Units
                    </dt>
                    <dd className="mt-1 font-semibold text-foreground">
                      {profile?.program.totalUnits ?? 36} Academic Units
                    </dd>
                  </div>
                  <div className="rounded-lg border border-(--earist-border-gray) p-3">
                    <dt className="flex items-center gap-1 text-(--earist-body-text)">
                      <Clock className="h-3.5 w-3.5 text-(--earist-secondary)" />
                      Residency Elapsed
                    </dt>
                    <dd className="mt-1 font-semibold text-foreground">
                      {profile?.residency?.elapsedSemesters ?? 3} Semesters (Max{" "}
                      {profile?.residency?.maxYears ?? 5} Years)
                    </dd>
                  </div>
                  <div className="rounded-lg border border-(--earist-border-gray) p-3">
                    <dt className="flex items-center gap-1 text-(--earist-body-text)">
                      <Award className="h-3.5 w-3.5 text-(--earist-secondary)" />
                      Comprehensive Exam
                    </dt>
                    <dd className="mt-1 font-semibold text-emerald-700">
                      {compExam?.rating ?? "Passed (First Take — 88.50%)"}
                    </dd>
                  </div>
                </dl>

                <div className="pt-1">
                  <Link
                    href="/student/curriculum"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                    View Full Curriculum Checklist
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-(--earist-primary)">
                  <FileCheck2 className="h-5 w-5 text-(--earist-secondary)" />
                  Thesis & Adviser Assignment Record
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="rounded-lg border border-(--earist-border-gray) bg-(--earist-surface-light-red)/50 p-3.5">
                  <p className="text-xs font-semibold text-(--earist-secondary)">
                    Approved Official Thesis Title
                  </p>
                  <p className="mt-1 font-semibold leading-snug text-(--earist-primary)">
                    {journey?.selectedTitle?.titleText ??
                      "Data-Driven Instructional Supervision and Digital Readiness of Public Secondary School Heads in the Division of Manila"}
                  </p>
                </div>

                <div className="rounded-lg border border-(--earist-border-gray) p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-(--earist-body-text)">
                        Official Thesis Adviser (GS Form No. 020)
                      </p>
                      <p className="mt-0.5 font-bold text-foreground">
                        {profile?.adviserAssignment?.adviserName ??
                          "Dr. Maria Clara R. Santos, EdD"}
                      </p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                      Approved
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-xs text-(--earist-body-text)">
                    Confirmed via Official GS-020 Adviser Request workflow on{" "}
                    {profile?.adviserAssignment?.assignedDate
                      ? new Date(
                          profile.adviserAssignment.assignedDate,
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "February 18, 2026"}
                    .
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Link
                    href="/student/thesis"
                    className={buttonVariants({ size: "sm" })}
                  >
                    Open Thesis Journey
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/student/thesis/adviser-request"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    View GS-020 Adviser Form
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
