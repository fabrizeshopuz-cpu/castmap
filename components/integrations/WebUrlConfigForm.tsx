import { Field, Select, type IntegrationFormValues } from "@/components/integrations/GoogleSheetsConfigForm";
import type { UseFormRegister } from "react-hook-form";

export function WebUrlConfigForm({ register }: { register: UseFormRegister<IntegrationFormValues> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="HTTPS URL" name="url" register={register} placeholder="https://castmap.uz" />
      <Select label="Display mode" name="displayMode" register={register} options={[["fullscreen", "Fullscreen"], ["widget_card", "Widget card"], ["split_screen", "Split screen"]]} />
      <Field label="Refresh interval" name="refreshInterval" register={register} placeholder="600" />
      <Field label="Zoom level" name="zoom" register={register} placeholder="1" />
      <Field label="Allowed domains" name="allowedDomains" register={register} placeholder="castmap.uz, example.com" />
    </div>
  );
}
