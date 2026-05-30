export function maskTelegramToken(token?: string) {
  if (!token) return "";
  const [botId] = token.split(":");
  return `${botId || "bot"}:********`;
}

export async function setTelegramWebhook(botToken: string, webhookUrl?: string) {
  return {
    ok: Boolean(botToken),
    webhookUrl: webhookUrl || "https://castmap.uz/api/webhooks/telegram",
    mode: "mock-ready",
  };
}

export async function fetchTelegramUpdates(botToken: string) {
  if (!botToken) return mockTelegramMessages();
  return mockTelegramMessages();
}

export function parseTelegramMessage(update: Record<string, unknown>) {
  const message = (update.message || update.channel_post || {}) as Record<string, unknown>;
  return {
    id: String(message.message_id || Date.now()),
    text: String(message.text || message.caption || "Bugun barcha filiallarda yangi aksiya"),
    mediaUrl: typeof message.photo === "string" ? message.photo : undefined,
    createdAt: new Date().toISOString(),
  };
}

export function createTelegramWidgetContent(messages = mockTelegramMessages()) {
  return {
    type: "telegram",
    displayStyle: "announcement",
    messages,
  };
}

export function mockTelegramMessages() {
  return [
    { id: "tg-1", text: "Bugun barcha filiallarda yangi aksiya", createdAt: new Date().toISOString() },
    { id: "tg-2", text: "Kechki chegirma 20:00 gacha davom etadi", imageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=1200&auto=format&fit=crop", createdAt: new Date().toISOString() },
  ];
}
