"use client";

import { Bot, CloudSun, FileJson, FileSpreadsheet, Globe2, Instagram, LifeBuoy, Link2, MessageCircle, RadioTower, Rss, ShieldCheck, Youtube, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Integration, IntegrationCatalogItem, IntegrationStatus, IntegrationType } from "@/types/integrations";

const icons: Record<IntegrationType, LucideIcon> = {
  google_sheets: FileSpreadsheet,
  telegram: MessageCircle,
  instagram: Instagram,
  youtube: Youtube,
  weather: CloudSun,
  rss: Rss,
  web_url: Globe2,
  anydesk: LifeBuoy,
  google_drive: Link2,
  canva: Bot,
  custom_api: FileJson,
  pos_webhook: RadioTower,
};

function statusText(status: IntegrationStatus) {
  if (status === "connected") return "Ulangan";
  if (status === "error") return "Xatolik";
  if (status === "syncing") return "Sync";
  if (status === "requires_auth") return "Auth kerak";
  return "Ulanmagan";
}

function statusTone(status: IntegrationStatus) {
  if (status === "connected") return "green";
  if (status === "error") return "red";
  if (status === "syncing") return "blue";
  if (status === "requires_auth") return "orange";
  return "gray";
}

export function IntegrationCard({
  item,
  integration,
  onConnect,
  onConfigure,
  onTest,
  onGuide,
}: {
  item: IntegrationCatalogItem;
  integration?: Integration;
  onConnect: () => void;
  onConfigure: () => void;
  onTest: () => void;
  onGuide: () => void;
}) {
  const Icon = icons[item.type] || ShieldCheck;
  const status = integration?.status || "disconnected";
  return (
    <article className="glass-panel hover-3d rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-castGold/35 bg-castGold/12 text-castGold shadow-gold">
          <Icon className="h-6 w-6" />
        </div>
        <Badge tone={statusTone(status)}>{statusText(status)}</Badge>
      </div>
      <h3 className="mt-5 text-lg font-black text-white">{item.name}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-castMuted">{item.description}</p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="gold" onClick={onConnect}>{integration ? "Qayta ulash" : "Ulash"}</Button>
        <Button onClick={onConfigure}>Sozlash</Button>
        <Button onClick={onTest}>Test qilish</Button>
        <Button onClick={onGuide}>Qo'llanma</Button>
      </div>
    </article>
  );
}
