import { X } from "lucide-react";
import type { MediaAsset } from "@/types/media";

export function MediaPreviewModal({ asset, onClose }: { asset: MediaAsset | null; onClose: () => void }) {
  if (!asset) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-5 backdrop-blur">
      <section className="w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-castCard shadow-2xl">
        <header className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <h2 className="text-xl font-black text-white">{asset.name}</h2>
            <p className="text-sm text-castMuted">{asset.format} • {asset.resolution}</p>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-castMuted hover:text-white" type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="grid min-h-[560px] place-items-center bg-black">
          {asset.type === "video" ? (
            <video src={asset.fileUrl} poster={asset.thumbnailUrl} controls muted className="max-h-[70vh] w-full object-contain" />
          ) : asset.type === "image" ? (
            <img src={asset.fileUrl} alt={asset.name} className="max-h-[70vh] w-full object-contain" />
          ) : asset.type === "web" || asset.type === "html" ? (
            <iframe src={asset.fileUrl === "about:blank" ? undefined : asset.fileUrl} title={asset.name} className="h-[70vh] w-full bg-white" />
          ) : (
            <div className="rounded-2xl border border-castGold/25 bg-castGold/10 p-10 text-center">
              <b className="text-3xl text-castGold">PDF preview</b>
              <p className="mt-3 text-castMuted">Fayl: {asset.name}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
