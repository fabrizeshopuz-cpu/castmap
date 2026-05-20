import { statusText } from "@/lib/mediaData";
import type { MediaStatus } from "@/types/media";

const statusClasses: Record<MediaStatus, string> = {
  active: "border-green-400/25 bg-green-400/10 text-green-300",
  draft: "border-zinc-400/20 bg-zinc-400/10 text-zinc-300",
  approval: "border-orange-400/25 bg-orange-400/10 text-orange-300",
  archived: "border-white/10 bg-white/[0.04] text-castMuted",
  expired: "border-red-400/25 bg-red-400/10 text-red-300",
  processing: "border-blue-400/25 bg-blue-400/10 text-blue-300",
  failed: "border-red-400/25 bg-red-400/10 text-red-300",
};

export function MediaStatusBadge({ status }: { status: MediaStatus }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-bold ${statusClasses[status]}`}>
      <i className="h-2 w-2 rounded-full bg-current" />
      {statusText(status)}
    </span>
  );
}
