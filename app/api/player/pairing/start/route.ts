import { NextResponse } from "next/server";
import { publicRequestOrigin } from "@/lib/playerMedia";

export async function POST(request: Request) {
  const baseUrl = publicRequestOrigin(request);
  return NextResponse.json({
    pairingCode: "482-913",
    qrUrl: `${baseUrl}/devices?pair=482-913`,
    temporaryDeviceId: "temp-cm-box-01",
    expiresIn: 300,
  });
}
