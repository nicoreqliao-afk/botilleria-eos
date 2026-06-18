import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify } from "../src/lib/slugify";

test("básico en minúsculas", () => {
  assert.equal(slugify("Cervezas"), "cervezas");
});

test("quita tildes y diacríticos", () => {
  assert.equal(slugify("Limón & Menta"), "limon-menta");
  assert.equal(slugify("Whisky 12 años"), "whisky-12-anos");
  assert.equal(slugify("Espumantes Brut Nature"), "espumantes-brut-nature");
});

test("colapsa separadores y signos", () => {
  assert.equal(slugify("Coca-Cola 1.5L"), "coca-cola-1-5l");
  assert.equal(slugify("  hola   mundo  "), "hola-mundo");
  assert.equal(slugify("A---B"), "a-b");
});

test("sin guiones al inicio o final", () => {
  assert.equal(slugify("!!!Hola!!!"), "hola");
  assert.equal(slugify("-borde-"), "borde");
});

test("cadena sin caracteres válidos da vacío", () => {
  assert.equal(slugify("###"), "");
  assert.equal(slugify("   "), "");
});

test("trunca a 80 caracteres", () => {
  const out = slugify("a".repeat(200));
  assert.equal(out.length, 80);
});

test("emojis y símbolos se descartan", () => {
  assert.equal(slugify("Cerveza 🍺 helada"), "cerveza-helada");
});
