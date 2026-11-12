"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClientRequest } from "@/lib/api.client";
import { useStudentThesisJourney } from "@/hooks/use-student-thesis-journey";
import {
  journeyRouteFor,
  journeyStepFor,
  studentThesisJourneyQueryKey,
} from "@/lib/student-thesis-journey";
import { ScenarioSwitcherBar } from "@/components/evaluation/scenario-switcher-bar";
import { LocalFilePreviewDialog } from "@/components/student/local-file-preview-dialog";
import {
  ThesisJourneyShell,
  JourneyStepStatusCard,
} from "@/components/student/thesis-journey-shell";
import { DocumentViewer } from "@/components/ui/document-viewer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Info,
  Send,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

export default function StudentStrikePage() {
  const queryClient = useQueryClient();
  const {
    data: journey,
    isLoading,
    isError,
    refetch,
  } = useStudentThesisJourney();

  const strike = journeyStepFor(journey, "STRIKE");
  const strikeRequired = journey?.policy?.strikeRequired === true;
  const strikeCompleted = strike?.state === "COMPLETED";
  const strikeWaiting = strike?.state === "WAITING";

  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);
  const [sampleAttached, setSampleAttached] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [localPreviewOpen, setLocalPreviewOpen] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [certPreviewOpen, setCertPreviewOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (localPreviewUrl && localPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const handleAttachSampleManuscript = async () => {
    try {
      const res = await fetch("/sample-docs/sample-manuscript.pdf");
      const blob = await res.blob();
      setManuscriptFile(
        new File(
          [blob],
          "DelaCruz_MAEd_Revised_Manuscript_For_Plagiarism_Check.pdf",
          { type: "application/pdf" },
        ),
      );
      setSampleAttached(true);
      toast.success("Sample Revised Manuscript PDF attached for Plagiarism Check!");
    } catch {
      setManuscriptFile(
        new File(
          ["%PDF-1.4 Sample Revised Manuscript"],
          "DelaCruz_MAEd_Revised_Manuscript_For_Plagiarism_Check.pdf",
          { type: "application/pdf" },
        ),
      );
      setSampleAttached(true);
      toast.success("Sample Revised Manuscript PDF attached for Plagiarism Check!");
    }
  };

  const openLocalPreview = () => {
    if (!manuscriptFile) return;
    if (localPreviewUrl && localPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    if (sampleAttached) {
      setLocalPreviewUrl("/sample-docs/sample-manuscript.pdf");
    } else {
      setLocalPreviewUrl(URL.createObjectURL(manuscriptFile));
    }
    setLocalPreviewOpen(true);
  };

  const submitStrikeManuscript = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (manuscriptFile) {
        formData.append("manuscript", manuscriptFile);
      }
      return apiClientRequest("/thesis/strike/manuscript", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: async () => {
      setManuscriptFile(null);
      setSampleAttached(false);
      if (inputRef.current) inputRef.current.value = "";
      toast.success("Manuscript submitted for Plagiarism & Similarity verification!", {
        description:
          "Your manuscript is now queued with the Graduate School Research Unit.",
      });
      await queryClient.invalidateQueries({
        queryKey: studentThesisJourneyQueryKey,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <ScenarioSwitcherBar pageKey="strike" />
        <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-24 w-full animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (isError || !journey) {
    return (
      <div className="w-full space-y-4">
        <ScenarioSwitcherBar pageKey="strike" />
        <Card>
          <CardContent className="space-y-3 pt-6">
            <p className="text-sm text-red-600">
              Unable to load Plagiarism Check status.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-10">
      <ScenarioSwitcherBar pageKey="strike" />

      <ThesisJourneyShell
        activeStep="STRIKE"
        title="Plagiarism Check"
        description="Institutional manuscript similarity & originality verification (<15% threshold) required prior to Final Oral Defense."
        journey={journey}
      >
        {strike?.state === "LOCKED" && (
          <div data-guide="strike-upload">
            <JourneyStepStatusCard
              variant="locked"
              title="Plagiarism Check is Locked"
              badgeText="Locked"
              description={strike.lockReason || "This step is currently unavailable."}
              nextStepHref="/student/thesis"
              nextStepLabel="Back to Thesis Journey"
            />
          </div>
        )}

        {strike && strike.state !== "LOCKED" && !strikeRequired && (
          <Card data-guide="strike-upload">
            <CardHeader className="border-b border-gray-100 pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-[#333333]">
                  <Info className="h-4 w-4 text-[#e02b20]" />
                  Plagiarism Check Not Required
                </CardTitle>
                <Badge variant="outline">Not required</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-sm text-[#333333]">
              <p className="text-gray-600">
                Plagiarism checking is not required for your current workflow.
              </p>
              <Link
                href={journeyRouteFor("FINAL_DEFENSE")}
                className={buttonVariants()}
              >
                Continue to Final Defense
              </Link>
            </CardContent>
          </Card>
        )}

        {/* STATE 3: COMPLETED / CLEARED */}
        {strike && strike.state !== "LOCKED" && strikeRequired && strikeCompleted && (
          <>
            <Card data-guide="strike-upload">
              <CardHeader className="border-b border-gray-100 pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-[#333333]">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    Plagiarism Check Cleared
                  </CardTitle>
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    9% Similarity Index — Passed (&lt;15% Threshold)
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-sm text-[#333333]">
                <p className="text-gray-600">
                  The Graduate School Research Unit has completed the plagiarism and similarity verification of your revised manuscript. Your manuscript achieved an overall similarity index of <strong>9%</strong>, which is well within the institutional maximum threshold of <strong>15%</strong>.
                </p>

                <div className="grid gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">
                      Similarity Index
                    </p>
                    <p className="mt-0.5 text-lg font-bold text-emerald-800">
                      9% Overall
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">
                      Institutional Limit
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-emerald-800">
                      Below 15% Maximum
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">
                      Clearance Status
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-emerald-800">
                      Cleared for Final Defense
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-guide="strike-certificate">
              <CardHeader className="border-b border-gray-100 pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-bold text-[#333333]">
                  <ShieldCheck className="h-4 w-4 text-[#e02b20]" />
                  Official Plagiarism Clearance Certificate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-sm text-[#333333]">
                <div className="flex flex-col justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e02b20]/10">
                      <FileCheck2 className="h-5 w-5 text-[#e02b20]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#333333]">
                        Plagiarism &amp; Similarity Clearance Certificate (GS-CLEARANCE-2026-0142)
                      </p>
                      <p className="text-xs text-gray-500">
                        Issued March 29, 2026 · Verified by EARIST Graduate School Research Unit
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setCertPreviewOpen(true)}
                    >
                      <Eye className="mr-1.5 h-4 w-4" />
                      Preview Certificate PDF
                    </Button>
                    <a
                      href="/sample-docs/sample-strike-certificate.pdf"
                      download="EARIST-Plagiarism-Clearance-Certificate.pdf"
                    >
                      <Button type="button" size="sm" variant="outline">
                        <Download className="mr-1.5 h-4 w-4" />
                        Download PDF
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-500">
                    {strike.nextAction ||
                      "Your plagiarism clearance is now linked to your thesis record. You may proceed to Final Oral Defense."}
                  </p>
                  <Link
                    href={journeyRouteFor("FINAL_DEFENSE")}
                    className={buttonVariants()}
                  >
                    Continue to Final Defense
                  </Link>
                </div>
              </CardContent>
            </Card>

            <DocumentViewer
              open={certPreviewOpen}
              onOpenChange={setCertPreviewOpen}
              fetchUrl="/sample-docs/sample-strike-certificate.pdf"
              title="Official Plagiarism Clearance Certificate"
            />
          </>
        )}

        {/* STATE 2: WAITING / VERIFICATION IN PROGRESS */}
        {strike &&
          strike.state !== "LOCKED" &&
          strikeRequired &&
          strikeWaiting && (
            <Card data-guide="strike-upload">
              <CardHeader className="border-b border-gray-100 pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-[#333333]">
                    <Clock className="h-4 w-4 text-[#f9a825]" />
                    Manuscript Under Graduate School Plagiarism Verification
                  </CardTitle>
                  <Badge className="border-amber-200 bg-amber-50 text-amber-700">
                    Verification in Progress
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4 text-sm text-[#333333]">
                <p className="text-gray-600">
                  Your revised manuscript has been received and is currently queued for plagiarism and similarity scanning by the Graduate School Research Unit.
                </p>
                <div
                  data-guide="strike-certificate"
                  className="space-y-1.5 rounded-lg border border-gray-100 bg-gray-50/70 p-3.5 text-xs"
                >
                  <p className="font-semibold text-[#333333]">
                    Submitted Manuscript on File
                  </p>
                  <p className="flex items-center gap-2 font-medium text-[#e02b20]">
                    <FileText className="h-4 w-4" />
                    DelaCruz_MAEd_Revised_Manuscript_For_Plagiarism_Check.pdf
                  </p>
                  <p className="text-gray-500">
                    {strike.detail ||
                      "Submitted on March 26, 2026 — Verification in progress. Once cleared (<15% similarity), your official Clearance Certificate will appear here."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

        {/* STATE 1: SUBMIT_MANUSCRIPT */}
        {strike &&
          strike.state !== "LOCKED" &&
          strikeRequired &&
          !strikeCompleted &&
          !strikeWaiting && (
            <>
              <Card data-guide="strike-upload">
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <CardTitle className="text-base font-bold text-[#333333]">
                      Submit Revised Manuscript for Plagiarism Check
                    </CardTitle>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Upload your post-Proposal revised manuscript PDF for institutional similarity scanning.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleAttachSampleManuscript()}
                    className="border-[#f9a825] bg-amber-50 text-xs font-semibold text-[#b71c1c] hover:bg-amber-100"
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#f9a825]" />
                    Attach Sample Evaluation PDF
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-4 text-sm">
                  {!manuscriptFile ? (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 transition-all hover:border-[#e02b20] hover:bg-red-50/20">
                      <Upload className="mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-center text-sm font-semibold text-[#333333]">
                        Select Revised Manuscript PDF
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF only · Complete manuscript incorporating Proposal Defense revisions
                      </p>
                      <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setManuscriptFile(f);
                            setSampleAttached(false);
                          }
                        }}
                      />
                    </label>
                  ) : (
                    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-[#e02b20]">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#333333]">
                              {manuscriptFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Ready for plagiarism and similarity verification
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={openLocalPreview}
                          >
                            <Eye className="mr-1 h-4 w-4" /> Preview PDF
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setManuscriptFile(null);
                              setSampleAttached(false);
                              if (inputRef.current) inputRef.current.value = "";
                            }}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <X className="mr-1 h-4 w-4" /> Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    type="button"
                    disabled={!manuscriptFile || submitStrikeManuscript.isPending}
                    onClick={() => submitStrikeManuscript.mutate()}
                    className="w-full sm:w-auto"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {submitStrikeManuscript.isPending
                      ? "Submitting Manuscript…"
                      : "Submit Manuscript for Plagiarism Check"}
                  </Button>
                </CardContent>
              </Card>

              <Card data-guide="strike-certificate">
                <CardContent className="space-y-1.5 pt-6 text-xs text-gray-600">
                  <p className="font-semibold text-[#333333]">
                    Institutional Similarity Policy (GS Memorandum No. 2026-03)
                  </p>
                  <p>
                    All Master&apos;s theses and Doctoral dissertations must record an overall similarity index below <strong>15%</strong> prior to Final Adviser Endorsement and Final Oral Defense scheduling. Switch to <strong>3. Cleared (Similarity Index: 9%)</strong> above to preview the issued Plagiarism Clearance Certificate.
                  </p>
                </CardContent>
              </Card>

              <LocalFilePreviewDialog
                open={localPreviewOpen}
                onOpenChange={setLocalPreviewOpen}
                objectUrl={localPreviewUrl}
                file={manuscriptFile}
                title="Revised Manuscript Preview"
              />
            </>
          )}
      </ThesisJourneyShell>
    </div>
  );
}
