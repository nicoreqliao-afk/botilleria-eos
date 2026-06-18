"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { business } from "@/lib/business";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { Stars } from "./Stars";

// Secuencia de cuadros (técnica tipo Apple): el scroll dibuja cada frame en un
// <canvas>. Funciona igual en iPhone y desktop (iOS no permite scrub de <video>).
const FRAME_COUNT = 60;
const FRAME_W = 640;
const FRAME_H = 856;
// ?v=6 evita que el navegador use los cuadros viejos cacheados.
const framePath = (i: number) =>
  `/hero/frames/eos-${String(i + 1).padStart(3, "0")}.jpg?v=6`;

export function ScrollPourHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const track = trackRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!track || !stage || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false);
    let lastDrawn = -1;
    let readyDone = false;
    const fixedIndex = Math.round((FRAME_COUNT - 1) * 0.5);

    const drawFrame = (idx: number) => {
      let i = Math.max(0, Math.min(FRAME_COUNT - 1, idx));
      if (!loaded[i]) {
        // busca el cuadro cargado más cercano
        let lo = i;
        let hi = i;
        i = -1;
        while (lo >= 0 || hi < FRAME_COUNT) {
          if (lo >= 0 && loaded[lo]) {
            i = lo;
            break;
          }
          if (hi < FRAME_COUNT && loaded[hi]) {
            i = hi;
            break;
          }
          lo--;
          hi++;
        }
      }
      if (i < 0 || i === lastDrawn) return;
      lastDrawn = i;
      ctx.drawImage(images[i], 0, 0, canvas.width, canvas.height);
    };

    // Precarga de los cuadros
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.onload = () => {
        loaded[i] = true;
        if (!readyDone) {
          readyDone = true;
          setReady(true);
        }
        if (mq.matches) drawFrame(fixedIndex);
        else if (lastDrawn < 0) drawFrame(i);
      };
      img.src = framePath(i);
      images[i] = img;
    }

    // Movimiento reducido: cuadro fijo, sin scrub.
    if (mq.matches) {
      stage.style.setProperty("--p", "0.5");
      setStep(2);
      return;
    }

    let raf = 0;

    const computeP = () => {
      const rect = track.getBoundingClientRect();
      const total = track.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      return total > 0 ? scrolled / total : 0;
    };

    const tick = () => {
      // Mapeo directo scroll → cuadro (1:1, sin retraso): se siente natural.
      const p = computeP();
      stage.style.setProperty("--p", p.toFixed(4));

      const s = p < 0.3 ? 0 : p < 0.64 ? 1 : 2;
      setStep((prev) => (prev === s ? prev : s));

      drawFrame(Math.round(p * (FRAME_COUNT - 1)));

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      for (const img of images) if (img) img.onload = null;
    };
  }, []);

  return (
    <section
      ref={trackRef}
      className="hero-track relative"
      style={{ height: reduced ? "100svh" : "300vh" }}
      aria-label={`${business.name} — inicio`}
    >
      <div
        ref={stageRef}
        className="hero-stage sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-black"
      >
        {/* Fondo atmosférico */}
        <div className="hero-bg absolute inset-0" />

        {/* Escena de respaldo mientras cargan los cuadros */}
        <GlassScene visible={!ready} />

        {/* Secuencia de cuadros dibujada por el scroll */}
        <canvas
          ref={canvasRef}
          width={FRAME_W}
          height={FRAME_H}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-contain md:px-4 md:pb-12 md:pt-20 transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Scrim para legibilidad (negro, combina con el fondo; centro limpio) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(58%_50%_at_50%_45%,rgba(0,0,0,0.55),transparent_72%)]" />
        <div className="absolute inset-0 bg-vignette" />

        {/* Copys por pasos */}
        <div className="container-eos relative z-10 flex h-full flex-col items-center justify-center text-center">
          <StepBlock active={step === 0}>
            <p className="kicker mb-6">
              {business.sector} · {business.city}
            </p>
            <h1 className="font-display text-[19vw] leading-[0.82] tracking-tight text-cream sm:text-[13vw] lg:text-[9.5rem]">
              EOS
            </h1>
            <p className="mt-4 font-display text-xl italic text-gold sm:text-2xl">
              Botillería
            </p>
          </StepBlock>

          <StepBlock active={step === 1}>
            <p className="kicker mb-6">Desde el mediodía hasta tarde</p>
            <p className="mx-auto max-w-3xl text-balance font-display text-4xl leading-[1.1] text-cream sm:text-6xl">
              Cervezas, vinos y destilados
              <br />
              <span className="text-gold">para cuando la noche</span> recién
              empieza.
            </p>
          </StepBlock>

          <StepBlock active={step === 2}>
            <div className="flex flex-col items-center gap-7">
              <div className="flex items-center gap-3 rounded-full border border-gold/30 bg-ink/50 px-5 py-2 backdrop-blur-sm">
                <Stars value={business.rating} size={18} />
                <span className="text-sm font-medium text-cream">
                  {business.rating.toLocaleString("es-CL")}
                </span>
                <span className="text-sm text-cream-muted">
                  · {business.reviews} reseñas en Google
                </span>
              </div>
              <p className="max-w-xl text-balance font-display text-3xl text-cream sm:text-5xl">
                Todo lo que el carrete necesita, a un mensaje.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/catalogo" className="btn-gold">
                  Ver catálogo
                </Link>
                <a
                  href={buildWhatsappUrl(
                    `¡Hola ${business.name}! Quiero hacer un pedido 🍷`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  Pedir por WhatsApp
                </a>
              </div>
            </div>
          </StepBlock>
        </div>

        {!reduced && (
          <div className="hero-cue absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-center">
            <span className="kicker text-[0.6rem] text-cream-muted">Desliza</span>
            <div className="mx-auto mt-2 h-10 w-px bg-gradient-to-b from-gold to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}

function StepBlock({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute inset-x-0 px-5 drop-shadow-[0_2px_30px_rgba(0,0,0,0.6)] transition-all duration-[800ms] ease-out ${
        active
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

/** Escena SVG de respaldo mientras cargan los cuadros del hero. */
function GlassScene({ visible }: { visible: boolean }) {
  return (
    <div
      className={`hero-glass-scene absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 320 470"
        className="h-[78vh] max-h-[640px] w-auto opacity-90"
        fill="none"
      >
        <defs>
          <clipPath id="bowl">
            <path d="M78 56 C78 168 116 232 160 232 C204 232 242 168 242 56 Z" />
          </clipPath>
          <linearGradient id="wine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8A2A38" />
            <stop offset="100%" stopColor="#4E141E" />
          </linearGradient>
        </defs>
        <g clipPath="url(#bowl)">
          <rect
            className="hero-liquid"
            x="78"
            y="56"
            width="164"
            height="176"
            fill="url(#wine)"
          />
        </g>
        <path
          d="M78 56 C78 168 116 232 160 232 C204 232 242 168 242 56 Z"
          stroke="rgba(237,230,214,0.5)"
          strokeWidth="1.5"
        />
        <path d="M160 232 L160 404" stroke="rgba(237,230,214,0.45)" strokeWidth="3" />
        <path
          d="M112 410 C112 400 208 400 208 410"
          stroke="rgba(237,230,214,0.45)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
