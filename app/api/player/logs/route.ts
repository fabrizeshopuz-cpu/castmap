import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true, logId: `log-${Date.now()}`, level: body.level || "info" });
}
