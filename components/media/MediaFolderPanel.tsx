import { Folder, Plus } from "lucide-react";
import type { MediaFolder } from "@/types/media";

export function MediaFolderPanel({
  folders,
  activeFolder,
  onChange,
  onCreate,
}: {
  folders: MediaFolder[];
  activeFolder: string;
  onChange: (folder: string) => void;
  onCreate: () => void;
}) {
  return (
    <aside className="glass-panel rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-castMuted">Papkalar</h3>
        <button className="grid h-8 w-8 place-items-center rounded-lg border border-castGold/25 text-castGold hover:bg-castGold/10" type="button" onClick={onCreate}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-1">
        {folders.map((folder) => (
          <button
            key={folder.name}
            className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
              activeFolder === folder.name ? "bg-castGold/10 text-castGold" : "text-castMuted hover:bg-white/[0.04] hover:text-white"
            }`}
            type="button"
            onClick={() => onChange(folder.name)}
          >
            <span className="flex items-center gap-2"><Folder className="h-4 w-4" />{folder.name}</span>
            <b className="text-xs">{folder.count}</b>
          </button>
        ))}
      </div>
    </aside>
  );
}
