import { NextResponse } from "next/server";
import { handlePosWebhook } from "@/lib/integrations/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = await request.json();
  return NextResponse.json(await handlePosWebhook(payload.integrationId || null, { ...payload, source: "custom_webhook" }));
}
