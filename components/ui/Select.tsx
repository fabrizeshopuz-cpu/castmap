import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn("h-11 rounded-xl border border-white/10 bg-[#0D0D0D] px-4 text-sm text-white outline-none focus:border-castGold/40", props.className)}
    />
  );
}
