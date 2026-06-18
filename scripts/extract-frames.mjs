import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, readdirSync, statSync } from "node:fs";

const src = "public/hero/eos-pour-source.mp4";
const outDir = "public/hero/frames";

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const fps = process.argv[2] ?? "15";
const size = process.argv[3] ?? "900";
const q = process.argv[4] ?? "4";

console.log(`Extrayendo frames a ${size}px, ${fps} fps, q${q}...`);
execFileSync(
  ffmpegPath,
  [
    "-y",
    "-i", src,
    // El video ya viene listo (vertical, botella llena, negro puro): solo escalar.
    "-vf", `fps=${fps},scale=${size}:-2:flags=lanczos`,
    "-q:v", q,
    `${outDir}/eos-%03d.jpg`,
  ],
  { stdio: ["ignore", "ignore", "inherit"] },
);

const files = readdirSync(outDir).filter((f) => f.endsWith(".jpg"));
const total = files.reduce((s, f) => s + statSync(`${outDir}/${f}`).size, 0);
console.log(`Listo: ${files.length} frames, ${(total / 1048576).toFixed(2)} MB total`);
