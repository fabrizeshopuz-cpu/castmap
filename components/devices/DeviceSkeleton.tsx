export function DeviceSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl bg-white/[0.06]" />)}
      </div>
      <div className="rounded-2xl border border-white/10 bg-castCard p-4">
        {[1, 2, 3, 4, 5].map((item) => <div key={item} className="mb-3 h-16 animate-pulse rounded-xl bg-white/[0.05] last:mb-0" />)}
      </div>
    </div>
  );
}

export function DeviceDrawerSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-castCard p-5">
      <div className="h-8 w-52 animate-pulse rounded-lg bg-white/[0.06]" />
      <div className="mt-5 h-44 animate-pulse rounded-2xl bg-white/[0.06]" />
      <div className="mt-5 grid gap-3">
        {[1, 2, 3, 4, 5].map((item) => <div key={item} className="h-7 animate-pulse rounded-lg bg-white/[0.05]" />)}
      </div>
    </div>
  );
}
