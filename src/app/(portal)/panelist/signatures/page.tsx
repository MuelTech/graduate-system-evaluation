"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClientRequest } from "@/lib/api.client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, FileText, PenTool } from "lucide-react";
import { ESignaturePad } from "@/components/defense-workspace/e-signature-pad";

interface PendingDoc {
  id: string;
  rapReport: {
    defenseType: string;
    generatedAt: string;
    thesis: {
      student: {
        user: {
          firstName: string;
          lastName: string;
        };
      };
    };
  };
}

interface SignedDocRecord {
  id: string;
  studentName: string;
  defenseType: string;
  signedAt: string;
  role: string;
}

const INITIAL_SIGNED_DOCS: SignedDocRecord[] = [
  {
    id: "rap-signed-01",
    studentName: "Juan S. Dela Cruz",
    defenseType: "PROPOSAL_DEFENSE",
    signedAt: "2025-11-18T16:40:00.000Z",
    role: "Committee Chairperson",
  },
  {
    id: "rap-signed-02",
    studentName: "Camille R. Villanueva",
    defenseType: "FINAL_DEFENSE",
    signedAt: "2026-02-20T17:15:00.000Z",
    role: "Panel Member",
  },
];

export default function PanelistSignaturesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"pending" | "signed">("pending");
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Faculty default signature specimen state
  const [specimenData, setSpecimenData] = useState("");
  const [specimenSaved, setSpecimenSaved] = useState(true);
  const [editingSpecimen, setEditingSpecimen] = useState(false);

  const [signedHistory, setSignedHistory] =
    useState<SignedDocRecord[]>(INITIAL_SIGNED_DOCS);

  const isSignatureValid = signatureData.startsWith("data:image/png;base64,");
  const isSpecimenValid = specimenData.startsWith("data:image/png;base64,");

  const { data: pendingDocs = [], isLoading } = useQuery<PendingDoc[]>({
    queryKey: ["pendingRapReports"],
    queryFn: async () => {
      const res = await apiClientRequest("/thesis/defense/rap-reports/pending");
      return Array.isArray(res) ? (res as PendingDoc[]) : [];
    },
  });

  const effectiveSelectedId = selectedDoc ?? pendingDocs[0]?.id ?? null;
  const selectedDocument = pendingDocs.find(
    (d: PendingDoc) => d.id === effectiveSelectedId,
  );

  const signMutation = useMutation({
    mutationFn: async (pngDataUrl: string) => {
      if (!effectiveSelectedId) throw new Error("No document selected");
      return apiClientRequest(
        `/thesis/defense/rap-reports/${effectiveSelectedId}/sign`,
        {
          method: "POST",
          body: JSON.stringify({ signatureData: pngDataUrl }),
        },
      );
    },
    onSuccess: () => {
      if (selectedDocument) {
        setSignedHistory((prev) => [
          {
            id: selectedDocument.id,
            studentName: `${selectedDocument.rapReport.thesis.student.user.firstName} ${selectedDocument.rapReport.thesis.student.user.lastName}`,
            defenseType: selectedDocument.rapReport.defenseType,
            signedAt: new Date().toISOString(),
            role: "Committee Chairperson",
          },
          ...prev,
        ]);
      }
      toast.success("Rapporteur Report e-signature recorded.");
      void queryClient.invalidateQueries({ queryKey: ["pendingRapReports"] });
      void queryClient.invalidateQueries({ queryKey: ["defenseWorkspace"] });
      setSelectedDoc(null);
      setShowConfirm(false);
      setSignatureData("");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Could not record e-signature.");
    },
  });

  const handleSubmitSignature = () => {
    if (!isSignatureValid) return;
    signMutation.mutate(signatureData);
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h2 className="text-2xl font-bold text-[#e02b20]">
          E-Signatures
        </h2>
        <p className="text-sm text-[#333333]">
          Manage your digital signature specimen and sign pending Rapporteur
          Report (RAP) slots and GS-020 Adviser Request forms.
        </p>
      </div>

      {/* Faculty Digital Signature Specimen Card */}
      <Card data-guide="signature-specimen-card">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base text-(--earist-primary)">
              <PenTool className="h-4 w-4 text-(--earist-secondary)" />
              Faculty Digital Signature Specimen
            </CardTitle>
            <div className="flex items-center gap-2">
              {specimenSaved ? (
                <Badge className="bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Active Specimen on
                  File
                </Badge>
              ) : null}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingSpecimen((v) => !v)}
              >
                {editingSpecimen ? "Close Specimen Pad" : "Update Specimen"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-(--earist-body-text)">
            Your registered digital signature specimen is used for timestamped
            cryptographic verification on EARIST Graduate School forms (GS-020
            Request for Adviser, Pre-Defense Endorsements, and Report of Action
            of the Panel).
          </p>
          {editingSpecimen ? (
            <div className="max-w-lg space-y-3 rounded-lg border border-(--earist-border-gray) bg-(--earist-surface-gray)/40 p-4">
              <ESignaturePad value={specimenData} onChange={setSpecimenData} />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingSpecimen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={!isSpecimenValid}
                  onClick={() => {
                    setSpecimenSaved(true);
                    setEditingSpecimen(false);
                    if (!signatureData) {
                      setSignatureData(specimenData);
                    }
                    toast.success("Default digital signature specimen saved.");
                  }}
                  className="bg-(--earist-primary) text-white hover:bg-(--earist-primary)/90"
                >
                  Save Default Specimen
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Pending / Signed Tabs */}
      <div className="flex gap-2 border-b border-(--earist-border-gray)">
        {(["pending", "signed"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "border-b-2 border-(--earist-primary) text-(--earist-primary)"
                : "text-(--earist-body-text) hover:text-(--earist-primary)"
            }`}
          >
            {tab === "pending"
              ? `Pending Signatures (${pendingDocs.length})`
              : `Signed History (${signedHistory.length})`}
          </button>
        ))}
      </div>

      {activeTab === "pending" && (
        <div
          data-guide="pending-signatures-list"
          className="grid gap-4 lg:grid-cols-2"
        >
          <div className="space-y-3">
            {isLoading ? (
              <p className="text-sm text-(--earist-body-text)">Loading…</p>
            ) : pendingDocs.length === 0 ? (
              <div className="rounded-lg border border-dashed border-(--earist-border-gray) p-8 text-center text-(--earist-body-text)">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
                <p className="text-sm font-semibold text-(--earist-primary)">
                  All Committee Reports Signed!
                </p>
                <p className="mt-1 text-xs">
                  You have no pending Committee Report signatures. Switch to the{" "}
                  <strong>Signed History</strong> tab to view your completed
                  signatures.
                </p>
              </div>
            ) : (
              pendingDocs.map((rap: PendingDoc) => (
                <button
                  key={rap.id}
                  type="button"
                  onClick={() => {
                    setSelectedDoc(rap.id);
                    setSignatureData("");
                    setShowConfirm(false);
                  }}
                  className={`w-full rounded-lg border p-3.5 text-left transition-colors ${
                    effectiveSelectedId === rap.id
                      ? "border-(--earist-primary) bg-(--earist-primary)/5 shadow-xs"
                      : "border-(--earist-border-gray) bg-white hover:border-(--earist-primary)/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-(--earist-primary)">
                        {rap.rapReport.thesis.student.user.firstName}{" "}
                        {rap.rapReport.thesis.student.user.lastName}
                      </p>
                      <p className="text-xs text-(--earist-body-text)">
                        {rap.rapReport.defenseType.replace(/_/g, " ")} · Report
                        of Action of the Panel (RAP)
                      </p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">
                      Signature required
                    </Badge>
                  </div>
                  <p className="mt-2 text-[11px] text-(--earist-body-text)">
                    Generated:{" "}
                    {new Date(rap.rapReport.generatedAt).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>

          {effectiveSelectedId && selectedDocument && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm font-semibold text-(--earist-secondary)">
                      Committee Report Preview
                    </CardTitle>
                    <a
                      href="/sample-docs/sample-rap-report.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-(--earist-primary) hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Open Full PDF
                    </a>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="overflow-hidden rounded-lg border border-(--earist-border-gray) bg-(--earist-surface-gray)">
                    <iframe
                      src="/sample-docs/sample-rap-report.pdf"
                      title="Committee Report Preview"
                      className="h-56 w-full border-0"
                    />
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-(--earist-body-text)">
                    <FileText className="h-3.5 w-3.5 text-(--earist-secondary)" />
                    <span>
                      Official RAP Document:{" "}
                      <strong className="text-foreground">
                        {selectedDocument.rapReport.defenseType.replace(
                          /_/g,
                          " ",
                        )}{" "}
                        —{" "}
                        {
                          selectedDocument.rapReport.thesis.student.user
                            .firstName
                        }{" "}
                        {
                          selectedDocument.rapReport.thesis.student.user
                            .lastName
                        }
                      </strong>
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-(--earist-secondary)">
                    Your Signature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ESignaturePad
                    value={signatureData}
                    onChange={setSignatureData}
                  />

                  <div className="mt-4 border-t pt-4">
                    {!showConfirm ? (
                      <Button
                        type="button"
                        onClick={() => setShowConfirm(true)}
                        disabled={!isSignatureValid}
                        className="w-full bg-(--earist-primary) text-white hover:bg-(--earist-primary)/90"
                      >
                        Apply Signature
                      </Button>
                    ) : (
                      <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
                        <p className="flex items-start gap-2 text-xs text-green-800">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>
                            By confirming, you are securely attaching your
                            timestamped e-signature to this official Committee
                            Report. Double-signing is blocked.
                          </span>
                        </p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowConfirm(false)}
                            className="flex-1"
                            disabled={signMutation.isPending}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            onClick={handleSubmitSignature}
                            disabled={signMutation.isPending}
                            className="flex-1 bg-green-600 text-white hover:bg-green-700"
                          >
                            {signMutation.isPending
                              ? "Signing..."
                              : "Confirm & Sign"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {activeTab === "signed" && (
        <div
          data-guide="pending-signatures-list"
          className="space-y-3"
        >
          {signedHistory.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-(--earist-primary)">
                      {item.studentName}
                    </p>
                    <Badge className="bg-emerald-100 text-emerald-800">
                      Signed
                    </Badge>
                  </div>
                  <p className="text-xs text-(--earist-body-text)">
                    {item.defenseType.replace(/_/g, " ")} · Role: {item.role}
                  </p>
                  <p className="text-[11px] text-(--earist-body-text)">
                    Timestamp:{" "}
                    {new Date(item.signedAt).toLocaleString()}
                  </p>
                </div>
                <a
                  href="/sample-docs/sample-rap-report.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-(--earist-border-gray) px-3 py-1.5 text-xs font-medium text-(--earist-primary) hover:bg-(--earist-surface-gray)"
                >
                  <FileText className="h-3.5 w-3.5" /> View Signed RAP PDF
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
