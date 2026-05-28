import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  green: "border-[#22C55E]/35 bg-[#22C55E]/12 text-green-200 shadow-[0_0_24px_rgba(34,197,94,0.10)]",
  red: "border-[#EF4444]/35 bg-[#EF4444]/12 text-red-200 shadow-[0_0_24px_rgba(239,68,68,0.10)]",
  orange: "border-[#F59E0B]/35 bg-[#F59E0B]/12 text-orange-200 shadow-[0_0_24px_rgba(245,158,11,0.10)]",
  blue: "border-[#3B82F6]/35 bg-[#3B82F6]/12 text-sky-200 shadow-[0_0_24px_rgba(59,130,246,0.10)]",
  gold: "border-[#D4AF37]/35 bg-[#D4AF37]/12 text-[#FACC15] shadow-[0_0_24px_rgba(212,175,55,0.12)]",
  gray: "border-white/15 bg-white/[0.06] text-castMuted",
};

export function StatusBadge({ children, tone = "gray", className }: { children: ReactNode; tone?: keyof typeof tones; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black backdrop-blur-xl", tones[tone], className)}>{children}</span>;
}
