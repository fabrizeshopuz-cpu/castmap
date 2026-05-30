import { NextResponse } from "next/server";
import { playerWidgetsForDevice, toPlayerWidget } from "@/lib/integrations/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params;
  const widgets = await playerWidgetsForDevice(deviceId);
  return NextResponse.json({ schema: "castmap.player.widgets.v1", deviceId, widgets: widgets.map(toPlayerWidget) });
}
