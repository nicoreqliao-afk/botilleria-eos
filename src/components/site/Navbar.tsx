"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";
import { OpenStatus } from "./OpenStatus";

const links = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/#resenas", label: "Reseñas" },
  { href: "/#visitanos", label: "Visítanos" },
];

export function Navbar() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, open, hydrated } = useCart();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-500 ${
        solid
          ? "border-b border-cream/10 bg-ink/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-eos flex h-16 items-center justify-between">
        <Link
          href="/"
          aria-label="Botillería EOS — inicio"
          className="flex items-center"
        >
          <Image
            src="/logo-eos.png"
            alt="Botillería EOS"
            width={46}
            height={46}
            priority
            className="h-11 w-11 object-contain"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-cream-muted transition-colors hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <OpenStatus className="hidden text-xs lg:inline-flex" />
          <button
            onClick={open}
            className="relative rounded-full border border-cream/20 px-4 py-2 text-sm text-cream transition-colors hover:border-gold/70 hover:text-gold"
          >
            Pedido
            {hydrated && count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[0.6rem] font-bold text-ink tabular-nums">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menú"
            aria-expanded={menuOpen}
            className="text-cream md:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="border-t border-cream/10 bg-ink/95 backdrop-blur-md md:hidden">
          <div className="container-eos flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-2 py-3 text-cream-muted transition-colors hover:bg-ink-600 hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
            <OpenStatus className="px-2 py-3 text-xs" />
          </div>
        </div>
      )}
    </header>
  );
}
