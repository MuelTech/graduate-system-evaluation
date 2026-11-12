"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClientRequest } from "@/lib/api.client";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  TableCard,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Award,
  Layers,
} from "lucide-react";

interface CourseItem {
  code: string;
  title: string;
  category: string;
  units: number;
  grade: string;
  status: "COMPLETED" | "ENROLLED" | "PENDING";
  semester: string;
}

interface StudentCurriculumResponse {
  program?: {
    programName: string;
    totalUnits: number;
  };
  curriculumType?: string;
  curriculumSummary?: {
    requiredUnits: number;
    earnedUnits: number;
    inProgressUnits: number;
    gwa: string;
    courses: CourseItem[];
  };
}

export default function StudentCurriculum() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const { data, isLoading } = useQuery<StudentCurriculumResponse>({
    queryKey: ["student", "journey-overview"],
    queryFn: async () =>
      (await apiClientRequest("/student/journey")) as StudentCurriculumResponse,
  });

  const summary = data?.curriculumSummary;
  const courses = useMemo(() => summary?.courses ?? [], [summary]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(courses.map((c) => c.category)));
    return ["ALL", ...unique];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (selectedCategory === "ALL") return courses;
    return courses.filter((c) => c.category === selectedCategory);
  }, [courses, selectedCategory]);

  const requiredUnits = summary?.requiredUnits ?? 36;
  const earnedUnits = summary?.earnedUnits ?? 30;
  const inProgressUnits = summary?.inProgressUnits ?? 6;
  const completionPct = Math.min(
    100,
    Math.round((earnedUnits / requiredUnits) * 100),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Curriculum Checklist"
        description={
          data?.program?.programName ??
          "Master of Arts in Education Major in Administration and Supervision (MAEd-AS)"
        }
      />

      {/* Summary KPI Cards & Progress Bar */}
      <div data-guide="curriculum-summary" className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-xs">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500">
                  Earned Academic Units
                </p>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-[#333333]">
                {earnedUnits}{" "}
                <span className="text-sm font-normal text-gray-500">
                  / {requiredUnits} units
                </span>
              </p>
              <p className="mt-1 text-xs text-emerald-700 font-medium">
                {completionPct}% of degree coursework completed
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500">
                  Currently Enrolled
                </p>
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-[#333333]">
                {inProgressUnits}{" "}
                <span className="text-sm font-normal text-gray-500">units</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Thesis Writing I & II (2nd Sem AY 2025–2026)
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500">
                  Cumulative GWA
                </p>
                <Award className="h-4 w-4 text-[#e02b20]" />
              </div>
              <p className="mt-2 text-2xl font-bold text-[#333333]">
                {summary?.gwa ?? "1.32"}
              </p>
              <p className="mt-1 text-xs text-emerald-700 font-medium">
                Good Academic Standing (≤ 1.75 required)
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500">
                  Curriculum Track
                </p>
                <GraduationCap className="h-4 w-4 text-[#e02b20]" />
              </div>
              <p className="mt-2 text-lg font-bold text-[#333333]">
                Thesis Track
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Core (9u) · Major (15u) · Cognate (6u) · Thesis (6u)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Visual Progress Bar */}
        <Card className="shadow-xs">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
              <span className="text-[#333333]">
                Overall Curriculum Progress ({earnedUnits} Earned +{" "}
                {inProgressUnits} Enrolled of {requiredUnits} Total Units)
              </span>
              <span className="text-emerald-700">
                {completionPct}% Completed
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#e02b20] transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categorized Course Checklist */}
      <TableCard data-guide="curriculum-course-list">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-base font-bold text-[#333333]">
            <Layers className="h-4 w-4 text-[#e02b20]" />
            Official Graduate Course Checklist
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-[#e02b20] text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-[#e02b20] hover:text-[#e02b20]"
                  }`}
                >
                  {cat === "ALL" ? "All Categories" : cat}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading curriculum courses…
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Descriptive Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Units</TableHead>
                <TableHead>Term Taken</TableHead>
                <TableHead className="text-center">Final Grade</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => {
                const isCompleted = course.status === "COMPLETED";
                return (
                  <TableRow key={course.code}>
                    <TableCell className="font-mono text-xs font-bold text-[#333333]">
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-[#e02b20]" />
                        {course.code}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-[#333333]">
                      {course.title}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {course.category}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-[#333333]">
                      {course.units}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {course.semester}
                    </TableCell>
                    <TableCell className="text-center font-bold text-[#333333]">
                      {course.grade}
                    </TableCell>
                    <TableCell className="text-right">
                      {isCompleted ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[11px]">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[11px]">
                          <Clock className="mr-1 h-3 w-3" />
                          Enrolled
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableCard>
    </div>
  );
}
