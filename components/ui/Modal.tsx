"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-5">
      <section className="w-full max-w-2xl rounded-2xl border border-white/10 bg-castCard shadow-gold">
        <header className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="text-xl font-black text-white">{title}</h2>
          <button className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-castMuted hover:text-white" type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="p-5">{children}</div>
      </section>
    </div>
  );
}
