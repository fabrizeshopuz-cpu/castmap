"use client";

import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export function Tabs({ items, active, onChange }: { items: TabItem[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          className={cn("min-h-10 rounded-xl border px-4 text-sm font-black transition", active === item.id ? "border-castGold bg-castGold/10 text-castGold" : "border-white/10 bg-white/[0.03] text-castMuted hover:text-white")}
          type="button"
          onClick={() => onChange(item.id)}
        >
          {item.label} {item.count !== undefined ? <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs">{item.count}</span> : null}
        </button>
      ))}
    </div>
  );
}
