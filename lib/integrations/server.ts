import { updateCastmapState, readCastmapState } from "@/lib/serverState";
import { integrationCatalog } from "@/lib/integrations/mockData";
import { fetchGoogleSheetData, transformSheetToWidget } from "@/lib/integrations/googleSheets";
import { createTelegramWidgetContent, parseTelegramMessage } from "@/lib/integrations/telegram";
import { fetchInstagramMedia, transformInstagramFeedToWidget } from "@/lib/integrations/instagram";
import { createYouTubeWidget } from "@/lib/integrations/youtube";
import { createWebUrlWidget } from "@/lib/integrations/webUrl";
import { fetchWeather } from "@/lib/integrations/weather";
import { fetchRssFeed } from "@/lib/integrations/rss";
import { createRemoteSession } from "@/lib/integrations/anydesk";
import { fetchCustomApiData, mapJsonToWidget } from "@/lib/integrations/customApi";
import { uid } from "@/lib/utils";
import type { Integration, IntegrationLog, IntegrationStatus, IntegrationType, IntegrationWidget, RemoteSession, WidgetLayout } from "@/types/integrations";

const organizationId = "org-castmap-demo";

export async function listIntegrations() {
  const state = await readCastmapState();
  return {
    catalog: integrationCatalog,
    integrations: state.integrations,
    widgets: state.integrationWidgets,
    logs: state.integrationLogs,
    remoteSessions: state.remoteSessions,
  };
}

export async function getIntegration(id: string) {
  const state = await readCastmapState();
  return {
    integration: state.integrations.find((item) => item.id === id) || null,
    widgets: state.integrationWidgets.filter((item) => item.integrationId === id),
    logs: state.integrationLogs.filter((item) => item.integrationId === id),
  };
}

export async function createIntegration(input: Partial<Integration> & { type: IntegrationType }) {
  const catalogItem = integrationCatalog.find((item) => item.type === input.type);
  const now = new Date().toISOString();
  const integration: Integration = {
    id: input.id || uid("int"),
    organizationId,
    type: input.type,
    name: input.name?.trim() || catalogItem?.name || "Yangi integratsiya",
    status: input.status || "connected",
    description: input.description || catalogItem?.description || "CASTMAP integratsiyasi",
    category: input.category || catalogItem?.category,
    config: input.config || defaultConfig(input.type),
    credentials: maskCredentials(input.credentials),
    lastSyncAt: "Hozir",
    createdAt: now,
    updatedAt: now,
  };
  const state = await updateCastmapState((draft) => {
    draft.integrations = [integration, ...draft.integrations.filter((item) => item.id !== integration.id)];
    draft.integrationLogs = [log(integration.id, "success", `${integration.name} ulandi`, integration.config), ...draft.integrationLogs].slice(0, 200);
  });
  return { integration, state };
}

export async function patchIntegration(id: string, patch: Partial<Integration>) {
  let updated: Integration | null = null;
  await updateCastmapState((state) => {
    state.integrations = state.integrations.map((item) => {
      if (item.id !== id) return item;
      updated = { ...item, ...patch, credentials: maskCredentials(patch.credentials) || item.credentials, updatedAt: new Date().toISOString() };
      return updated;
    });
    state.integrationLogs = [log(id, "info", "Integratsiya sozlamalari yangilandi", patch.config), ...state.integrationLogs].slice(0, 200);
  });
  return updated;
}

export async function deleteIntegration(id: string) {
  await updateCastmapState((state) => {
    state.integrations = state.integrations.filter((item) => item.id !== id);
    state.integrationWidgets = state.integrationWidgets.filter((item) => item.integrationId !== id);
    state.integrationLogs = [log(id, "warning", "Integratsiya o'chirildi"), ...state.integrationLogs.filter((item) => item.integrationId !== id)].slice(0, 200);
  });
  return { ok: true };
}

export async function testIntegration(id: string) {
  let integration: Integration | undefined;
  await updateCastmapState((state) => {
    integration = state.integrations.find((item) => item.id === id);
    const hasError = integration?.status === "error";
    state.integrations = state.integrations.map((item) => item.id === id ? { ...item, status: hasError ? "error" : "connected", lastError: hasError ? item.lastError || "Mock test error" : undefined } : item);
    state.integrationLogs = [log(id, hasError ? "error" : "success", hasError ? "Test xatolik bilan tugadi" : "Mock API test muvaffaqiyatli"), ...state.integrationLogs].slice(0, 200);
  });
  return { ok: integration?.status !== "error", integrationId: id };
}

