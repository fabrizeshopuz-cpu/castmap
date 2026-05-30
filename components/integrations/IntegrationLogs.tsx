import type { IntegrationLog } from "@/types/integrations";

export function IntegrationLogs({ logs }: { logs: IntegrationLog[] }) {
  if (!logs.length) return <div className="rounded-xl border border-white/10 bg-white/[0.055] p-4 text-sm text-castMuted">Log hali yo'q.</div>;
  return (
    <div className="grid gap-2">
      {logs.slice(0, 8).map((log) => (
        <div key={log.id} className="rounded-xl border border-white/10 bg-white/[0.055] p-3 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <b className={`text-sm ${log.level === "error" ? "text-red-300" : log.level === "warning" ? "text-orange-300" : log.level === "success" ? "text-green-300" : "text-blue-200"}`}>{log.level.toUpperCase()}</b>
            <span className="text-xs text-castMuted">{new Date(log.createdAt).toLocaleString("uz-UZ")}</span>
          </div>
          <p className="mt-1 text-sm text-white">{log.message}</p>
        </div>
      ))}
    </div>
  );
}
