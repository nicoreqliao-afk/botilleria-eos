import XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const products = await prisma.product.findMany({
  orderBy: [{ category: { position: "asc" } }, { position: "asc" }],
  include: { category: true },
});

const out = [
  ["id", "Categoría", "Producto", "Precio", "Imagen (link o nombre de archivo)"],
];
for (const p of products) out.push([p.id, p.category.name, p.name, p.price, ""]);

const ws = XLSX.utils.aoa_to_sheet(out);
ws["!cols"] = [{ wch: 26 }, { wch: 18 }, { wch: 38 }, { wch: 9 }, { wch: 48 }];
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Catálogo");
const dest = "C:/Users/si/Downloads/catalogo_fotos_template.xlsx";
XLSX.writeFile(wb, dest);
console.log(`Plantilla creada: ${dest} (${products.length} productos)`);
await prisma.$disconnect();
