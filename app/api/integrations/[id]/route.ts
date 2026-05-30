import { NextResponse } from "next/server";
import { deleteIntegration, getIntegration, patchIntegration } from "@/lib/integrations/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getIntegration(id);
  if (!result.integration) return NextResponse.json({ ok: false, error: "Integration topilmadi" }, { status: 404 });
  return NextResponse.json({ ok: true, ...result });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updated = await patchIntegration(id, await request.json());
  if (!updated) return NextResponse.json({ ok: false, error: "Integration topilmadi" }, { status: 404 });
  return NextResponse.json({ ok: true, integration: updated });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json(await deleteIntegration(id));
}
