"use client";

import { Copy, ExternalLink, RefreshCw, Router, Unplug, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { IntegrationGuide } from "@/components/integrations/IntegrationGuide";
import { IntegrationLogs } from "@/components/integrations/IntegrationLogs";
import type { Device, Playlist } from "@/types";
import type { Integration, IntegrationLog, IntegrationWidget, RemoteSession } from "@/types/integrations";

export function IntegrationDetailDrawer({
  integration,
  widgets,
  logs,
  devices,
  playlists,
  remoteSessions,
  open,
  onClose,
  onSync,
  onTest,
  onDisconnect,
  onCreateWidget,
  onAddToPlaylist,
  onRemoteSession,
}: {
  integration: Integration | null;
  widgets: IntegrationWidget[];
  logs: IntegrationLog[];
  devices: Device[];
  playlists: Playlist[];
  remoteSessions: RemoteSession[];
  open: boolean;
  onClose: () => void;
  onSync: () => void;
  onTest: () => void;
  onDisconnect: () => void;
  onCreateWidget: () => void;
  onAddToPlaylist: (widget: IntegrationWidget) => void;
  onRemoteSession: (deviceId: string, address?: string) => void;
}) {
  if (!integration) return null;
  const webhookUrl = integration.type === "pos_webhook"
    ? `https://castmap.uz/api/webhooks/pos/${integration.id}`
    : integration.type === "telegram"
      ? "https://castmap.uz/api/webhooks/telegram"
      : "https://castmap.uz/api/webhooks/custom";

  return (
    <Drawer open={open} title={integration.name} onClose={onClose}>
      <div className="grid gap-5">
        <div className="flex items-center justify-between gap-3">
          <Badge tone={integration.status === "connected" ? "green" : integration.status === "error" ? "red" : "orange"}>{integration.status}</Badge>
          <button className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/[0.06] text-castMuted hover:text-white" type="button" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur">
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-castGold">Config</h3>
          <div className="mt-3 grid gap-2 text-sm text-castMuted">
            {Object.entries(integration.config || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-3 border-b border-white/10 pb-2 last:border-0">
                <span>{key}</span>
                <b className="max-w-[60%] text-right text-white [overflow-wrap:anywhere]">{String(value)}</b>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="gold" onClick={onSync}><RefreshCw className="h-4 w-4" />Sync now</Button>
          <Button onClick={onTest}>Test qilish</Button>
          <Button onClick={onCreateWidget}>Widget yaratish</Button>
          <Button variant="danger" onClick={onDisconnect}><Unplug className="h-4 w-4" />Disconnect</Button>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur">
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-castGold">Webhook / API</h3>
          <code className="mt-3 block rounded-xl border border-white/10 bg-[#020617]/60 p-3 text-xs text-castGold [overflow-wrap:anywhere]">{webhookUrl}</code>
          <div className="mt-3 flex gap-2">
            <Button onClick={() => navigator.clipboard?.writeText(webhookUrl)}><Copy className="h-4 w-4" />Copy webhook URL</Button>
            <Button onClick={() => navigator.clipboard?.writeText("castmap_mock_secret")}><Copy className="h-4 w-4" />Copy API key</Button>
          </div>
        </section>

        {integration.type === "anydesk" ? (
          <section className="rounded-2xl border border-castGold/25 bg-castGold/10 p-4">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-castGold">Remote support</h3>
            <div className="mt-3 grid gap-2">
              {devices.slice(0, 3).map((device) => {
                const mapping = (integration.config.deviceMappings as Array<{ deviceId: string; address: string }> | undefined)?.find((item) => item.deviceId === device.id);
                const address = mapping?.address || "123 456 789";
                return (
                  <div key={device.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3">
                    <div>
                      <b className="text-white">{device.name}</b>
                      <p className="text-xs text-castMuted">AnyDesk: {address}</p>
                    </div>
                    <Button onClick={() => onRemoteSession(device.id, address)}><ExternalLink className="h-4 w-4" />Remote session</Button>
                  </div>
                );
              })}
            </div>
            {remoteSessions.length ? <p className="mt-3 text-xs text-castMuted">Last session: {remoteSessions[0].sessionUrl}</p> : null}
          </section>
        ) : null}

        <section>
          <h3 className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-castGold">Widgets</h3>
          <div className="grid gap-2">
            {widgets.length ? widgets.map((widget) => (
              <div key={widget.id} className="rounded-xl border border-white/10 bg-white/[0.055] p-3 backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <b className="text-white">{widget.name}</b>
                    <p className="text-xs text-castMuted">{widget.type} / {String(widget.config.layout || "fullscreen")}</p>
                  </div>
                  <Button onClick={() => onAddToPlaylist(widget)}><Router className="h-4 w-4" />Playlistga qo'shish</Button>
                </div>
              </div>
            )) : <p className="text-sm text-castMuted">Widget hali yaratilmagan.</p>}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-castGold">Qo'llanma</h3>
          <IntegrationGuide type={integration.type} />
        </section>

        <section>
          <h3 className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-castGold">Logs</h3>
          <IntegrationLogs logs={logs} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-sm text-castMuted">
          Connected playlists: {playlists.filter((playlist) => playlist.items.some((item) => widgets.some((widget) => widget.id === item.integrationWidgetId))).length}
        </section>
      </div>
    </Drawer>
  );
}
