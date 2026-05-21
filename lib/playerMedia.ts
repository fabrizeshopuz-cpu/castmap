import type { MediaAsset } from "@/types/media";

export function publicRequestOrigin(request: Request) {
  const configured = process.env.PUBLIC_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host")?.split(",")[0]?.trim();
  if (host) {
    const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const protocol = forwardedProto || new URL(request.url).protocol.replace(":", "") || "https";
    return `${protocol}://${host}`.replace(/\/$/, "");
  }

  return new URL(request.url).origin.replace(/\/$/, "");
}

export function mediaPublicUrl(asset: MediaAsset | undefined, origin: string) {
  const url = asset?.fileUrl || asset?.cdnUrl || "";
  if (!url) return "";
  if (/^(https?:|data:|about:)/i.test(url)) return url;
  return `${origin.replace(/\/$/, "")}/${url.replace(/^\/+/, "")}`;
}

export function playerMediaType(asset: MediaAsset | undefined) {
  if (asset?.type === "image") return "IMAGE";
  if (asset?.type === "web") return "WEB_URL";
  if (asset?.type === "html") return "HTML";
  return "VIDEO";
}

export function tvMediaKind(asset: MediaAsset | undefined) {
  if (asset?.type === "image") return "Rasm";
  if (asset?.type === "web") return "Web";
  if (asset?.type === "html") return "HTML";
  return "Video";
}

export function mediaMime(asset: MediaAsset | undefined) {
  if (asset?.type === "image") return "image/jpeg";
  if (asset?.type === "web" || asset?.type === "html") return "text/html";
  return "video/mp4";
}

export function playlistDurationMs(durationSeconds: number | undefined) {
  const seconds = Number.isFinite(durationSeconds) ? Number(durationSeconds) : 10;
  return Math.max(5, seconds) * 1000;
}

export function tvDuration(durationSeconds: number | undefined) {
  const seconds = Math.max(5, Number.isFinite(durationSeconds) ? Number(durationSeconds) : 10);
  return `00:00:${String(seconds).padStart(2, "0")}`;
}

export function playableMediaAssets(media: MediaAsset[]) {
  return [...media]
    .filter((asset) => asset.fileUrl && !["archived", "expired", "failed"].includes(asset.status))
    .sort((a, b) => String(b.uploadedAt || "").localeCompare(String(a.uploadedAt || "")));
}

export function fallbackDurationSeconds(asset: MediaAsset | undefined) {
  if (asset?.type === "video") return 20;
  if (asset?.type === "web" || asset?.type === "html") return 30;
  return 10;
}
