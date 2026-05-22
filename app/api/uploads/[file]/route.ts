import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { readUploadedFileFromDb } from "@/lib/serverDb";

const uploadDir = path.join(process.cwd(), "data", "uploads");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

type ParsedRange = { start: number; end: number; partial: boolean };

function parseRangeHeader(value: string | null, size: number): ParsedRange | null {
  if (!value) return { start: 0, end: Math.max(0, size - 1), partial: false };

  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim());
  if (!match) return null;

  const [, rawStart, rawEnd] = match;
  if (!rawStart && !rawEnd) return null;

  let start: number;
  let end: number;

  if (!rawStart) {
    const suffixLength = Number(rawEnd);
    if (!Number.isFinite(suffixLength) || suffixLength <= 0) return null;
    start = Math.max(size - suffixLength, 0);
    end = size - 1;
  } else {
    start = Number(rawStart);
    end = rawEnd ? Number(rawEnd) : size - 1;
  }

  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end < start || start >= size) {
    return null;
  }

  return { start, end: Math.min(end, size - 1), partial: true };
}

function uploadHeaders(mime: string, size: number, range: ParsedRange) {
  const length = range.end - range.start + 1;
  const headers = new Headers({
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Length": String(length),
    "Content-Type": mime,
  });

  if (range.partial) {
    headers.set("Content-Range", `bytes ${range.start}-${range.end}/${size}`);
  }

  return headers;
}

function rangeNotSatisfiable(size: number) {
  return new Response(null, {
    status: 416,
    headers: {
      "Accept-Ranges": "bytes",
      "Content-Range": `bytes */${size}`,
    },
  });
}

async function uploadResponse(request: Request, params: Promise<{ file: string }>, headOnly = false) {
  const { file } = await params;
  const safeFile = path.basename(decodeURIComponent(file));
  const dbFile = await readUploadedFileFromDb(safeFile);
  if (dbFile) {
    const data = Buffer.isBuffer(dbFile.data) ? dbFile.data : Buffer.from(dbFile.data);
    const size = data.length;
    const range = parseRangeHeader(request.headers.get("range"), size);
    if (!range) return rangeNotSatisfiable(size);

    const body = headOnly ? null : new Uint8Array(data.subarray(range.start, range.end + 1));
    return new Response(body, {
      status: range.partial ? 206 : 200,
      headers: uploadHeaders(dbFile.mime || mimeByExt[path.extname(safeFile).toLowerCase()] || "application/octet-stream", size, range),
    });
  }

  try {
    const filePath = path.join(uploadDir, safeFile);
    const fileStat = await stat(filePath);
    const range = parseRangeHeader(request.headers.get("range"), fileStat.size);
    if (!range) return rangeNotSatisfiable(fileStat.size);

    return new Response(headOnly ? null : Readable.toWeb(createReadStream(filePath, { start: range.start, end: range.end })) as BodyInit, {
      status: range.partial ? 206 : 200,
      headers: uploadHeaders(mimeByExt[path.extname(safeFile).toLowerCase()] || "application/octet-stream", fileStat.size, range),
    });
  } catch {
    return NextResponse.json({ ok: false, message: "Fayl topilmadi" }, { status: 404 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ file: string }> }) {
  return uploadResponse(request, params);
}

export async function HEAD(request: Request, { params }: { params: Promise<{ file: string }> }) {
  return uploadResponse(request, params, true);
}
