"use server";

import { writeFile, mkdir, unlink } from "fs/promises";
import { randomUUID } from "node:crypto";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import {
  createAdminSession,
  destroyAdminSession,
  checkPassword,
  isAuthenticated,
} from "@/lib/auth";
import {
  checkLoginRate,
  recordLoginFailure,
  recordLoginSuccess,
} from "@/lib/rate-limit";
import { uniqueProductSlug, uniqueCategorySlug } from "@/lib/slug";
import { clampText, parseDigits, LIMITS, POSITION_MAX } from "@/lib/sanitize";
import { validateImageUpload, MAX_UPLOAD_BYTES } from "@/lib/uploads";

export type FormState = { error?: string; ok?: boolean };

async function assertAuth() {
  if (!(await isAuthenticated())) {
    throw new Error("No autorizado");
  }
}

function refreshPublic() {
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/admin");
}

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Guarda una imagen subida validándola por su contenido real. Lanza un Error
 * con mensaje legible si el archivo es inválido (lo captura el caller).
 * Devuelve la ruta pública o null si no se subió nada.
 */
async function saveUpload(file: FormDataEntryValue | null): Promise<string | null> {
  if (!file || typeof file === "string") return null;
  const f = file as File;
  if (!f.size) return null;

  // Corta antes de leer a memoria para no permitir un DoS con archivos enormes.
  if (f.size > MAX_UPLOAD_BYTES) {
    throw new Error("La imagen supera el máximo de 5 MB.");
  }

  const bytes = new Uint8Array(await f.arrayBuffer());
  const check = validateImageUpload(bytes);
  if (!check.ok) {
    throw new Error(check.error);
  }

  const name = `${randomUUID()}.${check.ext}`;
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(UPLOADS_DIR, name), bytes);
  return `/uploads/${name}`;
}

/** Borra una imagen del directorio de uploads, sin permitir salir de él. */
async function removeUpload(imagePath: string | null) {
  if (!imagePath || !imagePath.startsWith("/uploads/")) return;
  // basename descarta cualquier intento de path traversal ("../").
  const name = path.basename(imagePath);
  const target = path.join(UPLOADS_DIR, name);
  if (path.dirname(target) !== UPLOADS_DIR) return;
  try {
    await unlink(target);
  } catch {
    /* archivo ya no existe */
  }
}

function clientIp(): string {
  const h = headers();
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}

/* ----------------------------- Auth ----------------------------- */

export async function login(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const ip = clientIp();
  const rate = checkLoginRate(ip);
  if (!rate.ok) {
    const mins = Math.ceil(rate.retryAfterSec / 60);
    return {
      error: `Demasiados intentos. Inténtalo de nuevo en ${mins} minuto${mins === 1 ? "" : "s"}.`,
    };
  }

  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    recordLoginFailure(ip);
    return { error: "Contraseña incorrecta. Inténtalo de nuevo." };
  }

  recordLoginSuccess(ip);
  await createAdminSession();
  redirect("/admin");
}

export async function logout() {
  destroyAdminSession();
  redirect("/admin/login");
}

/* --------------------------- Productos --------------------------- */

export async function createProduct(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await assertAuth();

  const name = clampText(formData.get("name"), LIMITS.productName);
  const categoryId = String(formData.get("categoryId") ?? "");
  const price = parseDigits(formData.get("price"));
  const description = clampText(formData.get("description"), LIMITS.description);

  if (!name) return { error: "El nombre es obligatorio." };
  if (!categoryId) return { error: "Selecciona una categoría." };

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!category) return { error: "La categoría seleccionada ya no existe." };

  let image: string | null = null;
  try {
    image = await saveUpload(formData.get("image"));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo subir la imagen." };
  }

  const slug = await uniqueProductSlug(name);

  try {
    await prisma.product.create({
      data: {
        name,
        slug,
        categoryId,
        price,
        description: description || null,
        image,
        available: formData.get("available") === "on",
        featured: formData.get("featured") === "on",
        position: parseDigits(formData.get("position"), POSITION_MAX),
      },
    });
  } catch {
    // Si falla la inserción, no dejes la imagen huérfana en disco.
    await removeUpload(image);
    return { error: "No se pudo guardar el producto. Inténtalo de nuevo." };
  }

  refreshPublic();
  redirect("/admin");
}

