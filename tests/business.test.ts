import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeOpenState,
  chileNowParts,
  weeklyHours,
} from "../src/lib/business";

// day: 0=domingo ... 6=sábado. minutes = horas*60 + min.
test("lunes al mediodía: abierto, cierra 00:00", () => {
  const s = computeOpenState(1, 12 * 60); // 12:00
  assert.equal(s.open, true);
  assert.match(s.detail, /Cierra a las 00:00/);
});

test("lunes 13:00: abierto", () => {
  assert.equal(computeOpenState(1, 13 * 60).open, true);
});

test("lunes 11:00: cerrado, abre hoy 12:00", () => {
  const s = computeOpenState(1, 11 * 60);
  assert.equal(s.open, false);
  assert.match(s.detail, /Abre hoy a las 12:00/);
});

test("lunes 11:59: cerrado (borde antes de abrir)", () => {
  assert.equal(computeOpenState(1, 11 * 60 + 59).open, false);
});

test("lunes 23:59: abierto", () => {
  assert.equal(computeOpenState(1, 23 * 60 + 59).open, true);
});

test("sábado 01:00: abierto por arrastre del viernes (cierra 02:00)", () => {
  const s = computeOpenState(6, 60);
  assert.equal(s.open, true);
  assert.match(s.detail, /Cierra a las 02:00/);
});

test("sábado 01:59: abierto (borde antes del cierre 02:00)", () => {
  assert.equal(computeOpenState(6, 119).open, true);
});

test("sábado 02:00: cerrado (al cierre ya no es madrugada activa)", () => {
  // prevClose viernes = 120; minutes 120 NO es < 120 → y aún no abre (12:00).
  assert.equal(computeOpenState(6, 120).open, false);
});

test("domingo 02:30: cerrado (sábado cerró 02:00)", () => {
  const s = computeOpenState(0, 150);
  assert.equal(s.open, false);
  assert.match(s.detail, /Abre hoy a las 12:00/);
});

test("miércoles 00:15: cerrado (martes cierra 00:00)", () => {
  assert.equal(computeOpenState(3, 15).open, false);
});

test("jueves 00:15: abierto (miércoles cierra 00:30)", () => {
  const s = computeOpenState(4, 15);
  assert.equal(s.open, true);
  assert.match(s.detail, /Cierra a las 00:30/);
});

test("jueves 00:30: cerrado (borde justo al cierre 00:30)", () => {
  assert.equal(computeOpenState(4, 30).open, false);
});

test("cada día de la semana está cubierto en weeklyHours", () => {
  const days = new Set(weeklyHours.map((h) => h.day));
  for (let d = 0; d <= 6; d++) assert.ok(days.has(d), `falta el día ${d}`);
});

test("chileNowParts devuelve rangos válidos", () => {
  const { day, minutes } = chileNowParts(new Date("2026-06-17T15:00:00Z"));
  assert.ok(day >= 0 && day <= 6);
  assert.ok(minutes >= 0 && minutes < 24 * 60);
});
