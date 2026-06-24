"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";
import { CategoryIcon } from "@/components/site/CategoryIcon";
import { formatCLP } from "@/lib/format";
import type { ProductDTO } from "@/lib/types";

export function ProductCard({
  product,
  variant = "default",
}: {
  product: ProductDTO;
  variant?: "default" | "featured";
}) {
  const { add, open } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!product.available) return;
    add({ id: product.id, name: product.name, price: product.price });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  const hasImage = Boolean(product.image);
  const featured = variant === "featured";

  return (
    <article
      className={`card-eos group relative flex flex-col overflow-hidden transition-all duration-300 hover:border-gold/40 hover:-translate-y-1 ${
        !product.available ? "opacity-60" : ""
      }`}
    >
      {/* Imagen o lienzo tipográfico */}
      <div
        className={`relative overflow-hidden bg-ink ${
          featured ? "aspect-[4/5]" : "aspect-[3/4]"
        }`}
      >
        {hasImage ? (
          <Image
            src={product.image as string}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-wine-deep/40 via-ink-700 to-ink">
            <div className="text-wine-light/30 transition-transform duration-700 group-hover:scale-110">
              <CategoryIcon
                slug={product.categorySlug ?? ""}
                className="h-20 w-20"
              />
            </div>
          </div>
        )}
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-gold/90 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-ink">
            Destacado
          </span>
        )}
        {!product.available && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-cream-muted">
            Agotado
          </span>
        )}
      </div>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col p-4">
        {product.categoryName && (
          <p className="kicker mb-1 text-[0.58rem]">{product.categoryName}</p>
        )}
        <h3
          className={`font-display leading-tight text-cream ${
            featured ? "text-xl" : "text-base"
          }`}
        >
          {product.name}
        </h3>
        {product.description && featured && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-cream-muted">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-display text-lg text-gold tabular-nums">
            {formatCLP(product.price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={!product.available}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-cream/10 text-cream hover:bg-gold hover:text-ink"
            } disabled:cursor-not-allowed disabled:opacity-40`}
            aria-label={`Agregar ${product.name} al pedido`}
          >
            {added ? "Agregado ✓" : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
}
