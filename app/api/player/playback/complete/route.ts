import { NextResponse } from "next/server";
import { updateCastmapState } from "@/lib/serverState";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  await updateCastmapState((state) => {
    const device = state.devices.find((item) => item.id === body.deviceId || item.deviceId === body.deviceId);
    if (device && body.mediaId) {
      state.playbackLogs = [{
        id: `log-${Date.now()}`,
        deviceId: device.id,
        mediaId: body.mediaId,
        playlistId: body.playlistId || "",
        eventType: "complete" as const,
        timestamp: new Date().toISOString(),
        durationSeconds: Number(body.durationSeconds || 0),
      }, ...state.playbackLogs].slice(0, 500);
    }
  });
  return NextResponse.json({ ok: true, event: "complete", mediaId: body.mediaId, timestamp: new Date().toISOString() });
}
