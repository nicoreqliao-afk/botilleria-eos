import { prisma } from "@/lib/db";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-cream">Categorías</h1>
        <p className="mt-1 text-sm text-cream-muted">
          Organiza cómo se agrupan los productos en el catálogo.
        </p>
      </div>
      <CategoryManager
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          blurb: c.blurb,
          count: c._count.products,
        }))}
      />
    </div>
  );
}
