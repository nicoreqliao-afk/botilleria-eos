import { test } from "node:test";
import assert from "node:assert/strict";
import { formatCLP } from "../src/lib/format";

// Normaliza espacios no separables (NBSP/narrow NBSP) que mete Intl.
function norm(s: string): string {
  return s.replace(/[  ]/g, " ");
}

test("formatea con separador de miles y signo peso, sin decimales", () => {
  const out = norm(formatCLP(12990));
  assert.ok(out.includes("$"), `esperaba símbolo $: ${out}`);
  assert.ok(out.includes("12.990"), `esperaba 12.990: ${out}`);
  assert.ok(!out.includes(","), `no debería tener decimales: ${out}`);
});

test("cero", () => {
  assert.ok(norm(formatCLP(0)).includes("0"));
});

test("valor pequeño", () => {
  assert.ok(norm(formatCLP(1490)).includes("1.490"));
});

test("millón", () => {
  assert.ok(norm(formatCLP(1000000)).includes("1.000.000"));
});
