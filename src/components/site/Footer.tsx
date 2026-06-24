import Link from "next/link";
import Image from "next/image";
import { business, ageNotice } from "@/lib/business";
import { OpenStatus } from "./OpenStatus";
import { Stars } from "./Stars";

export function Footer() {
  return (
    <footer className="relative border-t border-cream/10 bg-ink-800">
      <div className="container-eos grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image
            src="/logo-eos.png"
            alt="Botillería EOS"
            width={80}
            height={80}
            className="h-20 w-20 object-contain"
          />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream-muted">
            {business.tagline}. Cervezas, vinos y destilados con la mejor
            atención de {business.sector}.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Stars value={business.rating} size={15} />
            <span className="text-sm text-cream-muted">
              {business.rating.toLocaleString("es-CL")} · {business.reviews}{" "}
              reseñas
            </span>
          </div>
        </div>

        <div>
          <h3 className="kicker mb-4 text-[0.62rem]">Navega</h3>
          <ul className="space-y-2.5 text-sm text-cream-muted">
            <li>
              <Link href="/catalogo" className="hover:text-gold">
                Catálogo
              </Link>
            </li>
            <li>
              <Link href="/#resenas" className="hover:text-gold">
                Reseñas
              </Link>
            </li>
            <li>
              <Link href="/#visitanos" className="hover:text-gold">
                Visítanos
              </Link>
            </li>
            <li>
              <a
                href={business.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold"
              >
                Instagram {business.instagramHandle}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${business.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold"
              >
                WhatsApp {business.whatsappDisplay}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="kicker mb-4 text-[0.62rem]">Visítanos</h3>
          <p className="text-sm text-cream-muted">{business.addressLine}</p>
          <a
            href={business.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm text-gold hover:text-gold-light"
          >
            Ver en Google Maps →
          </a>
          <div className="mt-4">
            <OpenStatus className="text-xs" />
          </div>
          <p className="mt-4 text-xs text-cream-dim">
            Pagos: {business.payments.join(" · ")}
          </p>
        </div>
      </div>

      <div className="border-t border-cream/8">
        <div className="container-eos flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream-dim sm:flex-row">
          <p>{ageNotice}</p>
          <div className="flex items-center gap-4">
            <span>
              © {new Date().getFullYear()} {business.name}
            </span>
            <Link href="/admin" className="hover:text-cream-muted">
              Administración
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
