"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { GoogleSheetsConfigForm, Field, Select, type IntegrationFormValues } from "@/components/integrations/GoogleSheetsConfigForm";
import { TelegramConfigForm } from "@/components/integrations/TelegramConfigForm";
import { InstagramConfigForm } from "@/components/integrations/InstagramConfigForm";
import { YouTubeConfigForm } from "@/components/integrations/YouTubeConfigForm";
import { AnyDeskConfigForm } from "@/components/integrations/AnyDeskConfigForm";
import { WebUrlConfigForm } from "@/components/integrations/WebUrlConfigForm";
import { CustomApiConfigForm } from "@/components/integrations/CustomApiConfigForm";
import type { Integration, IntegrationCatalogItem } from "@/types/integrations";

const baseSchema = z.object({
  name: z.string().min(2, "Integration name kerak"),
});

export function IntegrationConnectModal({
  item,
  integration,
  open,
  onClose,
  onSave,
}: {
  item: IntegrationCatalogItem | null;
  integration?: Integration;
  open: boolean;
  onClose: () => void;
  onSave: (payload: Partial<Integration> & { config: Record<string, unknown>; credentials?: Record<string, unknown> }) => void;
}) {
  const [error, setError] = useState("");
  const defaultValues = useMemo(() => ({
    name: integration?.name || item?.name || "",
    ...(integration?.config || {}),
  }) as IntegrationFormValues, [integration, item]);
  const { register, handleSubmit, reset } = useForm<IntegrationFormValues>({ values: defaultValues });

  if (!item) return null;

  const submit = (values: IntegrationFormValues) => {
    const parsed = baseSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Formani tekshiring");
      return;
    }
    const credentials: Record<string, unknown> = {};
    const config: Record<string, unknown> = {};
    Object.entries(values).forEach(([key, value]) => {
      if (["botToken", "appSecret", "accessToken", "apiPassword", "apiKey", "serviceAccountJson"].includes(key)) credentials[key] = value;
      else if (key !== "name") config[key] = normalizeValue(value);
    });
    onSave({ name: values.name, status: "connected", config, credentials });
    reset(defaultValues);
    setError("");
    onClose();
  };

  return (
    <Modal open={open} title={`${item.name} ulash`} onClose={onClose}>
      <form className="grid gap-4" onSubmit={handleSubmit(submit)}>
        <Field label="Integration name" name="name" register={register} placeholder={item.name} />
        {item.type === "google_sheets" ? <GoogleSheetsConfigForm register={register} /> : null}
        {item.type === "telegram" ? <TelegramConfigForm register={register} /> : null}
        {item.type === "instagram" ? <InstagramConfigForm register={register} /> : null}
        {item.type === "youtube" ? <YouTubeConfigForm register={register} /> : null}
        {item.type === "anydesk" ? <AnyDeskConfigForm register={register} /> : null}
        {item.type === "web_url" || item.type === "canva" || item.type === "google_drive" ? <WebUrlConfigForm register={register} /> : null}
        {item.type === "custom_api" || item.type === "pos_webhook" ? <CustomApiConfigForm register={register} /> : null}
        {item.type === "weather" ? (
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="City" name="city" register={register} placeholder="Toshkent" />
            <Select label="Language" name="language" register={register} options={[["uz", "UZ"], ["ru", "RU"], ["en", "EN"]]} />
            <Select label="Unit" name="unit" register={register} options={[["celsius", "Celsius"]]} />
            <Select label="Display style" name="displayStyle" register={register} options={[["compact", "Compact"], ["fullscreen", "Fullscreen"], ["ticker", "Ticker"], ["card", "Card"]]} />
          </div>
        ) : null}
        {item.type === "rss" ? (
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="RSS URL" name="url" register={register} placeholder="https://example.com/rss.xml" />
            <Field label="Number of posts" name="count" register={register} placeholder="5" />
            <Select label="Display style" name="displayStyle" register={register} options={[["ticker", "Ticker"], ["cards", "Cards"], ["fullscreen_news", "Fullscreen news"]]} />
            <Field label="Refresh interval" name="refreshInterval" register={register} placeholder="900" />
          </div>
        ) : null}
        {error ? <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={onClose}>Bekor qilish</Button>
          <Button variant="gold" type="submit">Save config</Button>
        </div>
      </form>
    </Modal>
  );
}

function normalizeValue(value: unknown) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) return Number(value);
  if (typeof value === "string" && value.includes(",")) return value.split(",").map((item) => item.trim()).filter(Boolean);
  return value;
}
