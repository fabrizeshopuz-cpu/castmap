"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Plus, Search } from "lucide-react";
import { DeviceDetailDrawer } from "@/components/devices/DeviceDetailDrawer";
import { DeviceEmptyState } from "@/components/devices/DeviceEmptyState";
import { DeviceFilters } from "@/components/devices/DeviceFilters";
import { DeviceMetricCard } from "@/components/devices/DeviceMetricCard";
import { DeviceSkeleton } from "@/components/devices/DeviceSkeleton";
import { DeviceTable } from "@/components/devices/DeviceTable";
import { PairDeviceModal } from "@/components/devices/PairDeviceModal";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useCastmapStore } from "@/lib/store";
import type { CommandType } from "@/types";
import type { Device, DeviceFilter } from "@/types/devices";

export default function DevicesPage() {
  const store = useCastmapStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DeviceFilter>("all");
  const [selected, setSelected] = useState<Device | null>(null);
  const [openActionId, setOpenActionId] = useState("");
  const [pairOpen, setPairOpen] = useState(false);
  const [loading] = useState(false);

  const updateRequiredDeviceIds = useMemo(
    () => new Set(store.devices.filter((device) => device.apkVersion !== "v1.0.5").map((device) => device.id)),
    [store.devices],
  );
  const newDeviceIds = useMemo(() => new Set(store.devices.slice(0, 3).map((device) => device.id)), [store.devices]);

  useEffect(() => {
    if (!selected && store.devices.length) setSelected(store.devices[0]);
  }, [selected, store.devices]);

  const deviceMetrics = useMemo(() => {
    const total = store.devices.length;
    const online = store.devices.filter((device) => device.status === "online").length;
    const offline = store.devices.filter((device) => device.status === "offline").length;
    const errors = store.devices.filter((device) => device.status === "error").length;
    return [
      { title: "Jami qurilmalar", value: String(total), subtext: total ? "Ro'yxatdan o'tgan ekranlar" : "Hali qurilma ulanmagan", tone: "gold" as const },
      { title: "Onlayn", value: String(online), subtext: total ? `${Math.round((online / total) * 100)}% faol` : "0% faol", tone: "green" as const },
      { title: "Offline", value: String(offline), subtext: "So'nggi heartbeat asosida", tone: "red" as const },
      { title: "Xatoliklar", value: String(errors), subtext: errors ? "Tezkor e'tibor kerak" : "Xatolik yo'q", tone: "orange" as const },
    ];
  }, [store.devices]);

  const filteredDevices = useMemo(() => {
    const search = query.trim().toLowerCase();
    return store.devices.filter((device) => {
      const matchesSearch = !search
        || device.name.toLowerCase().includes(search)
        || device.deviceId.toLowerCase().includes(search)
        || device.branch.toLowerCase().includes(search)
        || device.location.toLowerCase().includes(search);
      const matchesFilter = filter === "all"
        || device.status === filter
        || (filter === "update" && updateRequiredDeviceIds.has(device.id))
        || (filter === "new" && newDeviceIds.has(device.id));
      return matchesSearch && matchesFilter;
    });
  }, [query, filter, newDeviceIds, store.devices, updateRequiredDeviceIds]);

  const handleAction = (device: Device, action: string) => {
    setOpenActionId("");
    setSelected(device);
    const commandByAction: Record<string, CommandType> = {
      screenshot: "TAKE_SCREENSHOT",
      sync: "FORCE_SYNC",
      restart: "RESTART_APP",
      cache: "CLEAR_CACHE",
      apk: "UPDATE_APK",
      "Force Sync": "FORCE_SYNC",
      "Restart Device": "RESTART_APP",
      "Take Screenshot": "TAKE_SCREENSHOT",
      "Clear Cache": "CLEAR_CACHE",
      "Update APK": "UPDATE_APK",
    };
    const command = commandByAction[action];
    if (command) {
      store.sendCommand(device.id, command);
      return;
    }
    if (action === "delete") {
      store.pushToast("Qurilmani o'chirish real bazada tasdiq oynasi bilan ulanadi. Hozircha mock rejimda buyruq yuborilmadi.", "warning");
      return;
    }
    store.pushToast(`${device.name} ma'lumotlari ochildi.`, "info");
  };

  return (
    <main className="flex min-h-screen bg-castBg text-castText max-lg:flex-col">
      <Sidebar activeLabel="TV Qurilmalar" />
      <section className="min-w-0 flex-1">
        <Topbar />
        <div className="grid gap-5 p-7 max-sm:p-4">
          <header className="flex items-start justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 max-xl:flex-col">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-castGold">DEVICE MANAGEMENT</p>
              <h1 className="mt-1 text-3xl font-black text-white">TV Qurilmalar</h1>
              <span className="mt-1 block text-castMuted">Barcha ekran va player qurilmalarni boshqarish</span>
            </div>
            <div className="flex flex-wrap justify-end gap-3 max-xl:w-full max-xl:justify-start">
              <label className="relative w-[430px] max-w-full">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-castMuted" />
                <input
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none placeholder:text-castMuted"
                  value={query}
                  placeholder="Qurilma nomi, filial yoki ID bo'yicha qidirish"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <button className="flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-white" type="button"><Filter className="h-4 w-4 text-castGold" />Filtr</button>
              <select className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none">
                <option>17 May, 2026 - Barcha statuslar</option>
                <option>Faqat onlayn qurilmalar</option>
                <option>Yangilanish kerak</option>
              </select>
              <button className="flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#FFE18A] to-castDeepGold px-5 font-black text-black" type="button" onClick={() => setPairOpen(true)}>
                <Plus className="h-4 w-4" /> Yangi qurilma ulash
              </button>
            </div>
          </header>

          {loading ? (
            <DeviceSkeleton />
          ) : (
            <>
              <section className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
                {deviceMetrics.map((metric) => <DeviceMetricCard key={metric.title} {...metric} />)}
              </section>

              <DeviceFilters active={filter} onChange={setFilter} />

              <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
                <div>
                  {filteredDevices.length ? (
                    <DeviceTable
                      devices={filteredDevices}
                      selectedId={selected?.id}
                      openActionId={openActionId}
                      onSelect={setSelected}
                      onToggleActions={(deviceId) => setOpenActionId((current) => current === deviceId ? "" : deviceId)}
                      onAction={handleAction}
                    />
                  ) : (
                    <DeviceEmptyState onPair={() => setPairOpen(true)} />
                  )}
                </div>
                {selected ? <DeviceDetailDrawer device={selected} onClose={() => setSelected(null)} onAction={(action) => handleAction(selected, action)} /> : null}
              </section>

              <section className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
                {[
                  ["Eng ko'p offline bo'layotgan filiallar", "Ma'lumot yo'q", "Qurilmalar ulangandan keyin ko'rinadi"],
                  ["APK yangilanishi kerak bo'lgan qurilmalar", "Ma'lumot yo'q", "Qurilmalar ulangandan keyin ko'rinadi"],
                  ["Storage 80% dan oshgan qurilmalar", "Ma'lumot yo'q", "Qurilmalar ulangandan keyin ko'rinadi"],
                  ["So'nggi ulanishlar", "Ma'lumot yo'q", "Qurilmalar ulangandan keyin ko'rinadi"],
                ].map(([title, first, second]) => (
                  <article key={title} className="grid gap-2 rounded-2xl border border-white/10 bg-castCard p-5">
                    <h3 className="font-black text-white">{title}</h3>
                    <span className="text-sm text-castMuted">{first}</span>
                    <span className="text-sm text-castMuted">{second}</span>
                  </article>
                ))}
              </section>
            </>
          )}
        </div>
      </section>
      <PairDeviceModal open={pairOpen} onClose={() => setPairOpen(false)} />
    </main>
  );
}
