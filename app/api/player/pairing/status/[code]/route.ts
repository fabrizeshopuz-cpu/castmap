import { NextResponse } from "next/server";
import { readCastmapState } from "@/lib/serverState";

function cleanCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export async function GET(_: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const state = await readCastmapState();
  const normalizedCode = cleanCode(code);
  const device = state.devices.find((item) => cleanCode(item.deviceId).endsWith(normalizedCode));
  const paired = Boolean(device);
  return NextResponse.json({
    paired,
    accessToken: paired ? "mock-access-token" : null,
    refreshToken: paired ? "mock-refresh-token" : null,
    deviceId: paired ? device?.deviceId : null,
    organizationId: paired ? "org-castmap" : null,
    branchId: paired ? device?.branchId : null,
    deviceName: paired ? device?.name : null,
  });
}
