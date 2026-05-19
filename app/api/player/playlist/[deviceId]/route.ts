import { NextResponse } from "next/server";
import { mediaAssets, playlists } from "@/lib/mockData";

export async function GET(_: Request, { params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = await params;
  const playlist = playlists[0];
  if (!playlist) {
    return NextResponse.json({
      deviceId,
      playlistId: null,
      version: "empty",
      items: [],
      message: "Kontent biriktirilmagan",
    });
  }
  return NextResponse.json({
    deviceId,
    playlistId: playlist.id,
    version: "2026.05.18.1",
    items: playlist.items.map((item) => {
      const media = mediaAssets.find((asset) => asset.id === item.mediaId) || mediaAssets[0];
      return {
        id: item.id,
        mediaId: media.id,
        type: media.type,
        url: media.fileUrl,
        duration: item.duration,
        priority: item.priority,
        startAt: null,
        endAt: null,
        scheduleRules: [],
        checksum: `mock-${media.id}`,
        version: 1,
      };
    }),
  });
}
