import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ThreeDPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("perspective-card", className)}>
      <div className="glass-panel hover-3d light-sweep rounded-2xl">{children}</div>
    </div>
  );
}
