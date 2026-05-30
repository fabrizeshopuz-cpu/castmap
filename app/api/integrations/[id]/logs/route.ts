import { NextResponse } from "next/server";
import { getIntegration } from "@/lib/integrations/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getIntegration(id);
  return NextResponse.json({ ok: true, logs: result.logs });
}
