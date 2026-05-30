import { NextResponse } from "next/server";
import { readCastmapState } from "@/lib/serverState";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ widgetId: string }> }) {
  const { widgetId } = await params;
  const state = await readCastmapState();
  const widget = state.integrationWidgets.find((item) => item.id === widgetId);

  if (!widget || widget.status !== "active") {
    return htmlResponse(renderMessage("Widget topilmadi", "Bu integration widget aktiv emas yoki o'chirilgan."));
  }

  if (widget.type === "google_sheets") return htmlResponse(renderGoogleSheets(widget.name, widget.previewData, widget.config));
  if (widget.type === "weather") return htmlResponse(renderWeather(widget.name, widget.previewData));
  if (widget.type === "telegram" || widget.type === "rss") return htmlResponse(renderFeed(widget.name, widget.previewData));
  return htmlResponse(renderGeneric(widget.name, widget.type, widget.previewData));
}

function htmlResponse(body: string) {
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function renderShell(title: string, content: string, refreshSeconds = 300) {
  return `<!doctype html>
<html lang="uz">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="refresh" content="${refreshSeconds}" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: dark; --bg:#0f172a; --panel:rgba(15,23,42,.86); --line:rgba(255,255,255,.14); --gold:#d4af37; --muted:#94a3b8; --text:#f8fafc; --blue:#3b82f6; --green:#22c55e; }
    * { box-sizing:border-box; }
    html, body { width:100%; height:100%; margin:0; overflow:hidden; background:#0f172a; color:var(--text); font-family:Inter, Arial, sans-serif; }
    body { background:
      radial-gradient(circle at 14% 18%, rgba(59,130,246,.26), transparent 34%),
      radial-gradient(circle at 82% 12%, rgba(212,175,55,.22), transparent 32%),
      linear-gradient(135deg, #0f172a 0%, #111827 52%, #0b1220 100%);
    }
    .screen { width:100vw; height:100vh; padding:42px; display:flex; flex-direction:column; gap:22px; }
    .top { display:flex; align-items:center; justify-content:space-between; gap:24px; }
    .brand { display:flex; flex-direction:column; gap:6px; }
    .eyebrow { color:var(--gold); font-size:16px; font-weight:900; letter-spacing:.18em; text-transform:uppercase; }
    h1 { margin:0; font-size:42px; line-height:1.08; letter-spacing:0; }
    .status { display:flex; align-items:center; gap:10px; color:#bbf7d0; font-size:18px; font-weight:800; padding:12px 16px; border:1px solid rgba(34,197,94,.34); border-radius:18px; background:rgba(34,197,94,.12); }
    .dot { width:10px; height:10px; border-radius:50%; background:var(--green); box-shadow:0 0 24px rgba(34,197,94,.75); }
    .panel { flex:1; min-height:0; border:1px solid var(--line); border-radius:28px; background:var(--panel); box-shadow:0 34px 90px rgba(0,0,0,.36), 0 0 70px rgba(212,175,55,.12); backdrop-filter:blur(18px); overflow:hidden; }
    table { width:100%; border-collapse:collapse; table-layout:fixed; }
    thead { background:linear-gradient(90deg, rgba(212,175,55,.24), rgba(59,130,246,.12)); }
    th, td { border-bottom:1px solid rgba(255,255,255,.08); border-right:1px solid rgba(255,255,255,.06); padding:10px 12px; text-align:left; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
    th { color:#fde68a; font-weight:900; font-size:12px; text-transform:uppercase; letter-spacing:.03em; }
    td { color:#f8fafc; font-weight:760; font-size:14px; }
    tbody tr:nth-child(odd) { background:rgba(255,255,255,.035); }
    tbody tr:nth-child(even) { background:rgba(59,130,246,.035); }
    tbody tr:first-child td { color:#facc15; font-weight:900; }
    .cards { height:100%; display:grid; grid-template-columns:repeat(3, 1fr); gap:18px; padding:24px; }
    .card { border:1px solid var(--line); border-radius:24px; background:rgba(255,255,255,.065); padding:26px; display:flex; flex-direction:column; justify-content:center; min-height:0; box-shadow:inset 0 1px 0 rgba(255,255,255,.12); }
    .label { color:var(--muted); font-size:18px; font-weight:800; }
    .value { color:var(--text); font-size:42px; font-weight:950; margin-top:10px; overflow:hidden; text-overflow:ellipsis; }
    .footer { color:var(--muted); font-size:14px; display:flex; justify-content:space-between; gap:20px; }
    .message { height:100%; display:flex; align-items:center; justify-content:center; text-align:center; padding:48px; }
    .message h2 { color:var(--gold); font-size:54px; margin:0 0 12px; }
    .message p { color:var(--muted); font-size:24px; margin:0; }
  </style>
</head>
<body>
  <main class="screen">
    <section class="top">
      <div class="brand">
        <div class="eyebrow">CASTMAP LIVE WIDGET</div>
        <h1>${escapeHtml(title)}</h1>
      </div>
      <div class="status"><span class="dot"></span> Live sync</div>
    </section>
    ${content}
    <section class="footer">
      <span>castmap.uz</span>
      <span>${escapeHtml(new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" }))}</span>
    </section>
  </main>
</body>
</html>`;
}

function renderGoogleSheets(title: string, previewData: unknown, config: Record<string, unknown>) {
  const data = asRecord(previewData);
  const nested = asRecord(data.data);
  const columns = toStringList(data.columns).length ? toStringList(data.columns) : toStringList(nested.columns);
  const rows = toRows(data.rows).length ? toRows(data.rows) : toRows(nested.rows);
  const refresh = Number(config.refreshInterval || data.refreshInterval || 300);

  if (!columns.length && !rows.length) return renderMessage(title, "Google Sheets ma'lumotlari hali sync qilinmagan.");
  const header = columns.length ? columns : (rows[0] || []).map((_, index) => `Col ${index + 1}`);
  const bodyRows = rows.length ? rows : [];
  const table = `<section class="panel"><table>
    <thead><tr>${header.map((item) => `<th>${escapeHtml(item)}</th>`).join("")}</tr></thead>
    <tbody>${bodyRows.map((row) => `<tr>${header.map((_, index) => `<td>${escapeHtml(row[index] || "")}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></section>`;

  return renderShell(title, table, Number.isFinite(refresh) ? refresh : 300);
}

function renderWeather(title: string, previewData: unknown) {
  const data = asRecord(previewData);
  const cards = [
    ["Shahar", data.city || "Toshkent"],
    ["Harorat", `${data.temp || "--"} C`],
    ["Holat", data.condition || "Ob-havo"],
  ];
  return renderShell(title, renderCards(cards));
}

function renderFeed(title: string, previewData: unknown) {
  const data = asRecord(previewData);
  const items = Array.isArray(data.items) ? data.items : Array.isArray(data.messages) ? data.messages : [];
  const cards = items.slice(0, 6).map((item, index) => {
    const record = asRecord(item);
    return [`${index + 1}`, record.title || record.text || item];
  });
  return renderShell(title, cards.length ? renderCards(cards) : `<section class="panel">${renderInlineMessage("Feed bo'sh")}</section>`);
}

function renderGeneric(title: string, type: string, previewData: unknown) {
  const data = asRecord(previewData);
  const cards = Object.entries(data).slice(0, 6).map(([key, value]) => [key, Array.isArray(value) ? `${value.length} item` : value]);
  return renderShell(title, cards.length ? renderCards(cards) : `<section class="panel">${renderInlineMessage(type)}</section>`);
}

function renderMessage(title: string, message: string) {
  return renderShell(title, `<section class="panel">${renderInlineMessage(message)}</section>`, 60);
}

function renderInlineMessage(message: string) {
  return `<div class="message"><div><h2>CASTMAP</h2><p>${escapeHtml(message)}</p></div></div>`;
}

function renderCards(cards: unknown[][]) {
  return `<section class="panel"><div class="cards">${cards.map(([label, value]) => `
    <div class="card">
      <div class="label">${escapeHtml(String(label))}</div>
      <div class="value">${escapeHtml(String(value ?? ""))}</div>
    </div>`).join("")}</div></section>`;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function toStringList(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item ?? "")) : [];
}

function toRows(value: unknown) {
  return Array.isArray(value)
    ? value.map((row) => Array.isArray(row) ? row.map((cell) => String(cell ?? "")) : []).filter((row) => row.length)
    : [];
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
