"use client";

import type { ReactNode } from "react";
import { GlassModal } from "@/components/ui/GlassModal";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  return <GlassModal open={open} title={title} onClose={onClose}>{children}</GlassModal>;
}
