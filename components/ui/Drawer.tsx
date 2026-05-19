"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Drawer({ open, title, children, onClose }: DrawerProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60">
      <aside className="ml-auto flex h-full w-[440px] max-w-full flex-col border-l border-white/10 bg-castCard shadow-gold">
        <header className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="text-xl font-black text-white">{title}</h2>
          <button className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-castMuted hover:text-white" type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-auto p-5">{children}</div>
      </aside>
    </div>
  );
}
