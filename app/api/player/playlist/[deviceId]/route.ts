import { NextResponse } from "next/server";
import { fallbackDurationSeconds, isCacheableMedia, isStreamMedia, mediaPublicUrl, mediaStreamKind, playableMediaAssets, playerMediaType, playlistDurationMs, publicRequestOrigin } from "@/lib/playerMedia";
import { readCastmapState } from "@/lib/serverState";

export async function GET(request: Request, { params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params;
  const origin = publicRequestOrigin(request);
  const state = await readCastmapState();
  const device = state.devices.find((item) => item.id === deviceId || item.deviceId === deviceId);
  const playlist = state.playlists.find((item) => device && item.deviceIds?.includes(device.id) && item.status === "published")
    || state.playlists.find((item) => device && item.branchId === device.branchId && item.status === "published")
    || state.playlists.find((item) => item.name === device?.playlist)
    || state.playlists.find((item) => item.target === device?.branch && item.status === "published")
    || state.playlists.find((item) => item.status === "published")
    || state.playlists[0];
  const items = playlist ? playlist.items.map((item) => {
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
  }).filter((item) => item.url) : [];
  const fallbackItems = items.length ? [] : playableMediaAssets(state.media).map((media, index) => ({
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
      deviceId,
      playlistId: null,
      version: 0,
      items: [],
      message: "Kontent biriktirilmagan",
    });
  }
  return NextResponse.json({
    deviceId: device?.deviceId || deviceId,
    playlistId: playlist?.id || "uploaded-media",
    version: Date.parse(state.updatedAt) || Date.now(),
    items: items.length ? items : fallbackItems,
  });
}
