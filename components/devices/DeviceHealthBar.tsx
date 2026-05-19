interface DeviceHealthBarProps {
  value: number;
  tone?: "signal" | "storage" | "danger" | "system";
}

export function DeviceHealthBar({ value, tone = "signal" }: DeviceHealthBarProps) {
  const gradient = tone === "danger" ? "from-amber-500 to-red-500" : tone === "signal" ? "from-emerald-500 to-emerald-300" : "from-castGold to-castDeepGold";
  return (
    <div className="grid min-w-24 gap-1">
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full bg-gradient-to-r ${gradient}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      <b className="text-xs text-castMuted">{value ? `${value}%` : "--"}</b>
    </div>
  );
}
