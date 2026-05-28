import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FloatingParticles } from "@/components/ui/FloatingParticles";

export function GradientBackground({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className={cn("gradient-background relative min-h-screen overflow-hidden text-castText", className)}>
      <div className="pointer-events-none absolute inset-0 digital-grid opacity-35" />
      <FloatingParticles />
      <div className="relative z-10">{children}</div>
    </main>
  );
}
