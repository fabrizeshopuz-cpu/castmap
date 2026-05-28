"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, LogOut } from "lucide-react";
import { topbarActions } from "@/lib/dashboard-data";

export function Topbar() {
  const { searchIcon: Search, notificationIcon: Bell, helpIcon: HelpCircle, lightIcon: Sun, darkIcon: Moon } = topbarActions;
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === "/" || pathname === "/dashboard";

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("castmap-theme") === "light" ? "light" : "dark";
    setTheme(savedTheme);
    document.documentElement.dataset.theme = savedTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("castmap-theme", nextTheme);
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-24 items-center justify-between gap-5 border-b border-white/15 bg-[#0F172A]/72 px-7 py-5 backdrop-blur-2xl max-xl:flex-col max-xl:items-stretch">
      <div className="hidden gap-2 max-lg:flex">
        <button
          className="flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-3 text-sm font-bold text-white backdrop-blur-xl"
          type="button"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 text-castGold" />
          Orqaga
        </button>
        {!isDashboard ? (
          <button
            className="flex min-h-10 items-center gap-2 rounded-xl border border-castGold/35 bg-castGold/12 px-3 text-sm font-bold text-castGold backdrop-blur-xl"
            type="button"
            onClick={() => router.push("/dashboard")}
          >
            <LogOut className="h-4 w-4" />
            Chiqish
          </button>
        ) : null}
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-castGold">CASTMAP</p>
        <h1 className="mt-1 text-2xl font-black text-white">Retail Media Infrastructure Platform</h1>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 max-xl:justify-start">
        <label className="relative w-[420px] max-w-full">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-castMuted" />
          <input className="glass-input h-11 w-full rounded-xl pl-11 pr-4 text-sm outline-none placeholder:text-castMuted" placeholder="Qidirish..." />
        </label>
        <button className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/[0.06] text-castGold backdrop-blur-xl" type="button" aria-label="Bildirishnoma">
          <Bell className="h-5 w-5" />
        </button>
        <button className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/[0.06] text-castMuted backdrop-blur-xl" type="button" aria-label="Yordam">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button
          className="relative flex h-11 w-[92px] items-center justify-between rounded-xl border border-white/15 bg-white/[0.06] px-3 text-castGold backdrop-blur-xl"
          type="button"
          aria-label="Tungi va kunduzgi rejim"
          aria-pressed={theme === "light"}
          onClick={toggleTheme}
          title={theme === "dark" ? "Kunduzgi rejimga o'tish" : "Tungi rejimga o'tish"}
        >
          <span className={`absolute top-1 h-9 w-9 rounded-lg bg-gradient-to-br from-[#FACC15] to-castGold shadow-gold transition-all duration-200 ${theme === "light" ? "left-1" : "left-[51px]"}`} />
          <Sun className={`relative z-10 h-4 w-4 ${theme === "light" ? "text-black" : "text-castGold"}`} />
          <Moon className={`relative z-10 h-4 w-4 ${theme === "dark" ? "text-black" : "text-castMuted"}`} />
        </button>
        <button className="flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 text-sm text-white backdrop-blur-xl" type="button">
          <CalendarDays className="h-4 w-4 text-castGold" />
          17 May, 2026 - 17 May, 2026
        </button>
      </div>
    </header>
  );
}
