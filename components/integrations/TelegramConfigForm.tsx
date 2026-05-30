import { Field, Select, type IntegrationFormValues } from "@/components/integrations/GoogleSheetsConfigForm";
import type { UseFormRegister } from "react-hook-form";

export function TelegramConfigForm({ register }: { register: UseFormRegister<IntegrationFormValues> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="Bot token" name="botToken" register={register} placeholder="123456:ABC..." />
      <Field label="Channel username / chat ID" name="channel" register={register} placeholder="@castmap_demo" />
      <Select label="Content type" name="contentType" register={register} options={[["latest_posts", "Latest posts"], ["ticker", "Text ticker"], ["image_posts", "Image posts"], ["announcement", "Announcement board"]]} />
      <Select label="Refresh mode" name="refreshMode" register={register} options={[["webhook", "Webhook"], ["polling", "Polling"]]} />
      <Select label="Moderation" name="moderation" register={register} options={[["auto_publish", "Auto publish"], ["approval_required", "Approval required"]]} />
    </div>
  );
}
