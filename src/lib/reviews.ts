// Reseñas reales de Google (jun 2026). Editadas levemente para limpieza tipográfica.
export type Review = {
  author: string;
  text: string;
  localGuide?: boolean;
};

export const reviews: Review[] = [
  {
    author: "Nicolás Molina",
    text: "Excelente atención y buenos precios, el local es precioso.",
  },
  {
    author: "Mauro Garrido",
    text: "Excelente atención. Muy cordiales y encuentras de todo para tu fiesta.",
    localGuide: true,
  },
  {
    author: "rodrigo gaete",
    text: "Tiene casi de todo para el carrete, pero lo que más destaco es que la atención es súper cercana y amistosa.",
    localGuide: true,
  },
  {
    author: "Luis Rodríguez M.",
    text: "Excelente atención y mucha variedad, a bajo costo.",
    localGuide: true,
  },
  {
    author: "Judith Bravo",
    text: "La mejor atención y buenos precios.",
  },
  {
    author: "karen gallegos",
    text: "Siempre tienen de todo y excelente atención.",
    localGuide: true,
  },
  {
    author: "carlos villegas",
    text: "Buen precio, buen trato, rapidez y fluidez. Recomendado 100%.",
    localGuide: true,
  },
  {
    author: "Mundo Daryl",
    text: "Excelente ubicación, abierto hasta tarde, ¡todo lo que necesite para compartir!",
    localGuide: true,
  },
  {
    author: "Francisco Vidal",
    text: "Gran variedad de copete y buenos precios, además que puedes comprar con RedCompra.",
    localGuide: true,
  },
];