export async function syncIntegration(id: string) {
  const state = await readCastmapState();
  const integration = state.integrations.find((item) => item.id === id);
  if (!integration) return null;
  const previewData = await previewForIntegration(integration);
  await updateCastmapState((draft) => {
    draft.integrations = draft.integrations.map((item) => item.id === id ? { ...item, status: "connected", lastSyncAt: "Hozir", lastError: undefined, updatedAt: new Date().toISOString() } : item);
    draft.integrationWidgets = draft.integrationWidgets.map((widget) => widget.integrationId === id ? { ...widget, previewData, updatedAt: new Date().toISOString() } : widget);
    draft.integrationLogs = [log(id, "success", "Sync now bajarildi", previewData), ...draft.integrationLogs].slice(0, 200);
  });
  return { ok: true, previewData };
}

export async function createWidget(input: { integrationId: string; name?: string; type?: string; config?: Record<string, unknown> }) {
  const state = await readCastmapState();
  const integration = state.integrations.find((item) => item.id === input.integrationId);
  if (!integration) return null;
  const now = new Date().toISOString();
  const widget: IntegrationWidget = {
    id: uid("iwidget"),
    organizationId,
    integrationId: integration.id,
    name: input.name?.trim() || `${integration.name} widget`,
    type: input.type || integration.type,
    config: { duration: 20, layout: "fullscreen", refreshInterval: 300, ...(input.config || {}) },
    previewData: await previewForIntegration({ ...integration, config: { ...integration.config, ...(input.config || {}) } }),
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
  await updateCastmapState((draft) => {
    draft.integrationWidgets = [widget, ...draft.integrationWidgets];
    draft.integrationLogs = [log(integration.id, "success", `${widget.name} widget yaratildi`), ...draft.integrationLogs].slice(0, 200);
  });
  return widget;
}

export async function patchWidget(id: string, patch: Partial<IntegrationWidget>) {
  let updated: IntegrationWidget | null = null;
  await updateCastmapState((state) => {
    state.integrationWidgets = state.integrationWidgets.map((widget) => {
      if (widget.id !== id) return widget;
      updated = { ...widget, ...patch, updatedAt: new Date().toISOString() };
      return updated;
    });
  });
  return updated;
}

export async function deleteWidget(id: string) {
  await updateCastmapState((state) => {
    state.integrationWidgets = state.integrationWidgets.filter((widget) => widget.id !== id);
    state.playlists = state.playlists.map((playlist) => ({ ...playlist, items: playlist.items.filter((item) => item.integrationWidgetId !== id) }));
  });
  return { ok: true };
}

export async function addWidgetToPlaylist(widgetId: string, playlistId: string, options: { duration?: number; layout?: WidgetLayout } = {}) {
  await updateCastmapState((state) => {
    const widget = state.integrationWidgets.find((item) => item.id === widgetId);
    if (!widget) return;
    state.playlists = state.playlists.map((playlist) => {
      if (playlist.id !== playlistId || playlist.items.some((item) => item.integrationWidgetId === widgetId)) return playlist;
      return {
        ...playlist,
        items: [...playlist.items, {
          id: uid("item"),
          type: "integration_widget",
          mediaId: "",
          integrationWidgetId: widgetId,
          duration: options.duration || Number(widget.config.duration || 20),
          layout: options.layout || widget.config.layout as WidgetLayout || "fullscreen",
          transition: "fade",
          order: playlist.items.length + 1,
          priority: 1,
          status: "active",
        }],
        updatedAt: new Date().toISOString(),
      };
    });
  });
  return { ok: true };
}

export async function handleTelegramWebhook(update: Record<string, unknown>) {
  const message = parseTelegramMessage(update);
  await updateCastmapState((state) => {
    const integration = state.integrations.find((item) => item.type === "telegram");
    if (!integration) return;
    state.integrationWidgets = state.integrationWidgets.map((widget) => widget.integrationId === integration.id ? {
      ...widget,
      previewData: { messages: [message, ...((widget.previewData as { messages?: unknown[] } | undefined)?.messages || [])].slice(0, 8) },
      updatedAt: new Date().toISOString(),
    } : widget);
    state.integrationLogs = [log(integration.id, "success", "Telegram webhook update qabul qilindi", message), ...state.integrationLogs].slice(0, 200);
  });
  return { ok: true, message };
}

export async function handlePosWebhook(integrationId: string | null, event: Record<string, unknown>) {
  await updateCastmapState((state) => {
    const integration = state.integrations.find((item) => item.id === integrationId || item.type === "pos_webhook");
    if (!integration) return;
    state.integrationLogs = [log(integration.id, "success", "POS webhook event qabul qilindi", event), ...state.integrationLogs].slice(0, 200);
    state.integrationWidgets = state.integrationWidgets.map((widget) => widget.integrationId === integration.id ? { ...widget, previewData: event, updatedAt: new Date().toISOString() } : widget);
  });
  return { ok: true };
}

export async function createAnyDeskSession(deviceId: string, remoteAddress?: string) {
  const session = createRemoteSession(deviceId, remoteAddress) as RemoteSession;
  await updateCastmapState((state) => {
    state.remoteSessions = [session, ...state.remoteSessions].slice(0, 100);
  });
  return session;
}

export async function playerWidgetsForDevice(deviceId: string) {
  const state = await readCastmapState();
  const playlist = state.playlists.find((item) => item.deviceIds?.includes(deviceId) || item.status === "published") || state.playlists[0];
  const orderedWidgetIds = (playlist?.items || []).map((item) => item.integrationWidgetId).filter(Boolean) as string[];
  const widgetIds = new Set(orderedWidgetIds);
  const order = new Map(orderedWidgetIds.map((id, index) => [id, index]));
  return state.integrationWidgets
    .filter((widget) => widget.status === "active" && (!widgetIds.size || widgetIds.has(widget.id)))
    .sort((left, right) => (order.get(left.id) ?? 999) - (order.get(right.id) ?? 999));
}

export async function playerIntegrationContent(widgetId: string) {
  const state = await readCastmapState();
  const widget = state.integrationWidgets.find((item) => item.id === widgetId);
  if (!widget) return null;
  return toPlayerWidget(widget);
}

export function toPlayerWidget(widget: IntegrationWidget) {
  return {
    id: widget.id,
    type: "integration_widget",
    widgetType: widget.type,
    duration: Number(widget.config.duration || 20),
    layout: widget.config.layout || "fullscreen",
    data: widget.previewData || {},
    refreshInterval: Number(widget.config.refreshInterval || 300),
  };
}

function log(integrationId: string, level: IntegrationLog["level"], message: string, payload?: unknown): IntegrationLog {
  return { id: uid("ilog"), integrationId, level, message, payload, createdAt: new Date().toISOString() };
}

function maskCredentials(credentials?: Record<string, unknown>) {
  if (!credentials) return credentials;
  return Object.fromEntries(Object.entries(credentials).map(([key, value]) => [/token|secret|password|key|json/i.test(key) ? [key, "********"] : [key, value]]));
}

function defaultConfig(type: IntegrationType): Record<string, unknown> {
  if (type === "google_sheets") return { spreadsheetId: "1CASTMAPMOCKSHEET", sheetName: "Menu", range: "A1:D20", refreshInterval: 300, displayStyle: "table", authType: "public_csv" };
  if (type === "telegram") return { channel: "@castmap_demo", contentType: "announcement", refreshMode: "webhook", moderation: "auto_publish" };
  if (type === "anydesk") return { licenseId: "AD-CASTMAP-DEMO", namespace: "castmap", deviceMappings: [{ deviceId: "device-kj8aha-mpgpx88j", address: "123 456 789" }] };
  if (type === "web_url") return { url: "https://castmap.uz", displayMode: "fullscreen", refreshInterval: 600 };
  return { refreshInterval: 300, displayStyle: "card" };
}

async function previewForIntegration(integration: Integration) {
  if (integration.type === "google_sheets") {
    const data = await fetchGoogleSheetData(integration.config);
    return transformSheetToWidget(data, String(integration.config.displayStyle || "table"));
  }
  if (integration.type === "telegram") return createTelegramWidgetContent();
  if (integration.type === "instagram") return transformInstagramFeedToWidget(await fetchInstagramMedia());
  if (integration.type === "youtube") return createYouTubeWidget(integration.config);
  if (integration.type === "weather") return await fetchWeather(integration.config);
  if (integration.type === "rss") return { type: "rss", items: await fetchRssFeed(integration.config) };
  if (integration.type === "web_url") return createWebUrlWidget(integration.config);
  if (integration.type === "custom_api") return mapJsonToWidget(await fetchCustomApiData(integration.config), integration.config);
  if (integration.type === "anydesk") return { address: "123 456 789", status: "online", sessionUrl: "anydesk:123456789" };
  return { ok: true, mode: "mock" };
}
