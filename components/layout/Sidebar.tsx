import Image from "next/image";
import Link from "next/link";
import { Crown } from "lucide-react";
import { sidebarItems, uiIcons } from "@/lib/dashboard-data";

interface SidebarProps {
  activeLabel?: string;
}

export function Sidebar({ activeLabel = "Dashboard" }: SidebarProps) {
  const { UserRound } = uiIcons;

  return (
    <aside className="flex min-h-screen w-[292px] shrink-0 flex-col border-r border-white/10 bg-black/60 p-5 backdrop-blur-xl max-lg:min-h-0 max-lg:w-full max-lg:border-b max-lg:border-r-0">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-gold">
        <Image src="/castmap-logo.png" alt="CASTMAP" width={240} height={160} className="h-24 w-full rounded-xl object-contain" priority />
        <p className="mt-3 text-center text-xs font-bold uppercase tracking-[0.22em] text-castGold">Control Every Screen</p>
      </div>

      <nav className="mt-6 grid gap-2 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-h-11 items-center gap-3 rounded-xl border px-3 text-left text-sm transition ${
                item.label === activeLabel
                  ? "border-castGold/35 bg-castGold/10 text-white shadow-gold"
                  : "border-transparent text-castMuted hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 text-castGold" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto grid gap-4 pt-6">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-castGold/15 to-white/[0.03] p-5">
          <div className="flex items-center gap-2 text-castGold">
            <Crown className="h-5 w-5" />
            <b>PRO PLAN</b>
          </div>
          <p className="mt-4 text-sm text-castMuted">Sizning tarifingiz</p>
          <strong className="mt-1 block text-white">Professional</strong>
          <p className="mt-2 text-xs text-castMuted">Oxirgi to'lov: 15.05.2026</p>
          <button className="mt-4 min-h-10 w-full rounded-xl bg-gradient-to-r from-[#FFE18A] to-castDeepGold px-4 text-sm font-black text-black" type="button">
            Tarifni boshqarish
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#FFE18A] to-castDeepGold text-black">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <b className="block text-sm text-white">Super Admin</b>
            <span className="block truncate text-xs text-castMuted">superadmin@castmap.uz</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
