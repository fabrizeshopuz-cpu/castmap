interface ImpressionPoint {
  day: string;
  value: number;
}

interface StatsChartProps {
  data: ImpressionPoint[];
}

export function StatsChart({ data }: StatsChartProps) {
  const maxValue = 800;
  const width = 720;
  const height = 250;
  const padX = 46;
  const padY = 30;
  const chartWidth = width - padX * 2;
  const chartHeight = height - padY * 2;
  const points = data
    .map((item, index) => {
      const x = padX + (chartWidth / (data.length - 1)) * index;
      const y = padY + chartHeight - (item.value / maxValue) * chartHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const areaPoints = `${padX},${height - padY} ${points} ${width - padX},${height - padY}`;

  return (
    <article className="rounded-2xl border border-white/10 bg-castCard p-5 shadow-black/30 lg:col-span-2">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-white">Ko'rsatishlar statistikasi</h2>
        <button className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white" type="button">7 kunlik</button>
      </div>
      <svg className="h-[250px] w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="7 kunlik ko'rsatishlar statistikasi">
        {[0, 200, 400, 600, 800].map((value) => {
          const y = padY + chartHeight - (value / maxValue) * chartHeight;
          return <line key={value} x1={padX} y1={y} x2={width - padX} y2={y} stroke="rgba(255,255,255,0.08)" />;
        })}
        <polygon points={areaPoints} fill="rgba(212,175,55,0.22)" />
        <polyline points={points} fill="none" stroke="#D4AF37" strokeWidth="3" />
        {data.map((item, index) => {
          const x = padX + (chartWidth / (data.length - 1)) * index;
          const y = padY + chartHeight - (item.value / maxValue) * chartHeight;
          return (
            <g key={item.day}>
              <circle cx={x} cy={y} r="4" fill="#D4AF37" />
              <text x={x} y={height - 7} fill="#A1A1AA" fontSize="12" textAnchor="middle">{item.day}</text>
            </g>
          );
        })}
      </svg>
    </article>
  );
}
