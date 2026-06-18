import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acceso administración",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");

  return (
    <main className="grid min-h-dvh place-items-center bg-wine-radial px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-5xl font-semibold tracking-tight text-cream">
            EOS
          </p>
          <p className="mt-2 text-sm text-cream-muted">Panel de administración</p>
        </div>
        <div className="card-eos p-7">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-cream-dim">
          <Link href="/" className="hover:text-gold">
            ← Volver al sitio
          </Link>
        </p>
      </div>
    </main>
  );
}
