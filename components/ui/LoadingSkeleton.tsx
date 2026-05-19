export function LoadingSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="h-10 w-64 animate-pulse rounded-xl bg-white/10" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-32 animate-pulse rounded-2xl bg-white/[0.06]" />
        <div className="h-32 animate-pulse rounded-2xl bg-white/[0.06]" />
        <div className="h-32 animate-pulse rounded-2xl bg-white/[0.06]" />
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-white/[0.06]" />
    </div>
  );
}
