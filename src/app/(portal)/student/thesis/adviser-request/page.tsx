"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClientRequest } from "@/lib/api.client";
import { ESignaturePad } from "@/components/defense-workspace/e-signature-pad";
import {
  AdviserRequestRecords,
  adviserRequestRecordsQueryKey,
} from "@/components/shared/adviser-request-records";
import { ScenarioSwitcherBar } from "@/components/evaluation/scenario-switcher-bar";
import {
  captureAdviserRequestReview,
  adviserRequestSigningReady,
  signedAdviserRequestSubmission,
  type AdviserRequestReview,
  type AdviserRequestReviewContext,
} from "@/lib/adviser-request-signing";
import { useStudentThesisJourney } from "@/hooks/use-student-thesis-journey";
import { studentThesisJourneyQueryKey } from "@/lib/student-thesis-journey";
import {
  resolveAdviserRequestUiState,
  roleLabel,
} from "@/lib/adviser-request-ui-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Lock,
  Send,
  Sparkles,
  UserCheck,
  XCircle,
} from "lucide-react";

export const studentAdviserCandidatesQueryKey = [
  "student",
  "adviser",
  "candidates",
] as const;

type OdpCandidate = {
  userId: string;
  name: string;
  defenseRole: string;
  specialization: string | null;
  officeAffiliation: string | null;
  isExternal: boolean;
  isAvailableAsAdviser: boolean;
};

type CandidatesResponse = {
  sourceDefenseScheduleId: string;
  /** Historical context only — nullable; not required to list candidates. */
  selectedTitle: { id: string; titleText: string } | null;
  candidates: OdpCandidate[];
  student: Omit<
    AdviserRequestReviewContext,
    "requestedAdviserName" | "sourceDefenseScheduleId"
  >;
};

export default function AdviserRequestPage() {
  const { data: session } = useSession();
  if (!session?.user?.id) return null;
  const viewerScope = `${session.user.id}:${session.user.role}`;
  return <AdviserRequestContent key={viewerScope} viewerScope={viewerScope} />;
}

