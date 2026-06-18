import { business } from "./business";
import { formatCLP } from "./format";

export type CartLine = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

/** Construye el enlace wa.me con el pedido prearmado. */
export function buildWhatsappOrderUrl(lines: CartLine[]): string {
  const intro = `¡Hola ${business.name}! 👋 Quiero hacer un pedido:`;
  const items = lines
    .map((l) => `• ${l.qty}x ${l.name} — ${formatCLP(l.price * l.qty)}`)
    .join("\n");
  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const closing = `\nTotal referencial: ${formatCLP(total)}\n\n¿Me confirman disponibilidad, despacho y total final? ¡Gracias! 🍷`;
  const message = `${intro}\n${items}${closing}`;
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Enlace de WhatsApp para una consulta simple. */
export function buildWhatsappUrl(text: string): string {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
