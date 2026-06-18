import { test } from "node:test";
import assert from "node:assert/strict";
import {
  clampText,
  parseDigits,
  PRICE_MAX,
  POSITION_MAX,
} from "../src/lib/sanitize";

test("clampText recorta espacios", () => {
  assert.equal(clampText("  hola  ", 100), "hola");
});

test("clampText limita longitud", () => {
  assert.equal(clampText("a".repeat(50), 10), "a".repeat(10));
});

test("clampText maneja null/undefined", () => {
  assert.equal(clampText(null, 10), "");
  assert.equal(clampText(undefined, 10), "");
});

test("parseDigits extrae solo dígitos", () => {
  assert.equal(parseDigits("12990"), 12990);
  assert.equal(parseDigits("$12.990"), 12990);
  assert.equal(parseDigits("1.490 CLP"), 1490);
});

test("parseDigits sin dígitos da 0", () => {
  assert.equal(parseDigits(""), 0);
  assert.equal(parseDigits("abc"), 0);
  assert.equal(parseDigits(null), 0);
});

test("parseDigits acota al máximo de precio", () => {
  assert.equal(parseDigits("999999999999"), PRICE_MAX);
});

test("parseDigits respeta un máximo personalizado (posición)", () => {
  assert.equal(parseDigits("999999", POSITION_MAX), POSITION_MAX);
  assert.equal(parseDigits("5", POSITION_MAX), 5);
});

test("parseDigits nunca devuelve NaN ni negativos", () => {
  const out = parseDigits("--..--");
  assert.equal(Number.isFinite(out), true);
  assert.equal(out, 0);
});

test("PRICE_MAX está bajo el límite de Int de 32 bits", () => {
  assert.ok(PRICE_MAX < 2 ** 31 - 1);
});
