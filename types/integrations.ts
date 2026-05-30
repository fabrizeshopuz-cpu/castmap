export type IntegrationType =
  | "google_sheets"
  | "telegram"
  | "instagram"
  | "youtube"
  | "weather"
  | "rss"
  | "web_url"
  | "anydesk"
  | "google_drive"
  | "canva"
  | "custom_api"
  | "pos_webhook";

export type IntegrationStatus =
  | "connected"
  | "disconnected"
  | "error"
  | "syncing"
  | "requires_auth";

export type IntegrationCategory =
  | "content"
  | "live"
  | "data"
  | "remote"
  | "marketing"
  | "security";

export type WidgetLayout = "fullscreen" | "ticker" | "split" | "card" | "bottom_ticker" | "right_panel";

export interface Integration {
  id: string;
  organizationId?: string;
  type: IntegrationType;
  name: string;
  status: IntegrationStatus;
  description: string;
  category?: IntegrationCategory;
  config: Record<string, unknown>;
  credentials?: Record<string, unknown>;
  lastSyncAt?: string;
  lastError?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IntegrationWidget {
  id: string;
  integrationId: string;
  organizationId?: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  previewData?: unknown;
  status: "active" | "inactive" | "error";
  createdAt?: string;
  updatedAt?: string;
}

export interface IntegrationLog {
  id: string;
  integrationId: string;
  level: "info" | "warning" | "error" | "success";
  message: string;
  payload?: unknown;
  createdAt: string;
}

export interface RemoteSession {
  id: string;
  deviceId: string;
  provider: "anydesk" | "castmap_agent";
  remoteAddress?: string;
  sessionUrl?: string;
  status: "pending" | "active" | "ended" | "failed";
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
}

export interface IntegrationCatalogItem {
  type: IntegrationType;
  name: string;
  description: string;
  category: IntegrationCategory;
  guideKey: IntegrationType;
}

export interface PlayerIntegrationItem {
  id: string;
  type: "integration_widget";
  widgetType: IntegrationType;
  duration: number;
  layout: WidgetLayout;
  data: unknown;
  refreshInterval: number;
}
