# CivilKit EC — Plan maestro

Documento vivo para no perder el hilo.  
Producto: suite gratuita de herramientas académicas de ingeniería civil **solo Ecuador (NEC)**, orientada a **pregrado** por ahora.  
Autor / responsable: Hernández Axel · PUCE sede Portoviejo.

---

## 1. Decisión de producto (fijada)

| Tema | Decisión |
| --- | --- |
| Nombre de la suite | **CivilKit EC** |
| Marca del módulo actual | **PreDim NEC** (sigue existiendo dentro de CivilKit) |
| País / norma | Solo Ecuador · NEC (y ACI cuando la NEC remite) |
| Usuario | Estudiantes de pregrado (civil / afines) |
| Precio | Gratis el núcleo académico; sin cuentas obligatorias |
| Alcance | Anteproyecto y práctica académica; **no** memoria firmable |
| Criterio de calidad | Calcular → entender → guardar/imprimir; tests + CI |

**Promesa:**  
CivilKit EC ayuda al estudiante ecuatoriano a resolver desde lo básico hasta chequeos de anteproyecto, con trazabilidad normativa y sin costo.

**No-promesa:**  
No sustituye análisis estructural completo, detallado sísmico ni revisión profesional.

---

## 2. Criterios de éxito

### Producto
- Un estudiante encuentra la página buscando cosas como “calculadora vigas NEC Ecuador”, “área tributaria columna”, “combinaciones carga NEC”.
- En una sesión usa **≥ 2 módulos** (ej. cargas → PreDim).
- Puede salir con PDF/memoria local sin registrarse.

### Técnico
- Cada módulo nuevo: dominio puro + UI + presets + tests + página SEO.
- `npm run check` verde (lint + test + build).
- Disclaimer de alcance visible en cada herramienta.

### Marca
- CivilKit EC = suite.
- PreDim NEC = módulo estrella de predimensionamiento (vigas, columnas, losas).

---

## 3. Mapa de módulos (elegidos)

Orden pensado para utilidad de pregrado + SEO + reutilizar lo ya construido.

| # | Módulo | Nivel | Para qué sirve | Estado |
| --- | --- | --- | --- | --- |
| 0 | **PreDim NEC** | Intermedio | Vigas, columnas, losas (diseño simplificado) | **Hecho** (`/predim`) |
| 1 | **CivilKit Shell** | — | Home de suite, navegación, marca, SEO hub | **Hecho** (`/`) |
| 2 | **GeoSecciones** | Básico | Área, inercia, módulo de sección (rectángulo, T, circular) | **Hecho** (`/geosecciones`) |
| 3 | **Unidades EC** | Básico | Conversiones SI útiles en civil (kN, MPa, kgf, etc.) | **Hecho** (`/unidades-ec`) |
| 4 | **Tributarias** | Intermedio | Áreas tributarias, cargas de piso → kN o kN/m | **Hecho** (`/tributarias`) |
| 5 | **Combinaciones NEC** | Intermedio | Combinaciones simplificadas NEC-SE-CG (1.2D+1.6L, etc.) | **Hecho** (`/combinaciones-nec`) |
| 6 | **Zapatas PreDim** | Intermedio | Zapata aislada preliminar (área, espesor, chequeos básicos) | **Hecho** (`/zapatas-predim`) |
| 7 | **Deflexión aprox.** | Intermedio | Deflexión elástica aproximada de vigas (anteproyecto) | **Hecho** (`/deflexion-aprox`) |
| 8 | **Guía NEC Estudiante** | Contenido | FAQ, glosario, flujo de tarea, enlaces a módulos | **Hecho** (mapa CivilKit) |

### Por qué este orden
1. **Shell** da identidad CivilKit sin romper PreDim.  
2. **GeoSecciones + Unidades** atraen búsquedas básicas y dan tráfico temprano.  
3. **Tributarias + Combinaciones** alimentan PreDim (flujo real de tarea).  
4. **Zapatas + Deflexión** amplían “complicado” sin salir de anteproyecto.  
5. **Guía** amarra SEO y onboarding.

Fuera de alcance por ahora: diseño sísmico detallado, ETABS/SAP helpers, cuentas de usuario, monetización.

---

## 4. Arquitectura técnica

Seguir la modularización ya hecha en el repo:

```
src/
  calculations/     # dominio puro por módulo (beam, column, … + futuros)
  project/          # persistencia local / migraciones
  presets/          # ejemplos y plantillas
  components/forms/ # UI por módulo
  app/              # rutas SEO + home CivilKit
```

### Reglas al añadir un módulo
1. `src/calculations/<modulo>.ts` + tests.  
2. Registrar en `calculations/registry.ts` si aplica.  
3. Formulario en `components/forms/`.  
4. Página indexable `app/<slug-seo>/page.tsx`.  
5. Entrada en home CivilKit + `sitemap.ts`.  
6. Disclaimer (`src/lib/scope.ts`).  
7. `npm run check`.

### Branding
- Suite: CivilKit EC.  
- URL sugerida a medio plazo: `civilkit-ec.vercel.app` o dominio propio; mientras, puede vivir en el mismo deploy con home nueva.  
- PreDim conserva rutas actuales (`/calculadora-vigas-nec`, etc.) por SEO.

### Persistencia
- Por ahora: `localStorage` por herramienta o proyecto unificado CivilKit (decidir en Fase 1 Shell).  
- Preferencia: **un proyecto CivilKit** con elementos tipados (`beam | column | slab | footing | …`).

---

## 5. Fases de entrega

