import { NextResponse } from "next/server";
import { hasDatabaseUrl } from "@/lib/serverDb";
import { STATE_SCHEMA_VERSION } from "@/lib/stateSchema";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    app: "CASTMAP",
    product: "Retail Media Infrastructure Platform",
    status: "ok",
    schemaVersion: STATE_SCHEMA_VERSION,
    persistence: hasDatabaseUrl() ? "postgres" : "local-json",
    commit: process.env.RENDER_GIT_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA || "local",
    timestamp: new Date().toISOString(),
  });
}
