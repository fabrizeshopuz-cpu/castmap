import { NextResponse } from "next/server";
import { createWidget, listIntegrations } from "@/lib/integrations/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await listIntegrations();
  return NextResponse.json({ ok: true, widgets: result.widgets });
}

export async function POST(request: Request) {
  const widget = await createWidget(await request.json());
  if (!widget) return NextResponse.json({ ok: false, error: "Integratsiya topilmadi" }, { status: 404 });
  return NextResponse.json({ ok: true, widget });
}
