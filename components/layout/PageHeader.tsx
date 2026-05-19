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
    <header className="flex items-start justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 max-xl:flex-col">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-castGold/20 bg-castGold/10 text-castGold">
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
          className="min-h-11 rounded-xl bg-gradient-to-r from-[#FFE18A] to-castDeepGold px-5 font-black text-black shadow-gold transition hover:scale-[1.01]"
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </header>
  );
}
