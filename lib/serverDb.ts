import { Pool } from "pg";
import type { PersistedCastmapState } from "@/lib/serverState";

let pool: Pool | null = null;
let initialized = false;

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    const isLocal = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    });
  }
  return pool;
}

async function ensureDatabase() {
  const db = getPool();
  if (!db || initialized) return db;
  await db.query(`
    CREATE TABLE IF NOT EXISTS castmap_app_state (
      id TEXT PRIMARY KEY,
      state JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS castmap_uploaded_files (
      file_name TEXT PRIMARY KEY,
      original_name TEXT NOT NULL,
      mime TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      data BYTEA NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  initialized = true;
  return db;
}

export async function readStateFromDb() {
  const db = await ensureDatabase();
  if (!db) return null;
  const result = await db.query<{ state: PersistedCastmapState }>("SELECT state FROM castmap_app_state WHERE id = $1", ["main"]);
  return result.rows[0]?.state || null;
}

export async function writeStateToDb(state: PersistedCastmapState) {
  const db = await ensureDatabase();
  if (!db) return null;
  await db.query(
    `INSERT INTO castmap_app_state (id, state, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (id) DO UPDATE SET state = EXCLUDED.state, updated_at = NOW()`,
    ["main", JSON.stringify(state)],
  );
  return state;
}

export async function saveUploadedFileToDb(input: {
  fileName: string;
  originalName: string;
  mime: string;
  sizeBytes: number;
  data: Buffer;
}) {
  const db = await ensureDatabase();
  if (!db) return false;
  await db.query(
    `INSERT INTO castmap_uploaded_files (file_name, original_name, mime, size_bytes, data, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (file_name) DO UPDATE SET
       original_name = EXCLUDED.original_name,
       mime = EXCLUDED.mime,
       size_bytes = EXCLUDED.size_bytes,
       data = EXCLUDED.data`,
    [input.fileName, input.originalName, input.mime, input.sizeBytes, input.data],
  );
  return true;
}

export async function readUploadedFileFromDb(fileName: string) {
  const db = await ensureDatabase();
  if (!db) return null;
  const result = await db.query<{ file_name: string; mime: string; size_bytes: number; data: Buffer }>(
    "SELECT file_name, mime, size_bytes, data FROM castmap_uploaded_files WHERE file_name = $1",
    [fileName],
  );
  return result.rows[0] || null;
}
