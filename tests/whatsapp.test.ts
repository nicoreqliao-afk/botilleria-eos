import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildWhatsappOrderUrl,
  buildWhatsappUrl,
  type CartLine,
} from "../src/lib/whatsapp";
import { business } from "../src/lib/business";

test("buildWhatsappUrl arma wa.me con texto codificado", () => {
  const url = buildWhatsappUrl("hola mundo & cía");
  assert.ok(url.startsWith(`https://wa.me/${business.whatsappNumber}?text=`));
  const text = decodeURIComponent(url.split("text=")[1]!);
  assert.equal(text, "hola mundo & cía");
});

test("buildWhatsappOrderUrl incluye items y total", () => {
  const lines: CartLine[] = [
    { id: "a", name: "Cristal 1L", price: 1490, qty: 2 },
    { id: "b", name: "Coca-Cola 1.5L", price: 1890, qty: 1 },
  ];
  const url = buildWhatsappOrderUrl(lines);
  const text = decodeURIComponent(url.split("text=")[1]!);
  assert.match(text, /2x Cristal 1L/);
  assert.match(text, /1x Coca-Cola 1\.5L/);
  // total = 1490*2 + 1890 = 4870
  assert.match(text, /4\.870/);
});

test("buildWhatsappOrderUrl con carrito vacío no rompe", () => {
  const url = buildWhatsappOrderUrl([]);
  assert.ok(url.startsWith("https://wa.me/"));
  const text = decodeURIComponent(url.split("text=")[1]!);
  assert.match(text, /Total referencial/);
});

test("el número de WhatsApp es solo dígitos (formato wa.me)", () => {
  assert.match(business.whatsappNumber, /^\d+$/);
});
