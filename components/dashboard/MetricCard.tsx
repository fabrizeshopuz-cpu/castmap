import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  helper: string;
  icon: LucideIcon;
  tone: "violet" | "green" | "gold" | "blue" | "red";
}

const toneClass: Record<MetricCardProps["tone"], string> = {
  violet: "from-violet-500/70 to-violet-950/70",
  green: "from-emerald-500/70 to-emerald-950/70",
  gold: "from-castGold/85 to-castDeepGold/70 text-black",
  blue: "from-blue-500/70 to-blue-950/70",
  red: "from-red-500/70 to-red-950/70",
};

export function MetricCard({ title, value, trend, helper, icon: Icon, tone }: MetricCardProps) {
  return (
    <article className="group grid min-h-32 grid-cols-[58px_1fr] items-center gap-4 rounded-2xl border border-white/10 bg-castCard p-5 shadow-black/30 transition hover:border-castGold/30 hover:shadow-gold">
      <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${toneClass[tone]}`}>
        <Icon className="h-7 w-7" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-castMuted">{title}</p>
        <strong className="mt-1 block text-3xl font-black text-white">{value}</strong>
        <span className={`mt-2 block text-xs font-bold ${tone === "red" ? "text-red-300" : "text-emerald-300"}`}>
          {trend} <span className="font-medium text-castMuted">{helper}</span>
        </span>
      </div>
    </article>
  );
}
