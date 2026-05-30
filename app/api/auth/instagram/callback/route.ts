import { NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/integrations/instagram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code") || "";
  return NextResponse.json({ ok: true, provider: "instagram", token: await exchangeCodeForToken(code), mode: "oauth-ready" });
}
