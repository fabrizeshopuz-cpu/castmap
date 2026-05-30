"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, Clock, PlugZap, Puzzle, Search } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { IntegrationCatalog } from "@/components/integrations/IntegrationCatalog";
import { IntegrationConnectModal } from "@/components/integrations/IntegrationConnectModal";
import { IntegrationDetailDrawer } from "@/components/integrations/IntegrationDetailDrawer";
import { IntegrationGuide } from "@/components/integrations/IntegrationGuide";
import { IntegrationWidgetBuilder } from "@/components/integrations/IntegrationWidgetBuilder";
import { AddWidgetToPlaylistModal } from "@/components/integrations/AddWidgetToPlaylistModal";
import { integrationCatalog } from "@/lib/integrations/mockData";
import { useIntegrationUiStore } from "@/lib/integrations/uiStore";
import { useCastmapStore } from "@/lib/store";
import type { Integration, IntegrationCatalogItem, IntegrationWidget, WidgetLayout } from "@/types/integrations";

const tabs = [
  ["all", "Barchasi"],
  ["content", "Kontent manbalari"],
  ["live", "Live oqim"],
  ["data", "Jadval va ma'lumotlar"],
  ["remote", "Remote support"],
  ["marketing", "Marketing"],
  ["security", "Xavfsizlik"],
];

