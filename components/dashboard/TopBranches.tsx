interface Branch {
  name: string;
  value: number;
}

interface TopBranchesProps {
  data: Branch[];
}

export function TopBranches({ data }: TopBranchesProps) {
  const max = Math.max(1, ...data.map((item) => item.value));

  return (
    <article className="glass-panel hover-3d rounded-2xl p-5">
      <h2 className="text-lg font-black text-white">Top 5 filiallar</h2>
      <div className="mt-5 grid gap-4">
        {!data.length ? <p className="text-sm text-castMuted">Filial statistikasi tozalangan.</p> : null}
        {data.map((item) => (
          <div key={item.name} className="grid gap-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-castMuted">{item.name}</span>
              <b className="text-white">{item.value}</b>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-[#FACC15] to-castGold" style={{ width: `${Math.round((item.value / max) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
      <button className="mt-5 min-h-10 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 text-left text-sm text-white backdrop-blur-xl" type="button">
        Barcha filiallar
      </button>
    </article>
  );
}
