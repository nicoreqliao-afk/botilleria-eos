import "server-only";
import { prisma } from "@/lib/db";
import type { CategoryDTO, ProductDTO } from "./types";
import type { Category, Product } from "@prisma/client";

function toDTO(p: Product, c?: Pick<Category, "name" | "slug">): ProductDTO {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    image: p.image,
    available: p.available,
    featured: p.featured,
    categoryName: c?.name,
    categorySlug: c?.slug,
  };
}

/** Catálogo completo agrupado por categoría (solo categorías con productos). */
export async function getCatalog(): Promise<CategoryDTO[]> {
  const cats = await prisma.category.findMany({
    orderBy: { position: "asc" },
    include: {
      products: { orderBy: [{ position: "asc" }, { name: "asc" }] },
    },
  });

  return cats
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      blurb: c.blurb,
      coverImage: c.coverImage,
      productCount: c.products.length,
      products: c.products.map((p) => toDTO(p, c)),
    }))
    .filter((c) => c.products.length > 0);
}

/** Resumen de categorías para la portada (sin productos). */
export async function getCategorySummary() {
  const cats = await prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return cats
    .filter((c) => c._count.products > 0)
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      blurb: c.blurb,
      count: c._count.products,
    }));
}

/** Productos destacados y disponibles para la portada. */
export async function getFeatured(limit = 8): Promise<ProductDTO[]> {
  const prods = await prisma.product.findMany({
    where: { featured: true, available: true },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: { category: { select: { name: true, slug: true } } },
  });
  return prods.map((p) => toDTO(p, p.category));
}
