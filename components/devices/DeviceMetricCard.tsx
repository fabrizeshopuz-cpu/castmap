interface DeviceMetricCardProps {
  title: string;
  value: string;
  subtext: string;
  tone: "gold" | "green" | "red" | "orange";
}

const toneClass: Record<DeviceMetricCardProps["tone"], string> = {
  gold: "from-[#FFE18A] to-castDeepGold text-black",
  green: "from-emerald-500 to-emerald-950 text-white",
  red: "from-red-500 to-red-950 text-white",
  orange: "from-amber-500 to-amber-900 text-black",
};

export function DeviceMetricCard({ title, value, subtext, tone }: DeviceMetricCardProps) {
  return (
    <article className="glass-panel hover-3d grid min-h-32 grid-cols-[56px_1fr] items-center gap-4 rounded-2xl p-5 transition hover:border-castGold/35 hover:shadow-gold">
      <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-xs font-black ${toneClass[tone]}`}>{tone === "green" ? "ON" : tone === "red" ? "OFF" : tone === "orange" ? "!" : "TV"}</div>
      <div>
        <span className="text-sm text-castMuted">{title}</span>
        <strong className="mt-1 block text-3xl font-black text-white">{value}</strong>
        <small className="mt-1 block text-castMuted">{subtext}</small>
      </div>
    </article>
  );
}
