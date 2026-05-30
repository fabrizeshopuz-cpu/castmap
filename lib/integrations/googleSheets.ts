import { z } from "zod";

export const googleSheetsConfigSchema = z.object({
  name: z.string().optional(),
  sheetUrl: z.string().url().optional().or(z.literal("")),
  spreadsheetId: z.string().optional().default(""),
  gid: z.string().optional().default(""),
  sheetName: z.string().default("Sheet1"),
  range: z.string().default("A1:D20"),
  refreshInterval: z.coerce.number().default(300),
  displayStyle: z.enum(["table", "price_list", "menu_board", "ticker", "kpi_cards"]).default("table"),
  authType: z.enum(["public_csv", "oauth", "service_account"]).default("public_csv"),
  publicCsvUrl: z.string().url().optional().or(z.literal("")),
});

export type GoogleSheetsConfig = z.infer<typeof googleSheetsConfigSchema>;

export function validateGoogleSheetConfig(config: unknown) {
  return googleSheetsConfigSchema.safeParse(config);
}

export function parseGoogleSheetUrl(value: string | undefined) {
  if (!value) return { spreadsheetId: "", gid: "" };
  try {
    const url = new URL(value);
    const spreadsheetId = url.pathname.match(/\/spreadsheets\/d\/([^/]+)/)?.[1] || "";
    const gid = url.searchParams.get("gid") || url.hash.match(/gid=([^&]+)/)?.[1] || "";
    return { spreadsheetId, gid };
  } catch {
    const spreadsheetId = value.match(/\/spreadsheets\/d\/([^/]+)/)?.[1] || value;
    const gid = value.match(/[?#&]gid=([^&]+)/)?.[1] || "";
    return { spreadsheetId, gid };
  }
}

function resolveGoogleSheetConfig(config: GoogleSheetsConfig) {
  const parsedUrl = parseGoogleSheetUrl(config.sheetUrl);
  const spreadsheetId = config.spreadsheetId || parsedUrl.spreadsheetId;
  const gid = config.gid || parsedUrl.gid;
  const publicCsvUrl = config.publicCsvUrl
    || (spreadsheetId && gid ? `https://docs.google.com/spreadsheets/d/${encodeURIComponent(spreadsheetId)}/export?format=csv&gid=${encodeURIComponent(gid)}` : "");
  return { ...config, spreadsheetId, gid, publicCsvUrl };
}

function parseCsv(csv: string) {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let quoted = false;
  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];
    if (char === "\"" && quoted && next === "\"") {
      current += "\"";
      index += 1;
    } else if (char === "\"") {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (current || row.length) {
        row.push(current.trim());
        rows.push(row);
        row = [];
        current = "";
      }
      if (char === "\r" && next === "\n") index += 1;
    } else {
      current += char;
    }
  }
  if (current || row.length) {
    row.push(current.trim());
    rows.push(row);
  }
  return rows.filter((item) => item.some(Boolean));
}

export async function fetchGoogleSheetData(configInput: unknown) {
  const parsed = validateGoogleSheetConfig(configInput);
  if (!parsed.success) return mockSheetData();
  const config = resolveGoogleSheetConfig(parsed.data);
  if (!config.spreadsheetId && !config.publicCsvUrl) return mockSheetData();
  const url = config.publicCsvUrl
    || `https://docs.google.com/spreadsheets/d/${encodeURIComponent(config.spreadsheetId)}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(config.sheetName)}`;

  if (config.authType !== "public_csv" && !config.publicCsvUrl) return mockSheetData();

  try {
    const response = await fetch(url, { next: { revalidate: config.refreshInterval } });
    if (!response.ok) throw new Error(`Google Sheets CSV ${response.status}`);
    const rows = parseCsv(await response.text());
    if (!rows.length) return mockSheetData();
    return {
      columns: rows[0],
      rows: rows.slice(1),
      source: "public_csv",
      syncedAt: new Date().toISOString(),
    };
  } catch {
    return mockSheetData();
  }
}

export function transformSheetToWidget(data: { columns: string[]; rows: string[][] }, displayStyle = "table") {
  return {
    type: "google_sheets",
    displayStyle,
    refreshInterval: 300,
    columns: data.columns,
    rows: data.rows,
    data: { columns: data.columns, rows: data.rows },
  };
}

export function mockSheetData() {
  return {
    columns: ["Product", "Price", "Discount", "Status"],
    rows: [
      ["Burger Menu", "45000", "20%", "Active"],
      ["Lavash Set", "39000", "10%", "Active"],
      ["Coffee Combo", "25000", "15%", "Active"],
    ],
    source: "mock",
    syncedAt: new Date().toISOString(),
  };
}
