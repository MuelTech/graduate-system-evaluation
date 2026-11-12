"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
} from "lucide-react";
import { apiClientRequest } from "@/lib/api.client";
import type { Panelist } from "@/types/index";

function formatFacultyDisplayName(panelist: Panelist) {
  const title = panelist.user?.title?.trim();
  const first = panelist.user?.firstName?.trim() ?? "";
  const last = panelist.user?.lastName?.trim() ?? "";
  const suffix = panelist.user?.suffix?.trim();
  const base = [title, first, last].filter(Boolean).join(" ");
  return suffix ? `${base}, ${suffix}` : base;
}

export default function PanelistProfilePage() {
  const { data: panelist, isLoading } = useQuery<Panelist>({
    queryKey: ["panelistProfile"],
    queryFn: async () => (await apiClientRequest("/panelists/me")) as Panelist,
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-[#333333]">
        Loading profile...
      </div>
    );
  }

  if (!panelist) {
    return (
      <div className="p-8 text-center text-sm text-[#e02b20]">
        Failed to load profile.
      </div>
    );
  }

  const canAdvise = !panelist.isExternal && panelist.canAdvise !== false;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#e02b20]">Faculty Profile</h2>
        <p className="text-sm text-[#333333]">
          View your institutional faculty classification, specialization, and
          assigned academic permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card
          data-guide="panelist-profile-card"
          className="border-gray-200 shadow-sm"
        >
          <CardHeader className="border-b border-gray-200 bg-gray-50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-[#333333]">
              <User className="h-5 w-5 text-[#e02b20]" /> Faculty Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 text-sm">
            <div>
              <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                Full Name &amp; Academic Title
              </p>
              <p className="mt-1 text-base font-bold text-[#333333]">
                {formatFacultyDisplayName(panelist)}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                Email Address
              </p>
              <p className="mt-1 font-medium text-[#333333]">
                {panelist.user?.email}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                Specialization
              </p>
              <p className="mt-1 font-semibold text-[#333333]">
                {panelist.specialization || "General"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                Office / Institution Affiliation
              </p>
              <p className="mt-1 flex items-center gap-1.5 font-medium text-[#333333]">
                <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                {panelist.officeAffiliation || "EARIST Graduate School"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          data-guide="faculty-access-badges"
          className="border-gray-200 shadow-sm"
        >
          <CardHeader className="border-b border-gray-200 bg-gray-50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-[#333333]">
              <GraduationCap className="h-5 w-5 text-[#e02b20]" /> Classification
              &amp; Academic Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
              <div>
                <p className="font-bold text-[#333333]">
                  Faculty Classification
                </p>
                <p className="text-xs text-gray-500">
                  Determines panelist vs. internal adviser eligibility
                </p>
              </div>
              {panelist.isExternal ? (
                <Badge className="border-purple-200 bg-purple-100 text-purple-800">
                  External Panelist
                </Badge>
              ) : (
                <Badge className="border-blue-200 bg-blue-100 text-blue-800">
                  Internal Faculty
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
              <div>
                <p className="font-bold text-[#333333]">
                  Thesis / Dissertation Adviser Eligibility
                </p>
                <p className="text-xs text-gray-500">
                  Managed by the Graduate School Administrator
                </p>
              </div>
              {canAdvise ? (
                <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Eligible Adviser
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-500">
                  Panelist Only
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
              <div>
                <p className="font-bold text-[#333333]">
                  Entrance Exam Essay Evaluation
                </p>
                <p className="text-xs text-gray-500">
                  Access to grade applicant entrance examination essays
                </p>
              </div>
              {panelist.canEvaluateEssays ? (
                <Badge className="border-amber-200 bg-amber-100 text-amber-900">
                  <ClipboardCheck className="mr-1 h-3 w-3" />
                  Enabled
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-500">
                  Not Assigned
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
