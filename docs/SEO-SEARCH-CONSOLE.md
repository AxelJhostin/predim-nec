# Checklist SEO · Search Console (CivilKit EC)

Sitio: https://predim-nec.vercel.app  
Sitemap: https://predim-nec.vercel.app/sitemap.xml  
Robots: https://predim-nec.vercel.app/robots.txt

## 1. Verificar la propiedad (una sola vez)

1. Entra a [Google Search Console](https://search.google.com/search-console).
2. Añade la propiedad **URL prefijo**: `https://predim-nec.vercel.app`.
3. Elige verificación por **etiqueta HTML** (meta tag).
4. Copia el código de verificación (solo el valor `content="…"`).
5. En Vercel → Project → Settings → Environment Variables:
   - Nombre: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   - Valor: el token de Google
6. Redeploy. La app ya lee esa variable en `src/app/layout.tsx`.
7. Pulsa **Verificar** en Search Console.

Alternativa: verificación por archivo HTML en `public/` si prefieres no usar env.

## 2. Enviar el sitemap

1. En GSC → Sitemaps → Añadir: `sitemap.xml`
2. Espera indexación (días a semanas).

## 3. Inspeccionar URLs prioritarias

Pide indexación manual de:

- `/`
- `/predim`
- `/aprender`
- `/guia-predimensionamiento-nec`
- `/calculadora-vigas-nec`
- `/combinaciones-nec`
- `/tributarias`

## 4. Qué mirar cada mes

- Consultas reales (Rendimiento) → ajustar títulos/FAQ.
- Cobertura / páginas indexadas.
- Core Web Vitals (si aparece).

## 5. Enlaces y difusión (fuera del código)

- Compartir en grupos de clase / PUCE / LinkedIn.
- Enlazar desde la guía del curso si aplica.
- Mantener el dominio estable; un dominio propio ayuda a marca a medio plazo.

## 6. Ya implementado en el repo

- Metadata + keywords + Open Graph / Twitter por página.
- `opengraph-image` 1200×630.
- FAQ + JSON-LD en módulos Toolkit.
- Hub `/aprender` + 5 guías cortas indexables.
- Sitemap actualizado con `/aprender` y artículos.
