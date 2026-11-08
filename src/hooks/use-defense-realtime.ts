"use client";

import { useCallback, useRef, useState } from "react";
import type { LiveReportPreview } from "@/lib/realtime/report-preview";
import {
  normalizeReportDocument,
  type ReportDocument,
} from "@/lib/report/report-document";

export interface UseDefenseRealtimeOptions {
  scheduleId: string;
  sessionStatus: string | null | undefined;
  documentId?: string | null;
}

export interface SendReportPreviewInput {
  baseBodyVersion: number;
  body: ReportDocument;
}

export interface UseDefenseRealtimeResult {
  sendReportPreview: (input: SendReportPreviewInput) => void;
  liveReportPreview: LiveReportPreview | null;
}

/**
 * Simulated local realtime bus for Evaluation Mode (zero Socket.IO dependency).
 */
export function useDefenseRealtime({
  scheduleId,
}: UseDefenseRealtimeOptions): UseDefenseRealtimeResult {
  const previewSeqRef = useRef(0);
  const [liveReportPreview, setLiveReportPreview] =
    useState<LiveReportPreview | null>(null);

  const sendReportPreview = useCallback(
    (input: SendReportPreviewInput) => {
      previewSeqRef.current += 1;
      setLiveReportPreview({
        scheduleId,
        baseBodyVersion: input.baseBodyVersion,
        previewSequence: previewSeqRef.current,
        senderUserId: "panelist-eval-01",
        body: normalizeReportDocument(input.body),
      });
    },
    [scheduleId],
  );

  return { sendReportPreview, liveReportPreview };
}
