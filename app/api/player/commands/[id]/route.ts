import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({
    deviceId: id,
    commands: [
      {
        commandId: "cmd-force-sync",
        type: "FORCE_SYNC",
        payload: {},
        createdAt: new Date().toISOString(),
      },
    ],
  });
}
