interface DeviceStatus {
  label: string;
  value: number;
  color: string;
}

interface DeviceStatusChartProps {
  data: DeviceStatus[];
}

export function DeviceStatusChart({ data }: DeviceStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <article className="glass-panel hover-3d rounded-2xl p-5">
      <h2 className="mb-5 text-lg font-black text-white">Ekranlar holati</h2>
      <div className="grid items-center gap-6 sm:grid-cols-[190px_1fr]">
        <div className="grid aspect-square w-44 place-items-center rounded-full bg-[conic-gradient(#22C55E_0deg_313deg,#EF4444_313deg_341deg,#94A3B8_341deg_353deg,#D4AF37_353deg_360deg)] shadow-gold">
          <div className="grid aspect-square w-24 place-items-center rounded-full bg-[#0F172A]/90 text-center backdrop-blur-xl">
            <div>
              <strong className="block text-2xl text-white">{total.toLocaleString("en-US")}</strong>
              <span className="text-sm text-castMuted">Jami</span>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          {data.map((item) => (
            <div key={item.label} className="grid grid-cols-[12px_1fr_auto] items-center gap-3 text-sm">
              <span className="h-3 w-3 rounded-full" style={{ background: item.color }} />
              <b className="text-white">{item.label}</b>
              <strong className="text-white">{item.value.toLocaleString("en-US")} ({total ? ((item.value / total) * 100).toFixed(1) : "0.0"}%)</strong>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
