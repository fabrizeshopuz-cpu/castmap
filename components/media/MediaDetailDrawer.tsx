import { Archive, Copy, Download, FolderInput, ListPlus, Maximize2, Pencil, Trash2, UploadCloud, X } from "lucide-react";
import type { ReactNode } from "react";
import { typeText } from "@/lib/mediaData";
import { ApprovalActions } from "@/components/media/ApprovalActions";
import type { MediaAction } from "@/components/media/MediaActionMenu";
import { MediaStatusBadge } from "@/components/media/MediaStatusBadge";
import { MediaTags } from "@/components/media/MediaTags";
import type { MediaAsset } from "@/types/media";

export function MediaDetailDrawer({
  asset,
  onClose,
  onAction,
  onApprove,
  onReject,
}: {
  asset: MediaAsset;
  onClose: () => void;
  onAction: (asset: MediaAsset, action: MediaAction) => void;
  onApprove: (asset: MediaAsset) => void;
  onReject: (asset: MediaAsset) => void;
}) {
  const details = [
    ["Fayl nomi", asset.name],
    ["Turi", typeText(asset.type)],
    ["Hajmi", `${asset.size} (${asset.sizeBytes.toLocaleString()} bytes)`],
    ["Davomiyligi", asset.duration || "-"],
    ["Rezolyutsiya", asset.resolution || "-"],
    ["Orientation", asset.orientation],
    ["Format", asset.format],
    ["Upload date", asset.uploadedAt],
    ["Uploaded by", asset.uploadedBy],
    ["Papka", asset.folder],
    ["Local cache", asset.usedOnScreens ? "TV cache uchun tayyor" : "Hali cache qilinmagan"],
    ["Used in playlists", String(asset.usedInPlaylists)],
    ["Used on screens", String(asset.usedOnScreens)],
    ["Last played", asset.lastPlayed || "-"],
    ["Playback count", String(asset.playbackCount)],
  ];

  return (
    <aside className="sticky top-5 min-w-0 max-h-[calc(100vh-40px)] overflow-y-auto rounded-2xl border border-white/10 bg-castCard p-4 max-xl:static max-xl:max-h-none">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-black text-white [overflow-wrap:anywhere]">{asset.name}</h2>
          <div className="mt-2"><MediaStatusBadge status={asset.status} /></div>
        </div>
        <button className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-castMuted hover:text-white" type="button" onClick={onClose}>
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black">
        <img src={asset.thumbnailUrl} alt={asset.name} className="aspect-video w-full object-cover" />
      </div>

      <div className="mt-4 border-b border-white/10 pb-4">
        <h3 className="mb-3 text-sm font-black text-castGold">Ma'lumot</h3>
        <div className="grid gap-3">
          {details.map(([label, value]) => (
            <div key={label} className="flex min-w-0 justify-between gap-4 text-sm">
              <span className="shrink-0 text-castMuted">{label}</span>
              <b className="min-w-0 max-w-[60%] text-right text-white [overflow-wrap:anywhere]">{value}</b>
            </div>
          ))}
          <div className="grid gap-2 text-sm">
            <span className="text-castMuted">Taglar</span>
            <MediaTags tags={asset.tags} />
          </div>
          <div className="grid gap-2 text-sm">
            <span className="text-castMuted">CDN URL / public URL</span>
            <code className="block max-w-full rounded-xl border border-white/10 bg-black/40 p-2 text-xs text-castGold [overflow-wrap:anywhere]">{asset.cdnUrl || asset.fileUrl}</code>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <ApprovalActions asset={asset} onApprove={onApprove} onReject={onReject} />
        <ActionButton icon={<Maximize2 className="h-4 w-4" />} label="Preview fullscreen" onClick={() => onAction(asset, "preview")} />
        <ActionButton icon={<ListPlus className="h-4 w-4" />} label="Playlistga qo'shish" onClick={() => onAction(asset, "playlist")} />
        <ActionButton icon={<Pencil className="h-4 w-4" />} label="Metadata tahrirlash" onClick={() => onAction(asset, "edit")} />
        <ActionButton icon={<FolderInput className="h-4 w-4" />} label="Papka o'zgartirish" onClick={() => onAction(asset, "move")} />
        <ActionButton icon={<UploadCloud className="h-4 w-4" />} label="Faylni almashtirish" onClick={() => onAction(asset, "replace")} />
        <ActionButton icon={<Download className="h-4 w-4" />} label="Yuklab olish" onClick={() => onAction(asset, "download")} />
        <ActionButton icon={<Copy className="h-4 w-4" />} label="URL nusxalash" onClick={() => onAction(asset, "copy")} />
        <ActionButton icon={<Archive className="h-4 w-4" />} label="Arxivlash" onClick={() => onAction(asset, "archive")} danger />
        <ActionButton icon={<Trash2 className="h-4 w-4" />} label="O'chirish" onClick={() => onAction(asset, "delete")} danger />
      </div>
    </aside>
  );
}

function ActionButton({ icon, label, danger, onClick }: { icon: ReactNode; label: string; danger?: boolean; onClick: () => void }) {
  return (
    <button
      className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold ${
        danger ? "border-red-400/25 bg-red-400/10 text-red-300" : "border-castGold/25 bg-castGold/10 text-castGold hover:bg-castGold/15"
      }`}
      type="button"
      onClick={onClick}
    >
      {icon}{label}
    </button>
  );
}
