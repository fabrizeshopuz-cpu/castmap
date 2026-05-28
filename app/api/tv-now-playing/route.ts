import { NextResponse } from "next/server";
import { updateCastmapState } from "@/lib/serverState";
import type { PersistedCastmapState } from "@/lib/serverState";

function resolveMediaId(state: PersistedCastmapState, value: unknown) {
  const id = String(value || "");
  if (!id) return "";
  if (state.media.some((item) => item.id === id)) return id;

  const playlistItem = state.playlists.flatMap((playlist) => playlist.items).find((item) => item.id === id);
  return playlistItem?.mediaId || id;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  await updateCastmapState((state) => {
    const code = String(body.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const device = state.devices.find((item) => item.id === body.deviceId || item.deviceId === body.deviceId || item.deviceId.toUpperCase().replace(/[^A-Z0-9]/g, "").endsWith(code));
    const mediaId = resolveMediaId(state, body.mediaId || body.currentMediaId);
    const media = state.media.find((item) => item.id === mediaId);
    const playlist = state.playlists.find((item) => item.items.some((playlistItem) => playlistItem.mediaId === mediaId || playlistItem.id === body.mediaId));
    if (!device) return;

    state.devices = state.devices.map((item) => item.id === device.id ? {
      ...item,
      status: "online",
      currentMediaId: mediaId || item.currentMediaId,
      playlist: playlist?.name || item.playlist,
      apkVersion: body.appVersion ? `v${String(body.appVersion).replace(/^v/i, "")}` : item.apkVersion,
      lastSeen: "Hozir",
      lastHeartbeat: new Date().toISOString(),
    } : item);

    if (media) {
      state.media = state.media.map((item) => item.id === media.id ? {
        ...item,
        lastPlayed: new Date().toISOString(),
        playbackCount: item.playbackCount + 1,
      } : item);
    }

    state.playbackLogs = [{
      id: `log-${Date.now()}`,
      deviceId: device.id,
      mediaId,
      playlistId: playlist?.id || "",
      eventType: "start" as const,
      timestamp: new Date().toISOString(),
      durationSeconds: 0,
    }, ...state.playbackLogs].slice(0, 500);
  });

  return NextResponse.json({ ok: true, storedAt: new Date().toISOString() });
}
