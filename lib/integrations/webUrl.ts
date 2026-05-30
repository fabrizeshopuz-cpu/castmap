import { z } from "zod";

export const webUrlConfigSchema = z.object({
  url: z.string().url().refine((value) => value.startsWith("https://"), "Faqat https URL ruxsat etiladi"),
  displayMode: z.enum(["fullscreen", "widget_card", "split_screen"]).default("fullscreen"),
  refreshInterval: z.coerce.number().default(600),
  zoom: z.coerce.number().min(0.5).max(2).default(1),
  autoReload: z.boolean().default(true),
  allowedDomains: z.array(z.string()).default([]),
});

export function validateWebUrlConfig(config: unknown) {
  return webUrlConfigSchema.safeParse(config);
}

export function createWebUrlWidget(config: Record<string, unknown>) {
  return {
    type: "web_url",
    url: String(config.url || "https://castmap.uz"),
    displayMode: config.displayMode || "fullscreen",
    refreshInterval: Number(config.refreshInterval || 600),
    zoom: Number(config.zoom || 1),
    sandbox: "allow-scripts allow-same-origin",
  };
}
