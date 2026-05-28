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
  violet: "from-violet-400/65 to-violet-900/55 text-violet-100",
  green: "from-[#22C55E]/70 to-emerald-950/55 text-green-50",
  gold: "from-[#FACC15]/90 to-castGold/75 text-[#0F172A]",
  blue: "from-[#3B82F6]/72 to-sky-950/55 text-sky-50",
  red: "from-[#EF4444]/75 to-red-950/55 text-red-50",
};

export function MetricCard({ title, value, trend, helper, icon: Icon, tone }: MetricCardProps) {
  return (
    <article className="glass-panel hover-3d group grid min-h-32 grid-cols-[58px_1fr] items-center gap-4 rounded-2xl p-5">
      <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br shadow-blue ${toneClass[tone]}`}>
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
