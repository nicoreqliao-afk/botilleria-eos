import "server-only";

/**
 * Limitador de intentos en memoria (por proceso). Suficiente para una sola
 * instancia como la de EOS. No se comparte entre réplicas ni sobrevive a un
 * reinicio; si algún día hay varias instancias, mover a Redis/DB.
 */

type Bucket = { count: number; resetAt: number; lockedUntil: number };

const WINDOW_MS = 15 * 60 * 1000; // ventana de 15 min
const MAX_ATTEMPTS = 8; // intentos fallidos por ventana
const LOCK_MS = 15 * 60 * 1000; // bloqueo tras superar el máximo

const buckets = new Map<string, Bucket>();

function prune(now: number) {
  // Limpieza oportunista para que el Map no crezca sin límite.
  if (buckets.size < 5000) return;
  buckets.forEach((b, key) => {
    if (b.lockedUntil < now && b.resetAt < now) buckets.delete(key);
  });
}

export type RateResult = { ok: true } | { ok: false; retryAfterSec: number };

/** Revisa si la clave (IP) puede intentar ahora. No incrementa el contador. */
export function checkLoginRate(key: string, now = Date.now()): RateResult {
  const b = buckets.get(key);
  if (b && b.lockedUntil > now) {
    return { ok: false, retryAfterSec: Math.ceil((b.lockedUntil - now) / 1000) };
  }
  return { ok: true };
}

/** Registra un intento fallido y bloquea si se supera el máximo. */
export function recordLoginFailure(key: string, now = Date.now()): void {
  prune(now);
  let b = buckets.get(key);
  if (!b || b.resetAt < now) {
    b = { count: 0, resetAt: now + WINDOW_MS, lockedUntil: 0 };
    buckets.set(key, b);
  }
  b.count += 1;
  if (b.count >= MAX_ATTEMPTS) {
    b.lockedUntil = now + LOCK_MS;
    b.count = 0;
    b.resetAt = now + LOCK_MS;
  }
}

/** Login correcto: limpia el historial de esa clave. */
export function recordLoginSuccess(key: string): void {
  buckets.delete(key);
}

/** Solo para tests: reinicia el estado. */
export function _resetRateLimit(): void {
  buckets.clear();
}
