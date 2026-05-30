import type { IntegrationType } from "@/types/integrations";

const guides: Record<IntegrationType, string[]> = {
  google_sheets: [
    "Google Cloud Console'da project yarating",
    "Google Sheets API ni yoqing",
    "OAuth yoki Service Account yarating",
    "Spreadsheet ID ni linkdan oling",
    "Sheet range kiriting",
    "Test qiling",
    "Widget yarating",
    "Playlistga qo'shing",
  ],
  telegram: [
    "BotFather'da bot yarating",
    "Bot tokenni oling",
    "Botni kanalga admin qiling",
    "Channel username yoki chat ID kiriting",
    "Webhook ulang",
    "Test message yuboring",
    "Widget yarating",
  ],
  instagram: [
    "Meta Developer account yarating",
    "Meta App yarating",
    "Instagram Business account ulang",
    "OAuth redirect URL sozlang",
    "Access token oling",
    "Feed widget yarating",
    "Live uchun public/embed URL bo'lsa Web URL widgetdan foydalaning",
  ],
  anydesk: [
    "my.anydesk account oching",
    "API credential oling",
    "License ID va API password kiriting",
    "TV Box ichida AnyDesk client o'rnating",
    "AnyDesk addressni CASTMAP device bilan bog'lang",
    "Remote sessionni device detaildan oching",
  ],
  youtube: ["YouTube live yoki video URL kiriting", "Autoplay/mute sozlang", "Fallback media tanlang", "Widgetni playlistga qo'shing"],
  weather: ["City kiriting", "Til va celsius unit tanlang", "Display style tanlang", "Widgetni playlistga qo'shing"],
  rss: ["RSS URL kiriting", "Post sonini belgilang", "Ticker/cards/fullscreen style tanlang", "Sync test qiling"],
  web_url: ["Faqat HTTPS URL kiriting", "Display mode tanlang", "Allowed domain qo'shing", "APK WebView preview qiling"],
  google_drive: ["Google OAuth ulang", "Drive folder tanlang", "Import qoidalarini belgilang", "Media library sync qiling"],
  canva: ["Canva publish link yarating", "HTTPS link kiriting", "WebView fallbackni tekshiring", "Playlistga qo'shing"],
  custom_api: ["Endpoint URL kiriting", "Auth va headers sozlang", "JSON mapping belgilang", "Widget style tanlang"],
  pos_webhook: ["POS integration yarating", "Webhook URL va secretni nusxalang", "Event turlarini tanlang", "Trigger natijasini test qiling"],
};

export function IntegrationGuide({ type }: { type: IntegrationType }) {
  return (
    <div className="grid gap-2">
      {(guides[type] || guides.custom_api).map((step, index) => (
        <div key={step} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.055] p-3 text-sm text-castMuted backdrop-blur">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-castGold/30 bg-castGold/12 text-xs font-black text-castGold">{index + 1}</span>
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
}
