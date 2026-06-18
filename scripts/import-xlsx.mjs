import XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";

const FILE = process.argv[2];
const COMMIT = process.argv.includes("--commit");

function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
function parsePrice(v) {
  if (typeof v === "number") return Math.round(v);
  const d = String(v ?? "").replace(/[^\d]/g, "");
  return d ? parseInt(d, 10) : 0;
}

// --- Leer Excel ---
const wb = XLSX.readFile(FILE);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false });

const groups = new Map(); // categoria -> [{name, price, formato}]
let skipped = 0;
for (let i = 1; i < rows.length; i++) {
  const [cat, prod, formato, precio] = rows[i];
  if (!prod || String(prod).trim() === "") {
    skipped++;
    continue;
  } // divisores en mayúscula
  const price = parsePrice(precio);
  if (!price) {
    skipped++;
    continue;
  }
  const categoria = String(cat ?? "").trim() || "Otros";
  const fmt = String(formato ?? "").trim();
  const name = fmt ? `${String(prod).trim()} ${fmt}` : String(prod).trim();
  if (!groups.has(categoria)) groups.set(categoria, []);
  groups.get(categoria).push({ name, price });
}

// --- Resumen ---
let total = 0;
console.log("\n=== Vista previa de importación ===");
for (const [cat, items] of groups) {
  total += items.length;
  console.log(`\n▸ ${cat} (${items.length})`);
  for (const it of items.slice(0, 3))
    console.log(`   - ${it.name}  $${it.price.toLocaleString("es-CL")}`);
  if (items.length > 3) console.log(`   …(+${items.length - 3} más)`);
}
console.log(`\nTotal: ${groups.size} categorías, ${total} productos (filas omitidas: ${skipped})`);

if (!COMMIT) {
  console.log("\n(Vista previa. Para escribir en la base: agrega --commit)");
  process.exit(0);
}

// --- Escribir en la base (reemplaza el catálogo) ---
const prisma = new PrismaClient();
await prisma.product.deleteMany();
await prisma.category.deleteMany();

let catPos = 0;
for (const [cat, items] of groups) {
  catPos++;
  const category = await prisma.category.create({
    data: { name: cat, slug: slugify(cat) || `cat-${catPos}`, position: catPos },
  });
  let pos = 0;
  const seen = new Set();
  for (const it of items) {
    pos++;
    let slug = slugify(it.name) || `prod-${catPos}-${pos}`;
    let s = slug, n = 1;
    while (seen.has(s)) { n++; s = `${slug}-${n}`; }
    seen.add(s);
    await prisma.product.create({
      data: {
        name: it.name,
        slug: s,
        price: it.price,
        available: true,
        featured: false,
        position: pos,
        categoryId: category.id,
      },
    });
  }
  console.log(`  ✓ ${cat}: ${items.length}`);
}
const tc = await prisma.category.count();
const tp = await prisma.product.count();
console.log(`\n✅ Importado: ${tc} categorías, ${tp} productos.`);
await prisma.$disconnect();
