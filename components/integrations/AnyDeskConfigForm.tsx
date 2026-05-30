import { Field, type IntegrationFormValues } from "@/components/integrations/GoogleSheetsConfigForm";
import type { UseFormRegister } from "react-hook-form";

export function AnyDeskConfigForm({ register }: { register: UseFormRegister<IntegrationFormValues> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="License ID" name="licenseId" register={register} placeholder="AD-CASTMAP-DEMO" />
      <Field label="API password" name="apiPassword" register={register} />
      <Field label="Namespace / domain" name="namespace" register={register} placeholder="castmap" />
      <Field label="Default AnyDesk address" name="remoteAddress" register={register} placeholder="123 456 789" />
    </div>
  );
}
