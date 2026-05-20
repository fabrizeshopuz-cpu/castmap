import { NextResponse } from "next/server";
import { updateCastmapState } from "@/lib/serverState";
import type { CommandType } from "@/types";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const command = {
    id: `cmd-${Date.now()}`,
    deviceId: id,
    type: (body.type || "FORCE_SYNC") as CommandType,
    status: "queued" as const,
    message: "Admin paneldan yuborildi",
    createdAt: new Date().toISOString(),
  };
  await updateCastmapState((state) => {
    state.commands = [command, ...state.commands];
  });
  return NextResponse.json({
    ok: true,
    commandId: command.id,
    deviceId: id,
    type: command.type,
    status: command.status,
    createdAt: command.createdAt,
  });
}
