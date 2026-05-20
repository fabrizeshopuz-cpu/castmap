import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dataDir = path.join(process.cwd(), "data");
const statePath = path.join(dataDir, "castmap-state.json");

export async function GET() {
  try {
    const raw = await readFile(statePath, "utf8");
    return NextResponse.json({ state: JSON.parse(raw) });
  } catch {
    return NextResponse.json({ state: null });
  }
}

export async function PUT(request: Request) {
  const payload = await request.json();
  if (payload?.schemaVersion !== 2) {
    return NextResponse.json({ ok: false, error: "Unsupported state schema" }, { status: 409 });
  }
  await mkdir(dataDir, { recursive: true });
  await writeFile(statePath, JSON.stringify(payload, null, 2), "utf8");
  return NextResponse.json({ ok: true });
}
