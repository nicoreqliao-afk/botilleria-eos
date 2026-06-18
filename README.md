# Botillería EOS — Sitio web + Panel de administración

Web elegante para **Botillería EOS** (Villa Bicentenario, Talca). Home cinematográfica
con animación de scroll tipo Apple, catálogo con pedido por WhatsApp, y un panel para
que el equipo administre el catálogo.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma + SQLite · jose (sesión admin)
- **Diseño:** "Cava nocturna" — negro cálido, vino burdeos, oro champagne · tipografías Fraunces + Archivo

---

## 🚀 Puesta en marcha

Requisitos: **Node 18+**.

```bash
npm install            # instala dependencias (genera el cliente Prisma)
npm run db:push        # crea las tablas en la base SQLite
npm run db:seed        # carga categorías y productos de ejemplo
npm run dev            # desarrollo en http://localhost:3000
```

Para producción:

```bash
npm run build
npm run start          # sirve la versión optimizada
```

---

## 🔐 Panel de administración

- URL: **`/admin`** (entra con la contraseña; cierra sesión con "Salir").
- La contraseña y el secreto de sesión están en **`.env`**:

```
ADMIN_PASSWORD="eos2026"          ← CÁMBIALA antes de publicar
SESSION_SECRET="..."              ← CÁMBIALO por una cadena larga y aleatoria
```

Desde el panel se puede: crear/editar/eliminar productos, subir foto, marcar
**destacado** o **agotado**, ordenar, y gestionar **categorías**. Los cambios se
reflejan al instante en la web pública.

---

## ✏️ Personalización rápida

| Qué | Dónde |
|-----|-------|
| **WhatsApp** (⚠️ hoy es un placeholder), dirección, horario, redes, pagos | `src/lib/business.ts` |
| **Video del hero** (tu animación de la botella) | `public/hero/` — ver `LEEME.txt` |
| Reseñas mostradas | `src/lib/reviews.ts` |
| Paleta / tipografías | `tailwind.config.ts` y `src/app/globals.css` |
| Productos y categorías | desde el panel `/admin` |

> **Pendiente real:** reemplazar el número de WhatsApp en `src/lib/business.ts`
> (`whatsappNumber` y `whatsappDisplay`) por el de EOS. Sin eso, el botón
> "Pedir por WhatsApp" no llega a nadie.

---

## ☁️ Notas para publicar

La base es **SQLite** (archivo local `prisma/dev.db`) y las fotos se guardan en
`public/uploads/`. Esto funciona perfecto en un **VPS / servidor Node** propio.

Si se quiere publicar en **Vercel** (serverless), conviene migrar a una base
**Postgres** (Supabase/Neon) y guardar las imágenes en un almacenamiento de objetos
(p. ej. Vercel Blob/S3), porque el sistema de archivos no es persistente ahí.
El código ya está aislado por Prisma: basta cambiar el `datasource` en
`prisma/schema.prisma` y las variables de entorno.

---

## 🔞 Aviso legal

El sitio incluye verificación de edad (mayores de 18) y avisos de consumo
responsable, acorde a la venta de alcohol en Chile.
