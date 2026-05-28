"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";

export function GlassModal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#020617]/68 p-5 backdrop-blur-xl">
      <section className="glass-panel light-sweep w-full max-w-2xl rounded-2xl shadow-gold">
        <header className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="text-xl font-black text-white">{title}</h2>
          <GlassButton className="h-10 w-10 px-0 text-castMuted hover:text-castGold" type="button" onClick={onClose} aria-label="Yopish">
            <X className="h-5 w-5" />
          </GlassButton>
        </header>
        <div className="p-5">{children}</div>
      </section>
    </div>
  );
}
