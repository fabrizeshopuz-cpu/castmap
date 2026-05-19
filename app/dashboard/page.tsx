"use client";

import { useMemo } from "react";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { DeviceStatusChart } from "@/components/dashboard/DeviceStatusChart";
import { MapOverview } from "@/components/dashboard/MapOverview";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatsChart } from "@/components/dashboard/StatsChart";
import { TestSetupWizard } from "@/components/dashboard/TestSetupWizard";
import { TopBranches } from "@/components/dashboard/TopBranches";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { activityItems, deviceStatuses, impressions, mapMarkers, metrics, topBranches } from "@/lib/dashboard-data";
import { useCastmapStore } from "@/lib/store";

export default function DashboardPage() {
  const store = useCastmapStore();
  const isLoading = false;
  const hasData = true;

  const dashboardMetrics = useMemo(() => {
    const total = store.devices.length;
    const online = store.devices.filter((device) => device.status === "online").length;
    const offline = store.devices.filter((device) => device.status === "offline").length;
    const activeCampaigns = store.campaigns.filter((campaign) => campaign.status === "active").length;
    const playbackCount = store.playbackLogs.length;
    const openAlerts = store.alerts.filter((alert) => alert.status === "open").length;
    return [
      { ...metrics[0], value: String(total), trend: total ? "+1" : "0%", helper: total ? "test ekran yaratildi" : "hali ekran ulanmagan" },
      { ...metrics[1], value: String(online), trend: total ? `${Math.round((online / total) * 100)}%` : "0%", helper: "jami ekranlardan" },
      { ...metrics[2], value: String(activeCampaigns), trend: activeCampaigns ? "+1" : "0", helper: activeCampaigns ? "faol kampaniya" : "yangi kampaniya yo'q" },
      { ...metrics[3], value: String(playbackCount), trend: playbackCount ? "+1" : "0%", helper: "playback loglar asosida" },
      { ...metrics[4], value: String(openAlerts), trend: `${offline} offline`, helper: "ogohlantirish holati" },
    ];
  }, [store.alerts, store.campaigns, store.devices, store.playbackLogs]);

  const dynamicDeviceStatuses = useMemo(() => {
    const online = store.devices.filter((device) => device.status === "online").length;
    const offline = store.devices.filter((device) => device.status === "offline").length;
    const inactive = store.devices.filter((device) => device.status === "inactive").length;
    const errors = store.devices.filter((device) => device.status === "error").length;
    return [
      { label: "Onlayn", value: online, color: "#56C66B" },
      { label: "Offline", value: offline, color: "#FF645A" },
      { label: "Nofaol", value: inactive, color: "#94A3B8" },
      { label: "Xatolik", value: errors, color: "#D4AF37" },
    ];
  }, [store.devices]);

  const dynamicTopBranches = useMemo(() => {
    const rows = store.branches.map((branch) => ({
      name: branch.name,
      value: store.devices.filter((device) => device.branchId === branch.id).length || branch.screenCount,
    })).filter((branch) => branch.value > 0);
    return rows.length ? rows.slice(0, 5) : topBranches;
  }, [store.branches, store.devices]);

  const dynamicImpressions = useMemo(() => {
    if (!store.playbackLogs.length) return impressions;
    return impressions.map((item, index) => ({ ...item, value: index === impressions.length - 1 ? store.playbackLogs.length * 100 : 0 }));
  }, [store.playbackLogs]);

  const dynamicActivity = useMemo(() => {
    if (!store.playbackLogs.length && !store.devices.length) return activityItems;
    return [
      ...store.media.slice(0, 1).map((asset) => ({ title: "Yangi media qo'shildi", text: asset.name, time: "Hozir", role: asset.uploadedBy, icon: "upload" as const, tone: "blue" as const })),
      ...store.playlists.slice(0, 1).map((playlist) => ({ title: "Playlist publish qilindi", text: playlist.name, time: playlist.updatedAt, role: "Admin", icon: "playlist" as const, tone: "green" as const })),
      ...store.devices.slice(0, 1).map((device) => ({ title: "Ekran onlayn bo'ldi", text: device.name, time: device.lastSeen, role: "Tizim", icon: "screen" as const, tone: "violet" as const })),
    ];
  }, [store.devices, store.media, store.playlists, store.playbackLogs]);

  const dynamicMapMarkers = useMemo(() => {
    const positions: Record<string, { label: string; x: number; y: number }> = {
      nukus: { label: "Nukus", x: 17, y: 25 },
      qoraqalpogiston: { label: "Qoraqalpog'iston", x: 17, y: 25 },
      urganch: { label: "Urganch", x: 30, y: 54 },
      xorazm: { label: "Xorazm", x: 30, y: 54 },
      navoiy: { label: "Navoiy", x: 49, y: 43 },
      buxoro: { label: "Buxoro", x: 45, y: 66 },
      samarqand: { label: "Samarqand", x: 60, y: 70 },
      jizzax: { label: "Jizzax", x: 69, y: 63 },
      qarshi: { label: "Qarshi", x: 58, y: 82 },
      qashqadaryo: { label: "Qashqadaryo", x: 58, y: 82 },
      termiz: { label: "Termiz", x: 70, y: 90 },
      surxondaryo: { label: "Surxondaryo", x: 70, y: 90 },
      guliston: { label: "Guliston", x: 76, y: 59 },
      sirdaryo: { label: "Sirdaryo", x: 76, y: 59 },
      toshkent: { label: "Toshkent", x: 79, y: 50 },
      namangan: { label: "Namangan", x: 90, y: 47 },
      andijon: { label: "Andijon", x: 94, y: 53 },
      fargona: { label: "Farg'ona", x: 89, y: 58 },
    };

    const normalizeCity = (city: string) => city
      .toLowerCase()
      .replace(/['‘’`]/g, "")
      .replace(/g‘|g'/g, "g")
      .replace(/ʻ/g, "")
      .replace(/\s+/g, "");

    const cityCounts = new Map<string, { label: string; value: number }>();
    store.branches.forEach((branch) => {
      const rawCity = branch.city || branch.name;
      const key = normalizeCity(rawCity);
      const deviceCount = store.devices.filter((device) => device.branchId === branch.id).length;
      const count = deviceCount || branch.screenCount;
      if (!count) return;
      const current = cityCounts.get(key) || { label: positions[key]?.label || rawCity, value: 0 };
      cityCounts.set(key, { ...current, value: current.value + count });
    });

    const rows = Array.from(cityCounts.entries()).map(([key, item], index) => {
      const position = positions[key] || { label: item.label, x: 18 + (index % 6) * 12, y: 38 + Math.floor(index / 6) * 10 };
      return { city: position.label, value: item.value, tone: index === 0 ? "gold" as const : "green" as const, x: position.x, y: position.y };
    });
    return rows.length ? rows : mapMarkers;
  }, [store.branches, store.devices]);

  return (
    <main className="flex min-h-screen bg-castBg text-castText max-lg:flex-col">
      <Sidebar activeLabel="Dashboard" />
      <section className="min-w-0 flex-1">
        <Topbar />
        <div className="p-7 max-sm:p-4">
          <section className="mb-6 flex items-start justify-between gap-4 max-sm:flex-col">
            <div>
              <h1 className="text-3xl font-black text-white">Dashboard</h1>
              <p className="mt-1 text-sm text-castMuted">Platforma holati va umumiy statistika</p>
            </div>
            <button className="min-h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-white hover:border-castGold/35" type="button">
              Hisobotni eksport qilish
            </button>
          </section>

          {isLoading ? (
            <LoadingSkeleton />
          ) : hasData ? (
            <>
              <section className="grid gap-4 xl:grid-cols-5 md:grid-cols-2">
                {dashboardMetrics.map((metric) => (
                  <MetricCard key={metric.title} {...metric} />
                ))}
              </section>

              <TestSetupWizard />

              <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)]">
                <StatsChart data={dynamicImpressions} />
                <DeviceStatusChart data={dynamicDeviceStatuses.length ? dynamicDeviceStatuses : deviceStatuses} />
                <TopBranches data={dynamicTopBranches} />
                <ActivityFeed data={dynamicActivity} />
                <MapOverview markers={dynamicMapMarkers} />
              </section>
            </>
          ) : (
            <EmptyState title="Ma'lumot topilmadi" text="Tanlangan davr uchun ekranlar yoki kampaniya statistikasi hali shakllanmagan." />
          )}

          <footer className="mt-8 flex items-center justify-between text-xs text-castMuted max-sm:flex-col max-sm:gap-2">
            <span>© 2026 CASTMAP. Barcha huquqlar himoyalangan.</span>
            <span>v1.0.0</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
