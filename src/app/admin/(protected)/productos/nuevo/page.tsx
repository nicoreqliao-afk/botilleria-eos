import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { position: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <Link
        href="/admin"
        className="text-sm text-cream-muted hover:text-gold"
      >
        ← Productos
      </Link>
      <h1 className="mb-8 mt-3 font-display text-3xl text-cream">
        Nuevo producto
      </h1>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cream/15 p-8 text-center">
          <p className="text-cream">
            Primero crea una categoría para poder agregar productos.
          </p>
          <Link href="/admin/categorias" className="btn-gold mt-5">
            Crear categoría
          </Link>
        </div>
      ) : (
        <ProductForm
          action={createProduct}
          categories={categories}
          submitLabel="Crear producto"
        />
      )}
    </div>
  );
}
