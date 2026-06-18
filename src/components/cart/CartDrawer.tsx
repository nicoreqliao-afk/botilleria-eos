"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { formatCLP } from "@/lib/format";
import { buildWhatsappOrderUrl } from "@/lib/whatsapp";

export function CartDrawer() {
  const { items, total, isOpen, close, setQty, remove, clear, hydrated } =
    useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!hydrated) return null;

  const waUrl = buildWhatsappOrderUrl(items);

  return (
    <>
      {/* Scrim */}
      <div
        onClick={close}
        className={`fixed inset-0 z-[90] bg-ink/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Tu pedido"
        aria-modal="true"
        className={`fixed right-0 top-0 z-[91] flex h-dvh w-full max-w-md flex-col border-l border-cream/10 bg-ink-800 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
          <div>
            <p className="kicker text-[0.62rem]">Tu pedido</p>
            <h2 className="font-display text-2xl text-cream">Canasto EOS</h2>
          </div>
          <button
            onClick={close}
            aria-label="Cerrar"
            className="rounded-full border border-cream/15 p-2 text-cream-muted transition-colors hover:border-gold/60 hover:text-gold"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <div className="text-gold/60">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3h6l-.4 8a3 3 0 0 1-2.6 2.96V19M9 19h6" />
              </svg>
            </div>
            <p className="font-display text-xl text-cream">Tu canasto está vacío</p>
            <p className="text-sm text-cream-muted">
              Agrega productos del catálogo y arma tu pedido. Lo cierras por
              WhatsApp en un toque.
            </p>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-cream/8 overflow-y-auto px-6">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-cream">
                    {item.name}
                  </p>
                  <p className="text-sm text-gold tabular-nums">
                    {formatCLP(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full border border-cream/15">
                  <button
                    onClick={() => setQty(item.id, item.qty - 1)}
                    aria-label="Quitar uno"
                    className="grid h-8 w-8 place-items-center text-cream-muted hover:text-gold"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm tabular-nums text-cream">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => setQty(item.id, item.qty + 1)}
                    aria-label="Agregar uno"
                    className="grid h-8 w-8 place-items-center text-cream-muted hover:text-gold"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => remove(item.id)}
                  aria-label="Eliminar"
                  className="text-cream-dim transition-colors hover:text-wine-light"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer className="border-t border-cream/10 px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-cream-muted">Total referencial</span>
            <span className="font-display text-2xl text-cream tabular-nums">
              {formatCLP(total)}
            </span>
          </div>
          <a
            href={items.length ? waUrl : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={items.length === 0}
            className={`btn-gold w-full ${
              items.length === 0 ? "pointer-events-none opacity-40" : ""
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2Zm5.6 14.2c-.2.7-1.2 1.3-1.9 1.4-.5.1-1.1.2-3.6-.8-3-1.2-5-4.3-5.1-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.9 1.5 2 2.4 1.3 1.2 2.4 1.5 2.7 1.6.2.1.4.1.6-.1l.7-.9c.2-.3.4-.2.7-.1l2 .9c.3.1.4.2.5.3 0 .2 0 .9-.2 1.5Z" />
            </svg>
            Enviar pedido por WhatsApp
          </a>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="mt-3 w-full text-center text-xs text-cream-dim hover:text-cream-muted"
            >
              Vaciar canasto
            </button>
          )}
          <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-cream-dim">
            Precios referenciales. Confirma disponibilidad y total final con la
            botillería. Solo mayores de 18 años.
          </p>
        </footer>
      </aside>
    </>
  );
}
