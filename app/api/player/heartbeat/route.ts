import { NextResponse } from "next/server";
import { updateCastmapState } from "@/lib/serverState";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  await updateCastmapState((state) => {
    state.devices = state.devices.map((device) => {
      const matches = device.id === body.deviceId || device.deviceId === body.deviceId;
      if (!matches) return device;
      return {
        ...device,
        status: body.status === "error" ? "error" : "online",
        signal: body.internetStatus === "offline" ? 0 : Math.max(1, Number(body.internetSignal || device.signal || 90)),
        storage: Number(body.storageUsedPercent || device.storage || 0),
        ram: Number(body.ramUsage || device.ram || 0),
        cpu: Number(body.cpuUsage || device.cpu || 0),
        apkVersion: body.appVersion || device.apkVersion,
        lastSeen: "Hozir",
        lastHeartbeat: new Date().toISOString(),
        currentMediaId: body.currentMediaId || device.currentMediaId,
      };
    });
  });
  return NextResponse.json({
    ok: true,
    receivedAt: new Date().toISOString(),
    deviceId: body.deviceId || "unknown",
    commandPollAfterSeconds: 10,
  });
}
