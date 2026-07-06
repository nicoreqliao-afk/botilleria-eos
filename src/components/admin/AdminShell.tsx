"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";

const nav = [
  { href: "/admin", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-ink">
      <header className="sticky top-0 z-40 border-b border-cream/10 bg-ink-800/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-5">
          <div className="flex items-center gap-3 sm:gap-8">
            <Link href="/admin" className="font-display text-xl text-cream">
              EOS{" "}
              <span className="text-xs tracking-widest2 text-gold">ADMIN</span>
            </Link>
            <nav className="flex items-center gap-1">
              {nav.map((n) => {
                const active =
                  n.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`rounded-full px-3 py-1.5 text-xs transition-colors sm:px-4 sm:text-sm ${
                      active
                        ? "bg-gold text-ink"
                        : "text-cream-muted hover:text-cream"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2 text-sm sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden text-cream-muted hover:text-gold sm:inline"
            >
              Ver sitio ↗
            </Link>
            <form action={logout}>
              <button className="rounded-full border border-cream/15 px-3 py-1.5 text-cream-muted transition-colors hover:border-wine-light/60 hover:text-cream sm:px-4">
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
