/**
 * Convierte un texto en un slug seguro para URLs.
 * Pura y sin dependencias para poder testearla y reutilizarla (web + seed).
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // quita tildes/diacríticos combinados
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
