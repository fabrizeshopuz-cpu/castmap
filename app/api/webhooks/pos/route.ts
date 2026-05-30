import { NextResponse } from "next/server";
import { handlePosWebhook } from "@/lib/integrations/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = request.headers.get("x-castmap-secret");
  const payload = await request.json();
  if (process.env.CASTMAP_WEBHOOK_SECRET && secret !== process.env.CASTMAP_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "Invalid webhook secret" }, { status: 401 });
  }
  return NextResponse.json(await handlePosWebhook(payload.integrationId || null, payload));
}
