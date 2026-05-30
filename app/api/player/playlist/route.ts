import { NextResponse } from "next/server";
import { toPlayerWidget } from "@/lib/integrations/server";
import { fallbackDurationSeconds, isCacheableMedia, isStreamMedia, mediaPublicUrl, mediaStreamKind, playableMediaAssets, playerMediaType, playlistDurationMs, publicRequestOrigin } from "@/lib/playerMedia";
import { readCastmapState } from "@/lib/serverState";

function tokenDeviceId(request: Request) {
  const header = request.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (token.startsWith("device:")) return token.slice("device:".length);
  return "";
}

export async function GET(request: Request) {
  const origin = publicRequestOrigin(request);
  const state = await readCastmapState();
  const requestedDeviceId = tokenDeviceId(request);
  const device = state.devices.find((item) => item.id === requestedDeviceId || item.deviceId === requestedDeviceId) || state.devices[0];
  const playlist = state.playlists.find((item) => device && item.deviceIds?.includes(device.id) && item.status === "published")
    || state.playlists.find((item) => device && item.branchId === device.branchId && item.status === "published")
    || state.playlists.find((item) => item.name === device?.playlist)
    || state.playlists.find((item) => item.target === device?.branch && item.status === "published")
    || state.playlists.find((item) => item.status === "published")
    || state.playlists[0];

  const version = Date.parse(state.updatedAt) || Date.now();
  const playlistItems = playlist ? playlist.items.map((item) => {
    if (item.type === "integration_widget" || item.integrationWidgetId) {
      const widget = state.integrationWidgets.find((entry) => entry.id === item.integrationWidgetId);
      if (!widget || widget.status !== "active") return null;
      const payload = toPlayerWidget(widget);
      return {
        id: item.id,
        mediaId: widget.id,
        type: "INTEGRATION_WIDGET",
        url: "about:blank",
        isStream: false,
        streamType: "",
        cacheable: false,
        localPath: null,
        duration: playlistDurationMs(item.duration || payload.duration),
        priority: item.priority,
        startAt: null,
        endAt: null,
        scheduleRules: [],
        checksum: `castmap-${widget.id}-${state.updatedAt}`,
        version: 1,
        widgetType: payload.widgetType,
        layout: item.layout || payload.layout,
        data: payload.data,
        refreshInterval: payload.refreshInterval,
      };
    }
    const media = state.media.find((asset) => asset.id === item.mediaId);
    return {
      id: item.id,
      mediaId: media?.id || item.mediaId,
      type: playerMediaType(media),
      url: mediaPublicUrl(media, origin),
      isStream: isStreamMedia(media),
      streamType: mediaStreamKind(media),
      cacheable: isCacheableMedia(media),
      localPath: null,
      duration: playlistDurationMs(item.duration),
      priority: item.priority,
      startAt: null,
      endAt: null,
      scheduleRules: [],
      checksum: `castmap-${media?.id || item.mediaId}-${state.updatedAt}`,
      version: 1,
    };
  }).filter((item) => item?.url) : [];
  const fallbackItems = playlistItems.length ? [] : playableMediaAssets(state.media).map((media, index) => ({
    id: `fallback-${media.id}`,
    mediaId: media.id,
    type: playerMediaType(media),
    url: mediaPublicUrl(media, origin),
    isStream: isStreamMedia(media),
    streamType: mediaStreamKind(media),
    cacheable: isCacheableMedia(media),
    localPath: null,
    duration: playlistDurationMs(fallbackDurationSeconds(media)),
    priority: Math.max(1, 100 - index),
    startAt: null,
    endAt: null,
    scheduleRules: [],
    checksum: `castmap-${media.id}-${state.updatedAt}`,
    version: 1,
  }));

  if (!playlist && !fallbackItems.length) {
    return NextResponse.json({
      playlistId: "empty",
      version: 0,
      items: [],
    });
  }

  return NextResponse.json({
    playlistId: playlist?.id || "uploaded-media",
    version,
    items: playlistItems.length ? playlistItems : fallbackItems,
  });
}
