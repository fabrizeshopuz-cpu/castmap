import { NextResponse } from "next/server";
import { deleteWidget, patchWidget } from "@/lib/integrations/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const widget = await patchWidget(id, await request.json());
  if (!widget) return NextResponse.json({ ok: false, error: "Widget topilmadi" }, { status: 404 });
  return NextResponse.json({ ok: true, widget });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json(await deleteWidget(id));
}