function AdviserRequestContent({ viewerScope }: { viewerScope: string }) {
  const queryClient = useQueryClient();
  const {
    data: journey,
    isLoading: journeyLoading,
    isError: journeyError,
  } = useStudentThesisJourney();

  const uiState = resolveAdviserRequestUiState({
    isLoading: journeyLoading,
    isError: journeyError,
    journey,
  });

  const [selectedUserId, setSelectedUserId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [review, setReview] = useState<AdviserRequestReview | null>(null);
  const [signature, setSignature] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const needCandidates =
    uiState === "READY" ||
    uiState === "DECLINED_RETRY" ||
    uiState === "DEAN_REJECTED_RETRY";

  const {
    data: candidatesData,
    isLoading: candidatesLoading,
    isError: candidatesError,
    refetch: refetchCandidates,
  } = useQuery({
    queryKey: [...studentAdviserCandidatesQueryKey, viewerScope],
    enabled: needCandidates,
    queryFn: async () =>
      (await apiClientRequest(
        "/thesis/adviser/candidates",
      )) as CandidatesResponse,
  });

  const createRequest = useMutation({
    retry: false,
    mutationFn: async () => {
      return apiClientRequest("/thesis/adviser/request", {
        method: "POST",
        body: JSON.stringify(signedAdviserRequestSubmission(review, signature)),
      });
    },
    onSuccess: async () => {
      setSubmitError(null);
      setConfirmOpen(false);
      setReview(null);
      setSignature("");
      setSelectedUserId("");
      setRemarks("");
      toast.success("Official GS-020 Adviser Request signed & submitted!", {
        description:
          "Your request has been routed to the requested Adviser (CONFORME) and the Graduate School Dean.",
      });
      await queryClient.invalidateQueries({
        queryKey: studentThesisJourneyQueryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: studentAdviserCandidatesQueryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: adviserRequestRecordsQueryKey,
      });
    },
    onError: (error: Error) => {
      setSubmitError(error.message || "Unable to send adviser request.");
      setConfirmOpen(false);
      setReview(null);
      setSignature("");
      void queryClient.invalidateQueries({
        queryKey: studentThesisJourneyQueryKey,
      });
      void refetchCandidates();
    },
  });

  const officialTitle =
    candidatesData?.selectedTitle?.titleText ||
    journey?.selectedTitle?.titleText ||
    null;

  const selectedCandidate = useMemo(
    () =>
      candidatesData?.candidates.find((c) => c.userId === selectedUserId) ??
      null,
    [candidatesData, selectedUserId],
  );

  const adviserStep = journey?.steps.find((s) => s.key === "ADVISER_REQUEST");
  const req = journey?.adviserRequest;
  const activeAdviser = journey?.activeAdviser;

  const closeSigning = () => {
    if (createRequest.isPending) return;
    setConfirmOpen(false);
    setReview(null);
    setSignature("");
  };

  const openSigning = () => {
    if (!selectedCandidate || !candidatesData?.student) return;
    setSignature("");
    setSubmitError(null);
    setReview(
      captureAdviserRequestReview({
        requestedAdviserId: selectedCandidate.userId,
        reason: remarks,
        reviewedContext: {
          ...candidatesData.student,
          requestedAdviserName: selectedCandidate.name,
          sourceDefenseScheduleId: candidatesData.sourceDefenseScheduleId,
        },
      }),
    );
    setConfirmOpen(true);
  };

  const handleQuickSelectSample = () => {
    const firstCandidate = candidatesData?.candidates[0];
    if (firstCandidate) {
      setSelectedUserId(firstCandidate.userId);
      setRemarks(
        "Dr. Santos served as Committee Chairperson during my Title Defense and her specialization in Educational Leadership & Supervision directly aligns with my approved thesis topic.",
      );
      toast.success("Selected Dr. Maria Clara R. Santos & populated GS-020 reason!");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 pb-10">
      <ScenarioSwitcherBar pageKey="adviser-request" />

      <div>
        <h2 className="text-2xl font-bold text-(--earist-primary)">
          Adviser Request (Official GS Form No. 020)
        </h2>
        <p className="text-sm text-(--earist-body-text)">
          Choose an eligible adviser from your Title Defense panel and sign GS Form No. 020 digitally.
        </p>
      </div>

      {officialTitle && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-(--earist-body-text)">
              Approved Thesis Title (Historical Record)
            </p>
            <p className="mt-1 text-sm font-semibold text-(--earist-primary)">
              {officialTitle}
            </p>
          </CardContent>
        </Card>
      )}

      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Request failed</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {uiState === "LOADING" && (
        <Card data-guide="adviser-selection">
          <CardContent className="pt-6 text-sm text-(--earist-body-text)">
            Loading Adviser Request status…
          </CardContent>
        </Card>
      )}

      {uiState === "ERROR" && (
        <Card data-guide="adviser-selection">
          <CardContent className="space-y-3 pt-6">
            <p className="text-sm text-red-600">
              Unable to load Adviser Request status.
            </p>
            <Link
              href="/student/thesis"
              className={buttonVariants({ variant: "outline" })}
            >
              Retry from Thesis Journey
            </Link>
          </CardContent>
        </Card>
      )}

      {uiState === "LOCKED" && (
        <Card data-guide="adviser-selection">
          <CardContent className="space-y-3 pt-6">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-(--earist-secondary)" />
              <p className="font-semibold">Adviser Request is locked</p>
            </div>
            <p className="text-sm text-(--earist-body-text)">
              {adviserStep?.lockReason || "This step is currently unavailable."}
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

      {uiState === "APPROVED_ACTIVE" && (
        <Card data-guide="adviser-selection">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <UserCheck className="h-5 w-5 text-emerald-600" />
              Adviser Officially Assigned (GS Form No. 020 Approved)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-(--earist-body-text)">
              Your Adviser Request process is complete. Both the Adviser CONFORME and Graduate School Dean approval have been recorded.
            </p>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                Active Thesis Adviser
              </p>
              <p className="mt-0.5 text-base font-bold text-(--earist-primary)">
                {activeAdviser?.name ?? "Dr. Maria Clara R. Santos, EdD"}
              </p>
            </div>
            <Link
              href="/student/thesis/proposal-defense"
              className={buttonVariants()}
            >
              Continue to Proposal Defense
            </Link>
          </CardContent>
        </Card>
      )}

      {uiState === "WAITING_ADVISER" && (
        <Card data-guide="adviser-selection">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-5 w-5 text-amber-600" />
              Waiting for Adviser Response
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-(--earist-body-text)">
              Your adviser request has been sent to{" "}
              <span className="font-semibold text-(--earist-primary)">
                {req?.requestedAdviserName || "the selected adviser"}
              </span>
              . The requested adviser must respond before the request can
              proceed to Dean review.
            </p>
            <p className="text-xs text-(--earist-body-text)">
              This is not yet an active adviser assignment.
            </p>
          </CardContent>
        </Card>
      )}

      {uiState === "WAITING_DEAN" && (
        <Card data-guide="adviser-selection">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-5 w-5 text-amber-600" />
              Awaiting Signatures — Adviser CONFORME Recorded
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-(--earist-body-text)">
              Your requested adviser has accepted the request and affixed their CONFORME signature. The GS-020 form is now routing for Graduate School Dean approval.
            </p>
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-(--earist-border-gray) bg-(--earist-surface-gray) p-3 text-xs">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Student: Signed
              </Badge>
              <span className="text-slate-400">→</span>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Adviser ({req?.requestedAdviserName || "Dr. Maria Clara R. Santos"}): CONFORME Approved
              </Badge>
              <span className="text-slate-400">→</span>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                <Clock className="mr-1 h-3 w-3" />
                Dean: Pending Sign-Off
              </Badge>
            </div>
            <p className="text-xs text-(--earist-body-text)">
              No active adviser assignment exists until Dean approval is
              completed.
            </p>
          </CardContent>
        </Card>
      )}

      {(uiState === "DECLINED_RETRY" || uiState === "DEAN_REJECTED_RETRY") && (
        <Alert>
          {uiState === "DECLINED_RETRY" ? (
            <XCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {uiState === "DECLINED_RETRY"
              ? "Previous Adviser Request Declined"
              : "Dean Review Returned Request"}
          </AlertTitle>
          <AlertDescription>
            {uiState === "DECLINED_RETRY"
              ? `The previously requested adviser (${req?.requestedAdviserName || "Dr. Roberto A. Villanueva, PhD"}) declined due to maximum advising load capacity. You may select another eligible Title Defense panel member below.`
              : "Dean review rejected this request. You may select another eligible Title Defense panel member below."}
          </AlertDescription>
        </Alert>
      )}

      {uiState === "UNEXPECTED" && (
        <Card data-guide="adviser-selection">
          <CardContent className="pt-6 text-sm text-(--earist-body-text)">
            Adviser Request status is unavailable. Open Thesis Journey to
            refresh.
          </CardContent>
        </Card>
      )}

      {needCandidates && (
        <Card data-guide="adviser-selection">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-sm font-semibold text-(--earist-secondary)">
              Eligible Graduate Faculty Adviser Candidates
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleQuickSelectSample}
              className="border-(--earist-accent) bg-amber-50 text-xs font-semibold text-(--earist-primary) hover:bg-amber-100"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-(--earist-accent)" />
              Auto-Select Sample Adviser
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-(--earist-body-text)">
              These candidates come from your Title Defense panel (Chairman and
              Panelists). Select your preferred Thesis Adviser and sign Official Form GS-020.
            </p>

            {candidatesLoading && (
              <p className="text-sm text-(--earist-body-text)">
                Loading eligible candidates…
              </p>
            )}

            {candidatesError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Candidate load failed</AlertTitle>
                <AlertDescription>
                  Unable to load Title Defense panel candidates.
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => refetchCandidates()}
                  >
                    Try again
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {!candidatesLoading &&
              !candidatesError &&
              (candidatesData?.candidates.length ?? 0) === 0 && (
                <p className="text-sm text-(--earist-body-text)">
                  No eligible Title Defense panel member is currently available
                  for adviser selection.
                </p>
              )}

            <div className="grid gap-3 sm:grid-cols-2">
              {(candidatesData?.candidates ?? []).map((c) => {
                const selected = selectedUserId === c.userId;
                return (
                  <button
                    key={c.userId}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelectedUserId(c.userId)}
                    className={`rounded-lg border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-(--earist-primary) ${
                      selected
                        ? "border-(--earist-primary) bg-(--earist-surface-light-red) ring-1 ring-(--earist-primary)"
                        : "border-(--earist-border-gray) hover:bg-(--earist-surface-gray)"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-(--earist-primary)">
                          {c.name}
                        </p>
                        <p className="text-xs text-(--earist-body-text)">
                          {roleLabel(c.defenseRole)} — Title Defense
                        </p>
                      </div>
                      <Badge variant={selected ? "default" : "outline"}>
                        {selected ? "Selected" : "Select"}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-(--earist-body-text)">
                      <p>Specialization: {c.specialization || "—"}</p>
                      <p>Office: {c.officeAffiliation || "—"}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-medium text-(--earist-body-text)"
                htmlFor="request-remarks"
              >
                Request Reason (Optional)
              </label>
              <Textarea
                id="request-remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Brief note for the requested adviser"
                rows={3}
              />
            </div>

            <Button
              type="button"
              disabled={!selectedUserId || createRequest.isPending}
              onClick={openSigning}
              className="w-full bg-(--earist-primary) hover:bg-(--earist-primary)/90 sm:w-auto"
            >
              <Send className="mr-2 h-4 w-4" />
              Review &amp; Sign Adviser Request
            </Button>
          </CardContent>
        </Card>
      )}

      {uiState !== "LOADING" && uiState !== "ERROR" && (
        <AdviserRequestRecords audience="student" />
      )}

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!open) closeSigning();
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Review &amp; Sign Adviser Request (GS-020)</DialogTitle>
            <DialogDescription>
              Your signature confirms this exact adviser request. Once submitted,
              these details cannot be changed.
            </DialogDescription>
          </DialogHeader>
          {review && (
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-(--earist-body-text)">Student: </span>
                <span className="font-medium">
                  {review.reviewedContext.studentName}
                </span>
              </p>
              <p>
                <span className="text-(--earist-body-text)">
                  Student Number:{" "}
                </span>
                {review.reviewedContext.studentNumber}
              </p>
              <p>
                <span className="text-(--earist-body-text)">Program: </span>
                {review.reviewedContext.programName}
              </p>
              <p>
                <span className="text-(--earist-body-text)">
                  Requested Adviser:{" "}
                </span>
                <span className="font-medium">
                  {review.reviewedContext.requestedAdviserName}
                </span>
              </p>
              <p className="whitespace-pre-wrap break-words">
                <span className="text-(--earist-body-text)">Reason: </span>
                {review.reason || "No reason provided."}
              </p>
            </div>
          )}
          {confirmOpen && review && (
            <ESignaturePad
              value={signature}
              onChange={setSignature}
              disabled={createRequest.isPending}
              autoFocus
              readyText="Signature ready for this adviser request."
              requiredText="Sign before submitting your adviser request."
            />
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeSigning}
              disabled={createRequest.isPending}
            >
              Go Back
            </Button>
            <Button
              type="button"
              disabled={
                createRequest.isPending ||
                !adviserRequestSigningReady(review, signature)
              }
              onClick={() => createRequest.mutate()}
              className="bg-(--earist-primary) hover:bg-(--earist-primary)/90"
            >
              <Send className="mr-2 h-4 w-4" />
              {createRequest.isPending
                ? "Submitting…"
                : "Sign & Submit Adviser Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
