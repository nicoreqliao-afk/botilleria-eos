// Datos reales del negocio (verificados en Google, jun 2026).
// Datos reales de EOS.

export const business = {
  name: "Botillería EOS",
  shortName: "EOS",
  legalType: "Tienda de bebidas alcohólicas",
  tagline: "La botillería de Villa Bicentenario",
  city: "Talca",
  region: "Región del Maule",
  sector: "Villa Bicentenario",
  addressLine: "Villa Bicentenario, Talca · Región del Maule",
  rating: 4.7,
  reviews: 193,
  instagram: "https://www.instagram.com/eos__botilleria/",
  instagramHandle: "@eos__botilleria",
  // WhatsApp real de EOS. Formato internacional sin signos para wa.me.
  whatsappNumber: "56968356516",
  whatsappDisplay: "+56 9 6835 6516",
  payments: ["Efectivo", "Tarjeta", "RedCompra"],
  mapsQuery: "Botillería Eos Talca",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Botiller%C3%ADa+Eos+Talca",
} as const;

export const ageNotice =
  "La venta de alcohol es solo para mayores de 18 años. Bebe con moderación.";

/**
 * Horario semanal. open/close en formato "HH:MM" (24h).
 * close menor que open significa que cierra después de medianoche (madrugada del día siguiente).
 * day: 0 = domingo ... 6 = sábado (igual que Date.getDay()).
 */
export type DayHours = {
  day: number;
  label: string;
  short: string;
  open: string;
  close: string;
};

export const weeklyHours: DayHours[] = [
  { day: 1, label: "Lunes", short: "Lun", open: "12:00", close: "00:00" },
  { day: 2, label: "Martes", short: "Mar", open: "12:00", close: "00:00" },
  { day: 3, label: "Miércoles", short: "Mié", open: "12:00", close: "00:30" },
  { day: 4, label: "Jueves", short: "Jue", open: "12:00", close: "00:30" },
  { day: 5, label: "Viernes", short: "Vie", open: "12:00", close: "02:00" },
  { day: 6, label: "Sábado", short: "Sáb", open: "12:00", close: "03:00" },
  { day: 0, label: "Domingo", short: "Dom", open: "12:00", close: "00:00" },
];

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Devuelve día (0-6) y minutos desde medianoche en hora de Chile. */
export function chileNowParts(now: Date = new Date()): {
  day: number;
  minutes: number;
} {
  // Truco estándar: re-interpretar la hora en zona America/Santiago.
  const chile = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Santiago" }),
  );
  return { day: chile.getDay(), minutes: chile.getHours() * 60 + chile.getMinutes() };
}

const dayByIndex = (d: number) => weeklyHours.find((h) => h.day === d)!;

export type OpenState = {
  open: boolean;
  /** Texto corto: "Cierra a las 02:00" o "Abre hoy a las 12:00". */
  detail: string;
};

/**
 * Lógica pura de horario (sin zona horaria): dado el día (0-6) y los minutos
 * desde medianoche, decide si está abierto. Separada para poder testearla sin
 * depender de la hora real ni del horario de verano.
 * Todos los días abren 12:00 y cierran pasada la medianoche, así que:
 *  - abierto si son >= 12:00 (parte antes de medianoche), o
 *  - abierto si aún no llega la hora de cierre del día anterior (madrugada).
 */
export function computeOpenState(day: number, minutes: number): OpenState {
  const today = dayByIndex(day);
  const prevDay = dayByIndex((day + 6) % 7);

  const openMin = toMinutes(today.open); // 720
  const prevClose = toMinutes(prevDay.close); // 0, 30 o 120

  // Madrugada: arrastre del día anterior.
  if (prevClose > 0 && minutes < prevClose) {
    return { open: true, detail: `Cierra a las ${prevDay.close}` };
  }

  // Mismo día, desde las 12:00 hasta medianoche.
  if (minutes >= openMin) {
    return { open: true, detail: `Cierra a las ${today.close}` };
  }

  // Cerrado: aún no abre hoy.
  return { open: false, detail: `Abre hoy a las ${today.open}` };
}

/** Calcula si EOS está abierto AHORA (hora de Chile) y el próximo cambio. */
export function getOpenState(now: Date = new Date()): OpenState {
  const { day, minutes } = chileNowParts(now);
  return computeOpenState(day, minutes);
}
