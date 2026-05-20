import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const uploadDir = path.join(process.cwd(), "data", "uploads");

function safeName(name: string) {
  const ext = path.extname(name).toLowerCase();
  const base = path.basename(name, ext).replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80) || "media";
  return `${base}-${Date.now()}${ext || ".bin"}`;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "Fayl topilmadi" }, { status: 400 });
  }

  const fileName = safeName(file.name);
  const bytes = Buffer.from(await file.arrayBuffer());
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), bytes);

  return NextResponse.json({
    ok: true,
    fileName,
    originalName: file.name,
    mime: file.type || "application/octet-stream",
    sizeBytes: file.size,
    url: `/api/uploads/${encodeURIComponent(fileName)}`,
  });
}
