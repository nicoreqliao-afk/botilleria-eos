/**
 * Helpers puros para limpiar y acotar lo que llega de formularios.
 * Sin dependencias: testeables y reutilizables en server actions.
 */

// Topes de longitud para evitar payloads gigantes en la base de datos.
export const LIMITS = {
  productName: 120,
  description: 2000,
  categoryName: 80,
  blurb: 200,
} as const;

// Prisma `Int` es de 32 bits: hay que mantenerse bajo 2^31-1.
// Tope de precio holgado para una botillería (≈ $99.999.999) y de orden.
export const PRICE_MAX = 99_999_999;
export const POSITION_MAX = 100_000;

/** Recorta espacios y limita a `max` caracteres. */
export function clampText(raw: unknown, max: number): string {
  return String(raw ?? "")
    .trim()
    .slice(0, max);
}

/**
 * Extrae solo los dígitos de un texto ("$12.990" → 12990) y lo acota a [0, max].
 * Devuelve 0 si no hay dígitos. Nunca devuelve NaN ni un número fuera de rango.
 */
export function parseDigits(raw: unknown, max = PRICE_MAX): number {
  const digits = String(raw ?? "").replace(/\D/g, "");
  if (!digits) return 0;
  // Recorta antes de parsear para no desbordar Number con cadenas absurdas.
  const n = parseInt(digits.slice(0, 15), 10);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, max);
}
