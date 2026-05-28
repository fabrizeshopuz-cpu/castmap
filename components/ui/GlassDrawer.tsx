"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";

export function GlassDrawer({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[#020617]/62 backdrop-blur-xl">
      <aside className="glass-panel ml-auto flex h-full w-[460px] max-w-full flex-col rounded-l-2xl border-l border-white/15 shadow-gold">
        <header className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="text-xl font-black text-white">{title}</h2>
          <GlassButton className="h-10 w-10 px-0 text-castMuted hover:text-castGold" type="button" onClick={onClose} aria-label="Yopish">
            <X className="h-5 w-5" />
          </GlassButton>
        </header>
        <div className="min-h-0 flex-1 overflow-auto p-5">{children}</div>
      </aside>
    </div>
  );
}
