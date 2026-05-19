import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    screenshotUrl: "https://cdn.castmap.uz/screenshots/mock-current-screen.jpg",
    uploadedAt: new Date().toISOString(),
  });
}
