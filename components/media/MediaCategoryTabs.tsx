import type { MediaAsset, MediaType } from "@/types/media";

export type MediaTab = "all" | MediaType | "archive" | "approval";

const tabs: { key: MediaTab; label: string }[] = [
  { key: "all", label: "Barchasi" },
  { key: "video", label: "Video" },
  { key: "image", label: "Rasmlar" },
  { key: "web", label: "Web kontent" },
  { key: "html", label: "HTML" },
  { key: "pdf", label: "PDF" },
  { key: "template", label: "Template" },
  { key: "archive", label: "Arxiv" },
  { key: "approval", label: "Approval kutmoqda" },
];

export function MediaCategoryTabs({ active, assets, onChange }: { active: MediaTab; assets: MediaAsset[]; onChange: (tab: MediaTab) => void }) {
  const count = (key: MediaTab) => {
    if (key === "all") return assets.length;
    if (key === "archive") return assets.filter((item) => item.status === "archived").length;
    if (key === "approval") return assets.filter((item) => item.status === "approval").length;
    return assets.filter((item) => item.type === key).length;
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-bold transition ${
            active === tab.key ? "border-castGold/45 bg-castGold/15 text-castGold shadow-gold" : "border-white/10 bg-white/[0.03] text-castMuted hover:text-white"
          }`}
          type="button"
          onClick={() => onChange(tab.key)}
        >
          {tab.label} <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs">{count(tab.key)}</span>
        </button>
      ))}
    </div>
  );
}
