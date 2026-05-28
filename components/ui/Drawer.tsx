"use client";

import type { ReactNode } from "react";
import { GlassDrawer } from "@/components/ui/GlassDrawer";

interface DrawerProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Drawer({ open, title, children, onClose }: DrawerProps) {
  return <GlassDrawer open={open} title={title} onClose={onClose}>{children}</GlassDrawer>;
}
