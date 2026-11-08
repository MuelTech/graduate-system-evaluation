"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClientRequest } from "@/lib/api.client";
import { studentThesisJourneyQueryKey } from "@/lib/student-thesis-journey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FileText,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Send,
  Sparkles,
} from "lucide-react";

export type DefenseEvidenceStage = "TITLE" | "PROPOSAL" | "FINAL";

interface EvidenceDto {
  id: string;
  docType: string;
  defenseStage: string | null;
  originalFilename: string | null;
  verifiedMimeType: string | null;
  sizeBytes: number | null;
  uploadedAt: string;
  isCurrent: boolean;
  supersedesDocumentId: string | null;
}

interface CurrentApplication {
  thesisId: string;
  stage: DefenseEvidenceStage;
  status: string;
  rejectionReason: string | null;
  evidence: EvidenceDto[];
}

const STAGE_SLOTS: Record<DefenseEvidenceStage, string[]> = {
  // UIUX-4B FIX-1: Title correction permits the package, COR, or fee proof.
  TITLE: ["TITLE_PROPOSAL", "COR", "RECEIPT"],
  PROPOSAL: ["COR", "RECEIPT"],
  FINAL: ["COR", "RECEIPT"],
};

const SLOT_FIELD: Record<string, "conceptPaper" | "cor" | "receipt"> = {
  TITLE_PROPOSAL: "conceptPaper",
  COR: "cor",
  RECEIPT: "receipt",
};

const SLOT_LABEL: Record<string, string> = {
  TITLE_PROPOSAL: "Title Defense Proposal Package",
  COR: "Current Semester COR",
  RECEIPT: "Defense-fee proof of payment",
};

const SLOT_ACCEPT: Record<string, string> = {
  TITLE_PROPOSAL: ".pdf",
  COR: ".pdf,.jpg,.jpeg,.png",
  RECEIPT: ".pdf,.jpg,.jpeg,.png",
};

/**
 * DL-6: rejected-application correction UI. Replacement files are optional;
 * unchanged evidence is retained. The server owns stage/slot/currentness rules.
 */
export function RejectedApplicationCorrection({
  stage,
  reason,
}: {
  stage: DefenseEvidenceStage;
  reason?: string | null;
}) {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { data: application } = useQuery<CurrentApplication | null>({
    queryKey: ["student", "thesis", "current-application"],
    queryFn: async () => apiClientRequest("/thesis/defense/current"),
  });

  const permittedSlots = STAGE_SLOTS[stage] ?? [];
  const currentByType = new Map(
    (application?.evidence ?? [])
      .filter((e) => e.isCurrent)
      .map((e) => [e.docType, e]),
  );
  const rejectedReason = reason || application?.rejectionReason || "";

  const handleAttachSampleCorrections = () => {
    setFiles({
      cor: new File(
        ["%PDF-1.4 Sample Corrected COR"],
        "DelaCruz_COR_2ndSem_AY2025-2026_Corrected.pdf",
        { type: "application/pdf" },
      ),
      receipt: new File(
        ["%PDF-1.4 Sample Clear Receipt"],
        "DelaCruz_Official_Receipt_OR884120_HighRes.pdf",
        { type: "application/pdf" },
      ),
    });
    toast.success("Sample replacement PDFs attached for evaluation!");
  };

  const resubmit = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      for (const docType of permittedSlots) {
        const field = SLOT_FIELD[docType];
        const file = files[field];
        if (field && file) formData.append(field, file);
      }
      return apiClientRequest(`/thesis/defense/${application?.thesisId ?? "thesis-eval-01"}/resubmit`, {
        method: "PUT",
        body: formData,
      });
    },
    onSuccess: async () => {
      setError(null);
      setSuccess(true);
      setFiles({});
      toast.success("Corrected application resubmitted!", {
        description: "Your application is now back under Graduate School review.",
      });
      await queryClient.invalidateQueries({ queryKey: studentThesisJourneyQueryKey });
      await queryClient.invalidateQueries({
        queryKey: ["student", "thesis", "current-application"],
      });
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to resubmit application");
      setSuccess(false);
    },
  });

  return (
    <div className="space-y-4">
      <Alert data-guide="title-status-panel">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Application returned for correction</AlertTitle>
        <AlertDescription>
          {rejectedReason || "Your application was returned. Review the feedback and resubmit."}{" "}
          Replace only the documents that need correction — unchanged evidence is
          kept.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Resubmission failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Application resubmitted</AlertTitle>
          <AlertDescription>Your application is back under Admin review.</AlertDescription>
        </Alert>
      )}

      <Card data-guide="title-doc-slots">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold text-(--earist-secondary)">
            Current Supporting Evidence
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAttachSampleCorrections}
            className="border-(--earist-accent) bg-amber-50 text-xs font-semibold text-(--earist-primary) hover:bg-amber-100"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-(--earist-accent)" />
            Attach Sample Replacement PDFs
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {permittedSlots.map((docType) => {
            const current = currentByType.get(docType);
            const field = SLOT_FIELD[docType];
            const file = field ? files[field] : null;
            return (
              <div
                key={docType}
                className="rounded-lg border border-(--earist-border-gray) p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-(--earist-primary)">
                      {SLOT_LABEL[docType]}
                    </p>
                    <p className="truncate text-xs text-(--earist-body-text)">
                      Current: {current?.originalFilename || "—"}
                    </p>
                  </div>
                  {!file ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => inputRefs.current[docType]?.click()}
                    >
                      <Upload className="mr-1 h-4 w-4" /> Replace
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFiles((prev) => ({ ...prev, [field]: null }));
                        const ref = inputRefs.current[docType];
                        if (ref) ref.value = "";
                      }}
                    >
                      <X className="mr-1 h-4 w-4" /> Remove
                    </Button>
                  )}
                </div>
                {file && (
                  <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-700">
                    <FileText className="h-3 w-3" /> Replacement ready: {file.name}
                  </p>
                )}
                <input
                  ref={(el) => {
                    inputRefs.current[docType] = el;
                  }}
                  type="file"
                  accept={SLOT_ACCEPT[docType]}
                  className="hidden"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected && field) {
                      setFiles((prev) => ({ ...prev, [field]: selected }));
                    }
                  }}
                />
              </div>
            );
          })}
          <p className="text-xs text-(--earist-body-text)">
            Leaving a document unchanged keeps its current version. Previous
            versions remain in history.
          </p>
        </CardContent>
      </Card>

      <Button
        type="button"
        disabled={resubmit.isPending}
        onClick={() => resubmit.mutate()}
        className="w-full bg-(--earist-primary) hover:bg-(--earist-primary)/90 sm:w-auto"
      >
        <Send className="mr-2 h-4 w-4" />
        {resubmit.isPending ? "Resubmitting…" : "Resubmit Application"}
      </Button>
    </div>
  );
}
