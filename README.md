# CivilKit EC

Suite web gratuita de herramientas de ingeniería civil para **pregrado en
Ecuador (NEC)**. Sin cuentas ni base de datos: todo corre en el navegador.

Desarrollada por **Hernández Axel · PUCE sede Portoviejo**.

## Aplicación desplegada

[Abrir CivilKit EC](https://predim-nec.vercel.app)

## Qué incluye

| Módulo | Ruta | Para qué |
| --- | --- | --- |
| **CivilKit Home** | `/` | Catálogo y flujo de tarea |
| **PreDim NEC** | `/predim` | Vigas, columnas y losas (diseño simplificado) |
| **GeoSecciones** | `/geosecciones` | Área, inercia, módulo de sección |
| **Unidades EC** | `/unidades-ec` | Conversiones SI (MPa, kgf/cm², kN…) |
| **Cálculo para civil** | `/calculo-civil` | Derivadas/integrales + centroide/inercia paso a paso |
| **Combinaciones NEC** | `/combinaciones-nec` | 1.4D y 1.2D+1.6L → q_u / w |
| **Tributarias** | `/tributarias` | At de columna y w de viga |
| **Zapatas PreDim** | `/zapatas-predim` | Zapata aislada preliminar |
| **Deflexión aprox.** | `/deflexion-aprox` | Chequeo elástico L/n |
| **Guía NEC** | `/guia-predimensionamiento-nec` | FAQ, mapa de módulos, flujo |
| **Aprender NEC** | `/aprender` | Guías cortas indexables (`/aprender/[slug]`) |
| **Norma NEC oficial** | `/norma-nec` | Enlaces MIT/MIDUVI a capítulos oficiales |
| **Tarea vivienda 2P** | `/tarea-vivienda-2-plantas` | Flujo guiado con cálculos coherentes |

SEO legado de PreDim (vigas/columnas/losas): `/calculadora-*-nec`.

Checklist Search Console: [`docs/SEO-SEARCH-CONSOLE.md`](docs/SEO-SEARCH-CONSOLE.md).

### Flujo recomendado

1. **Combinaciones NEC** → obtener `q_u`
2. **Tributarias** → `At` o `w`
3. **PreDim** → sección y acero (deep-link desde *Usar en PreDim*)
4. **Deflexión** / **Zapatas** → servicio y cimentación preliminar

Ejemplo de deep-link:

```text
/predim?tab=beam&w=36.8&L=6&from=tributarias
/predim?tab=column&At=20&q=8&floors=2
/predim?tab=slab&q=9.2&L=5&from=combinaciones
```

Plan de producto: [`docs/CIVILKIT-EC-PLAN.md`](docs/CIVILKIT-EC-PLAN.md).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- Persistencia solo en **localStorage** (proyecto PreDim)
- Tests: **Vitest** + Testing Library
- Deploy: **Vercel**

## Desarrollo local

```bash
npm install
npm run dev
```

Abra [http://127.0.0.1:3000](http://127.0.0.1:3000).

| Script | Uso |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run dev:clean` | Borra `.next` y reinicia (caché Turbopack) |
| `npm run check` | lint + test + build (gate antes de merge) |
| `npm test` | Solo Vitest |

### Si aparece Internal Server Error o errores de Turbopack

Casi siempre es caché corrupta de `.next` (p. ej. borrar `.next` con el
servidor aún corriendo). **Para el servidor primero**, luego limpia:

```bash
pkill -f "next dev" || true
npm run dev:clean
```

También sirve ante `enqueueModel is not a function` o panics de Turbopack
(`Failed to open SST file`). Si persiste: `npm run build && npm start`.

## Arquitectura

Principio: **dominio puro → UI delgada → catálogo único**.

```text
app/<ruta>/page.tsx     metadata SEO + monta la herramienta
calculations/<mod>.ts   matemáticas + validación (sin React)
components/tools/       UI ToolkitShell (Geo, Unidades, Cálculo, …)
components/forms/       formularios PreDim (vigas/columnas/losas)
lib/modules.ts          catálogo SSOT → home, guía, sitemap
lib/predimHandoff.ts    deep-link de cargas → /predim
project/                modelo local + migraciones localStorage
```

| Carpeta / archivo | Responsabilidad |
| --- | --- |
| `src/calculations/` | Dominio de cálculo + tests; barrel en `index.ts` |
| `src/calculations/registry.ts` | Solo tabs PreDim (`beam` \| `column` \| `slab`) |
| `src/components/tools/` | Herramientas CivilKit + `primitives.tsx` compartido |
| `src/components/ToolkitShell.tsx` | Layout común (título, FAQ, aside de resultados) |
| `src/components/forms/` | Formularios PreDim + `Field` / `inputClass` |
| `src/lib/modules.ts` | Catálogo live/soon (fuente para home y sitemap) |
| `src/lib/moduleFaqs.ts` | FAQ por herramienta ToolkitShell / PreDim |
| `src/lib/contentArticles.ts` | Artículos de `/aprender/[slug]` |
| `src/lib/vivienda2Plantas.ts` | Escenario coherente de la tarea 2 plantas |
| `src/project/` | Persistencia y migraciones del proyecto PreDim |
| `public/sw.js` | Precache PWA (`APP_SHELL` + `CACHE_VERSION`) |

### Criterios de calidad del código

| Criterio | Cómo se cumple hoy |
| --- | --- |
| **Modular** | Un archivo de dominio por módulo; UI no recalcula a mano |
| **Escalable** | Nuevo módulo = dominio + tool + página + entrada en `modules.ts` |
| **Eficiente** | Cálculos síncronos puros; sin backend; sitemap derivado del catálogo |
| **Seguro ante drift** | `modules.consistency.test.ts` valida páginas, SW y FAQs |

### Cómo añadir un módulo (checklist)

1. `src/calculations/<nombre>.ts` + `<nombre>.test.ts` → export en `calculations/index.ts`
2. `src/components/tools/<Nombre>Tool.tsx` con `ToolkitShell` + `tools/primitives`
3. `src/app/<slug-seo>/page.tsx` con `createPageMetadata`
4. Entrada `live` en `src/lib/modules.ts` (home + **sitemap** se actualizan solos)
5. FAQ en `src/lib/moduleFaqs.ts` si usa ToolkitShell
6. Ruta en `public/sw.js` `APP_SHELL` y subir `CACHE_VERSION`
7. Opcional: artículo en `contentArticles.ts` + fila en este README
8. `npm run check`

**PreDim** (nuevo tipo de elemento) es otro camino: `registry.ts` + form en
`components/forms/` + tab en `StructuralDashboard`.

## Alcance técnico

CivilKit EC es educativo. Sus resultados orientan anteproyecto y práctica
académica.

**El diseño final requiere análisis estructural, combinaciones de carga,
detallado y revisión de un profesional.**
