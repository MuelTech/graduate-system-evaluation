"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClientRequest } from "@/lib/api.client";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Save,
  ArrowLeft,
  Building2,
  ShieldCheck,
} from "lucide-react";

interface ApplicantProfileResponse {
  id: string;
  applicantId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  cellphone: string;
  dateOfBirth: string;
  address: string;
  undergraduateDegree: string;
  undergraduateSchool: string;
  yearGraduated: string;
  gwa: string;
  currentAffiliation: string;
  program: string;
  programType: string;
  alignmentStatus: string;
}

export default function ApplicantProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery<ApplicantProfileResponse>({
    queryKey: ["applicant-profile-detail"],
    queryFn: () => apiClientRequest("/applicant/profile"),
  });

  const [cellphone, setCellphone] = useState("");
  const [address, setAddress] = useState("");
  const [currentAffiliation, setCurrentAffiliation] = useState("");

  useEffect(() => {
    if (profile) {
      setCellphone(profile.cellphone || "");
      setAddress(profile.address || "");
      setCurrentAffiliation(profile.currentAffiliation || "");
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (payload: Record<string, string>) =>
      apiClientRequest("/applicant/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["applicant-profile-detail"],
      });
      void queryClient.invalidateQueries({ queryKey: ["applicant-profile"] });
      toast.success("Applicant profile contact information saved.");
    },
  });

  if (isLoading || !profile) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        Loading your applicant profile...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applicant Profile"
        description="View your admission application details, undergraduate background, and contact information."
      />

      {/* Top Identity Banner */}
      <Card className="border-gray-100 bg-white shadow-sm">
        <CardContent className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#e02b20] text-xl font-bold text-white shadow-sm">
              {profile.firstName.charAt(0)}
              {profile.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-[#333333]">
                  {profile.firstName} {profile.middleName ? `${profile.middleName.charAt(0)}. ` : ""}
                  {profile.lastName}
                </h2>
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Active Applicant
                </Badge>
              </div>
              <p className="mt-0.5 text-sm text-gray-600">{profile.program}</p>
              <p className="mt-0.5 text-xs font-medium text-gray-500">
                Applicant ID:{" "}
                <span className="font-semibold text-[#333333]">
                  {profile.applicantId}
                </span>
              </p>
            </div>
          </div>
          <Link
            href="/applicant/dashboard"
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#333333] shadow-2xs transition-colors hover:bg-gray-50 sm:self-center"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Card 1: Personal & Contact Information */}
        <Card data-guide="applicant-personal-info">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-bold text-[#333333]">
                <User className="h-4 w-4 text-[#e02b20]" />
                Personal & Contact Information
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                Editable Contact Info
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs text-gray-500">First Name</Label>
                <p className="mt-1 rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-[#333333]">
                  {profile.firstName}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Last Name</Label>
                <p className="mt-1 rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-[#333333]">
                  {profile.lastName}
                </p>
              </div>
              <div>
                <Label className="flex items-center gap-1 text-xs text-gray-500">
                  <Mail className="h-3 w-3" /> Registered Email
                </Label>
                <p className="mt-1 truncate rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-[#333333]">
                  {profile.email}
                </p>
              </div>
              <div>
                <Label className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" /> Date of Birth
                </Label>
                <p className="mt-1 rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-[#333333]">
                  August 14, 1996
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div>
                <Label
                  htmlFor="applicant-cellphone"
                  className="flex items-center gap-1 text-xs font-medium text-[#333333]"
                >
                  <Phone className="h-3 w-3 text-[#e02b20]" /> Mobile / Contact
                  Number
                </Label>
                <Input
                  id="applicant-cellphone"
                  value={cellphone}
                  onChange={(e) => setCellphone(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="applicant-address"
                  className="flex items-center gap-1 text-xs font-medium text-[#333333]"
                >
                  <MapPin className="h-3 w-3 text-[#e02b20]" /> Residential
                  Address
                </Label>
                <Input
                  id="applicant-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="applicant-affiliation"
                  className="flex items-center gap-1 text-xs font-medium text-[#333333]"
                >
                  <Building2 className="h-3 w-3 text-[#e02b20]" /> Current
                  Professional Affiliation
                </Label>
                <Input
                  id="applicant-affiliation"
                  value={currentAffiliation}
                  onChange={(e) => setCurrentAffiliation(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="pt-2">
                <Button
                  onClick={() =>
                    updateMutation.mutate({
                      cellphone,
                      address,
                      currentAffiliation,
                    })
                  }
                  disabled={updateMutation.isPending}
                  className="bg-[#e02b20] text-white hover:bg-[#c62828]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateMutation.isPending
                    ? "Saving Changes..."
                    : "Save Contact Details"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Undergraduate Academic Background & Target Graduate Program */}
        <Card data-guide="applicant-academic-background">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-bold text-[#333333]">
                <GraduationCap className="h-4 w-4 text-[#e02b20]" />
                Academic Background & Target Program
              </CardTitle>
              <Badge className="bg-green-100 text-green-700">
                <ShieldCheck className="mr-1 h-3 w-3" /> Aligned
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-[#e02b20]/15 bg-[#FFF8F0] p-4">
              <p className="text-xs font-semibold tracking-wider text-[#b71c1c] uppercase">
                Target Graduate Program
              </p>
              <p className="mt-1 text-sm font-bold text-[#333333]">
                {profile.program}
              </p>
              <p className="mt-1 text-xs text-gray-600">
                Degree Level: Master&apos;s Degree ({profile.programType}) ·
                College of Education / Graduate School
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-xs text-gray-500">
                  Prerequisite Undergraduate Degree
                </Label>
                <p className="mt-1 rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-[#333333]">
                  {profile.undergraduateDegree}
                </p>
              </div>

              <div>
                <Label className="text-xs text-gray-500">
                  Undergraduate Institution
                </Label>
                <p className="mt-1 rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-[#333333]">
                  {profile.undergraduateSchool}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">
                    Year Graduated
                  </Label>
                  <p className="mt-1 rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-[#333333]">
                    {profile.yearGraduated}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">
                    General Weighted Average
                  </Label>
                  <p className="mt-1 rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-medium text-[#333333]">
                    {profile.gwa}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50/70 p-3.5 text-xs text-green-800">
              <p className="font-semibold">
                Program Alignment Verification: Cleared
              </p>
              <p className="mt-0.5 text-green-700">
                Your Bachelor of Secondary Education degree fulfills the
                prerequisite alignment requirements for the Master of Arts in
                Education major in Administration and Supervision. No bridging
                coursework waiver is required.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
