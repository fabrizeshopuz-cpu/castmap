import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const baseUrl = new URL(request.url).origin;
  return NextResponse.json({
    pairingCode: "482-913",
    qrUrl: `${baseUrl}/devices?pair=482-913`,
    temporaryDeviceId: "temp-cm-box-01",
    expiresIn: 300,
  });
}
