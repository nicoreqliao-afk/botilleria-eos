import { business, weeklyHours } from "@/lib/business";

// Mapea el índice de día (0=Dom … 6=Sáb) al nombre schema.org.
const SCHEMA_DAY: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

/**
 * Datos estructurados (JSON-LD) del negocio para SEO local.
 * Describe la botillería como Store/LocalBusiness: dirección, horario,
 * teléfono, valoración y redes. Ayuda a Google a mostrar la ficha con
 * estrellas y a asociarla con el perfil de Maps.
 */
export function BusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${business.siteUrl}/#store`,
    name: business.name,
    description: `Botillería en ${business.sector}, ${business.city}. Cervezas, vinos, whisky, pisco, espumantes, bebidas, snacks y más.`,
    url: business.siteUrl,
    telephone: business.whatsappDisplay,
    image: `${business.siteUrl}/fondo-frente.jpg`,
    logo: `${business.siteUrl}/logo-eos.png`,
    priceRange: "$$",
    currenciesAccepted: "CLP",
    paymentAccepted: business.payments.join(", "),
    address: {
      "@type": "PostalAddress",
      streetAddress: business.sector,
      addressLocality: business.city,
      addressRegion: business.region,
      addressCountry: "CL",
    },
    areaServed: {
      "@type": "City",
      name: business.city,
    },
    sameAs: [business.instagram],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.rating,
      reviewCount: business.reviews,
      bestRating: 5,
      worstRating: 1,
    },
    openingHoursSpecification: weeklyHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: SCHEMA_DAY[h.day],
      opens: h.open,
      closes: h.close,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // JSON serializado; no incluye datos de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
