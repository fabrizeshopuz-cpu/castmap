import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true, event: "start", mediaId: body.mediaId, timestamp: new Date().toISOString() });
}
