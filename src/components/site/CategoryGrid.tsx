import Link from "next/link";
import { CategoryIcon } from "./CategoryIcon";

type Item = { slug: string; name: string; count: number; blurb: string | null };

export function CategoryGrid({ categories }: { categories: Item[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-cream/10 bg-cream/10 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/catalogo#${c.slug}`}
          className="group flex items-center gap-4 bg-ink-800 px-5 py-6 transition-colors duration-300 hover:bg-ink-700"
        >
          <span className="shrink-0 text-gold/70 transition-all duration-300 group-hover:scale-110 group-hover:text-gold">
            <CategoryIcon slug={c.slug} className="h-7 w-7" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-lg leading-tight text-cream transition-colors duration-300 group-hover:text-gold">
              {c.name}
            </h3>
            <p className="text-xs text-cream-dim tabular-nums">
              {c.count} productos
            </p>
          </div>
          <span className="text-cream-dim opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
