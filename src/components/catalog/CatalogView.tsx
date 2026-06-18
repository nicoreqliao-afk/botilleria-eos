"use client";

import { useMemo, useState } from "react";
import { CategoryIcon } from "@/components/site/CategoryIcon";
import { ProductCard } from "./ProductCard";
import type { CategoryDTO, ProductDTO } from "@/lib/types";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function CatalogView({ categories }: { categories: CategoryDTO[] }) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");

  const allProducts: ProductDTO[] = useMemo(
    () => categories.flatMap((c) => c.products),
    [categories],
  );

  const q = normalize(query.trim());
  const searching = q.length > 0;

  const searchResults = useMemo(() => {
    if (!searching) return [];
    return allProducts.filter(
      (p) =>
        normalize(p.name).includes(q) ||
        normalize(p.categoryName ?? "").includes(q),
    );
  }, [allProducts, q, searching]);

  const visibleCategories = searching
    ? []
    : activeCat === "all"
      ? categories
      : categories.filter((c) => c.slug === activeCat);

  return (
    <div>
      {/* Controles: buscador + pills */}
      <div className="sticky top-16 z-40 -mx-5 mb-2 border-b border-cream/10 bg-ink/85 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="container-eos px-0">
          <div className="relative mb-4 max-w-md">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream-dim"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.2-3.2" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar cerveza, whisky, vino…"
              className="w-full rounded-full border border-cream/15 bg-ink-700/80 py-3 pl-11 pr-4 text-sm text-cream placeholder:text-cream-dim outline-none transition-colors focus:border-gold/60"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <Pill
              active={activeCat === "all" && !searching}
              onClick={() => {
                setActiveCat("all");
                setQuery("");
              }}
            >
              Todos
            </Pill>
            {categories.map((c) => (
              <Pill
                key={c.slug}
                active={activeCat === c.slug && !searching}
                onClick={() => {
                  setActiveCat(c.slug);
                  setQuery("");
                }}
              >
                <CategoryIcon slug={c.slug} className="h-4 w-4" />
                {c.name}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      {/* Resultados de búsqueda */}
      {searching && (
        <section className="py-8">
          <p className="mb-6 text-sm text-cream-muted">
            {searchResults.length === 0
              ? "Sin resultados"
              : `${searchResults.length} resultado${searchResults.length === 1 ? "" : "s"} para “${query}”`}
          </p>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {searchResults.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>
      )}

      {/* Secciones por categoría */}
      {!searching &&
        visibleCategories.map((cat) => (
          <section key={cat.slug} id={cat.slug} className="scroll-mt-44 py-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-gold">
                  <CategoryIcon slug={cat.slug} className="h-7 w-7" />
                </span>
                <div>
                  <h2 className="font-display text-2xl text-cream sm:text-3xl">
                    {cat.name}
                  </h2>
                  {cat.blurb && (
                    <p className="text-sm text-cream-muted">{cat.blurb}</p>
                  )}
                </div>
              </div>
              <span className="shrink-0 text-xs text-cream-dim tabular-nums">
                {cat.products.length} productos
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {cat.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-all ${
        active
          ? "border-gold bg-gold text-ink"
          : "border-cream/15 text-cream-muted hover:border-gold/50 hover:text-cream"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-cream/15 py-16 text-center">
      <p className="font-display text-xl text-cream">Nada por aquí…</p>
      <p className="mt-1 text-sm text-cream-muted">
        Prueba con otra palabra o escríbenos por WhatsApp y lo conseguimos.
      </p>
    </div>
  );
}
