"use client";

import { useCart } from "./CartProvider";
import { business } from "@/lib/business";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export function FloatingActions() {
  const { count, open, hydrated } = useCart();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {hydrated && count > 0 && (
        <button
          onClick={open}
          className="group flex items-center gap-2 rounded-full border border-gold/40 bg-ink-700/90 py-3 pl-4 pr-5 text-sm font-medium text-cream shadow-wine-glow backdrop-blur transition-all hover:border-gold animate-fade-up"
          aria-label={`Abrir canasto, ${count} productos`}
        >
          <span className="relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
              <path d="M9 3h6l-.4 8a3 3 0 0 1-2.6 2.96V19M9 19h6M9 3l-.4 8a3 3 0 0 0 2.6 2.96" />
            </svg>
            <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[0.62rem] font-bold text-ink tabular-nums">
              {count}
            </span>
          </span>
          Ver pedido
        </button>
      )}

      <a
        href={buildWhatsappUrl(`¡Hola ${business.name}! Tengo una consulta 🍷`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir por WhatsApp"
        className="grid h-14 w-14 place-items-center rounded-full bg-emerald-600 p-3.5 text-white shadow-lg transition-transform hover:scale-105"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2Zm5.6 14.2c-.2.7-1.2 1.3-1.9 1.4-.5.1-1.1.2-3.6-.8-3-1.2-5-4.3-5.1-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.9 1.5 2 2.4 1.3 1.2 2.4 1.5 2.7 1.6.2.1.4.1.6-.1l.7-.9c.2-.3.4-.2.7-.1l2 .9c.3.1.4.2.5.3 0 .2 0 .9-.2 1.5Z" />
        </svg>
      </a>
    </div>
  );
}
