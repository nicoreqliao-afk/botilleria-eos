// Promos destacadas de la portada. Curadas a mano (editables aquí).
// Tomadas de la categoría "Promociones" del catálogo real.

export type Promo = {
  index: string;
  kicker: string;
  title: string;
  blurb: string;
  price: number;
  priceNote?: string;
  href: string;
};

export const promos: Promo[] = [
  {
    index: "01",
    kicker: "Promo estrella",
    title: "Johnnie Walker 1L + Bebida + Hielo",
    blurb: "El combo grande para el carrete: whisky, bebida 3 litros y hielo.",
    price: 15990,
    priceNote: "combo",
    href: "/catalogo#promociones",
  },
  {
    index: "02",
    kicker: "Para la piscola",
    title: "Mistral + Bebida 3L + Hielo",
    blurb: "Todo listo para la piscola perfecta, a un solo precio.",
    price: 10990,
    priceNote: "combo",
    href: "/catalogo#promociones",
  },
  {
    index: "03",
    kicker: "El más conveniente",
    title: "Alto del Carmen 1L + Bebida + Hielo",
    blurb: "El clásico chileno con todo lo necesario para compartir.",
    price: 8990,
    priceNote: "combo",
    href: "/catalogo#promociones",
  },
];
