import { Eye, ListPlus, Pencil } from "lucide-react";
import type { ReactNode } from "react";
import { typeText } from "@/lib/mediaData";
import type { MediaAction } from "@/components/media/MediaActionMenu";
import { MediaActionMenu } from "@/components/media/MediaActionMenu";
import { MediaStatusBadge } from "@/components/media/MediaStatusBadge";
import { MediaTags } from "@/components/media/MediaTags";
import type { MediaAsset } from "@/types/media";

export function MediaCard({
  asset,
  openActionId,
  onToggleActions,
  onSelect,
  onPreview,
  onAction,
}: {
  asset: MediaAsset;
  openActionId: string;
  onToggleActions: (id: string) => void;
  onSelect: (asset: MediaAsset) => void;
  onPreview: (asset: MediaAsset) => void;
  onAction: (asset: MediaAsset, action: MediaAction) => void;
}) {
  return (
    <article className={`glass-panel hover-3d group relative min-w-0 cursor-pointer overflow-visible rounded-2xl transition hover:border-castGold/45 hover:shadow-gold ${openActionId === asset.id ? "z-40" : "z-0"}`} onClick={() => onSelect(asset)}>
      <div className="relative aspect-video overflow-hidden bg-[#0F172A]/80">
        <img src={asset.thumbnailUrl} alt={asset.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        <div className="absolute left-3 top-3 rounded-lg border border-white/15 bg-[#0F172A]/72 px-2 py-1 text-[10px] font-black uppercase text-white backdrop-blur-xl">{typeText(asset.type)}</div>
        {asset.duration ? <div className="absolute bottom-3 right-3 rounded-lg border border-white/15 bg-[#0F172A]/72 px-2 py-1 text-xs font-bold text-white backdrop-blur-xl">{asset.duration}</div> : null}
        <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-[#0F172A]/68 backdrop-blur-sm group-hover:flex">
          <HoverButton icon={<Eye className="h-4 w-4" />} label="Preview" onClick={() => onPreview(asset)} />
          <HoverButton icon={<ListPlus className="h-4 w-4" />} label="Playlist" onClick={() => onAction(asset, "playlist")} />
          <HoverButton icon={<Pencil className="h-4 w-4" />} label="Edit" onClick={() => onAction(asset, "edit")} />
        </div>
      </div>
      <div className="grid min-w-0 gap-3 p-4">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="block max-w-full truncate font-black text-white">{asset.name}</h3>
            <p className="mt-1 max-w-full truncate text-xs text-castMuted">{asset.size} / {asset.resolution}</p>
          </div>
          <MediaActionMenu asset={asset} open={openActionId === asset.id} onToggle={() => onToggleActions(asset.id)} onAction={onAction} />
        </div>
        <MediaTags tags={asset.tags.slice(0, 2)} />
        <div className="flex min-w-0 items-center justify-between gap-3 text-xs text-castMuted">
          <MediaStatusBadge status={asset.status} />
          <span className="shrink-0">{asset.usedInPlaylists} playlist</span>
        </div>
        <div className="flex min-w-0 items-center justify-between gap-3 text-xs text-castMuted">
          <span className="min-w-0 truncate">{asset.uploadedBy}</span>
          <span className="shrink-0">{asset.uploadedAt.split(" ").slice(0, 3).join(" ")}</span>
        </div>
      </div>
    </article>
  );
}

function HoverButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button className="flex items-center gap-2 rounded-xl border border-castGold/35 bg-castGold/12 px-3 py-2 text-xs font-bold text-castGold shadow-gold backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-castGold/18" type="button" onClick={(event) => { event.stopPropagation(); onClick(); }}>
      {icon}{label}
    </button>
  );
}
