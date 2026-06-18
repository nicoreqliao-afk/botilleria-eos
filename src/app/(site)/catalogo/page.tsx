import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { CatalogView } from "@/components/catalog/CatalogView";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: "Catálogo",
  description: `Catálogo de ${business.name}: cervezas, vinos, whisky, pisco y más. Arma tu pedido y ciérralo por WhatsApp.`,
};

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const categories = await getCatalog();

  return (
    <div className="container-eos pb-28 pt-24 sm:pt-28">
      <header className="mb-4 max-w-2xl">
        <p className="kicker mb-3">Catálogo</p>
        <h1 className="font-display text-4xl text-cream sm:text-6xl">
          Todo lo que tenemos, listo para tu pedido
        </h1>
        <p className="mt-4 text-cream-muted">
          Agrega lo que quieras al canasto y envía el pedido por WhatsApp. Los
          precios son referenciales; confirmamos disponibilidad al toque.
        </p>
      </header>

      {categories.length === 0 ? (
        <div className="mt-16 grid place-items-center rounded-2xl border border-dashed border-cream/15 py-20 text-center">
          <p className="font-display text-2xl text-cream">
            Aún no hay productos cargados
          </p>
          <p className="mt-2 text-sm text-cream-muted">
            El catálogo se administra desde el panel.
          </p>
        </div>
      ) : (
        <CatalogView categories={categories} />
      )}
    </div>
  );
}
