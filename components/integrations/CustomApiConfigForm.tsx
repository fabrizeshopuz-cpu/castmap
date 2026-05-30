import { Field, Select, type IntegrationFormValues } from "@/components/integrations/GoogleSheetsConfigForm";
import type { UseFormRegister } from "react-hook-form";

export function CustomApiConfigForm({ register }: { register: UseFormRegister<IntegrationFormValues> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="Endpoint URL" name="endpoint" register={register} placeholder="https://api.example.com/data" />
      <Select label="Method" name="method" register={register} options={[["GET", "GET"], ["POST", "POST"]]} />
      <Select label="Auth" name="authType" register={register} options={[["none", "None"], ["bearer", "Bearer token"], ["api_key", "API key"]]} />
      <Field label="Token / API key" name="apiKey" register={register} />
      <Field label="JSON mapping" name="mapping" register={register} placeholder="items[].name, price" />
      <Select label="Display style" name="displayStyle" register={register} options={[["table", "Table"], ["cards", "Cards"], ["ticker", "Ticker"], ["chart", "Chart"]]} />
    </div>
  );
}
