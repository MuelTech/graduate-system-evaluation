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
  Lock,
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
          "DelaCruz_MAEd_Revised_Manuscript_For_STRIKE_Check.pdf",
          { type: "application/pdf" },
        ),
      );
      setSampleAttached(true);
      toast.success("Sample Revised Manuscript PDF attached for STRIKE check!");
    } catch {
      setManuscriptFile(
        new File(
          ["%PDF-1.4 Sample Revised Manuscript"],
          "DelaCruz_MAEd_Revised_Manuscript_For_STRIKE_Check.pdf",
          { type: "application/pdf" },
        ),
      );
      setSampleAttached(true);
      toast.success("Sample Revised Manuscript PDF attached for STRIKE check!");
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
      toast.success("Manuscript submitted for STRIKE similarity verification!", {
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
      <div className="mx-auto max-w-3xl space-y-4">
        <ScenarioSwitcherBar pageKey="strike" />
        <h2 className="text-2xl font-bold text-(--earist-primary)">
          STRIKE / Plagiarism
        </h2>
        <p className="text-sm text-(--earist-body-text)">Loading status…</p>
      </div>
    );
  }

  if (isError || !journey) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <ScenarioSwitcherBar pageKey="strike" />
        <h2 className="text-2xl font-bold text-(--earist-primary)">
          STRIKE / Plagiarism
        </h2>
        <Card>
          <CardContent className="space-y-3 pt-6">
            <p className="text-sm text-red-600">
              Unable to load STRIKE / plagiarism status.
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
    <div className="mx-auto max-w-3xl space-y-4 pb-10">
      <ScenarioSwitcherBar pageKey="strike" />

      <div>
        <h2 className="text-2xl font-bold text-(--earist-primary)">
          STRIKE / Plagiarism Similarity Clearance
        </h2>
        <p className="text-sm text-(--earist-body-text)">
          Institutional manuscript similarity &amp; originality verification (&lt;15% threshold) required prior to Final Oral Defense.
        </p>
      </div>

      {strike?.state === "LOCKED" && (
        <Card data-guide="strike-upload">
          <CardContent className="space-y-2 pt-6">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-(--earist-secondary)" />
              <p className="font-semibold">This step is not available yet</p>
            </div>
            <p className="text-sm text-(--earist-body-text)">
              {strike.lockReason || "This step is currently unavailable."}
            </p>
            <Link
              href="/student/thesis"
              className={buttonVariants({ variant: "outline" })}
            >
              Continue in Thesis Journey
            </Link>
          </CardContent>
        </Card>
      )}

      {strike && strike.state !== "LOCKED" && !strikeRequired && (
        <Card data-guide="strike-upload">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Info className="h-4 w-4" />
              Not required
              <Badge variant="outline">Not required</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-(--earist-body-text)">
              STRIKE / plagiarism checking is not required for your current
              workflow.
            </p>
            <Link
              href={journeyRouteFor("FINAL_DEFENSE")}
              className={buttonVariants()}
            >
              Proceed to Final Defense
            </Link>
          </CardContent>
        </Card>
      )}

      {/* STATE 3: COMPLETED / CLEARED */}
      {strike && strike.state !== "LOCKED" && strikeRequired && strikeCompleted && (
        <>
          <Card data-guide="strike-upload">
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2 text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                STRIKE Plagiarism Check Cleared
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  9% Similarity Index — Passed (&lt;15% Threshold)
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-(--earist-body-text)">
                The Graduate School Research Unit has completed the Turnitin / STRIKE similarity verification of your revised manuscript. Your manuscript achieved an overall similarity index of <strong>9%</strong>, which is well within the institutional maximum threshold of <strong>15%</strong>.
              </p>

              <div className="grid gap-3 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3.5 sm:grid-cols-3">
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-(--earist-secondary)">
                <ShieldCheck className="h-4 w-4 text-(--earist-primary)" />
                Official STRIKE Clearance Certificate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex flex-col justify-between gap-3 rounded-lg border border-(--earist-border-gray) bg-(--earist-surface-gray)/50 p-3.5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--earist-primary)/10">
                    <FileCheck2 className="h-5 w-5 text-(--earist-primary)" />
                  </div>
                  <div>
                    <p className="font-semibold text-(--earist-primary)">
                      STRIKE Similarity Clearance Certificate (GS-STRIKE-2026-0142)
                    </p>
                    <p className="text-xs text-(--earist-body-text)">
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
                    download="EARIST-STRIKE-Clearance-Certificate.pdf"
                  >
                    <Button type="button" size="sm" variant="outline">
                      <Download className="mr-1.5 h-4 w-4" />
                      Download PDF
                    </Button>
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--earist-border-gray) pt-3">
                <p className="text-xs text-(--earist-body-text)">
                  {strike.nextAction ||
                    "Your STRIKE clearance is now linked to your thesis record. You may proceed to Final Oral Defense."}
                </p>
                <Link
                  href={journeyRouteFor("FINAL_DEFENSE")}
                  className={buttonVariants()}
                >
                  Proceed to Final Defense
                </Link>
              </div>
            </CardContent>
          </Card>

          <DocumentViewer
            open={certPreviewOpen}
            onOpenChange={setCertPreviewOpen}
            fetchUrl="/sample-docs/sample-strike-certificate.pdf"
            title="Official STRIKE Plagiarism Clearance Certificate"
          />
        </>
      )}

      {/* STATE 2: WAITING / VERIFICATION IN PROGRESS */}
      {strike &&
        strike.state !== "LOCKED" &&
        strikeRequired &&
        strikeWaiting && (
          <Card data-guide="strike-upload">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Clock className="h-5 w-5 text-amber-600" />
                Manuscript Under Graduate School Plagiarism Verification
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                  Verification in Progress
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-(--earist-body-text)">
                Your revised manuscript has been received and is currently queued for Turnitin / STRIKE similarity scanning by the Graduate School Research Unit.
              </p>
              <div
                data-guide="strike-certificate"
                className="rounded-lg border border-(--earist-border-gray) bg-(--earist-surface-gray) p-3.5 text-xs space-y-1.5"
              >
                <p className="font-semibold text-(--earist-secondary)">
                  Submitted Manuscript on File
                </p>
                <p className="flex items-center gap-2 text-(--earist-primary) font-medium">
                  <FileText className="h-4 w-4" />
                  DelaCruz_MAEd_Revised_Manuscript_For_STRIKE_Check.pdf
                </p>
                <p className="text-(--earist-body-text)">
                  {strike.detail ||
                    "Submitted on March 26, 2026 — Verification in progress. Once cleared (<15% similarity), your official STRIKE Certificate will appear here."}
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
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-sm font-semibold text-(--earist-secondary)">
                    Submit Revised Manuscript for Similarity Check
                  </CardTitle>
                  <p className="mt-0.5 text-xs text-(--earist-body-text)">
                    Upload your post-Proposal revised manuscript PDF for institutional Turnitin / STRIKE scanning.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void handleAttachSampleManuscript()}
                  className="border-(--earist-accent) bg-amber-50 text-xs font-semibold text-(--earist-primary) hover:bg-amber-100"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5 text-(--earist-accent)" />
                  Attach Sample Evaluation PDF
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {!manuscriptFile ? (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-(--earist-border-gray) p-6 transition-colors hover:border-(--earist-primary) hover:bg-(--earist-surface-gray)">
                    <Upload className="mb-2 h-8 w-8 text-(--earist-body-text)/40" />
                    <p className="text-center text-sm font-medium text-(--earist-primary)">
                      Select Revised Manuscript PDF
                    </p>
                    <p className="text-xs text-(--earist-body-text)">
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
                  <div className="flex flex-col gap-3 rounded-lg border border-(--earist-border-gray) p-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded bg-(--earist-surface-gray)">
                          <FileText className="h-4 w-4 text-(--earist-primary)" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-(--earist-primary)">
                            {manuscriptFile.name}
                          </p>
                          <p className="text-xs text-(--earist-body-text)">
                            Ready for STRIKE plagiarism verification
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
                  className="w-full bg-(--earist-primary) hover:bg-(--earist-primary)/90 sm:w-auto"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {submitStrikeManuscript.isPending
                    ? "Submitting Manuscript…"
                    : "Submit Manuscript for STRIKE Verification"}
                </Button>
              </CardContent>
            </Card>

            <Card data-guide="strike-certificate">
              <CardContent className="pt-6 text-xs text-(--earist-body-text) space-y-1.5">
                <p className="font-semibold text-(--earist-secondary)">
                  Institutional Similarity Policy (GS Memorandum No. 2026-03)
                </p>
                <p>
                  All Master&apos;s theses and Doctoral dissertations must record an overall similarity index below <strong>15%</strong> prior to Final Adviser Endorsement and Final Oral Defense scheduling. Switch to <strong>3. Cleared (Similarity Index: 9%)</strong> above to preview the issued STRIKE Clearance Certificate.
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
    </div>
  );
}
