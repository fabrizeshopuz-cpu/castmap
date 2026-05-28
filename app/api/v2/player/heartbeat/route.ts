import { NextResponse } from "next/server";
import { updateCastmapState } from "@/lib/serverState";
import type { PersistedCastmapState } from "@/lib/serverState";

function cleanPlayerCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function resolveMediaId(state: PersistedCastmapState, value: unknown) {
  const id = String(value || "");
  if (!id) return "";
  if (state.media.some((media) => media.id === id)) return id;

  const playlistItem = state.playlists.flatMap((playlist) => playlist.items).find((item) => item.id === id);
  return playlistItem?.mediaId || id;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const deviceId = String(body.deviceId || body.deviceCode || body.code || "").trim();
  const code = cleanPlayerCode(String(body.code || body.deviceCode || ""));
  const now = new Date().toISOString();

  await updateCastmapState((state) => {
    const currentMediaId = resolveMediaId(state, body.currentMediaId);
    state.devices = state.devices.map((device) => {
      const deviceCode = cleanPlayerCode(device.deviceId);
      const matches = device.id === deviceId || device.deviceId === deviceId || Boolean(code && deviceCode.endsWith(code));
      if (!matches) return device;

      return {
        ...device,
        status: body.status === "error" ? "error" : "online",
        signal: Number(body.signal ?? body.internetSignal ?? device.signal ?? 90),
        storage: Number(body.storage ?? body.storageUsedPercent ?? device.storage ?? 0),
        ram: Number(body.ram ?? body.ramUsage ?? device.ram ?? 0),
        cpu: Number(body.cpu ?? body.cpuUsage ?? device.cpu ?? 0),
        apkVersion: body.appVersion || body.apkVersion || device.apkVersion,
        lastSeen: "Hozir",
        lastHeartbeat: now,
        currentMediaId: currentMediaId || device.currentMediaId,
      };
    });
  });

  return NextResponse.json({
    ok: true,
    schema: "castmap.player.heartbeat.v2",
    receivedAt: now,
    deviceId: deviceId || "unknown",
    commandPollAfterSeconds: 10,
  });
}
