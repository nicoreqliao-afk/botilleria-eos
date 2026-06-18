/**
 * Validación pura de imágenes subidas. NO confía en la extensión del nombre:
 * detecta el tipo real por los "magic bytes". Así se bloquea que un admin
 * suba un .svg/.html (XSS almacenado servido desde el mismo origen) renombrado
 * como .png.
 */

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const MIN_UPLOAD_BYTES = 16;

export type ImageCheck =
  | { ok: true; ext: "jpg" | "png" | "webp" | "gif" | "avif" }
  | { ok: false; error: string };

function bytesAre(b: Uint8Array, offset: number, sig: number[]): boolean {
  if (b.length < offset + sig.length) return false;
  for (let i = 0; i < sig.length; i++) {
    if (b[offset + i] !== sig[i]) return false;
  }
  return true;
}

function ascii(b: Uint8Array, offset: number, text: string): boolean {
  return bytesAre(
    b,
    offset,
    text.split("").map((c) => c.charCodeAt(0)),
  );
}

/**
 * Comprueba tamaño y firma binaria. Devuelve la extensión canónica derivada
 * del contenido real (no del nombre original).
 */
export function validateImageUpload(bytes: Uint8Array): ImageCheck {
  if (bytes.length < MIN_UPLOAD_BYTES) {
    return { ok: false, error: "La imagen está vacía o dañada." };
  }
  if (bytes.length > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "La imagen supera el máximo de 5 MB." };
  }

  // JPEG: FF D8 FF
  if (bytesAre(bytes, 0, [0xff, 0xd8, 0xff])) return { ok: true, ext: "jpg" };
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (bytesAre(bytes, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    return { ok: true, ext: "png" };
  // GIF: "GIF87a" / "GIF89a"
  if (ascii(bytes, 0, "GIF8")) return { ok: true, ext: "gif" };
  // WEBP: "RIFF"...."WEBP"
  if (ascii(bytes, 0, "RIFF") && ascii(bytes, 8, "WEBP"))
    return { ok: true, ext: "webp" };
  // AVIF: ...."ftyp" + marca "avif"/"avis"
  if (ascii(bytes, 4, "ftyp") && (ascii(bytes, 8, "avif") || ascii(bytes, 8, "avis")))
    return { ok: true, ext: "avif" };

  return {
    ok: false,
    error: "Formato no permitido. Sube una imagen JPG, PNG, WEBP, GIF o AVIF.",
  };
}
