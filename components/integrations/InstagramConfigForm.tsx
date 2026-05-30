import { Field, Select, type IntegrationFormValues } from "@/components/integrations/GoogleSheetsConfigForm";
import type { UseFormRegister } from "react-hook-form";

export function InstagramConfigForm({ register }: { register: UseFormRegister<IntegrationFormValues> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="Meta App ID" name="appId" register={register} />
      <Field label="Meta App Secret" name="appSecret" register={register} />
      <Field label="Instagram Business Account ID" name="accountId" register={register} />
      <Field label="Access Token" name="accessToken" register={register} />
      <Select label="Display" name="displayStyle" register={register} options={[["latest_posts", "Latest posts"], ["reels", "Reels preview"], ["feed_grid", "Profile feed"], ["live_fallback", "Live link / embed fallback"]]} />
    </div>
  );
}
