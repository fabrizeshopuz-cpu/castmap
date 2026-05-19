export function MediaTags({ tags, onRemove }: { tags: string[]; onRemove?: (tag: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag}
          className="rounded-full border border-castGold/25 bg-castGold/10 px-2.5 py-1 text-xs font-bold text-castGold"
          type="button"
          onClick={() => onRemove?.(tag)}
        >
          {tag}{onRemove ? " ×" : ""}
        </button>
      ))}
    </div>
  );
}
