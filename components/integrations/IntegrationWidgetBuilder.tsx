"use client";

import { Button } from "@/components/ui/Button";
import type { Integration, IntegrationWidget } from "@/types/integrations";

export function IntegrationWidgetBuilder({
  integrations,
  widgets,
  onCreate,
  onAddToPlaylist,
}: {
  integrations: Integration[];
  widgets: IntegrationWidget[];
  onCreate: (integrationId: string) => void;
  onAddToPlaylist: (widget: IntegrationWidget) => void;
}) {
  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-castGold">Widget builder</p>
          <h2 className="mt-1 text-xl font-black text-white">Integration widgetlar</h2>
          <p className="mt-1 text-sm text-castMuted">Widgetlarni media library, playlist va APK Player payloadiga ulash.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {integrations.filter((item) => item.status === "connected").slice(0, 3).map((integration) => (
            <Button key={integration.id} onClick={() => onCreate(integration.id)}>{integration.name}</Button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {widgets.map((widget) => (
          <article key={widget.id} className="rounded-xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <b className="text-white">{widget.name}</b>
              <span className="rounded-full border border-green-400/25 bg-green-400/10 px-2 py-1 text-xs font-black text-green-200">{widget.status}</span>
            </div>
            <p className="mt-2 text-sm text-castMuted">{widget.type} / {String(widget.config.layout || "fullscreen")}</p>
            <pre className="mt-3 max-h-28 overflow-hidden rounded-lg border border-white/10 bg-[#020617]/60 p-2 text-xs text-castGold">{JSON.stringify(widget.previewData, null, 2)}</pre>
            <Button className="mt-3 w-full" variant="gold" onClick={() => onAddToPlaylist(widget)}>Playlistga qo'shish</Button>
          </article>
        ))}
      </div>
    </section>
  );
}
