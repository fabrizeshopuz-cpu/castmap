import type { IntegrationWidget } from "@/types/integrations";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function firstString(...values: unknown[]) {
  return values.find((value) => typeof value === "string" && value.trim()) as string | undefined;
}

export function integrationWidgetPlaybackUrl(widget: IntegrationWidget, origin: string) {
  const data = asRecord(widget.previewData);
  const config = asRecord(widget.config);
  if (widget.type === "web_url") {
    return firstString(data.url, config.url) || `${origin}/player/widget/${encodeURIComponent(widget.id)}`;
  }
  if (widget.type === "youtube" || widget.type === "instagram") {
    return firstString(data.embedUrl, data.url, data.permalink, config.url) || `${origin}/player/widget/${encodeURIComponent(widget.id)}`;
  }
  return `${origin}/player/widget/${encodeURIComponent(widget.id)}`;
}

export function integrationWidgetMime(widget: IntegrationWidget) {
  if (widget.type === "web_url" || widget.type === "youtube" || widget.type === "instagram") return "text/html";
  return "text/html";
}

