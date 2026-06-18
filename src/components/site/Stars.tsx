type StarsProps = {
  value: number; // 0..5
  size?: number;
  className?: string;
};

function Star({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.5l2.7 5.86 6.3.62-4.74 4.2 1.39 6.32L12 16.9l-5.65 3.6 1.39-6.32L3 9.98l6.3-.62L12 2.5z" />
    </svg>
  );
}

/** Estrellas con relleno fraccional (p. ej. 4,7). */
export function Stars({ value, size = 16, className = "" }: StarsProps) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const stars = [0, 1, 2, 3, 4];
  return (
    <span
      className={`relative inline-flex ${className}`}
      role="img"
      aria-label={`${value} de 5 estrellas`}
    >
      <span className="flex text-cream/20" style={{ gap: size * 0.12 }}>
        {stars.map((i) => (
          <Star key={i} size={size} />
        ))}
      </span>
      <span
        className="absolute inset-0 flex overflow-hidden text-gold"
        style={{ width: `${pct}%`, gap: size * 0.12 }}
      >
        {stars.map((i) => (
          <Star key={i} size={size} />
        ))}
      </span>
    </span>
  );
}
