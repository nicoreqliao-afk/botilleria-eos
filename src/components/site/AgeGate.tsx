"use client";

import { useEffect, useState } from "react";
import { business } from "@/lib/business";

const KEY = "eos-age-ok";

export function AgeGate() {
  const [show, setShow] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) !== "1") setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/95 px-5 backdrop-blur-md">
      <div className="hero-bg absolute inset-0 opacity-60" />
      <div className="relative w-full max-w-md rounded-3xl border border-cream/12 bg-ink-800/90 p-8 text-center shadow-2xl animate-fade-up">
        <p className="font-display text-5xl tracking-tight text-cream">EOS</p>
        <div className="mx-auto my-5 h-px w-16 bg-gold-line" />
        {denied ? (
          <>
            <h2 className="font-display text-2xl text-cream">
              Vuelve cuando seas mayor de edad
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cream-muted">
              La venta y consumo de alcohol está permitida solo para mayores de
              18 años. Cuídate.
            </p>
          </>
        ) : (
          <>
            <h2 className="font-display text-2xl text-cream">
              ¿Eres mayor de 18 años?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cream-muted">
              Para entrar a {business.name} debes ser mayor de edad. La venta de
              alcohol es solo para mayores de 18. Bebe con moderación.
            </p>
            <div className="mt-7 flex flex-col gap-3">
              <button onClick={accept} className="btn-gold w-full">
                Sí, soy mayor de 18
              </button>
              <button
                onClick={() => setDenied(true)}
                className="text-sm text-cream-dim hover:text-cream-muted"
              >
                No, soy menor
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
