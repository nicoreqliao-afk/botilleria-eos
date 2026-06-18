"use client";

import { useEffect, useState } from "react";
import { weeklyHours, chileNowParts } from "@/lib/business";

export function HoursList() {
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    setToday(chileNowParts().day);
    const id = setInterval(() => setToday(chileNowParts().day), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <ul className="divide-y divide-cream/8">
      {weeklyHours.map((h) => {
        const isToday = today === h.day;
        return (
          <li
            key={h.day}
            className={`flex items-center justify-between py-2.5 text-sm ${
              isToday ? "text-cream" : "text-cream-muted"
            }`}
          >
            <span className="flex items-center gap-2">
              {isToday && (
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              )}
              <span className={isToday ? "font-semibold" : ""}>{h.label}</span>
            </span>
            <span className="tabular-nums">
              {h.open} – {h.close === "00:00" ? "00:00" : h.close}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
