export function parseYouTubeUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return { videoId: parsed.pathname.slice(1), kind: "video" };
    if (parsed.pathname.includes("/live")) return { channel: parsed.pathname.split("/")[1] || "", kind: "live" };
    return { videoId: parsed.searchParams.get("v") || "", kind: "video" };
  } catch {
    return { videoId: "", kind: "invalid" };
  }
}

export function getEmbedUrl(url: string) {
  const parsed = parseYouTubeUrl(url);
  if (parsed.videoId) return `https://www.youtube.com/embed/${parsed.videoId}?autoplay=1&mute=1&playsinline=1`;
  if (parsed.kind === "live") return url.replace("/live", "/live_stream?autoplay=1&mute=1");
  return url;
}

export function createYouTubeWidget(config: Record<string, unknown>) {
  const url = String(config.url || "https://www.youtube.com/@castmap/live");
  return {
    type: "youtube",
    displayStyle: "webview",
    embedUrl: getEmbedUrl(url),
    autoplay: config.autoplay !== false,
    mute: config.mute !== false,
    fallbackMediaId: config.fallbackMediaId || null,
  };
}
