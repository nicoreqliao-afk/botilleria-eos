import { readFile } from "node:fs/promises";
import path from "node:path";

// Sirve las fotos subidas desde public/uploads. Necesario porque Next NO sirve
// archivos agregados a /public después del build (en producción / next start).

export const dynamic = "force-dynamic";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export async function GET(
  _req: Request,
  { params }: { params: { name: string } },
) {
  const name = params.name;

  // Solo nombres seguros (uuid.ext). Sin slashes ni "..".
  if (!/^[a-zA-Z0-9._-]+$/.test(name) || name.includes("..")) {
    return new Response("Not found", { status: 404 });
  }
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const type = TYPES[ext];
  if (!type) return new Response("Not found", { status: 404 });

  const target = path.join(UPLOADS_DIR, name);
  if (path.dirname(target) !== UPLOADS_DIR) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const buf = await readFile(target);
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
