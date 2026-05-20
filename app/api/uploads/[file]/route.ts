import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const uploadDir = path.join(process.cwd(), "data", "uploads");

const mimeByExt: Record<string, string> = {
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".html": "text/html; charset=utf-8",
};

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const safeFile = path.basename(decodeURIComponent(file));
  try {
    const buffer = await readFile(path.join(uploadDir, safeFile));
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": mimeByExt[path.extname(safeFile).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, message: "Fayl topilmadi" }, { status: 404 });
  }
}
