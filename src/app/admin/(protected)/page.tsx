import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatCLP } from "@/lib/format";
import { RowActions } from "@/components/admin/RowActions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const categories = await prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { products: { orderBy: [{ position: "asc" }, { name: "asc" }] } },
  });

  const allProducts = categories.flatMap((c) => c.products);
  const stats = {
    products: allProducts.length,
    categories: categories.length,
    featured: allProducts.filter((p) => p.featured).length,
    soldOut: allProducts.filter((p) => !p.available).length,
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-cream">Productos</h1>
          <p className="mt-1 text-sm text-cream-muted">
            Gestiona el catálogo de la botillería.
          </p>
        </div>
        <Link href="/admin/productos/nuevo" className="btn-gold">
          + Nuevo producto
        </Link>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Productos" value={stats.products} />
        <Stat label="Categorías" value={stats.categories} />
        <Stat label="Destacados" value={stats.featured} />
        <Stat label="Agotados" value={stats.soldOut} />
      </div>

      {categories.length === 0 ? (
        <Empty />
      ) : (
        <div className="space-y-10">
          {categories.map((cat) => (
            <section key={cat.id}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-xl text-cream">
                  {cat.name}{" "}
                  <span className="text-sm text-cream-dim">
                    ({cat.products.length})
                  </span>
                </h2>
              </div>

              {cat.products.length === 0 ? (
                <p className="rounded-xl border border-dashed border-cream/12 px-4 py-6 text-sm text-cream-dim">
                  Sin productos en esta categoría.
                </p>
              ) : (
                <div className="overflow-hidden rounded-xl border border-cream/10">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-cream/8">
                      {cat.products.map((p) => (
                        <tr
                          key={p.id}
                          className="bg-ink-800/40 transition-colors hover:bg-ink-700/40"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-cream">
                                {p.name}
                              </span>
                              {p.featured && (
                                <span className="rounded bg-gold/15 px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-wide text-gold">
                                  Destacado
                                </span>
                              )}
                              {!p.available && (
                                <span className="rounded bg-wine/30 px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-wide text-cream-muted">
                                  Agotado
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-gold tabular-nums">
                            {formatCLP(p.price)}
                          </td>
                          <td className="px-4 py-3">
                            <RowActions
                              id={p.id}
                              available={p.available}
                              featured={p.featured}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-eos p-4">
      <p className="font-display text-3xl text-cream tabular-nums">{value}</p>
      <p className="text-xs text-cream-muted">{label}</p>
    </div>
  );
}

function Empty() {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-cream/15 py-16 text-center">
      <p className="font-display text-2xl text-cream">Aún no hay productos</p>
      <p className="mt-2 text-sm text-cream-muted">
        Crea tu primera categoría y luego agrega productos.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/admin/categorias" className="btn-ghost">
          Crear categoría
        </Link>
        <Link href="/admin/productos/nuevo" className="btn-gold">
          Nuevo producto
        </Link>
      </div>
    </div>
  );
}