export async function updateProduct(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await assertAuth();

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return { error: "El producto no existe." };

  const name = clampText(formData.get("name"), LIMITS.productName);
  const categoryId = String(formData.get("categoryId") ?? "");
  const price = parseDigits(formData.get("price"));
  const description = clampText(formData.get("description"), LIMITS.description);

  if (!name) return { error: "El nombre es obligatorio." };
  if (!categoryId) return { error: "Selecciona una categoría." };

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!category) return { error: "La categoría seleccionada ya no existe." };

  let image = existing.image;
  const removeImage = formData.get("removeImage") === "on";
  let newImage: string | null = null;
  try {
    newImage = await saveUpload(formData.get("image"));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo subir la imagen." };
  }
  if (newImage) {
    await removeUpload(existing.image);
    image = newImage;
  } else if (removeImage) {
    await removeUpload(existing.image);
    image = null;
  }

  const slug =
    name !== existing.name ? await uniqueProductSlug(name, id) : existing.slug;

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        categoryId,
        price,
        description: description || null,
        image,
        available: formData.get("available") === "on",
        featured: formData.get("featured") === "on",
        position: parseDigits(formData.get("position"), POSITION_MAX),
      },
    });
  } catch {
    // Limpia la imagen recién subida si el update falló.
    if (newImage) await removeUpload(newImage);
    return { error: "No se pudo guardar el producto. Inténtalo de nuevo." };
  }

  refreshPublic();
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  await assertAuth();
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return;
  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    return; // ya no existe; nada que hacer
  }
  await removeUpload(existing.image);
  refreshPublic();
}

export async function toggleAvailable(id: string) {
  await assertAuth();
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) return;
  await prisma.product.update({
    where: { id },
    data: { available: !p.available },
  });
  refreshPublic();
}

export async function toggleFeatured(id: string) {
  await assertAuth();
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) return;
  await prisma.product.update({
    where: { id },
    data: { featured: !p.featured },
  });
  refreshPublic();
}

/* -------------------------- Categorías -------------------------- */

export async function createCategory(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await assertAuth();
  const name = clampText(formData.get("name"), LIMITS.categoryName);
  const blurb = clampText(formData.get("blurb"), LIMITS.blurb);
  if (!name) return { error: "El nombre es obligatorio." };

  const count = await prisma.category.count();
  const slug = await uniqueCategorySlug(name);
  try {
    await prisma.category.create({
      data: { name, slug, blurb: blurb || null, position: count + 1 },
    });
  } catch {
    return { error: "No se pudo crear la categoría. Inténtalo de nuevo." };
  }
  refreshPublic();
  return { ok: true };
}

export async function updateCategory(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await assertAuth();
  const name = clampText(formData.get("name"), LIMITS.categoryName);
  const blurb = clampText(formData.get("blurb"), LIMITS.blurb);
  if (!name) return { error: "El nombre es obligatorio." };

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return { error: "La categoría no existe." };

  const slug =
    name !== existing.name ? await uniqueCategorySlug(name, id) : existing.slug;
  try {
    await prisma.category.update({
      where: { id },
      data: { name, slug, blurb: blurb || null },
    });
  } catch {
    return { error: "No se pudo guardar la categoría. Inténtalo de nuevo." };
  }
  refreshPublic();
  return { ok: true };
}

export async function deleteCategory(id: string) {
  await assertAuth();
  // Recupera las imágenes de los productos para no dejarlas huérfanas al borrar
  // la categoría en cascada.
  const products = await prisma.product.findMany({
    where: { categoryId: id },
    select: { image: true },
  });
  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    return; // ya no existe
  }
  for (const p of products) await removeUpload(p.image);
  refreshPublic();
}
