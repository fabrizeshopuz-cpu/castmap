import { NextResponse } from "next/server";
import { normalizeState, readCastmapState, writeCastmapState } from "@/lib/serverState";
import { STATE_SCHEMA_VERSION } from "@/lib/stateSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ state: await readCastmapState() });
}

export async function PUT(request: Request) {
  const payload = await request.json();
  if (payload?.schemaVersion !== STATE_SCHEMA_VERSION) {
    return NextResponse.json({ ok: false, error: "Unsupported state schema" }, { status: 409 });
  }
  const state = await writeCastmapState(normalizeState(payload));
  return NextResponse.json({ ok: true, state });
}
