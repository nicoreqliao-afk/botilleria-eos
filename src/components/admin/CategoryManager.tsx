"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type FormState,
} from "@/app/admin/actions";

type Cat = { id: string; name: string; blurb: string | null; count: number };

const inputClass =
  "w-full rounded-lg border border-cream/15 bg-ink-700 px-3 py-2 text-sm text-cream outline-none transition-colors focus:border-gold/60 placeholder:text-cream-dim";

function Saving({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "…" : label}
    </button>
  );
}

export function CategoryManager({ categories }: { categories: Cat[] }) {
  return (
    <div className="space-y-8">
      <AddCategory />
      <div className="space-y-3">
        {categories.length === 0 ? (
          <p className="rounded-xl border border-dashed border-cream/15 px-4 py-8 text-center text-sm text-cream-muted">
            Aún no hay categorías. Crea la primera arriba.
          </p>
        ) : (
          categories.map((c) => <CategoryRow key={c.id} cat={c} />)
        )}
      </div>
    </div>
  );
}

function AddCategory() {
  const [state, action] = useFormState(createCategory, {} as FormState);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);

  return (
    <form
      ref={ref}
      action={action}
      className="card-eos space-y-3 p-5"
    >
      <h2 className="font-display text-lg text-cream">Nueva categoría</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder="Nombre (ej: Cervezas)"
          className={inputClass}
        />
        <input
          name="blurb"
          placeholder="Frase corta (opcional)"
          className={inputClass}
        />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-wine-light">
          {state.error}
        </p>
      )}
      <Saving label="Agregar categoría" />
    </form>
  );
}

function CategoryRow({ cat }: { cat: Cat }) {
  const [state, action] = useFormState(
    updateCategory.bind(null, cat.id),
    {} as FormState,
  );

  return (
    <div className="card-eos flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <form action={action} className="flex flex-1 flex-col gap-3 sm:flex-row">
        <input
          name="name"
          required
          defaultValue={cat.name}
          className={`${inputClass} sm:max-w-xs`}
        />
        <input
          name="blurb"
          defaultValue={cat.blurb ?? ""}
          placeholder="Frase corta"
          className={inputClass}
        />
        <Saving label="Guardar" />
      </form>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <span className="text-xs text-cream-dim tabular-nums">
          {cat.count} prod.
        </span>
        <form
          action={deleteCategory.bind(null, cat.id)}
          onSubmit={(e) => {
            if (
              !confirm(
                `¿Eliminar “${cat.name}”? Se borrarán también sus ${cat.count} productos.`,
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <button
            className="rounded-lg border border-cream/12 px-3 py-2 text-sm text-cream-dim transition-colors hover:border-wine-light/60 hover:text-wine-light"
            title="Eliminar categoría"
          >
            Eliminar
          </button>
        </form>
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-wine-light">
          {state.error}
        </p>
      )}
    </div>
  );
}
