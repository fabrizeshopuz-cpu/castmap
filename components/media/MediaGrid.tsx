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
    <div className="grid gap-4 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2">
      {assets.map((asset) => (
        <MediaCard key={asset.id} asset={asset} openActionId={openActionId} onToggleActions={onToggleActions} onSelect={onSelect} onPreview={onPreview} onAction={onAction} />
      ))}
    </div>
  );
}
