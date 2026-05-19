import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    commandId: `cmd-${Date.now()}`,
    deviceId: id,
    type: body.type || "FORCE_SYNC",
    status: "queued",
    createdAt: new Date().toISOString(),
  });
}
