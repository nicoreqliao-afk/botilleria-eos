import XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Quita el formato del final del nombre para buscar mejor (190g, 473ml, 1L, 750cc...)
function baseName(name) {
  return name
    .replace(/\s+\d+(\.\d+)?\s?(g|kg|ml|cc|l|lt|litros?)\b.*$/i, "")
    .replace(/\s+(sixpack|tamaño\s+l|caja|botella)\b.*$/i, "")
    .trim();
}
function norm(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

async function offSearch(q) {
  const url =
    "https://world.openfoodfacts.org/cgi/search.pl?search_terms=" +
    encodeURIComponent(q) +
    "&search_simple=1&action=process&json=1&page_size=4&fields=product_name,brands,image_front_url";
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "BotilleriaEOS/1.0 (catalogo web)" },
    });
    const j = await r.json();
    return j.products || [];
  } catch {
    return [];
  }
}

const products = await prisma.product.findMany({
  orderBy: [{ category: { position: "asc" } }, { position: "asc" }],
  include: { category: true },
});

const out = [["id", "Categoría", "Producto", "Precio", "ImagenURL", "Coincidencia"]];
let found = 0;

for (const p of products) {
  const q = baseName(p.name);
  const fw = norm(q).split(/\s+/)[0];
  const cands = await offSearch(q);
  let url = "";
  let match = "";
  for (const c of cands) {
    if (!c.image_front_url) continue;
    const hay = norm(`${c.product_name || ""} ${c.brands || ""}`);
    if (fw.length >= 3 && hay.includes(fw)) {
      url = c.image_front_url;
      match = c.product_name || c.brands || "";
      break;
    }
  }
  if (url) found++;
  out.push([p.id, p.category.name, p.name, p.price, url, match]);
  console.log(`${url ? "✓" : "·"} ${p.name}${match ? "  → " + match : ""}`);
}

const ws = XLSX.utils.aoa_to_sheet(out);
ws["!cols"] = [{ wch: 26 }, { wch: 18 }, { wch: 34 }, { wch: 8 }, { wch: 60 }, { wch: 30 }];
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Catálogo");
const dest = "C:/Users/si/Downloads/catalogo_con_imagenes.xlsx";
XLSX.writeFile(wb, dest);
console.log(`\nListo: ${found}/${products.length} con imagen. Excel: ${dest}`);
await prisma.$disconnect();
