import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-white/10 bg-castCard p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition hover:border-castGold/25", className)}>
      {children}
    </section>
  );
}
