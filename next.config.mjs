/** @type {import('next').NextConfig} */

// Cabeceras de seguridad aplicadas a todas las respuestas.
const securityHeaders = [
  // Evita que el navegador "adivine" el tipo de un archivo (clave con /uploads).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Anti-clickjacking (sobre todo para el panel admin).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

// HSTS solo si se activa explícitamente: EOS puede servir por HTTP en LAN y no
// queremos forzar HTTPS de manera permanente en el navegador por error.
if (process.env.ENABLE_HSTS === "1") {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  });
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    // No bloquear el build de producción por lint; el dev igual lo muestra.
    ignoreDuringBuilds: true,
  },
  images: {
    // Las fotos de productos se guardan localmente en /public/uploads.
    remotePatterns: [],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
