import { NextResponse } from "next/server";
import { readCastmapState } from "@/lib/serverState";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const state = await readCastmapState();
  const device = state.devices.find((item) => item.id === id || item.deviceId === id);
  const commands = state.commands.filter((command) =>
    (command.deviceId === id || command.deviceId === device?.id || command.deviceId === device?.deviceId)
    && (command.status === "queued" || command.status === "running")
  );
  return NextResponse.json({
    deviceId: id,
    commands: commands.map((command) => ({
      commandId: command.id,
      type: command.type,
      payload: {},
      createdAt: command.createdAt,
    })),
  });
}
