"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import type { FormState } from "@/app/admin/actions";

type ProductLike = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
  available: boolean;
  featured: boolean;
  position: number;
  categoryId: string;
};

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  categories: { id: string; name: string }[];
  product?: ProductLike;
  submitLabel: string;
};

const inputClass =
  "w-full rounded-xl border border-cream/15 bg-ink-700 px-4 py-2.5 text-cream outline-none transition-colors focus:border-gold/60 placeholder:text-cream-dim";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-gold">
      {pending ? "Guardando…" : label}
    </button>
  );
}

export function ProductForm({
  action,
  categories,
  product,
  submitLabel,
}: Props) {
  const [state, formAction] = useFormState(action, {} as FormState);
  const [preview, setPreview] = useState<string | null>(product?.image ?? null);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <Field label="Nombre" htmlFor="name" required>
        <input
          id="name"
          name="name"
          required
          defaultValue={product?.name}
          placeholder="Ej: Cristal 1L retornable"
          className={inputClass}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Categoría" htmlFor="categoryId" required>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={product?.categoryId ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Selecciona…
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Precio (CLP)" htmlFor="price" required>
          <input
            id="price"
            name="price"
            inputMode="numeric"
            required
            defaultValue={product?.price}
            placeholder="12990"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Descripción (opcional)" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product?.description ?? ""}
          placeholder="Una línea que invite a comprarlo."
          className={inputClass}
        />
      </Field>

      <Field label="Foto (opcional)" htmlFor="image">
        <div className="flex items-center gap-4">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Vista previa"
              className="h-20 w-20 shrink-0 rounded-xl border border-cream/15 object-cover"
            />
          )}
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : product?.image ?? null);
            }}
            className="block w-full text-sm text-cream-muted file:mr-4 file:rounded-full file:border-0 file:bg-cream/10 file:px-4 file:py-2 file:text-sm file:text-cream hover:file:bg-cream/20"
          />
        </div>
        {product?.image && (
          <label className="mt-3 inline-flex items-center gap-2 text-sm text-cream-muted">
            <input type="checkbox" name="removeImage" className="accent-gold" />
            Quitar la foto actual
          </label>
        )}
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Orden (menor aparece primero)" htmlFor="position">
          <input
            id="position"
            name="position"
            inputMode="numeric"
            defaultValue={product?.position ?? 0}
            className={inputClass}
          />
        </Field>
        <div className="flex items-end gap-6 pb-2">
          <label className="inline-flex items-center gap-2 text-sm text-cream">
            <input
              type="checkbox"
              name="available"
              defaultChecked={product ? product.available : true}
              className="h-4 w-4 accent-gold"
            />
            Disponible
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-cream">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured ?? false}
              className="h-4 w-4 accent-gold"
            />
            Destacado
          </label>
        </div>
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-wine-light/40 bg-wine-deep/40 px-3 py-2 text-sm text-cream"
        >
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-cream/10 pt-6">
        <SubmitButton label={submitLabel} />
        <Link href="/admin" className="btn-ghost">
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-cream-muted"
      >
        {label}
        {required && <span className="text-gold"> *</span>}
      </label>
      {children}
    </div>
  );
}
