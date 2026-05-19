import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    pairingCode: "482-913",
    qrUrl: "https://api.castmap.uz/pair/482-913",
    temporaryDeviceId: "temp-cm-box-01",
    expiresIn: 300,
  });
}
