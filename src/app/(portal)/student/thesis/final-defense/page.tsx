"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClientRequest, ApiError } from "@/lib/api.client";
import {
  studentThesisJourneyQueryKey,
  journeyStepFor,
} from "@/lib/student-thesis-journey";
import { useStudentThesisJourney } from "@/hooks/use-student-thesis-journey";
import { ScenarioSwitcherBar } from "@/components/evaluation/scenario-switcher-bar";
import { RejectedApplicationCorrection } from "@/components/student/rejected-application-correction";
import {
  DefenseScheduleSummary,
  DefenseStatusPanel,
} from "@/components/student/defense-status-panel";
import { FinalAdviserReviewPanel } from "@/components/student/final-adviser-review-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Database,
  FileText,
  Lock,
  Send,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

type MissingRequirement = {
  code: string;
  message: string;
  stage: string;
};

function FileSlot({
  label,
  file,
  inputRef,
  accept,
  hint,
  onPick,
  onRemove,
}: {
  label: string;
  file: File | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept: string;
  hint: string;
  onPick: (f: File) => void;
  onRemove: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-(--earist-secondary)">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!file ? (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-(--earist-border-gray) p-6 transition-colors hover:border-(--earist-primary) hover:bg-(--earist-surface-gray)">
            <Upload className="mb-2 h-8 w-8 text-(--earist-body-text)/40" />
            <p className="text-center text-sm font-medium text-(--earist-primary)">
              Upload
            </p>
            <p className="text-xs text-(--earist-body-text)">{hint}</p>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPick(f);
              }}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex flex-col gap-3 rounded-lg border border-(--earist-border-gray) p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-(--earist-surface-gray)">
                <FileText className="h-4 w-4 text-(--earist-primary)" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-(--earist-primary)">
                  {file.name}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="flex w-full items-center justify-center rounded p-2 text-xs text-red-500 hover:bg-red-50"
            >
              <X className="mr-1 h-4 w-4" /> Remove
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * WP12 — Final Defense integrated with centralized Journey.
 * Journey = academic access. Eligibility endpoint = submit-time requirements.
 */
