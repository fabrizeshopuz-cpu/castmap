import { NextResponse } from "next/server";
import { updateCastmapState } from "@/lib/serverState";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const cleanCode = String(body.code || "482913").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const deviceId = body.deviceId || `CM-PAIR-${cleanCode || Date.now()}`;
  const branchId = body.branchId || "branch-main";
  await updateCastmapState((state) => {
    const branch = state.branches.find((item) => item.id === branchId) || state.branches[0];
    if (!state.devices.some((device) => device.deviceId === deviceId)) {
      state.devices = [{
        id: `device-${Date.now()}`,
        name: body.deviceName || "CASTMAP Player",
        deviceId,
        branch: branch?.name || "Biriktirilmagan",
        branchId: branch?.id || branchId,
        location: branch?.address || "TV lokatsiya",
        type: "CASTMAP Box",
        status: "online",
        signal: 95,
        storage: 0,
        ram: 0,
        cpu: 0,
        playlist: state.playlists[0]?.name || "Playlist biriktirilmagan",
        lastSeen: "Hozir",
        apkVersion: body.appVersion || "v1.0.0",
        ipAddress: body.ipAddress || "0.0.0.0",
        macAddress: body.macAddress || "",
        uptime: "0 kun 0 soat",
        screenResolution: "1920 x 1080",
        lastHeartbeat: new Date().toISOString(),
        screenshotUrl: "",
      }, ...state.devices];
    }
  });
  return NextResponse.json({
    ok: true,
    message: "Qurilma muvaffaqiyatli ulandi",
    deviceId,
    branchId,
  });
}
