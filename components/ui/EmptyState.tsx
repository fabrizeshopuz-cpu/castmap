interface EmptyStateProps {
  title: string;
  text: string;
}

export function EmptyState({ title, text }: EmptyStateProps) {
  return (
    <div className="grid min-h-72 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#FFE18A] to-castDeepGold font-black text-black">CM</div>
        <h3 className="mt-4 text-xl font-black text-white">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-castMuted">{text}</p>
      </div>
    </div>
  );
}
