import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({
      orderBy: { position: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  const action = updateProduct.bind(null, product.id);

  return (
    <div>
      <Link href="/admin" className="text-sm text-cream-muted hover:text-gold">
        ← Productos
      </Link>
      <h1 className="mb-8 mt-3 font-display text-3xl text-cream">
        Editar producto
      </h1>
      <ProductForm
        action={action}
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.image,
          available: product.available,
          featured: product.featured,
          position: product.position,
          categoryId: product.categoryId,
        }}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
