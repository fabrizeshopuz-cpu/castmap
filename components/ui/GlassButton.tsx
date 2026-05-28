import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

export function GlassButton({ children, variant = "secondary", className, ...props }: GlassButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-black backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-px active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "border border-[#FACC15]/45 bg-gradient-to-r from-[#FACC15] via-[#EAB308] to-[#D4AF37] text-[#0F172A] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_18px_46px_rgba(212,175,55,0.24)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.58),0_22px_58px_rgba(212,175,55,0.32)]",
        variant === "secondary" &&
          "border border-white/15 bg-white/[0.065] text-[#F8FAFC] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_34px_rgba(2,6,23,0.22)] hover:border-[#D4AF37]/35 hover:bg-[#D4AF37]/10 hover:shadow-[0_18px_46px_rgba(212,175,55,0.14)]",
        variant === "danger" &&
          "border border-[#EF4444]/35 bg-[#EF4444]/10 text-red-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_14px_34px_rgba(2,6,23,0.22)] hover:border-[#EF4444]/55 hover:bg-[#EF4444]/16 hover:shadow-[0_18px_46px_rgba(239,68,68,0.18)]",
        className,
      )}
    >
      {children}
    </button>
  );
}
