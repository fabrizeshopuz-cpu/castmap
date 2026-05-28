import type { ButtonHTMLAttributes, ReactNode } from "react";
import { GlassButton } from "@/components/ui/GlassButton";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "gold" | "ghost" | "danger";
}

export function Button({ children, variant = "ghost", className, ...props }: ButtonProps) {
  const glassVariant = variant === "gold" ? "primary" : variant === "danger" ? "danger" : "secondary";
  return <GlassButton {...props} className={className} variant={glassVariant}>{children}</GlassButton>;
}
