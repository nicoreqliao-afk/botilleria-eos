import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const prisma = new PrismaClient();
const dir = "public/uploads/_cand";
await mkdir(dir, { recursive: true });

// [coincide en DB, búsqueda OFF, palabra que DEBE estar en product_name]
const items = [
  ["Corona 620", "Corona Extra cerveza", "corona"],
  ["Heineken", "Heineken beer", "heineken"],
  ["Budweiser", "Budweiser beer", "budweiser"],
  ["Coors 620", "Coors beer", "coors"],
  ["Miller 473", "Miller Genuine Draft", "miller"],
  ["Stella", "Stella Artois", "stella"],
  ["Quilmes", "Quilmes cerveza", "quilmes"],
  ["Cusqueña 620", "Cusqueña cerveza", "cusque"],
  ["Michelob", "Michelob Ultra", "michelob"],
  ["Becker 473", "Becker cerveza", "becker"],
  ["Escudo 473", "Escudo cerveza", "escudo"],
  ["Takis", "Takis Fuego", "takis"],
  ["Doritos", "Doritos", "doritos"],
  ["Tostitos", "Tostitos", "tostitos"],
  ["Lays 250", "Lays papas fritas", "lay"],
  ["Cheetos", "Cheetos", "cheetos"],
];

async function off(q) {
  const u =
    "https://world.openfoodfacts.org/cgi/search.pl?search_terms=" +
    encodeURIComponent(q) +
    "&search_simple=1&action=process&json=1&page_size=6&fields=product_name,brands,image_front_url";
  try {
    const r = await fetch(u, { headers: { "User-Agent": "BotilleriaEOS/1.0" } });
    const j = await r.json();
    return j.products || [];
  } catch {
    return [];
  }
}

for (const [nameC, q, must] of items) {
  const p = await prisma.product.findFirst({ where: { name: { contains: nameC } } });
  if (!p) { console.log("· sin producto:", nameC); continue; }
  const cands = await off(q);
  const pick = cands.find(
    (c) => c.image_front_url && (c.product_name || "").toLowerCase().includes(must),
  );
  if (!pick) { console.log("· sin imagen:", p.name); continue; }
  try {
    const r = await fetch(pick.image_front_url, { headers: { "User-Agent": "BotilleriaEOS/1.0" } });
    const buf = Buffer.from(await r.arrayBuffer());
    await writeFile(path.join(dir, `${p.id}.jpg`), buf);
    console.log(`✓ ${p.name}  →  ${pick.product_name}  [${p.id}]`);
  } catch {
    console.log("· error descarga:", p.name);
  }
}
await prisma.$disconnect();
