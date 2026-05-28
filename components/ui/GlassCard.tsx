import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("glass-panel hover-3d rounded-2xl p-5", className)}>
      {children}
    </section>
  );
}
