"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClientRequest } from "@/lib/api.client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div>
        <h2
          className="text-2xl font-bold text-(--earist-primary)"
          style={{ fontFamily: '"Calibri", sans-serif' }}
        >
          Curriculum & Coursework Checklist
        </h2>
        <p className="text-sm text-(--earist-body-text)">
          {data?.program?.programName ??
            "Master of Arts in Education Major in Administration and Supervision (MAEd-AS)"}
        </p>
      </div>

      {/* Summary KPI Cards & Progress Bar */}
      <div data-guide="curriculum-summary" className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-(--earist-body-text)">
                  Earned Academic Units
                </p>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-(--earist-primary)">
                {earnedUnits} <span className="text-sm font-normal text-(--earist-body-text)">/ {requiredUnits} units</span>
              </p>
              <p className="mt-1 text-xs text-emerald-700 font-medium">
                {completionPct}% of degree coursework completed
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-(--earist-body-text)">
                  Currently Enrolled
                </p>
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-(--earist-primary)">
                {inProgressUnits} <span className="text-sm font-normal text-(--earist-body-text)">units</span>
              </p>
              <p className="mt-1 text-xs text-(--earist-body-text)">
                Thesis Writing I & II (2nd Sem AY 2025–2026)
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-(--earist-body-text)">
                  Cumulative GWA
                </p>
                <Award className="h-4 w-4 text-(--earist-secondary)" />
              </div>
              <p className="mt-2 text-2xl font-bold text-(--earist-primary)">
                {summary?.gwa ?? "1.32"}
              </p>
              <p className="mt-1 text-xs text-emerald-700 font-medium">
                Good Academic Standing (≤ 1.75 required)
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-(--earist-body-text)">
                  Curriculum Track
                </p>
                <GraduationCap className="h-4 w-4 text-(--earist-primary)" />
              </div>
              <p className="mt-2 text-lg font-bold text-(--earist-primary)">
                Thesis Track
              </p>
              <p className="mt-1 text-xs text-(--earist-body-text)">
                Core (9u) · Major (15u) · Cognate (6u) · Thesis (6u)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Visual Progress Bar */}
        <Card className="shadow-xs">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
              <span className="text-(--earist-primary)">
                Overall Curriculum Progress ({earnedUnits} Earned + {inProgressUnits} Enrolled of {requiredUnits} Total Units)
              </span>
              <span className="text-emerald-700">{completionPct}% Completed</span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-(--earist-primary) transition-all"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categorized Course Checklist */}
      <Card data-guide="curriculum-course-list" className="shadow-xs">
        <CardHeader className="border-b border-(--earist-border-gray) pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-base text-(--earist-primary)">
              <Layers className="h-4 w-4 text-(--earist-secondary)" />
              Official Graduate Course Checklist
            </CardTitle>

            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? "bg-(--earist-primary) text-white"
                        : "border border-(--earist-border-gray) bg-white text-(--earist-body-text) hover:border-(--earist-primary) hover:text-(--earist-primary)"
                    }`}
                  >
                    {cat === "ALL" ? "All Categories" : cat}
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-(--earist-body-text)">
              Loading curriculum courses…
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-(--earist-border-gray) bg-(--earist-surface-gray)/60 text-xs font-semibold uppercase text-(--earist-secondary)">
                  <tr>
                    <th className="px-4 py-3">Course Code</th>
                    <th className="px-4 py-3">Descriptive Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-center">Units</th>
                    <th className="px-4 py-3">Term Taken</th>
                    <th className="px-4 py-3 text-center">Final Grade</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--earist-border-gray)">
                  {filteredCourses.map((course) => {
                    const isCompleted = course.status === "COMPLETED";
                    return (
                      <tr
                        key={course.code}
                        className="transition-colors hover:bg-(--earist-surface-gray)/30"
                      >
                        <td className="px-4 py-3 font-mono text-xs font-bold text-(--earist-primary)">
                          <span className="inline-flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5 text-(--earist-secondary)" />
                            {course.code}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {course.title}
                        </td>
                        <td className="px-4 py-3 text-xs text-(--earist-body-text)">
                          {course.category}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-foreground">
                          {course.units}
                        </td>
                        <td className="px-4 py-3 text-xs text-(--earist-body-text)">
                          {course.semester}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-(--earist-primary)">
                          {course.grade}
                        </td>
                        <td className="px-4 py-3 text-right">
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
