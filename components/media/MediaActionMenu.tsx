import { MoreVertical } from "lucide-react";
import type { MediaAsset } from "@/types/media";

export type MediaAction = "preview" | "playlist" | "edit" | "replace" | "move" | "copy" | "download" | "archive" | "delete" | "approve" | "reject";

const actions: { key: MediaAction; label: string; danger?: boolean }[] = [
  { key: "preview", label: "Preview" },
  { key: "playlist", label: "Playlistga qo'shish" },
  { key: "edit", label: "Ma'lumotni tahrirlash" },
  { key: "replace", label: "Faylni almashtirish" },
  { key: "move", label: "Papkaga ko'chirish" },
  { key: "copy", label: "URL nusxalash" },
  { key: "download", label: "Yuklab olish" },
  { key: "archive", label: "Arxivlash" },
  { key: "delete", label: "O'chirish", danger: true },
];

export function MediaActionMenu({
  asset,
  open,
  onToggle,
  onAction,
}: {
  asset: MediaAsset;
  open: boolean;
  onToggle: () => void;
  onAction: (asset: MediaAsset, action: MediaAction) => void;
}) {
  return (
    <div className="relative">
      <button className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-black/45 text-white hover:border-castGold/35" type="button" onClick={(event) => { event.stopPropagation(); onToggle(); }}>
        <MoreVertical className="h-4 w-4" />
      </button>
      {open ? (
        <div className="absolute right-0 top-11 z-50 max-h-80 w-56 overflow-y-auto rounded-xl border border-white/10 bg-[#101010] p-1 shadow-2xl shadow-black/60">
          {asset.status === "approval" ? (
            <>
              <MenuButton label="Tasdiqlash" onClick={() => onAction(asset, "approve")} />
              <MenuButton label="Rad etish" onClick={() => onAction(asset, "reject")} danger />
            </>
          ) : null}
          {actions.map((item) => (
            <MenuButton key={item.key} label={item.label} danger={item.danger} onClick={() => onAction(asset, item.key)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MenuButton({ label, danger, onClick }: { label: string; danger?: boolean; onClick: () => void }) {
  return (
    <button
      className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/[0.05] ${danger ? "text-red-300" : "text-castText"}`}
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      {label}
    </button>
  );
}
