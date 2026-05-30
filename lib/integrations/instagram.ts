export function getInstagramAuthUrl(config: { appId?: string; redirectUri?: string }) {
  const redirect = encodeURIComponent(config.redirectUri || "https://castmap.uz/api/auth/instagram/callback");
  return `https://www.facebook.com/v20.0/dialog/oauth?client_id=${encodeURIComponent(config.appId || "META_APP_ID")}&redirect_uri=${redirect}&scope=instagram_basic,pages_show_list`;
}

export async function exchangeCodeForToken(code: string) {
  return { accessToken: code ? "mock_instagram_access_token" : "", expiresIn: 3600 };
}

export async function refreshLongLivedToken(token: string) {
  return { accessToken: token || "mock_long_lived_token", expiresIn: 60 * 24 * 60 * 60 };
}

export async function fetchInstagramMedia() {
  return mockInstagramItems();
}

export function transformInstagramFeedToWidget(items = mockInstagramItems()) {
  return {
    type: "instagram",
    displayStyle: "feed_grid",
    items,
  };
}

export function mockInstagramItems() {
  return Array.from({ length: 6 }).map((_, index) => ({
    id: `ig-${index + 1}`,
    mediaUrl: `https://images.unsplash.com/photo-${[
      "1556742049-0cfed4f6a45d",
      "1523381210434-271e8be1f52b",
      "1516321318423-f06f85e504b3",
      "1519389950473-47ba0277781c",
      "1497366754035-f200968a6e72",
      "1500530855697-b586d89ba3ee",
    ][index]}?q=80&w=800&auto=format&fit=crop`,
    caption: `CASTMAP social post ${index + 1}`,
    permalink: "https://instagram.com/castmap.uz",
    mediaType: index % 3 === 0 ? "REELS" : "IMAGE",
  }));
}
