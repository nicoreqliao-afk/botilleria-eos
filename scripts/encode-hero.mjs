import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, statSync } from "node:fs";

const dir = "public/hero";
const out = `${dir}/eos-pour.mp4`;
const source = `${dir}/eos-pour-source.mp4`;

// Respalda el original una sola vez (no lo pisa en re-runs).
if (!existsSync(source)) {
  copyFileSync(out, source);
  console.log("Respaldo creado:", source);
}

const crf = process.argv[2] ?? "21";
const size = process.argv[3] ?? "1080";

console.log(`Re-codificando a ${size}px, all-intra, crf ${crf}...`);
execFileSync(
  ffmpegPath,
  [
    "-y",
    "-i", source,
    "-an", // sin audio
    // Encaja dentro de {size}x{size} preservando proporción (no deforma), dims pares.
    "-vf", `scale=w='min(${size},iw)':h='min(${size},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2:flags=lanczos`,
    "-c:v", "libx264",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    "-g", "1", // cada cuadro es keyframe -> seek instantáneo
    "-keyint_min", "1",
    "-crf", crf,
    "-preset", "medium",
    "-movflags", "+faststart",
    out,
  ],
  { stdio: ["ignore", "ignore", "inherit"] },
);

console.log(`Listo. Tamaño: ${(statSync(out).size / 1048576).toFixed(2)} MB`);
