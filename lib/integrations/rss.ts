export async function fetchRssFeed(config: Record<string, unknown>) {
  const url = String(config.url || "");
  if (!url.startsWith("https://")) return mockRssItems();
  try {
    const response = await fetch(url, { next: { revalidate: Number(config.refreshInterval || 900) } });
    if (!response.ok) throw new Error("RSS fetch failed");
    return parseRssItems(await response.text()).slice(0, Number(config.count || 5));
  } catch {
    return mockRssItems();
  }
}

export function parseRssItems(xml: string) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match, index) => {
    const item = match[1];
    return {
      id: `rss-${index + 1}`,
      title: extract(item, "title"),
      description: extract(item, "description"),
      link: extract(item, "link"),
      publishedAt: extract(item, "pubDate"),
    };
  }).filter((item) => item.title);
}

function extract(value: string, tag: string) {
  return (value.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))?.[1]
    || value.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1]
    || "").trim();
}

export function mockRssItems() {
  return [
    { id: "rss-1", title: "CASTMAP retail media yangiliklari", description: "Bugungi aksiyalar ekranlarda avtomatik yangilandi.", link: "https://castmap.uz", publishedAt: new Date().toISOString() },
    { id: "rss-2", title: "Yangi menu va chegirmalar", description: "POS webhook orqali price update qabul qilindi.", link: "https://castmap.uz", publishedAt: new Date().toISOString() },
  ];
}
