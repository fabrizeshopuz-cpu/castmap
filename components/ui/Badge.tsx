import { cn } from "@/lib/utils";

const toneClass = {
  green: "border-green-400/25 bg-green-500/10 text-green-300",
  red: "border-red-400/25 bg-red-500/10 text-red-300",
  orange: "border-orange-400/25 bg-orange-500/10 text-orange-300",
  blue: "border-blue-400/25 bg-blue-500/10 text-blue-300",
  gold: "border-castGold/25 bg-castGold/10 text-castGold",
  gray: "border-white/10 bg-white/[0.05] text-castMuted",
};

export function Badge({ children, tone = "gray" }: { children: string; tone?: keyof typeof toneClass }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-black", toneClass[tone])}>{children}</span>;
}
