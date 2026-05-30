import { NextResponse } from "next/server";
import { syncIntegration } from "@/lib/integrations/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await syncIntegration(id);
  if (!result) return NextResponse.json({ ok: false, error: "Integration topilmadi" }, { status: 404 });
  return NextResponse.json(result);
}
