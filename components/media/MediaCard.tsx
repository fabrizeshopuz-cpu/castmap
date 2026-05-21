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
    <article className={`group relative cursor-pointer overflow-visible rounded-2xl border border-white/10 bg-castCard transition hover:border-castGold/45 hover:bg-castPanel hover:shadow-gold ${openActionId === asset.id ? "z-40" : "z-0"}`} onClick={() => onSelect(asset)}>
      <div className="relative aspect-video overflow-hidden bg-black">
        <img src={asset.thumbnailUrl} alt={asset.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        <div className="absolute left-3 top-3 rounded-lg border border-white/10 bg-black/65 px-2 py-1 text-[10px] font-black uppercase text-white">{typeText(asset.type)}</div>
        {asset.duration ? <div className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2 py-1 text-xs font-bold text-white">{asset.duration}</div> : null}
        <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-black/55 group-hover:flex">
          <HoverButton icon={<Eye className="h-4 w-4" />} label="Preview" onClick={() => onPreview(asset)} />
          <HoverButton icon={<ListPlus className="h-4 w-4" />} label="Playlist" onClick={() => onAction(asset, "playlist")} />
          <HoverButton icon={<Pencil className="h-4 w-4" />} label="Edit" onClick={() => onAction(asset, "edit")} />
        </div>
      </div>
      <div className="grid gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-black text-white">{asset.name}</h3>
            <p className="mt-1 text-xs text-castMuted">{asset.size} • {asset.resolution}</p>
          </div>
          <MediaActionMenu asset={asset} open={openActionId === asset.id} onToggle={() => onToggleActions(asset.id)} onAction={onAction} />
        </div>
        <MediaTags tags={asset.tags.slice(0, 2)} />
        <div className="flex items-center justify-between gap-3 text-xs text-castMuted">
          <MediaStatusBadge status={asset.status} />
          <span>{asset.usedInPlaylists} playlist</span>
        </div>
        <div className="flex items-center justify-between text-xs text-castMuted">
          <span>{asset.uploadedBy}</span>
          <span>{asset.uploadedAt.split(" ").slice(0, 3).join(" ")}</span>
        </div>
      </div>
    </article>
  );
}

function HoverButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button className="flex items-center gap-2 rounded-xl border border-castGold/30 bg-black/70 px-3 py-2 text-xs font-bold text-castGold" type="button" onClick={(event) => { event.stopPropagation(); onClick(); }}>
      {icon}{label}
    </button>
  );
}