export default function FinalDefensePage() {
  const queryClient = useQueryClient();
  const {
    data: journey,
    isLoading,
    isError,
    refetch,
    refreshStatus,
    isRefreshing,
  } = useStudentThesisJourney();

  const finalStep = journeyStepFor(journey, "FINAL_DEFENSE");
  const state = finalStep?.state;

  const [corFile, setCorFile] = useState<File | null>(null);
  const corInputRef = useRef<HTMLInputElement>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    data: eligibility,
    isLoading: eligibilityLoading,
    isError: eligibilityError,
    refetch: refetchEligibility,
  } = useQuery({
    queryKey: ["thesisEligibility", "FINAL_DEFENSE"],
    queryFn: async () =>
      (await apiClientRequest("/thesis/eligibility/FINAL_DEFENSE")) as {
        eligible: boolean;
        missing?: MissingRequirement[];
        missingRequirements?: MissingRequirement[];
      },
    enabled: state === "CURRENT" || state === "AVAILABLE",
    retry: 1,
  });

  const systemGaps = useMemo(
    () =>
      (eligibility?.missing ?? eligibility?.missingRequirements ?? []).filter(
        (m) => !["FINAL_MANUSCRIPT", "COR", "RECEIPT"].includes(m.code),
      ),
    [eligibility],
  );

  const eligibilityReady = eligibility != null && !eligibilityError;

  const canSubmit =
    eligibilityReady &&
    !!corFile &&
    !!receiptFile &&
    (state === "CURRENT" || state === "AVAILABLE") &&
    systemGaps.length === 0;

  const handleAttachSampleApplicationPdfs = () => {
    setCorFile(
      new File(
        ["%PDF-1.4 Sample COR"],
        "DelaCruz_COR_2ndSem_AY2025-2026.pdf",
        { type: "application/pdf" },
      ),
    );
    setReceiptFile(
      new File(
        ["%PDF-1.4 Sample Final Defense Fee Receipt"],
        "DelaCruz_Final_Defense_Fee_Receipt_OR904218.pdf",
        { type: "application/pdf" },
      ),
    );
    setSubmitSuccess(false);
    toast.success("Sample COR & Final Defense-Fee Receipt PDFs attached!");
  };

  const submitFinal = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      // CP4: certified Final manuscript is system-owned — COR + fee only.
      formData.append("cor", corFile!);
      formData.append("receipt", receiptFile!);
      return apiClientRequest("/thesis/defense/final", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: async () => {
      setSubmitError(null);
      setSubmitSuccess(true);
      toast.success("Final Oral Defense application submitted!", {
        description:
          "Your Final Oral Defense schedule and committee assignment are now active.",
      });
      await queryClient.invalidateQueries({
        queryKey: studentThesisJourneyQueryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: ["thesisEligibility", "FINAL_DEFENSE"],
      });
    },
    onError: (error: Error) => {
      const extra =
        error instanceof ApiError && error.missing?.length
          ? ` ${error.missing.map((m) => m.message).join(" ")}`
          : "";
      setSubmitError((error.message || "Failed to submit application") + extra);
      setSubmitSuccess(false);
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <ScenarioSwitcherBar pageKey="final-defense" />
        <div className="flex h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-(--earist-primary)" />
        </div>
      </div>
    );
  }

  if (isError || !journey) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <ScenarioSwitcherBar pageKey="final-defense" />
        <div className="mx-auto max-w-md space-y-3 p-8 text-center">
          <p className="text-sm text-red-600">
            Unable to load Final Defense status.
          </p>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (state === "LOCKED") {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-4">
        <ScenarioSwitcherBar pageKey="final-defense" />
        <Card data-guide="final-adviser-panel">
          <CardContent className="space-y-3 pt-6">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-(--earist-secondary)" />
              <p className="font-semibold">Final Defense is locked</p>
            </div>
            <p className="text-sm text-(--earist-body-text)">
              {finalStep?.lockReason || "This step is currently unavailable."}
            </p>
            <Link
              href="/student/thesis"
              className={buttonVariants({ variant: "outline" })}
            >
              Continue in Thesis Journey
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === "COMPLETED") {
    return (
      <div className="mx-auto max-w-3xl space-y-4 pb-10">
        <ScenarioSwitcherBar pageKey="final-defense" />
        <div>
          <h2 className="text-2xl font-bold text-(--earist-primary)">
            Final Oral Defense
          </h2>
          <p className="text-sm text-(--earist-body-text)">
            Final Oral Defense passed with finalized RAP report and eligibility for Research Databank archival.
          </p>
        </div>
        <Card data-guide="final-adviser-panel">
          <CardContent className="space-y-3 pt-6">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-semibold">
                Final Oral Defense Completed &amp; Passed (Ready for Archival)
              </p>
            </div>
            {finalStep?.nextAction && (
              <p className="text-sm text-(--earist-body-text)">
                {finalStep.nextAction}
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href="/student/repository/submit"
                className={buttonVariants()}
              >
                <Database className="mr-1.5 h-4 w-4" />
                Proceed to Thesis Repository Archival
              </Link>
              <Link
                href="/student/thesis"
                className={buttonVariants({ variant: "outline" })}
              >
                Back to Thesis Journey Hub
              </Link>
            </div>
          </CardContent>
        </Card>
        <div data-guide="final-rap-panel">
          <DefenseScheduleSummary session={finalStep?.defenseSession} />
        </div>
      </div>
    );
  }

  if (state === "WAITING") {
    return (
      <div className="mx-auto max-w-3xl space-y-4 pb-10">
        <ScenarioSwitcherBar pageKey="final-defense" />
        <div>
          <h2 className="text-2xl font-bold text-(--earist-primary)">
            Final Oral Defense
          </h2>
        </div>
        <div data-guide="final-rap-panel">
          <DefenseStatusPanel
            kind="Final"
            step={finalStep}
            onRefresh={refreshStatus}
            isRefreshing={isRefreshing}
            extra={
              <Link
                href="/student/thesis"
                className={buttonVariants({ variant: "outline" })}
              >
                Continue in Thesis Journey
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const rejectedHint = (finalStep?.detail || "").toLowerCase().includes("reject");
  if (rejectedHint) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 pb-10">
        <ScenarioSwitcherBar pageKey="final-defense" />
        <div>
          <h2 className="text-2xl font-bold text-(--earist-primary)">
            Final Defense
          </h2>
        </div>
        <RejectedApplicationCorrection stage="FINAL" reason={finalStep?.detail} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 pb-10">
      <ScenarioSwitcherBar pageKey="final-defense" />

      <div>
        <h2 className="text-2xl font-bold text-(--earist-primary)">
          Final Oral Defense Application
        </h2>
        <p className="text-sm text-(--earist-body-text)">
          Stage-scoped uploads for Final Defense (Cashier payment happens outside
          GS-IS — upload proof only).
        </p>
      </div>

      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Submission failed</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}
      {submitSuccess && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Application submitted</AlertTitle>
          <AlertDescription>
            Your Final Defense application was submitted. Status will update from
            the Thesis Journey.
          </AlertDescription>
        </Alert>
      )}

      {eligibilityError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Requirements unavailable</AlertTitle>
          <AlertDescription>
            Application requirements could not be loaded. Submission is disabled
            until requirements load successfully.
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => refetchEligibility()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {systemGaps.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>System requirements not met</AlertTitle>
          <AlertDescription>
            <ul className="list-disc space-y-1 pl-5">
              {systemGaps.map((m) => (
                <li key={m.code}>{m.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* CP4: certified Final manuscript is system-owned — COR + fee only */}
      <FinalAdviserReviewPanel />

      <Card data-guide="final-rap-panel">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
          <div>
            <CardTitle className="text-sm font-semibold text-(--earist-secondary)">
              2. Final Defense Application Documents (COR &amp; Fee Receipt)
            </CardTitle>
            <p className="text-xs text-(--earist-body-text)">
              Your Adviser-certified Final Manuscript (Ch. 1–5) and STRIKE Clearance are automatically linked.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAttachSampleApplicationPdfs}
            className="border-(--earist-accent) bg-amber-50 text-xs font-semibold text-(--earist-primary) hover:bg-amber-100"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-(--earist-accent)" />
            Attach Sample Evaluation PDFs
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FileSlot
              label="Certificate of Registration (COR)"
              file={corFile}
              inputRef={corInputRef}
              accept=".pdf,.jpg,.jpeg,.png"
              hint="Current semester COR (PDF / Image)"
              onPick={setCorFile}
              onRemove={() => {
                setCorFile(null);
                if (corInputRef.current) corInputRef.current.value = "";
              }}
            />
            <FileSlot
              label="Defense-fee proof of payment"
              file={receiptFile}
              inputRef={receiptInputRef}
              accept=".pdf,.jpg,.jpeg,.png"
              hint="Cashier Official Receipt (PDF / Image)"
              onPick={setReceiptFile}
              onRemove={() => {
                setReceiptFile(null);
                if (receiptInputRef.current) receiptInputRef.current.value = "";
              }}
            />
          </div>

          <Button
            type="button"
            disabled={!canSubmit || submitFinal.isPending || eligibilityLoading}
            onClick={() => submitFinal.mutate()}
            className="w-full bg-(--earist-primary) hover:bg-(--earist-primary)/90 sm:w-auto"
          >
            <Send className="mr-2 h-4 w-4" />
            {submitFinal.isPending
              ? "Submitting…"
              : "Submit Final Defense Application"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
