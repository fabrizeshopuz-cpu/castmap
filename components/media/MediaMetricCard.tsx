import { FileArchive, HardDrive, ImageIcon, Video } from "lucide-react";
import type { MediaMetric } from "@/types/media";

const icons = {
  violet: FileArchive,
  green: Video,
  blue: ImageIcon,
  gold: HardDrive,
};

const tones = {
  violet: "from-violet-500/25 to-violet-500/5 text-violet-200",
  green: "from-green-500/25 to-green-500/5 text-green-200",
  blue: "from-blue-500/25 to-blue-500/5 text-blue-200",
  gold: "from-castGold/25 to-castGold/5 text-castGold",
};

export function MediaMetricCard({ title, value, subtext, tone, progress }: MediaMetric) {
  const Icon = icons[tone];
  return (
    <article className="glass-panel hover-3d rounded-2xl p-5 transition hover:border-castGold/35">
      <div className="flex items-start gap-4">
        <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${tones[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-castMuted">{title}</p>
          <strong className="mt-1 block text-3xl font-black text-white">{value}</strong>
          <span className="mt-1 block text-sm text-castMuted">{subtext}</span>
        </div>
      </div>
      {progress !== undefined ? (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-[#FFE18A] to-castDeepGold" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
    </article>
  );
}
