import { NextResponse } from "next/server";
import { testIntegration } from "@/lib/integrations/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json(await testIntegration(id));
}
