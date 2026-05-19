import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const paired = code.replace("%20", "").length >= 6;
  return NextResponse.json({
    paired,
    accessToken: paired ? "mock-access-token" : null,
    refreshToken: paired ? "mock-refresh-token" : null,
    deviceId: paired ? "CM-BOX-482913" : null,
    organizationId: paired ? "org-castmap" : null,
    branchId: paired ? "branch-andijon" : null,
    deviceName: paired ? "CASTMAP Box 01" : null,
  });
}
