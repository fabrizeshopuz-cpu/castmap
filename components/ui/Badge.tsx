import { cn } from "@/lib/utils";

const toneClass = {
  green: "border-[#22C55E]/35 bg-[#22C55E]/12 text-green-200",
  red: "border-[#EF4444]/35 bg-[#EF4444]/12 text-red-200",
  orange: "border-[#F59E0B]/35 bg-[#F59E0B]/12 text-orange-200",
  blue: "border-[#3B82F6]/35 bg-[#3B82F6]/12 text-sky-200",
  gold: "border-castGold/35 bg-castGold/12 text-[#FACC15]",
  gray: "border-white/15 bg-white/[0.06] text-castMuted",
};

export function Badge({ children, tone = "gray" }: { children: string; tone?: keyof typeof toneClass }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black backdrop-blur-xl", toneClass[tone])}>{children}</span>;
}
