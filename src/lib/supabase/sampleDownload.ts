import { supabase } from "./client";

/**
 * In dev, call `/functions/v1/...` on the Vite dev server so requests are same-origin and avoid
 * browser CORS until the Edge Function returns proper Access-Control-* headers.
 * In production builds, use the full Supabase project URL (CORS must be enabled on the function).
 *
 * Edge Function should handle OPTIONS and include e.g.:
 *   Access-Control-Allow-Origin: *  (or your app origin)
 *   Access-Control-Allow-Headers: authorization, apikey, content-type, x-client-info
 */
function requestSampleDownloadUrl(): string {
  const path = "/functions/v1/request-sample-download";
  if (import.meta.env.DEV) {
    return path;
  }
  const base = import.meta.env.VITE_SUPABASE_URL!.replace(/\/$/, "");
  return `${base}${path}`;
}

export type RequestSampleDownloadSuccess = {
  signedUrl: string;
  expiresAt: string;
  filename: string;
  creditsCharged: number;
  replay: boolean;
};

export class SampleDownloadError extends Error {
  constructor(
    public readonly httpStatus: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = "SampleDownloadError";
  }
}

export function getSampleDownloadErrorMessage(code: string): string {
  switch (code) {
    case "not_authenticated":
      return "Please sign in to download.";
    case "insufficient_credits":
      return "Not enough credits to download this sample.";
    case "customer_not_found":
      return "Account not found. Please contact support.";
    case "forbidden":
      return "This sample requires an active subscription.";
    case "sample_not_found":
      return "This sample is no longer available.";
    case "idempotency_conflict":
      return "Download conflict. Please try again.";
    case "asset_unavailable":
      return "Download is temporarily unavailable. Please try again later.";
    case "bad_request":
      return "Invalid download request.";
    default:
      return "Download failed. Please try again.";
  }
}

/**
 * POST request-sample-download. Uses the current session access token.
 * Pass the same idempotencyKey only when retrying the same user action after a network/5xx failure.
 */
export async function requestSampleDownload(
  sampleId: string,
  options?: { idempotencyKey?: string }
): Promise<RequestSampleDownloadSuccess> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new SampleDownloadError(
      401,
      "not_authenticated",
      "Please sign in to download."
    );
  }

  const url = requestSampleDownloadUrl();
  const body: { sampleId: string; idempotencyKey?: string } = { sampleId };
  if (options?.idempotencyKey) {
    body.idempotencyKey = options.idempotencyKey;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;

  if (!res.ok) {
    const code = typeof json.code === "string" ? json.code : "server_error";
    const message =
      typeof json.message === "string" ? json.message : res.statusText;
    throw new SampleDownloadError(res.status, code, message);
  }

  return json as RequestSampleDownloadSuccess;
}

/** Best-effort browser download using suggested filename. */
export async function triggerSignedDownload(
  signedUrl: string,
  filename: string
): Promise<void> {
  try {
    const fileRes = await fetch(signedUrl);
    if (!fileRes.ok) {
      throw new Error(`HTTP ${fileRes.status}`);
    }
    const blob = await fileRes.blob();
    const objectUrl = URL.createObjectURL(blob);
    try {
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    window.open(signedUrl, "_blank", "noopener,noreferrer");
  }
}

function isRetryableDownloadError(err: unknown): boolean {
  if (err instanceof SampleDownloadError) {
    return err.httpStatus >= 500;
  }
  return true;
}

/**
 * One user click: new idempotency key; on retryable failure, one repeat with the same key.
 */
export async function requestSampleDownloadWithRetry(
  sampleId: string
): Promise<RequestSampleDownloadSuccess> {
  const idempotencyKey = crypto.randomUUID();
  try {
    return await requestSampleDownload(sampleId, { idempotencyKey });
  } catch (first) {
    if (!isRetryableDownloadError(first)) {
      throw first;
    }
    return await requestSampleDownload(sampleId, { idempotencyKey });
  }
}
