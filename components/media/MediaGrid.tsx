import type { MediaAction } from "@/components/media/MediaActionMenu";
import { MediaCard } from "@/components/media/MediaCard";
import type { MediaAsset } from "@/types/media";

export function MediaGrid({
  assets,
  openActionId,
  onToggleActions,
  onSelect,
  onPreview,
  onAction,
}: {
  assets: MediaAsset[];
  openActionId: string;
  onToggleActions: (id: string) => void;
  onSelect: (asset: MediaAsset) => void;
  onPreview: (asset: MediaAsset) => void;
  onAction: (asset: MediaAsset, action: MediaAction) => void;
}) {
  return (
    <div className="grid min-w-0 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {assets.map((asset) => (
        <MediaCard key={asset.id} asset={asset} openActionId={openActionId} onToggleActions={onToggleActions} onSelect={onSelect} onPreview={onPreview} onAction={onAction} />
      ))}
    </div>
  );
}
