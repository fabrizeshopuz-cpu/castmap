import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    ok: true,
    commandId: id,
    status: body.status || "success",
    storedAt: new Date().toISOString(),
  });
}
