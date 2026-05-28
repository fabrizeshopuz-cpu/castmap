import type { MediaAsset } from "@/types/media";

export function StorageAnalytics({ assets }: { assets: MediaAsset[] }) {
  const videoStorage = assets.filter((asset) => asset.type === "video").reduce((sum, asset) => sum + asset.sizeBytes, 0);
  const imageStorage = assets.filter((asset) => asset.type === "image").reduce((sum, asset) => sum + asset.sizeBytes, 0);
  const total = 1_000_000_000_000;
  const used = 687_000_000_000;
  const largest = [...assets].sort((a, b) => b.sizeBytes - a.sizeBytes).slice(0, 3);
  const unused = assets.filter((asset) => asset.usedInPlaylists === 0).length;
  const expired = assets.filter((asset) => asset.status === "expired").length;

  return (
    <section className="glass-panel rounded-2xl p-5">
      <h3 className="text-lg font-black text-white">Storage tahlili</h3>
      <div className="mt-4 grid gap-4">
        <StorageBar label="Total storage" value="1 TB" percent={100} color="bg-white/20" />
        <StorageBar label="Used storage" value="687 GB" percent={(used / total) * 100} color="bg-castGold" />
        <StorageBar label="Free storage" value="313 GB" percent={31.3} color="bg-green-400" />
        <StorageBar label="Video storage" value={`${Math.round(videoStorage / 1_000_000)} MB`} percent={42} color="bg-orange-400" />
        <StorageBar label="Image storage" value={`${Math.round(imageStorage / 1_000_000)} MB`} percent={19} color="bg-blue-400" />
      </div>
      <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 text-sm">
        <b className="text-castGold">Largest files</b>
        {largest.map((asset) => (
          <div key={asset.id} className="flex justify-between gap-3 text-castMuted">
            <span className="truncate">{asset.name}</span>
            <b className="text-white">{asset.size}</b>
          </div>
        ))}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <MiniStat label="Unused files" value={String(unused)} />
          <MiniStat label="Expired files" value={String(expired)} />
        </div>
      </div>
    </section>
  );
}

function StorageBar({ label, value, percent, color }: { label: string; value: string; percent: number; color: string }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-castMuted">{label}</span>
        <b className="text-white">{value}</b>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, percent)}%` }} />
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.055] p-3 backdrop-blur">
      <b className="block text-xl text-white">{value}</b>
      <span className="text-xs text-castMuted">{label}</span>
    </div>
  );
}
