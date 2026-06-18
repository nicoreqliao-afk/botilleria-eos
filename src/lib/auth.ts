import "server-only";
import { cookies, headers } from "next/headers";
import { timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "eos_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 días

// Valores de ejemplo que NO deben usarse en producción.
const FORBIDDEN_SECRETS = new Set([
  "genera-un-secreto-largo-y-aleatorio",
  "cambia-esto-por-un-secreto-largo-y-aleatorio-eos-talca",
]);

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET debe tener al menos 32 caracteres. Configúralo en .env.",
    );
  }
  if (FORBIDDEN_SECRETS.has(secret)) {
    throw new Error(
      "SESSION_SECRET es un valor de ejemplo. Genera uno aleatorio para producción.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSession(): Promise<void> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  // Solo marca la cookie como "secure" si realmente vamos por HTTPS.
  // Así no se rompe el login si EOS sirve el sitio por HTTP en una red local.
  const proto = headers().get("x-forwarded-proto");
  const isHttps = proto === "https";

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function destroyAdminSession(): void {
  cookies().delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    // Solo es admin si el token lo declara explícitamente.
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Compara en tiempo constante para no filtrar la contraseña por timing. */
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  // Longitudes distintas no pueden ser iguales; timingSafeEqual exige igual largo.
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (expected.length === 0) return false;
  return safeEqual(input, expected);
}
