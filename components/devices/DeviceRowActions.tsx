import { MoreHorizontal } from "lucide-react";

interface DeviceRowActionsProps {
  deviceId: string;
  open: boolean;
  onToggle: (deviceId: string) => void;
  onAction: (action: string) => void;
}

const actions = [
  ["view", "Batafsil ko'rish"],
  ["screenshot", "Screenshot olish"],
  ["sync", "Sync qilish"],
  ["restart", "Restart"],
  ["cache", "Cache tozalash"],
  ["apk", "APK yangilash"],
  ["delete", "Qurilmani o'chirish"],
];

export function DeviceRowActions({ deviceId, open, onToggle, onAction }: DeviceRowActionsProps) {
  return (
    <div className="relative flex gap-2">
      <button className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-castGold" type="button" onClick={() => onToggle(deviceId)}>
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open ? (
        <div className="absolute right-0 top-11 z-20 grid min-w-52 rounded-xl border border-white/10 bg-[#151515] p-2 shadow-2xl">
          {actions.map(([id, label]) => (
            <button
              key={id}
              className={`min-h-9 rounded-lg px-3 text-left text-sm hover:bg-white/[0.06] ${id === "delete" ? "text-red-300" : "text-white"}`}
              type="button"
              onClick={() => onAction(id)}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
