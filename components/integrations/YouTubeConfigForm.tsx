import { Field, Select, type IntegrationFormValues } from "@/components/integrations/GoogleSheetsConfigForm";
import type { UseFormRegister } from "react-hook-form";

export function YouTubeConfigForm({ register }: { register: UseFormRegister<IntegrationFormValues> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="YouTube URL" name="url" register={register} placeholder="https://www.youtube.com/@castmap/live" />
      <Select label="Autoplay" name="autoplay" register={register} options={[["true", "Enabled"], ["false", "Disabled"]]} />
      <Select label="Mute" name="mute" register={register} options={[["true", "Enabled"], ["false", "Disabled"]]} />
      <Field label="Fallback media ID" name="fallbackMediaId" register={register} placeholder="media-id optional" />
    </div>
  );
}
