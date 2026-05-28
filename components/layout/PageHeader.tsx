import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  kicker: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export function PageHeader({ kicker, title, subtitle, icon: Icon, actionLabel, onAction }: PageHeaderProps) {
  return (
    <header className="glass-panel light-sweep flex items-start justify-between gap-5 rounded-2xl p-5 max-xl:flex-col">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-castGold/30 bg-castGold/12 text-castGold shadow-gold">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-castGold">{kicker}</p>
          <h1 className="mt-1 text-3xl font-black text-white">{title}</h1>
          <span className="mt-1 block text-castMuted">{subtitle}</span>
        </div>
      </div>
      {actionLabel ? (
        <button
          className="min-h-11 rounded-xl border border-castGold/40 bg-gradient-to-r from-[#FACC15] to-castGold px-5 font-black text-[#0F172A] shadow-gold transition hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-px active:scale-[0.98]"
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </header>
  );
}
