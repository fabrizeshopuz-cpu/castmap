"use client";

import { useMemo, useState } from "react";

interface MapMarker {
  city: string;
  value: number;
  tone: "green" | "gold" | "red";
  x: number;
  y: number;
}

interface MapOverviewProps {
  markers: MapMarker[];
}

const markerClass: Record<MapMarker["tone"], string> = {
  green: "bg-emerald-500/80 shadow-[0_0_24px_rgba(86,198,107,0.55)]",
  gold: "bg-castGold/85 text-black shadow-[0_0_28px_rgba(212,175,55,0.65)]",
  red: "bg-red-500/80 shadow-[0_0_24px_rgba(255,100,90,0.55)]",
};

export function MapOverview({ markers }: MapOverviewProps) {
  const [selectedCity, setSelectedCity] = useState("all");
  const visibleMarkers = selectedCity === "all" ? markers : markers.filter((marker) => marker.city === selectedCity);
  const selectedCount = useMemo(() => visibleMarkers.reduce((sum, marker) => sum + marker.value, 0), [visibleMarkers]);

  return (
    <article className="rounded-2xl border border-white/10 bg-castCard p-5 shadow-black/30 lg:col-span-2">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-white">O'zbekiston bo'yicha ekranlar</h2>
          <p className="mt-1 text-sm text-castMuted">{selectedCity === "all" ? "Barcha shaharlar" : selectedCity}: {selectedCount} ta TV</p>
        </div>
        <select
          className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-bold text-white outline-none"
          value={selectedCity}
          onChange={(event) => setSelectedCity(event.target.value)}
        >
          <option value="all">Barcha shaharlar</option>
          {markers.map((marker) => <option key={marker.city} value={marker.city}>{marker.city} - {marker.value} TV</option>)}
        </select>
      </div>

      <div className="relative rounded-2xl border border-white/10 bg-[#0D0D0D] p-2">
        <div className="relative aspect-[660/382] w-full rounded-xl bg-[#b7ccd8]">
          <img
            src="/uzbekistan-map.png"
            alt="O'zbekiston xaritasi"
            className="absolute inset-0 h-full w-full rounded-xl object-contain"
          />

          {visibleMarkers.map((marker) => (
            <button
              key={marker.city}
              className={`absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70 text-sm font-black transition hover:z-20 hover:scale-110 md:h-14 md:w-14 md:text-base ${markerClass[marker.tone]}`}
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              type="button"
              onClick={() => setSelectedCity(marker.city)}
              title={`${marker.city}: ${marker.value} TV`}
            >
              {marker.value}
              <span className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-black/75 px-2 py-1 text-xs font-semibold text-white drop-shadow md:left-14 md:text-sm">{marker.city}</span>
            </button>
          ))}

          {!markers.length ? <div className="absolute inset-0 grid place-items-center bg-black/45 text-sm text-white">Xarita ma'lumotlari tozalangan</div> : null}
        </div>
      </div>

      <button
        className="mt-5 min-h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-left text-sm text-white"
        type="button"
        onClick={() => setSelectedCity("all")}
      >
        Xaritada barcha shaharlarni ko'rish
      </button>
    </article>
  );
}
