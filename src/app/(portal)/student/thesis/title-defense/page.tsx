"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClientRequest, ApiError } from "@/lib/api.client";
import {
  studentThesisJourneyQueryKey,
  journeyRouteFor,
  journeyStepFor,
} from "@/lib/student-thesis-journey";
import { useStudentThesisJourney } from "@/hooks/use-student-thesis-journey";
import { ScenarioSwitcherBar } from "@/components/evaluation/scenario-switcher-bar";
import { RejectedApplicationCorrection } from "@/components/student/rejected-application-correction";
import {
  DefenseScheduleSummary,
  DefenseStatusPanel,
} from "@/components/student/defense-status-panel";
import { LocalFilePreviewDialog } from "@/components/student/local-file-preview-dialog";
import {
  ThesisJourneyShell,
  JourneyStepStatusCard,
  DocumentUploadSlot,
} from "@/components/student/thesis-journey-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Send,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

type DocKey = "package" | "cor" | "receipt";

interface DocConfig {
  key: DocKey;
  field: string;
  label: string;
  helper: string[];
  accept: string;
  guidance?: ReactNode;
  formatNote?: string;
  dialogNote?: string;
  sampleUrl: string;
  sampleFilename: string;
}

const DOCUMENTS: DocConfig[] = [
  {
    key: "package",
    field: "conceptPaper",
    label: "Title Defense Proposal Package",
    helper: [
      "Upload one PDF containing your complete Title Defense proposal package.",
      "If your proposal contains three title options, include all of them inside this document.",
    ],
    accept: ".pdf",
    formatNote: "PDF only · One combined file for all 3 title proposals",
    dialogNote:
      "Confirm that the PDF contains three complete title proposals and the required supporting information for each.",
    sampleUrl: "/sample-docs/sample-manuscript.pdf",
    sampleFilename: "DelaCruz_MAEd_Title_Proposal_Package.pdf",
    guidance: (
      <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50/70 p-3 text-xs text-gray-600">
        <p className="font-semibold text-[#333333]">
          What should be included?
        </p>
        <p className="mt-1">
          Each of the three title proposals in your PDF should include:
        </p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4">
          <li>Rationale of the Study</li>
          <li>Statement of the Problem (SOP)</li>
          <li>Hypothesis</li>
          <li>Population</li>
          <li>Research Locale</li>
          <li>
            Student Profile with picture
            <span className="mt-0.5 block text-[11px] text-gray-500">
              Name · Degree Program &amp; Major · Occupation / Position ·
              School / Office Address · Subject Taught &amp; Grade Level
            </span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    key: "cor",
    field: "cor",
    label: "Current Semester COR",
    helper: ["Upload your current semester Certificate of Registration."],
    accept: ".pdf,.jpg,.jpeg,.png",
    sampleUrl: "/sample-docs/sample-cor.pdf",
    sampleFilename: "DelaCruz_COR_2ndSem_AY2025-2026.pdf",
  },
  {
    key: "receipt",
    field: "receipt",
    label: "Defense-fee Proof of Payment",
    helper: ["Upload your proof of payment for the Title Defense fee."],
    accept: ".pdf,.jpg,.jpeg,.png",
    sampleUrl: "/sample-docs/sample-defense-application.pdf",
    sampleFilename: "DelaCruz_Defense_Fee_Receipt_OR884120.pdf",
  },
];

function formatSize(bytes: number): string {
  return `${Math.max(0.01, bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function TitleDefensePage() {
  const queryClient = useQueryClient();
  const {
    data: journey,
    isLoading,
    isError,
    refetch,
    refreshStatus,
    isRefreshing,
  } = useStudentThesisJourney();

  const titleStep = journeyStepFor(journey, "TITLE_DEFENSE");
  const state = titleStep?.state;

  const [files, setFiles] = useState<Record<DocKey, File | null>>({
    package: null,
    cor: null,
    receipt: null,
  });
  const [samplePreviewUrls, setSamplePreviewUrls] = useState<
    Partial<Record<DocKey, string>>
  >({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const allDocsSelected =
    files.package !== null && files.cor !== null && files.receipt !== null;
  const canSubmit = allDocsSelected && !submitSuccess;

  const handleAttachSamplePdfs = async () => {
    try {
      const nextFiles: Record<DocKey, File | null> = {
        package: null,
        cor: null,
        receipt: null,
      };
      const nextUrls: Partial<Record<DocKey, string>> = {};
      for (const cfg of DOCUMENTS) {
        const res = await fetch(cfg.sampleUrl);
        const blob = await res.blob();
        nextFiles[cfg.key] = new File([blob], cfg.sampleFilename, {
          type: "application/pdf",
        });
        nextUrls[cfg.key] = cfg.sampleUrl;
      }
      setFiles(nextFiles);
      setSamplePreviewUrls(nextUrls);
      setSubmitSuccess(false);
      toast.success("Sample Evaluation PDFs attached to all 3 document slots!");
    } catch {
      setFiles({
        package: new File(
          ["%PDF-1.4 Sample Title Proposal Package"],
          "DelaCruz_MAEd_Title_Proposal_Package.pdf",
          { type: "application/pdf" },
        ),
        cor: new File(
          ["%PDF-1.4 Sample COR"],
          "DelaCruz_COR_2ndSem_AY2025-2026.pdf",
          { type: "application/pdf" },
        ),
        receipt: new File(
          ["%PDF-1.4 Sample Receipt"],
          "DelaCruz_Defense_Fee_Receipt_OR884120.pdf",
          { type: "application/pdf" },
        ),
      });
      setSamplePreviewUrls({
        package: "/sample-docs/sample-manuscript.pdf",
        cor: "/sample-docs/sample-cor.pdf",
        receipt: "/sample-docs/sample-defense-application.pdf",
      });
      setSubmitSuccess(false);
      toast.success("Sample Evaluation PDFs attached to all 3 document slots!");
    }
  };

  const submitTitle = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      for (const config of DOCUMENTS) {
        formData.append(config.field, files[config.key]!);
      }
      return apiClientRequest("/thesis/defense/title", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: async () => {
      setSubmitError(null);
      setSubmitSuccess(true);
      setConfirmOpen(false);
      toast.success("Title Defense application submitted", {
        description:
          "Your required documents were uploaded successfully and your application is now under Graduate School review.",
      });
      await queryClient.invalidateQueries({
        queryKey: studentThesisJourneyQueryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: ["student", "thesis", "current-application"],
      });
    },
    onError: (error: Error) => {
      const extra =
        error instanceof ApiError && error.missing?.length
          ? ` ${error.missing.map((m) => m.message).join(" ")}`
          : "";
      setSubmitError((error.message || "Failed to submit application") + extra);
      setSubmitSuccess(false);
      setConfirmOpen(false);
      toast.error("Submission failed", {
        description:
          "Your application was not submitted. Review the error and try again.",
      });
    },
  });

  const setSlot = (key: DocKey, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setSamplePreviewUrls((prev) => ({ ...prev, [key]: undefined }));
    const ref = inputRefs.current[key];
    if (ref) ref.value = "";
    setPreviewFile(null);
    setPreviewUrl(null);
  };

  const openPreview = (key: DocKey, file: File | null) => {
    if (!file) return;
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewFile(file);
    const staticSampleUrl = samplePreviewUrls[key];
    if (staticSampleUrl) {
      setPreviewUrl(staticSampleUrl);
    } else {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePreviewOpenChange = (next: boolean) => {
    if (!next) {
      setPreviewFile(null);
      setPreviewUrl(null);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <ScenarioSwitcherBar pageKey="title-defense" />
        <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-24 w-full animate-pulse rounded-xl bg-gray-200" />
        <div className="h-44 w-full animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (isError || !journey) {
    return (
      <div className="w-full space-y-4">
        <ScenarioSwitcherBar pageKey="title-defense" />
        <div className="mx-auto max-w-md space-y-3 p-8 text-center">
          <p className="text-sm text-red-600">Unable to load Title Defense status.</p>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (state === "LOCKED") {
    return (
      <div className="w-full space-y-6 pb-10">
        <ScenarioSwitcherBar pageKey="title-defense" />
        <ThesisJourneyShell
          activeStep="TITLE_DEFENSE"
          title="Title Defense"
          description="Step 1 of your Graduate Thesis Journey."
          journey={journey}
        >
          <div data-guide="title-status-panel">
            <JourneyStepStatusCard
              variant="locked"
              title="Title Defense is Locked"
              badgeText="Locked"
              description={
                titleStep?.lockReason || "This step is currently unavailable."
              }
              nextStepHref="/student/thesis"
              nextStepLabel="Back to Thesis Journey"
            />
          </div>
        </ThesisJourneyShell>
      </div>
    );
  }

  if (state === "COMPLETED") {
    return (
      <div className="w-full space-y-6 pb-10">
        <ScenarioSwitcherBar pageKey="title-defense" />
        <ThesisJourneyShell
          activeStep="TITLE_DEFENSE"
          title="Title Defense"
          description="Formal Title Defense is complete."
          journey={journey}
        >
          <div data-guide="title-doc-slots">
            <JourneyStepStatusCard
              variant="completed"
              title="Title Defense Completed"
              badgeText="Completed"
              description={
                titleStep?.nextAction ||
                "Your Title Defense has been officially passed and finalized."
              }
              nextStepHref={journeyRouteFor("ADVISER_REQUEST")}
              nextStepLabel="Continue to Adviser Request"
            />
          </div>
          <div data-guide="title-status-panel">
            <DefenseScheduleSummary session={titleStep?.defenseSession} />
          </div>
        </ThesisJourneyShell>
      </div>
    );
  }

  if (state === "WAITING") {
    return (
      <div className="w-full space-y-6 pb-10">
        <ScenarioSwitcherBar pageKey="title-defense" />
        <ThesisJourneyShell
          activeStep="TITLE_DEFENSE"
          title="Title Defense"
          description="Track your Title Defense application, schedule, and official records."
          journey={journey}
        >
          <div data-guide="title-status-panel">
            <DefenseStatusPanel
              kind="Title"
              step={titleStep}
              onRefresh={refreshStatus}
              isRefreshing={isRefreshing}
              extra={
                <Link
                  href="/student/thesis"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Back to Thesis Journey
                </Link>
              }
            />
          </div>
        </ThesisJourneyShell>
      </div>
    );
  }

  const rejectedHint =
    titleStep?.defenseStatus === "REJECTED" ||
    (titleStep?.detail || "").toLowerCase().includes("reject") ||
    (titleStep?.detail || "").toLowerCase().includes("clearer scan");
  if (rejectedHint) {
    return (
      <div className="w-full space-y-6 pb-10">
        <ScenarioSwitcherBar pageKey="title-defense" />
        <ThesisJourneyShell
          activeStep="TITLE_DEFENSE"
          title="Title Defense"
          description="Review feedback and resubmit your Title Defense application."
          journey={journey}
        >
          <div data-guide="title-status-panel">
            <RejectedApplicationCorrection stage="TITLE" reason={titleStep?.detail} />
          </div>
        </ThesisJourneyShell>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-10">
      <ScenarioSwitcherBar pageKey="title-defense" />

      <ThesisJourneyShell
        activeStep="TITLE_DEFENSE"
        title="Title Defense Application"
        description="Upload your Title Defense Proposal Package and the required documents. No adviser is required for Title Defense."
        journey={journey}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void handleAttachSamplePdfs()}
            className="border-[#f9a825] bg-amber-50 text-xs font-semibold text-[#b71c1c] hover:bg-amber-100"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#f9a825]" />
            Attach Sample Evaluation PDFs
          </Button>
        }
      >
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
              Your Title Defense application was submitted and is now under
              Graduate School review.
            </AlertDescription>
          </Alert>
        )}

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit || submitTitle.isPending) return;
            setConfirmOpen(true);
          }}
        >
          <div data-guide="title-doc-slots" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[#333333]">
                Required Documents
              </h2>
              <span className="text-xs text-gray-500">
                Select local PDFs or click &ldquo;Attach Sample Evaluation PDFs&rdquo; above
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {DOCUMENTS.map((config) => (
                <div
                  key={config.key}
                  className={
                    config.key === "package" ? "lg:col-span-3" : "lg:col-span-1"
                  }
                >
                  <DocumentUploadSlot
                    label={config.label}
                    helper={config.helper}
                    accept={config.accept}
                    formatNote={config.formatNote}
                    guidance={config.guidance}
                    file={files[config.key]}
                    disabled={submitTitle.isPending || submitSuccess}
                    onTriggerPick={() => inputRefs.current[config.key]?.click()}
                    registerInput={(el) => {
                      inputRefs.current[config.key] = el;
                    }}
                    onPick={(f) => setSlot(config.key, f)}
                    onRemove={() => setSlot(config.key, null)}
                    onView={() => openPreview(config.key, files[config.key])}
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            data-guide="title-status-panel"
            className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-2xs"
          >
            <p className="text-xs text-gray-600">
              Once all 3 required documents are attached, click below to review and submit your Title Defense application. Submitting automatically advances the scenario to <strong>2. Under Graduate School Review</strong>.
            </p>
            <Button
              type="submit"
              disabled={!canSubmit || submitTitle.isPending}
              className="w-full sm:w-auto"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Title Defense Application
            </Button>
          </div>
        </form>

        <LocalFilePreviewDialog
          open={previewFile !== null}
          onOpenChange={handlePreviewOpenChange}
          objectUrl={previewUrl}
          file={previewFile}
          title="Document preview"
        />

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Confirm Title Defense Application</DialogTitle>
              <DialogDescription>
                Please verify that the documents below are the correct files before
                submitting your Title Defense application.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              <div>
                <p className="mb-1.5 font-semibold text-[#333333]">
                  Documents
                </p>
                <ul className="space-y-2 text-gray-600">
                  {DOCUMENTS.map((config) => {
                    const f = files[config.key];
                    return (
                      <li key={config.key} className="space-y-0.5">
                        <div className="flex flex-wrap gap-x-1">
                          <span className="font-semibold text-[#333333]">
                            {config.label}:
                          </span>
                          <span className="min-w-0 break-all">
                            {f ? `${f.name} · ${formatSize(f.size)}` : "—"}
                          </span>
                        </div>
                        {config.dialogNote && (
                          <p className="text-xs text-gray-500">
                            {config.dialogNote}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <p className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs text-gray-600">
                Review all selected documents before submitting. Once submitted,
                the application will be placed under Graduate School review.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmOpen(false)}
                disabled={submitTitle.isPending}
              >
                Go Back
              </Button>
              <Button
                type="button"
                onClick={() => submitTitle.mutate()}
                disabled={submitTitle.isPending}
              >
                {submitTitle.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading documents and submitting…
                  </>
                ) : (
                  "Confirm & Submit"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ThesisJourneyShell>
    </div>
  );
}
