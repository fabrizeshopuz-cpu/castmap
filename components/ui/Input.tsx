import type { InputHTMLAttributes } from "react";
import { GlassInput } from "@/components/ui/GlassInput";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <GlassInput {...props} />;
}
