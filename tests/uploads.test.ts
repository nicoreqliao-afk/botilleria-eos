import { test } from "node:test";
import assert from "node:assert/strict";
import { validateImageUpload, MAX_UPLOAD_BYTES } from "../src/lib/uploads";

// Construye un buffer con los `head` bytes y rellena hasta `len` (>=16).
function buf(head: number[], len = 32): Uint8Array {
  const b = new Uint8Array(Math.max(len, head.length));
  b.set(head, 0);
  return b;
}
function ascii(s: string): number[] {
  return s.split("").map((c) => c.charCodeAt(0));
}

test("acepta JPEG por firma", () => {
  const r = validateImageUpload(buf([0xff, 0xd8, 0xff, 0xe0]));
  assert.equal(r.ok, true);
  assert.equal(r.ok && r.ext, "jpg");
});

test("acepta PNG por firma", () => {
  const r = validateImageUpload(buf([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  assert.equal(r.ok, true);
  assert.equal(r.ok && r.ext, "png");
});

test("acepta GIF por firma", () => {
  const r = validateImageUpload(buf(ascii("GIF89a")));
  assert.equal(r.ok, true);
  assert.equal(r.ok && r.ext, "gif");
});

test("acepta WEBP (RIFF....WEBP)", () => {
  const r = validateImageUpload(
    buf([...ascii("RIFF"), 0, 0, 0, 0, ...ascii("WEBP")]),
  );
  assert.equal(r.ok, true);
  assert.equal(r.ok && r.ext, "webp");
});

test("acepta AVIF (ftyp avif)", () => {
  const r = validateImageUpload(
    buf([0, 0, 0, 0, ...ascii("ftyp"), ...ascii("avif")]),
  );
  assert.equal(r.ok, true);
  assert.equal(r.ok && r.ext, "avif");
});

test("RECHAZA un SVG (XSS almacenado)", () => {
  const r = validateImageUpload(buf(ascii("<svg xmlns=\"http://www.w3.org")));
  assert.equal(r.ok, false);
});

test("RECHAZA HTML disfrazado", () => {
  const r = validateImageUpload(buf(ascii("<!DOCTYPE html><html><body>")));
  assert.equal(r.ok, false);
});

test("RECHAZA archivo demasiado pequeño", () => {
  const r = validateImageUpload(new Uint8Array([0xff, 0xd8, 0xff]));
  assert.equal(r.ok, false);
});

test("RECHAZA archivo que supera el máximo", () => {
  const big = new Uint8Array(MAX_UPLOAD_BYTES + 1);
  big.set([0xff, 0xd8, 0xff], 0); // aunque la firma sea válida, el tamaño manda
  const r = validateImageUpload(big);
  assert.equal(r.ok, false);
  assert.match(r.ok === false ? r.error : "", /5 MB/);
});