### Fase A — Identidad CivilKit (1 iteración)
**Objetivo:** que el sitio se sienta suite, no solo PreDim.

- [x] Home CivilKit EC (marca, grid de herramientas, CTA a PreDim).
- [x] Copy “Gratis · Ecuador · Pregrado · NEC”.
- [x] Nav/footer CivilKit; PreDim como módulo destacado (`/predim`).
- [x] Actualizar README + metadatos SEO raíz.
- [x] Mantener URLs PreDim (no romper ranking).

**Éxito:** un visitante entiende en 5 s qué es CivilKit y llega a PreDim. ✅

### Fase B — Básicos (2 módulos)
**Objetivo:** atraer búsquedas básicas y utilidad diaria.

- [x] **GeoSecciones** — `/geosecciones` (rectángulo, círculo, T; A, I, S, r).
- [x] **Unidades EC** — `/unidades-ec` (longitud, fuerza, esfuerzo, cargas).
- [x] Catálogo home, sitemap, SW shell, tests de dominio.

**Éxito:** cada uno con página SEO + calcular + explicación corta + tests. ✅

### Fase C — Flujo de tarea (2 módulos)
**Objetivo:** conectar con PreDim.

- [x] **Tributarias** — `/tributarias` (At columna, bt/w viga; CTA a PreDim).
- [x] **Combinaciones NEC** — `/combinaciones-nec` (1.4D, 1.2D+1.6L → q_u / w).
- [x] Enlaces cruzados Tributarias ↔ Combinaciones ↔ PreDim (pegado manual).

**Éxito:** flujo Combinaciones → Tributarias → PreDim documentado y usable. ✅

### Fase D — Anteproyecto ampliado
- [x] **Zapatas PreDim** — `/zapatas-predim` (área, espesor, corte/punzonamiento, malla).
- [x] **Deflexión aprox.** — `/deflexion-aprox` (δ elástica, L/n).
- [x] Ampliar **Guía NEC Estudiante** (flujo CivilKit + mapa de módulos).

**Éxito:** 6+ herramientas indexables; estudiante resuelve una tarea de entrepiso + zapata sin Excel. ✅

### Fase E — Pulido continuo
- [x] Deep-link PreDim (`/predim?tab=&w=&q=&At=`) desde Combinaciones / Tributarias / Deflexión.
- [x] Flujo de tarea visible en home + copy de catálogo actualizado.
- [x] Tests de handoff (`predimHandoff.test.ts`).
- [x] SEO: FAQ/JSON-LD por módulo, OG image, hub `/aprender` + 5 guías, checklist GSC.
- [ ] Memoria unificada CivilKit (más adelante).

---

## 6. SEO (Ecuador / pregrado)

Palabras objetivo por oleada:

| Oleada | Queries ejemplo |
| --- | --- |
| Actual | calculadora vigas NEC, columnas NEC, losas NEC Ecuador |
| Básicos | inercia sección rectangular, convertir MPa a kg/cm², área bruta columna |
| Flujo | área tributaria columna, combinaciones carga NEC SE CG |
| Ampliado | zapata aislada predimensionamiento, deflexión viga L/240 |

Cada módulo = 1 URL canónica + título/description + FAQ si aplica + enlace desde home y guía.

---

## 7. Alcance técnico (invariable)

Texto base (mantener en `src/lib/scope.ts` y adaptar por módulo):

> CivilKit EC es una suite educativa gratuita para pregrado en Ecuador.  
> Sus resultados orientan anteproyecto y práctica académica.  
> El diseño final requiere análisis estructural, combinaciones de carga,  
> detallado y revisión de un profesional competente conforme a la NEC vigente.

---

## 8. Cómo retomar en cualquier chat

Pegar esto al agente:

> Sigue `docs/CIVILKIT-EC-PLAN.md`.  
> Producto: CivilKit EC (Ecuador, pregrado, gratis).  
> PreDim NEC es el módulo actual.  
> Implementa la siguiente fase pendiente del plan; no saltes alcance.

Estado rápido al inicio de cada sesión:
1. Leer este plan (tabla de módulos + checkboxes de fase).  
2. Marcar qué está hecho.  
3. Implementar **una** fase o **un** módulo, no todo a la vez.  
4. Actualizar este archivo al cerrar la iteración.

---

## 9. Próximo paso inmediato

**Fase E (continuar)**
- FAQ/OG por módulo.  
- Memoria unificada CivilKit si hace falta.  
- Pulido UX según feedback de uso real.

---

## 10. Historial de avance

| Fecha | Qué pasó |
| --- | --- |
| 2026-08-01 | PreDim NEC: diseño simplificado vigas/columnas/losas, modularización, tests, CI, UX |
| 2026-08-02 | Plan CivilKit EC aprobado (nombre, Ecuador, pregrado, módulos elegidos) |
| 2026-08-02 | Fase A: shell CivilKit EC en `/`, PreDim en `/predim`, SEO/README |
| 2026-08-02 | Fase B: GeoSecciones + Unidades EC (páginas SEO, catálogo, tests) |
| 2026-08-02 | Fase C: Tributarias + Combinaciones NEC (flujo hacia PreDim) |
| 2026-08-02 | Fase D: Zapatas + Deflexión + guía con mapa CivilKit |
| 2026-08-02 | Fase E (parcial): deep-link PreDim + flujo en home |
| 2026-08-02 | Fix deep-link: handoff vía searchParams servidor (evita Suspense/Turbopack) |
| 2026-08-02 | SEO pack: OG, FAQ módulos, /aprender ×5, docs Search Console |

---

*Última actualización: 2026-08-02*
