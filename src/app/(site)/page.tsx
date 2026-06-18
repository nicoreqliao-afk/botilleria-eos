import Link from "next/link";
import { ScrollPourHero } from "@/components/site/ScrollPourHero";
import { Reveal } from "@/components/site/Reveal";
import { CategoryGrid } from "@/components/site/CategoryGrid";
import { ReviewMarquee } from "@/components/site/ReviewMarquee";
import { HoursList } from "@/components/site/HoursList";
import { OpenStatus } from "@/components/site/OpenStatus";
import { Promos } from "@/components/site/Promos";
import { getCategorySummary } from "@/lib/catalog";
import { business } from "@/lib/business";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await getCategorySummary();

  return (
    <>
      <ScrollPourHero />

      {/* Manifiesto */}
      <section className="relative overflow-hidden bg-wine-radial">
        <div className="container-eos py-24 sm:py-32">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="kicker mb-6">Botillería · {business.sector}</p>
            <h2 className="text-balance font-display text-4xl leading-[1.1] text-cream sm:text-6xl">
              Más que una botillería:{" "}
              <span className="italic text-gold">una buena cava</span> en Talca.
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-cream-muted">
              En {business.name} encuentras de todo para compartir: cervezas
              heladas, vinos del valle, destilados y lo que falte para el
              carrete. Con la atención cercana que nos hizo ganarnos a{" "}
              {business.city}.
            </p>
          </Reveal>

          <Reveal
            delay={150}
            className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm"
          >
            <OpenStatus />
            <span className="text-cream-muted">
              Pagas con {business.payments.join(", ")}
            </span>
            <span className="text-cream-muted">
              {business.rating.toLocaleString("es-CL")}★ · {business.reviews}{" "}
              reseñas
            </span>
          </Reveal>
        </div>
      </section>

      {/* Categorías */}
      <section className="container-eos py-20 sm:py-28">
        <Reveal className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="kicker mb-3">Explora</p>
            <h2 className="font-display text-3xl text-cream sm:text-5xl">
              Recorre la cava
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="hidden shrink-0 text-sm text-gold hover:text-gold-light sm:inline"
          >
            Ver catálogo completo →
          </Link>
        </Reveal>
        <Reveal delay={100}>
          <CategoryGrid categories={categories} />
        </Reveal>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/catalogo" className="btn-ghost">
            Ver catálogo completo
          </Link>
        </div>
      </section>

      {/* Promos */}
      <section className="relative border-y border-cream/10 bg-ink-800 py-20 sm:py-28">
        <div className="container-eos">
          <Reveal className="mb-10">
            <p className="kicker mb-3">Promos de la casa</p>
            <h2 className="font-display text-3xl text-cream sm:text-5xl">
              Tres que valen la pena
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <Promos />
          </Reveal>
        </div>
      </section>

      {/* Por qué EOS */}
      <section className="container-eos py-20 sm:py-28">
        <Reveal className="mb-12 text-center">
          <p className="kicker mb-3">Por qué EOS</p>
          <h2 className="font-display text-3xl text-cream sm:text-5xl">
            Lo que dicen los {business.reviews} que ya nos calificaron
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="bg-ink-800 p-7">
                <span className="text-gold">{f.icon}</span>
                <h3 className="mt-4 font-display text-xl text-cream">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-muted">
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Reseñas */}
      <section
        id="resenas"
        className="scroll-mt-24 border-y border-cream/10 bg-ink-800 py-20 sm:py-28"
      >
        <div className="container-eos">
          <Reveal className="mb-10 text-center">
            <p className="kicker mb-3">Reseñas reales</p>
            <h2 className="font-display text-3xl text-cream sm:text-5xl">
              La gente de Talca habla
            </h2>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <ReviewMarquee />
        </Reveal>
      </section>

      {/* Visítanos */}
      <section id="visitanos" className="container-eos scroll-mt-24 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="kicker mb-3">Visítanos</p>
            <h2 className="font-display text-3xl text-cream sm:text-5xl">
              Estamos en {business.sector}
            </h2>
            <div className="mt-5 h-px w-16 bg-gold-line" />
            <p className="mt-5 flex max-w-md items-start gap-2.5 text-cream-muted">
              <svg
                className="mt-1 shrink-0 text-gold"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span>
                {business.addressLine}. Abierto desde el mediodía y hasta tarde
                todos los días.
              </span>
            </p>

            {/* Horario en panel */}
            <div className="mt-8 max-w-md rounded-2xl border border-cream/10 bg-ink-800/50 p-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="kicker text-[0.6rem]">Horario</span>
                <OpenStatus className="text-xs" />
              </div>
              <HoursList />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={buildWhatsappUrl(
                  `¡Hola ${business.name}! Quiero hacer un pedido 🍷`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                Pedir por WhatsApp
              </a>
              <a
                href={business.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Cómo llegar
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs text-cream-dim">Pagamos con</span>
              {business.payments.map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-cream/12 px-3 py-1 text-xs text-cream-muted"
                >
                  {m}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="h-full min-h-[320px] overflow-hidden rounded-3xl border border-cream/10">
              <iframe
                title="Ubicación de Botillería EOS en Talca"
                src="https://www.google.com/maps?q=Botiller%C3%ADa%20Eos%20Talca&output=embed"
                className="h-full min-h-[320px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, filter: "grayscale(0.3) contrast(1.05)" }}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

const features = [
  {
    title: "Atención cercana",
    text: "“La mejor atención, cordial y amistosa.” Lo más repetido en nuestras reseñas.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.1-5.4A8.5 8.5 0 1 1 21 11.5Z" />
        <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
      </svg>
    ),
  },
  {
    title: "Surtido completo",
    text: "Cervezas, vinos, destilados, bebidas, hielo, snacks y cigarros. Tienen de todo.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7l1.5 12.5a1.5 1.5 0 0 0 1.5 1.3h12a1.5 1.5 0 0 0 1.5-1.3L21 7" />
        <path d="M3 7h18M8 7V5a4 4 0 0 1 8 0v2" />
      </svg>
    ),
  },
  {
    title: "Precios justos",
    text: "Buenos precios de verdad, sin vueltas. Y pagas con tarjeta o RedCompra.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
        <path d="M3 10h18M7 15h4" />
      </svg>
    ),
  },
  {
    title: "Abierto hasta tarde",
    text: "Desde el mediodía y hasta la madrugada el fin de semana. Para cuando se necesite.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
];
