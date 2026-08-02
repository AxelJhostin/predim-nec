# Checklist SEO · Search Console (CivilKit EC)

Sitio: https://predim-nec.vercel.app  
Sitemap: https://predim-nec.vercel.app/sitemap.xml  
Robots: https://predim-nec.vercel.app/robots.txt

## 1. Verificar la propiedad (una sola vez)

**Método activo: archivo HTML** (ya en el repo):

- Archivo: `public/googleb1c9503ecf985b49.html`
- URL: https://predim-nec.vercel.app/googleb1c9503ecf985b49.html
- Tras el deploy, en Search Console pulsa **Verificar**.

Alternativa (meta tag): variable `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` en Vercel; la lee `src/app/layout.tsx`.

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
