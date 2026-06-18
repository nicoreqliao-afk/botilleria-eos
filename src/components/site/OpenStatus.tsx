"use client";

import { useEffect, useState } from "react";
import { getOpenState, type OpenState } from "@/lib/business";

export function OpenStatus({ className = "" }: { className?: string }) {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const update = () => setState(getOpenState());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!state) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <span className="h-2 w-2 rounded-full bg-cream/30" />
        <span className="text-cream-muted">Horario</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-2.5 w-2.5">
        {state.open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
        )}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
            state.open ? "bg-emerald-400" : "bg-wine-light"
          }`}
        />
      </span>
      <span className="font-medium">
        {state.open ? "Abierto ahora" : "Cerrado"}
      </span>
      <span className="text-cream-muted">· {state.detail}</span>
    </span>
  );
}
