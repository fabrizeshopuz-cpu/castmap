import { typeText } from "@/lib/mediaData";
import type { MediaAction } from "@/components/media/MediaActionMenu";
import { MediaActionMenu } from "@/components/media/MediaActionMenu";
import { MediaStatusBadge } from "@/components/media/MediaStatusBadge";
import { MediaTags } from "@/components/media/MediaTags";
import type { MediaAsset } from "@/types/media";

export function MediaListView({
  assets,
  openActionId,
  onToggleActions,
  onSelect,
  onAction,
}: {
  assets: MediaAsset[];
  openActionId: string;
  onToggleActions: (id: string) => void;
  onSelect: (asset: MediaAsset) => void;
  onAction: (asset: MediaAsset, action: MediaAction) => void;
}) {
  return (
    <div className="glass-panel overflow-hidden rounded-2xl">
      <div className="grid min-w-[1100px] grid-cols-[90px_1.4fr_110px_110px_130px_110px_130px_180px_120px_140px_110px_70px] gap-3 border-b border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-castMuted">
        <span>Preview</span><span>Nomi</span><span>Turi</span><span>Hajmi</span><span>Resolution</span><span>Duration</span><span>Status</span><span>Taglar</span><span>Yuklagan</span><span>Sana</span><span>Playlist</span><span />
      </div>
      <div className="overflow-x-auto">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="grid min-w-[1100px] grid-cols-[90px_1.4fr_110px_110px_130px_110px_130px_180px_120px_140px_110px_70px] items-center gap-3 border-b border-white/10 px-4 py-3 text-left text-sm text-castText transition hover:bg-white/[0.03]"
            role="button"
            tabIndex={0}
            onClick={() => onSelect(asset)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onSelect(asset);
            }}
          >
            <img src={asset.thumbnailUrl} alt={asset.name} className="h-12 w-20 rounded-lg object-cover" />
            <b className="min-w-0 truncate text-white">{asset.name}</b>
            <span>{typeText(asset.type)}</span>
            <span>{asset.size}</span>
            <span>{asset.resolution}</span>
            <span>{asset.duration || "-"}</span>
            <MediaStatusBadge status={asset.status} />
            <MediaTags tags={asset.tags.slice(0, 2)} />
            <span>{asset.uploadedBy}</span>
            <span>{asset.uploadedAt}</span>
            <span>{asset.usedInPlaylists}</span>
            <MediaActionMenu asset={asset} open={openActionId === asset.id} onToggle={() => onToggleActions(asset.id)} onAction={onAction} />
          </div>
        ))}
      </div>
    </div>
  );
}
