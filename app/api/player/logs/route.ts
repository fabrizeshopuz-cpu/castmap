import { NextResponse } from "next/server";
import { updateCastmapState } from "@/lib/serverState";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const logId = `log-${Date.now()}`;
  const level = String(body.level || "info");
  const message = String(body.message || "");

  await updateCastmapState((state) => {
    const code = String(body.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const bodyDeviceId = String(body.deviceId || "");
    const device = state.devices.find((item) =>
      item.id === bodyDeviceId
      || item.deviceId === bodyDeviceId
      || (code && item.deviceId.toUpperCase().replace(/[^A-Z0-9]/g, "").endsWith(code))
    );
    if (!device) return;

    state.devices = state.devices.map((item) => item.id === device.id ? {
      ...item,
      status: level === "error" ? "error" : "online",
      apkVersion: body.appVersion ? `v${String(body.appVersion).replace(/^v/i, "")}` : item.apkVersion,
      lastSeen: "Hozir",
      lastHeartbeat: new Date().toISOString(),
    } : item);

    if (level === "error") {
      state.playbackLogs = [{
        id: logId,
        deviceId: device.id,
        mediaId: String(body.mediaId || ""),
        playlistId: state.playlists.find((playlist) => playlist.items.some((item) => item.mediaId === body.mediaId))?.id || "",
        eventType: "error" as const,
        timestamp: new Date().toISOString(),
        durationSeconds: 0,
      }, ...state.playbackLogs].slice(0, 500);

      state.alerts = [{
        id: `alert-${Date.now()}`,
        type: "playback_error" as const,
        title: message || "Player video ijro xatosi",
        deviceId: device.id,
        severity: "high" as const,
        status: "open" as const,
        createdAt: new Date().toISOString(),
      }, ...state.alerts].slice(0, 200);
    }
  });

  return NextResponse.json({ ok: true, logId, level });
}