export default function IntegrationsPage() {
  const store = useCastmapStore();
  const tab = useIntegrationUiStore((state) => state.activeTab);
  const setTab = useIntegrationUiStore((state) => state.setActiveTab);
  const query = useIntegrationUiStore((state) => state.query);
  const setQuery = useIntegrationUiStore((state) => state.setQuery);
  const [connectItem, setConnectItem] = useState<IntegrationCatalogItem | null>(null);
  const [configureIntegration, setConfigureIntegration] = useState<Integration | undefined>();
  const [detail, setDetail] = useState<Integration | null>(null);
  const [guideItem, setGuideItem] = useState<IntegrationCatalogItem | null>(null);
  const [playlistWidget, setPlaylistWidget] = useState<IntegrationWidget | null>(null);

  const catalog = useMemo(() => {
    const search = query.trim().toLowerCase();
    return integrationCatalog.filter((item) => !search || `${item.name} ${item.description}`.toLowerCase().includes(search));
  }, [query]);

  const errors = store.integrations.filter((item) => item.status === "error").length;
  const connected = store.integrations.filter((item) => item.status === "connected").length;
  const activeWidgets = store.integrationWidgets.filter((item) => item.status === "active").length;
  const lastSync = store.integrations.find((item) => item.lastSyncAt)?.lastSyncAt || "Hali sync yo'q";

  const openConnect = (item: IntegrationCatalogItem, integration?: Integration) => {
    setConnectItem(item);
    setConfigureIntegration(integration);
  };

  const integrationByType = (type: IntegrationCatalogItem["type"]) => store.integrations.find((item) => item.type === type);

  const runTest = (integration?: Integration, item?: IntegrationCatalogItem) => {
    const target = integration || (item ? store.connectIntegration({ type: item.type, name: item.name, description: item.description, category: item.category }) : null);
    if (target) store.testIntegration(target.id);
  };

  return (
    <main className="gradient-background flex min-h-screen text-castText max-lg:flex-col">
      <Sidebar activeLabel="Integratsiyalar" />
      <section className="min-w-0 flex-1">
        <Topbar />
        <div className="grid gap-5 p-7 max-sm:p-4">
          <PageHeader
            kicker="INTEGRATION HUB"
            title="Integratsiyalar"
            subtitle="CASTMAP'ni tashqi servislar, live kontent, jadval, ijtimoiy tarmoqlar va masofaviy boshqaruv tizimlari bilan ulang."
            icon={PlugZap}
            actionLabel="Integration ulash"
            onAction={() => openConnect(integrationCatalog[0], integrationByType("google_sheets"))}
          />

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Metric icon={<PlugZap className="h-5 w-5" />} label="Ulangan integratsiyalar" value={String(connected)} tone="gold" />
            <Metric icon={<Puzzle className="h-5 w-5" />} label="Faol widgetlar" value={String(activeWidgets)} tone="green" />
            <Metric icon={<Clock className="h-5 w-5" />} label="Oxirgi sync" value={lastSync} tone="blue" />
            <Metric icon={<AlertTriangle className="h-5 w-5" />} label="Xatoliklar" value={String(errors)} tone="red" />
          </section>

          <section className="glass-panel rounded-2xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {tabs.map(([id, label]) => (
                  <button
                    key={id}
                    className={`rounded-xl border px-4 py-2 text-sm font-black transition ${tab === id ? "border-castGold/45 bg-castGold/85 text-[#0F172A] shadow-gold" : "border-white/15 bg-white/[0.06] text-castMuted hover:border-castGold/35 hover:text-white"}`}
                    type="button"
                    onClick={() => setTab(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="relative w-[360px] max-w-full">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-castMuted" />
                <input className="glass-input h-11 w-full rounded-xl pl-11 pr-4 text-sm text-white outline-none" value={query} placeholder="Integration qidirish" onChange={(event) => setQuery(event.target.value)} />
              </label>
            </div>
          </section>

          <IntegrationCatalog
            catalog={catalog}
            integrations={store.integrations}
            activeTab={tab}
            onConnect={(item) => openConnect(item, integrationByType(item.type))}
            onConfigure={(item, integration) => integration ? setDetail(integration) : openConnect(item)}
            onTest={(integration, item) => runTest(integration, item)}
            onGuide={setGuideItem}
          />

          <IntegrationWidgetBuilder
            integrations={store.integrations}
            widgets={store.integrationWidgets}
            onCreate={(integrationId) => store.createIntegrationWidget({ integrationId })}
            onAddToPlaylist={setPlaylistWidget}
          />
        </div>
      </section>

      <IntegrationConnectModal
        open={Boolean(connectItem)}
        item={connectItem}
        integration={configureIntegration}
        onClose={() => { setConnectItem(null); setConfigureIntegration(undefined); }}
        onSave={(payload) => {
          if (!connectItem) return;
          if (configureIntegration) store.updateIntegration(configureIntegration.id, payload);
          else store.connectIntegration({ type: connectItem.type, description: connectItem.description, category: connectItem.category, ...payload });
        }}
      />

      <IntegrationDetailDrawer
        open={Boolean(detail)}
        integration={detail}
        widgets={store.integrationWidgets.filter((widget) => widget.integrationId === detail?.id)}
        logs={store.integrationLogs.filter((log) => log.integrationId === detail?.id)}
        devices={store.devices}
        playlists={store.playlists}
        remoteSessions={store.remoteSessions.filter((session) => session.deviceId === store.devices[0]?.id)}
        onClose={() => setDetail(null)}
        onSync={() => detail && store.syncIntegration(detail.id)}
        onTest={() => detail && store.testIntegration(detail.id)}
        onDisconnect={() => detail && store.disconnectIntegration(detail.id)}
        onCreateWidget={() => detail && store.createIntegrationWidget({ integrationId: detail.id })}
        onAddToPlaylist={setPlaylistWidget}
        onRemoteSession={store.openRemoteSession}
      />

      <AddWidgetToPlaylistModal
        open={Boolean(playlistWidget)}
        widget={playlistWidget}
        playlists={store.playlists}
        onClose={() => setPlaylistWidget(null)}
        onSave={(playlistId: string, duration: number, layout: WidgetLayout) => {
          if (playlistWidget) store.addIntegrationWidgetToPlaylist(playlistWidget.id, playlistId, { duration, layout });
          setPlaylistWidget(null);
        }}
      />

      <Modal open={Boolean(guideItem)} title={`${guideItem?.name || ""} qo'llanma`} onClose={() => setGuideItem(null)}>
        {guideItem ? <IntegrationGuide type={guideItem.type} /> : null}
      </Modal>
    </main>
  );
}

function Metric({ icon, label, value, tone }: { icon: ReactNode; label: string; value: string; tone: "gold" | "green" | "blue" | "red" }) {
  const color = tone === "green" ? "text-green-200" : tone === "blue" ? "text-blue-200" : tone === "red" ? "text-red-200" : "text-castGold";
  return (
    <article className="glass-panel hover-3d rounded-2xl p-5">
      <div className={`grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.06] ${color}`}>{icon}</div>
      <span className="mt-4 block text-sm text-castMuted">{label}</span>
      <strong className={`mt-2 block text-3xl font-black ${color}`}>{value}</strong>
    </article>
  );
}
