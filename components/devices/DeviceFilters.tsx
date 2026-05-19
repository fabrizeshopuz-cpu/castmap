import type { DeviceFilter } from "@/types/devices";
import { deviceFilters } from "@/lib/device-data";

interface DeviceFiltersProps {
  active: DeviceFilter;
  onChange: (filter: DeviceFilter) => void;
}

export function DeviceFilters({ active, onChange }: DeviceFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-2">
      {deviceFilters.map((filter) => (
        <button
          key={filter.id}
          className={`min-h-10 whitespace-nowrap rounded-xl px-4 text-sm font-bold transition ${
            active === filter.id ? "bg-gradient-to-r from-[#FFE18A] to-castDeepGold text-black" : "text-castMuted hover:bg-white/[0.05] hover:text-white"
          }`}
          type="button"
          onClick={() => onChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
