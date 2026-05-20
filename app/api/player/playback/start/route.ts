import { NextResponse } from "next/server";
import { updateCastmapState } from "@/lib/serverState";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  await updateCastmapState((state) => {
    const device = state.devices.find((item) => item.id === body.deviceId || item.deviceId === body.deviceId);
    const playlist = state.playlists.find((item) => item.id === body.playlistId);
    const media = state.media.find((item) => item.id === body.mediaId);
    if (device && media) {
      state.devices = state.devices.map((item) => item.id === device.id ? { ...item, currentMediaId: media.id, playlist: playlist?.name || item.playlist, status: "online", lastHeartbeat: new Date().toISOString() } : item);
      state.media = state.media.map((item) => item.id === media.id ? { ...item, lastPlayed: new Date().toISOString(), playbackCount: item.playbackCount + 1 } : item);
      state.playbackLogs = [{
        id: `log-${Date.now()}`,
        deviceId: device.id,
        mediaId: media.id,
        playlistId: playlist?.id || body.playlistId || "",
        eventType: "start" as const,
        timestamp: new Date().toISOString(),
        durationSeconds: Number(body.durationSeconds || 0),
      }, ...state.playbackLogs].slice(0, 500);
    }
  });
  return NextResponse.json({ ok: true, event: "start", mediaId: body.mediaId, timestamp: new Date().toISOString() });
}
