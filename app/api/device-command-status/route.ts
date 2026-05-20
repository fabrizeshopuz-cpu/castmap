import { NextResponse } from "next/server";
import { updateCastmapState } from "@/lib/serverState";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const commandId = String(body.commandId || "");
  await updateCastmapState((state) => {
    state.commands = state.commands.map((command) => {
      const sameCommand = command.id === commandId || (!commandId || commandId === "0") && command.type.toLowerCase().includes(String(body.command || "").toLowerCase());
      if (!sameCommand) return command;
      return {
        ...command,
        status: String(body.status || "").toLowerCase().includes("xato") ? "failed" : "success",
        message: String(body.status || "Buyruq bajarildi"),
      };
    });
  });

  return NextResponse.json({
    ok: true,
    commandId,
    storedAt: new Date().toISOString(),
  });
}
