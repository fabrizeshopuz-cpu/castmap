import { NextResponse } from "next/server";
import { handleTelegramWebhook } from "@/lib/integrations/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return NextResponse.json(await handleTelegramWebhook(await request.json()));
}
