import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";

export { slugify };

/** Genera un slug único para productos, agregando sufijo numérico si choca. */
export async function uniqueProductSlug(
  name: string,
  ignoreId?: string,
): Promise<string> {
  const base = slugify(name) || "producto";
  let candidate = base;
  let n = 1;
  // Itera hasta encontrar uno libre.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === ignoreId) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

/** Genera un slug único para categorías. */
export async function uniqueCategorySlug(
  name: string,
  ignoreId?: string,
): Promise<string> {
  const base = slugify(name) || "categoria";
  let candidate = base;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.category.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === ignoreId) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}
