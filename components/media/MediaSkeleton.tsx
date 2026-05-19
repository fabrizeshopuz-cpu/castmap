export function MediaSkeleton() {
  return (
    <div className="grid gap-5">
      <section className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => <SkeletonBlock key={index} className="h-32" />)}
      </section>
      <section className="grid gap-4 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => <SkeletonBlock key={index} className="h-72" />)}
      </section>
    </div>
  );
}

export function MediaDrawerSkeleton() {
  return <SkeletonBlock className="h-[720px]" />;
}

export function MediaTableRowSkeleton() {
  return <SkeletonBlock className="h-16" />;
}

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl border border-white/10 bg-white/[0.04] ${className}`} />;
}
