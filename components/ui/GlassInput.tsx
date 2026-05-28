import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function GlassInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("glass-input h-11 w-full rounded-xl px-4 text-sm outline-none placeholder:text-castMuted", props.className)} />;
}
