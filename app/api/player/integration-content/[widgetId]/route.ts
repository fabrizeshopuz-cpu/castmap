import { NextResponse } from "next/server";
import { playerIntegrationContent } from "@/lib/integrations/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ widgetId: string }> }) {
  const { widgetId } = await params;
  const content = await playerIntegrationContent(widgetId);
  if (!content) return NextResponse.json({ ok: false, error: "Widget topilmadi" }, { status: 404 });
  return NextResponse.json(content);
}
