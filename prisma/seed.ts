import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/slugify";

const prisma = new PrismaClient();

type SeedProduct = {
  name: string;
  price: number;
  description?: string;
  featured?: boolean;
};

const data: { category: string; blurb: string; products: SeedProduct[] }[] = [
  {
    category: "Cervezas",
    blurb: "Siempre heladas. De la clásica al barril artesanal.",
    products: [
      { name: "Cristal 1L retornable", price: 1490, featured: true, description: "La de siempre, bien helada." },
      { name: "Escudo 1L retornable", price: 1590 },
      { name: "Heineken lata 473cc", price: 1290 },
      { name: "Corona 355cc", price: 1190 },
      { name: "Kunstmann Torobayo 330cc", price: 2190, description: "Artesanal del sur." },
      { name: "Austral Calafate 330cc", price: 2390 },
      { name: "Royal Guard 470cc", price: 1390 },
    ],
  },
  {
    category: "Vinos",
    blurb: "Tintos, blancos y reservas del valle.",
    products: [
      { name: "Casillero del Diablo Cabernet", price: 5490, featured: true, description: "Concha y Toro. Un clásico que nunca falla." },
      { name: "Gato Negro Cabernet Sauvignon", price: 2990 },
      { name: "120 Santa Rita Merlot", price: 3490 },
      { name: "Frontera Cabernet", price: 3290 },
      { name: "Santa Carolina Reservado", price: 3990 },
      { name: "Misiones de Rengo Carmenère", price: 4290 },
    ],
  },
  {
    category: "Espumantes",
    blurb: "Para cuando hay algo que celebrar.",
    products: [
      { name: "Valdivieso Brut", price: 5990, featured: true, description: "Burbuja chilena para el brindis." },
      { name: "Undurraga Brut", price: 6490 },
      { name: "Chandon Brut", price: 14990 },
      { name: "Moët & Chandon Impérial", price: 54990, featured: true, description: "Champagne francés. El brindis grande." },
    ],
  },
  {
    category: "Whisky",
    blurb: "Etiquetas para tomar tranquilo o regalar.",
    products: [
      { name: "Jack Daniel's N°7 750cc", price: 19990, featured: true, description: "Tennessee whiskey, suave y tostado." },
      { name: "Johnnie Walker Red Label 750cc", price: 12990, featured: true },
      { name: "Johnnie Walker Black Label 750cc", price: 24990 },
      { name: "Jack Daniel's Apple 750cc", price: 21990 },
      { name: "Chivas Regal 12 años", price: 26990 },
      { name: "Ballantine's Finest", price: 11990 },
    ],
  },
  {
    category: "Pisco",
    blurb: "Del piscola de viernes al reserva fino.",
    products: [
      { name: "Alto del Carmen 35° 750cc", price: 7990, featured: true },
      { name: "Mistral Nobel 40°", price: 9990 },
      { name: "Capel 35° 1L", price: 8490 },
      { name: "Control C 35° 1L", price: 6990 },
    ],
  },
  {
    category: "Vodka",
    blurb: "Limpio y derecho para la mezcla.",
    products: [
      { name: "Smirnoff 750cc", price: 7990, featured: true },
      { name: "Absolut 750cc", price: 11990 },
      { name: "Stolichnaya 750cc", price: 10990 },
    ],
  },
  {
    category: "Ron",
    blurb: "Caribeño, para el mojito o derecho.",
    products: [
      { name: "Barceló Añejo", price: 12990, featured: true },
      { name: "Havana Club Añejo 3 años", price: 9990 },
      { name: "Bacardí Carta Blanca", price: 9490 },
    ],
  },
  {
    category: "Licores",
    blurb: "Aperitivos y cremas para la previa.",
    products: [
      { name: "Baileys Original 750cc", price: 13990, featured: true },
      { name: "Aperol 750cc", price: 9990 },
      { name: "Campari 750cc", price: 11990 },
      { name: "Jägermeister 700cc", price: 15990 },
    ],
  },
  {
    category: "Bebidas y jugos",
    blurb: "Para acompañar o para el bajón.",
    products: [
      { name: "Coca-Cola 1.5L", price: 1890 },
      { name: "Coca-Cola 3L", price: 2990 },
      { name: "Sprite 1.5L", price: 1790 },
      { name: "Agua tónica Canada Dry 1.5L", price: 1690 },
      { name: "Red Bull 250cc", price: 1690, featured: true },
      { name: "Hielo en bolsa 2kg", price: 1990, description: "Cubitos, listos para el carrete." },
    ],
  },
  {
    category: "Snacks y confites",
    blurb: "Lo salado y lo dulce para picar.",
    products: [
      { name: "Papas fritas Lay's", price: 1990 },
      { name: "Maní salado 200g", price: 1490 },
      { name: "Doritos Queso", price: 2290 },
      { name: "Super 8 pack x6", price: 1690 },
    ],
  },
  {
    category: "Cigarros",
    blurb: "Cajetillas y accesorios.",
    products: [
      { name: "Marlboro Box", price: 4500 },
      { name: "Lucky Strike", price: 4300 },
      { name: "Pall Mall", price: 3900 },
    ],
  },
  {
    category: "Carbón y parrilla",
    blurb: "Todo para el asado.",
    products: [
      { name: "Carbón 2kg", price: 2990, featured: true },
      { name: "Encendedor de fuego", price: 890 },
      { name: "Sal de mar 1kg", price: 1290 },
    ],
  },
];

async function main() {
  console.log("🌱 Sembrando catálogo de Botillería EOS...");

  // Limpia para una semilla idempotente.
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  let catPos = 0;
  for (const group of data) {
    catPos += 1;
    const category = await prisma.category.create({
      data: {
        name: group.category,
        slug: slugify(group.category),
        blurb: group.blurb,
        position: catPos,
      },
    });

    let prodPos = 0;
    for (const p of group.products) {
      prodPos += 1;
      await prisma.product.create({
        data: {
          name: p.name,
          slug: slugify(`${p.name}`),
          description: p.description ?? null,
          price: p.price,
          featured: p.featured ?? false,
          position: prodPos,
          categoryId: category.id,
        },
      });
    }
    console.log(`  • ${group.category}: ${group.products.length} productos`);
  }

  const totalCats = await prisma.category.count();
  const totalProds = await prisma.product.count();
  console.log(`✅ Listo: ${totalCats} categorías, ${totalProds} productos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
