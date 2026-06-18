import Link from "next/link";
import { promos } from "@/lib/promos";
import { formatCLP } from "@/lib/format";

export function Promos() {
  return (
    <div className="grid gap-px overflow-hidden rounded-3xl border border-cream/10 bg-cream/10 sm:grid-cols-3">
      {promos.map((p) => (
        <Link
          key={p.index}
          href={p.href}
          className="group relative flex flex-col bg-ink-800 p-8 transition-colors duration-300 hover:bg-ink-700 sm:p-10"
        >
          {/* filete de oro que crece al pasar el mouse */}
          <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold-line transition-transform duration-500 group-hover:scale-x-100" />

          <div className="flex items-start justify-between">
            <span className="font-display text-5xl leading-none text-cream/15 transition-colors duration-300 group-hover:text-gold/40">
              {p.index}
            </span>
            <span className="translate-x-0 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
              →
            </span>
          </div>

          <p className="kicker mt-10 text-[0.62rem]">{p.kicker}</p>
          <h3 className="mt-3 font-display text-2xl leading-tight text-cream sm:text-[1.7rem]">
            {p.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-cream-muted">
            {p.blurb}
          </p>

          <div className="mt-7 flex items-baseline gap-2 border-t border-cream/8 pt-5">
            <span className="font-display text-2xl text-gold tabular-nums">
              {formatCLP(p.price)}
            </span>
            {p.priceNote && (
              <span className="text-xs text-cream-dim">{p.priceNote}</span>
            )}
            <span className="ml-auto text-xs text-cream-muted transition-colors group-hover:text-gold">
              Ver en catálogo
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
