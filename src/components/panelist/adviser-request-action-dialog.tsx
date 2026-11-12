"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClientRequest, ApiError } from "@/lib/api.client";
import {
  panelistAdviserRequestsQueryKey,
  type PanelistAdviserRequestDto,
} from "@/lib/panelist-adviser-requests";
import { adviserWorkspaceQueryKey } from "@/lib/adviser-workspace";
import { panelistDashboardQueryKey } from "@/lib/panelist-dashboard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export type AdviserRequestDecision = "CONFORMED" | "DECLINED";

/**
 * ADV-6 — one shared Thesis Adviser Request response surface for My Advisees.
 */
export function AdviserRequestActionDialog({
  request,
  decision,
  onClose,
}: {
  request: PanelistAdviserRequestDto | null;
  decision: AdviserRequestDecision | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState<string | null>(null);
  const open = request !== null && decision !== null;

  const respond = useMutation({
    mutationFn: async () => {
      if (!request || !decision) throw new Error("No request selected.");
      return apiClientRequest(
        `/thesis/adviser/requests/${request.id}/adviser-response`,
        {
          method: "POST",
          body: JSON.stringify({
            decision,
            remarks: remarks.trim() ? remarks.trim() : undefined,
          }),
        },
      );
    },
    onSuccess: async () => {
      setError(null);
      toast.success(
        decision === "CONFORMED"
          ? "Adviser request accepted and forwarded for Dean approval."
          : "Adviser request declined.",
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adviserWorkspaceQueryKey }),
        queryClient.invalidateQueries({
          queryKey: panelistAdviserRequestsQueryKey,
        }),
        queryClient.invalidateQueries({ queryKey: panelistDashboardQueryKey }),
      ]);
      onClose();
    },
    onError: async (mutationError: Error) => {
      const msg = mutationError.message || "Unable to record your response.";
      setError(msg);
      toast.error(msg);
      // Authoritative refresh only; never auto-retry the transition.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adviserWorkspaceQueryKey }),
        queryClient.invalidateQueries({
          queryKey: panelistAdviserRequestsQueryKey,
        }),
      ]);
      if (mutationError instanceof ApiError && mutationError.statusCode === 409) {
        queryClient.invalidateQueries({ queryKey: panelistDashboardQueryKey });
      }
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !respond.isPending) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {decision === "CONFORMED"
              ? "Accept Adviser Request?"
              : "Decline Adviser Request?"}
          </DialogTitle>
          <DialogDescription>
            {decision === "CONFORMED"
              ? "After you accept, this request will be forwarded for Dean review. You are not yet the officially assigned adviser until Dean approval."
              : "No adviser assignment will be created. The student may submit another valid adviser request."}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2">
          <label
            className="text-xs font-medium text-[#333333]"
            htmlFor="adviser-response-remarks"
          >
            Response Remarks (Optional)
          </label>
          <Textarea
            id="adviser-response-remarks"
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
            rows={3}
            placeholder="Optional note for the student"
            disabled={respond.isPending}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={respond.isPending}
          >
            Go Back
          </Button>
          <Button
            type="button"
            disabled={respond.isPending}
            onClick={() => respond.mutate()}
            className={
              decision === "DECLINED"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-[#e02b20] text-white hover:bg-[#e02b20]/90"
            }
          >
            {decision === "CONFORMED" ? (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            ) : (
              <XCircle className="mr-2 h-4 w-4" />
            )}
            {respond.isPending
              ? "Saving…"
              : decision === "CONFORMED"
                ? "Accept Request"
                : "Decline Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
