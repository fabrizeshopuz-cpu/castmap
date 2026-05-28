import type { MediaOrientation, MediaStatus, MediaType } from "@/types/media";

export interface MediaFilterState {
  type: "all" | MediaType;
  status: "all" | MediaStatus;
  tag: "all" | string;
  uploader: "all" | string;
  orientation: "all" | MediaOrientation;
  usage: "all" | "used" | "unused";
}

export function MediaFilters({
  filters,
  tags,
  uploaders,
  onChange,
  onReset,
}: {
  filters: MediaFilterState;
  tags: string[];
  uploaders: string[];
  onChange: (next: MediaFilterState) => void;
  onReset: () => void;
}) {
  const set = <K extends keyof MediaFilterState>(key: K, value: MediaFilterState[K]) => onChange({ ...filters, [key]: value });

  return (
    <div className="glass-panel grid gap-3 rounded-2xl p-4 xl:grid-cols-[repeat(6,minmax(0,1fr))_110px] md:grid-cols-3">
      <Select value={filters.type} onChange={(value) => set("type", value as MediaFilterState["type"])} options={["all", "video", "image", "web", "html", "pdf", "template"]} label="Turi" />
      <Select value={filters.status} onChange={(value) => set("status", value as MediaFilterState["status"])} options={["all", "active", "draft", "approval", "archived", "expired", "processing", "failed"]} label="Status" />
      <Select value={filters.tag} onChange={(value) => set("tag", value)} options={["all", ...tags]} label="Tag" />
      <Select value={filters.uploader} onChange={(value) => set("uploader", value)} options={["all", ...uploaders]} label="Yuklagan" />
      <Select value={filters.orientation} onChange={(value) => set("orientation", value as MediaFilterState["orientation"])} options={["all", "landscape", "portrait", "square", "responsive"]} label="Format" />
      <Select value={filters.usage} onChange={(value) => set("usage", value as MediaFilterState["usage"])} options={["all", "used", "unused"]} label="Ishlatilgan" />
      <button className="rounded-xl border border-white/15 bg-white/[0.06] px-4 text-sm font-bold text-white backdrop-blur-xl hover:border-castGold/35" type="button" onClick={onReset}>
        Tozalash
      </button>
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs text-castMuted">
      {label}
      <select className="glass-input h-10 rounded-xl px-3 text-sm text-white outline-none" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option === "all" ? "Barchasi" : option}</option>)}
      </select>
    </label>
  );
}
