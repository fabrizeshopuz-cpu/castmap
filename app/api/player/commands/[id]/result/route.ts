import { NextResponse } from "next/server";
import { updateCastmapState } from "@/lib/serverState";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  await updateCastmapState((state) => {
    state.commands = state.commands.map((command) => command.id === id ? {
      ...command,
      status: body.status === "failed" ? "failed" : "success",
      message: body.message || "Buyruq bajarildi",
    } : command);
  });
  return NextResponse.json({
    ok: true,
    commandId: id,
    status: body.status || "success",
    storedAt: new Date().toISOString(),
  });
}
