import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <GlassCard className={className}>{children}</GlassCard>;
}
