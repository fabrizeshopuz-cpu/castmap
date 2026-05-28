interface DeviceEmptyStateProps {
  onPair: () => void;
}

export function DeviceEmptyState({ onPair }: DeviceEmptyStateProps) {
  return (
    <div className="glass-panel grid min-h-80 place-items-center rounded-2xl p-8 text-center">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#FFE18A] to-castDeepGold font-black text-black">TV</div>
        <h3 className="mt-4 text-xl font-black text-white">Hali qurilma ulanmagan</h3>
        <p className="mt-2 text-castMuted">Birinchi TV yoki TV Box qurilmangizni ulashdan boshlang.</p>
        <button className="mt-5 min-h-11 rounded-xl bg-gradient-to-r from-[#FFE18A] to-castDeepGold px-5 font-black text-black" type="button" onClick={onPair}>
          Qurilma ulash
        </button>
      </div>
    </div>
  );
}
