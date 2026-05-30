import { NextResponse } from "next/server";
import { createIntegration, listIntegrations } from "@/lib/integrations/server";
import type { IntegrationType } from "@/types/integrations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await listIntegrations());
}

export async function POST(request: Request) {
  const payload = await request.json();
  if (!payload?.type) return NextResponse.json({ ok: false, error: "Integration type kerak" }, { status: 400 });
  const result = await createIntegration({ ...payload, type: payload.type as IntegrationType });
  return NextResponse.json({ ok: true, integration: result.integration });
}
