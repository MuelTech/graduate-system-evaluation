import { isExamMediaId } from "./exam-content";
import { EXAM_MEDIA_ASSET_MAP } from "./evaluation-mock/applicant-exam-questions";

interface ImageRequest {
  baseUrl: string | (() => string);
  mediaId: string;
  applicationId?: string | null;
  token: string;
  onLoad: (url: string) => void;
  onError: (message: string) => void;
  onSessionExpired: () => void;
  fetcher?: typeof fetch;
  urls?: Pick<typeof URL, "createObjectURL" | "revokeObjectURL">;
}

/** Effect-owned request: resolves static OLSAT exam assets instantaneously in evaluation mode, or falls back to fetch. */
export function startExamImageRequest(request: ImageRequest): () => void {
  const controller = new AbortController();
  const urls = request.urls ?? URL;
  let disposed = false;
  let objectUrl: string | null = null;

  // Fast static resolution for all 108 OLSAT stimulus & option figures
  const staticAssetUrl = EXAM_MEDIA_ASSET_MAP[request.mediaId];
  if (staticAssetUrl) {
    queueMicrotask(() => {
      if (!disposed) {
        request.onLoad(staticAssetUrl);
      }
    });
    return () => {
      disposed = true;
      controller.abort();
    };
  }

  void (async () => {
    try {
      if (!isExamMediaId(request.mediaId) || !request.token)
        throw new Error("Unavailable");
      const baseUrl =
        typeof request.baseUrl === "function"
          ? request.baseUrl()
          : request.baseUrl;
      const response = await (request.fetcher ?? fetch)(
        `${baseUrl}/api/exam-engine/media/${request.mediaId}${request.applicationId ? `?applicationId=${encodeURIComponent(request.applicationId)}` : ""}`,
        {
          headers: { Authorization: `Bearer ${request.token}` },
          signal: controller.signal,
          cache: "no-store",
        },
      );
      if (disposed) return;
      if (response.status === 401 || response.status === 403) {
        request.onSessionExpired();
        throw new Error("Unavailable");
      }
      const mime = response.headers.get("Content-Type")?.split(";")[0].trim();
      if (!response.ok || (mime !== "image/png" && mime !== "image/jpeg"))
        throw new Error("Unavailable");
      const blob = await response.blob();
      if (disposed) return;
      if (!blob.size || blob.size > 5 * 1024 * 1024 || blob.type !== mime)
        throw new Error("Unavailable");
      objectUrl = urls.createObjectURL(blob);
      request.onLoad(objectUrl);
    } catch {
      if (!disposed)
        request.onError("Image unavailable. Try again or check your session.");
    }
  })();

  return () => {
    disposed = true;
    controller.abort();
    if (objectUrl) {
      urls.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
  };
}
