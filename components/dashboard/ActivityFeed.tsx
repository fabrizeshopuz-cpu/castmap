import { AlertTriangle, ListVideo, Monitor, Upload } from "lucide-react";

interface ActivityItem {
  title: string;
  text: string;
  time: string;
  role: string;
  icon: string;
  tone: "green" | "blue" | "violet" | "red";
}

interface ActivityFeedProps {
  data: ActivityItem[];
}

const iconMap = {
  upload: Upload,
  playlist: ListVideo,
  screen: Monitor,
  alert: AlertTriangle,
};

const toneClass: Record<ActivityItem["tone"], string> = {
  green: "from-[#22C55E]/70 to-emerald-950/60",
  blue: "from-[#3B82F6]/70 to-sky-950/60",
  violet: "from-violet-500/70 to-violet-950/70",
  red: "from-red-500/70 to-red-950/70",
};

export function ActivityFeed({ data }: ActivityFeedProps) {
  return (
    <article className="glass-panel hover-3d rounded-2xl p-5">
      <h2 className="text-lg font-black text-white">So'nggi faoliyatlar</h2>
      <div className="mt-4 grid">
        {!data.length ? <p className="py-4 text-sm text-castMuted">Faoliyatlar tarixi tozalangan.</p> : null}
        {data.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Upload;
          return (
            <div key={`${item.title}-${item.text}`} className="grid grid-cols-[42px_1fr_auto] items-center gap-3 border-b border-white/10 py-3 last:border-0">
              <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${toneClass[item.tone]}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <b className="block text-sm text-white">{item.title}</b>
                <span className="block truncate text-xs text-castMuted">{item.text}</span>
              </div>
              <time className="text-right text-xs text-castMuted">
                {item.time}
                <span className="block">{item.role}</span>
              </time>
            </div>
          );
        })}
      </div>
      <button className="mt-5 min-h-10 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 text-left text-sm text-white backdrop-blur-xl" type="button">
        Barcha faoliyatlar
      </button>
    </article>
  );
}
