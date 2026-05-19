import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CastmapProvider } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "CASTMAP Admin Panel",
  description: "Retail Media Infrastructure Platform dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="uz">
      <body><CastmapProvider>{children}</CastmapProvider></body>
    </html>
  );
}
