"use client";

import Link from "next/link";
import {
  toggleAvailable,
  toggleFeatured,
  deleteProduct,
} from "@/app/admin/actions";

export function RowActions({
  id,
  available,
  featured,
}: {
  id: string;
  available: boolean;
  featured: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <form action={toggleFeatured.bind(null, id)}>
        <IconButton
          title={featured ? "Quitar de destacados" : "Destacar"}
          active={featured}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill={featured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M12 3l2.7 5.9 6.3.6-4.7 4.2 1.4 6.3L12 17.9 6.3 20.5l1.4-6.3L3 9.5l6.3-.6L12 3Z" />
          </svg>
        </IconButton>
      </form>

      <form action={toggleAvailable.bind(null, id)}>
        <IconButton
          title={available ? "Marcar agotado" : "Marcar disponible"}
          active={available}
          activeClass="text-emerald-400"
        >
          {available ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.9 5.1A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a13.8 13.8 0 0 1-2.2 3M6.1 6.1A13.7 13.7 0 0 0 2 12s3.5 7 10 7a9.5 9.5 0 0 0 4-0.9" />
              <path d="M3 3l18 18" />
            </svg>
          )}
        </IconButton>
      </form>

      <Link
        href={`/admin/productos/${id}`}
        title="Editar"
        className="grid h-8 w-8 place-items-center rounded-lg border border-cream/12 text-cream-muted transition-colors hover:border-gold/50 hover:text-gold"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
        </svg>
      </Link>

      <form
        action={deleteProduct.bind(null, id)}
        onSubmit={(e) => {
          if (!confirm("¿Eliminar este producto? No se puede deshacer.")) {
            e.preventDefault();
          }
        }}
      >
        <IconButton title="Eliminar" danger>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
          </svg>
        </IconButton>
      </form>
    </div>
  );
}

function IconButton({
  children,
  title,
  active,
  activeClass = "text-gold",
  danger,
}: {
  children: React.ReactNode;
  title: string;
  active?: boolean;
  activeClass?: string;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      aria-label={title}
      className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors ${
        danger
          ? "border-cream/12 text-cream-dim hover:border-wine-light/60 hover:text-wine-light"
          : active
            ? `border-cream/12 ${activeClass} hover:opacity-80`
            : "border-cream/12 text-cream-dim hover:text-cream"
      }`}
    >
      {children}
    </button>
  );
}
