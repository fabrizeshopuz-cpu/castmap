export function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 26 }).map((_, index) => (
        <span
          className="absolute h-1 w-1 rounded-full bg-[#D4AF37]/40 shadow-[0_0_18px_rgba(212,175,55,0.45)]"
          key={index}
          style={{
            left: `${(index * 31) % 100}%`,
            top: `${12 + ((index * 19) % 76)}%`,
            animation: `castmap-particle-drift ${5 + (index % 7)}s ease-in-out ${index * -0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
