# PreDim NEC

Calculadora web gratuita de predimensionamiento y diseño simplificado de vigas,
columnas y losas según criterios de la Norma Ecuatoriana de la Construcción
(NEC). Funciona completamente en el navegador, sin cuentas ni base de datos.

Desarrollada por **Hernández Axel · PUCE sede Portoviejo**.

## Aplicación desplegada

[Abrir PreDim NEC](https://predim-nec.vercel.app)

## Estado actual

La aplicación incluye tres calculadoras con diseño simplificado académico
(sección + refuerzo propuesto), trazabilidad normativa, reportes imprimibles y
gestión de proyectos sin servidor. Los metadatos y elementos guardados
permanecen en el navegador y pueden trasladarse mediante archivos JSON.

### Cambios recientes

#### Calidad de software

- Tests unitarios del dominio (`vitest`) para vigas, columnas, losas y parseo
  de proyecto.
- Pipeline CI en GitHub Actions: `lint` → `test` → `build` en cada push/PR a
  `main`.
- Script local `npm run check` para la misma verificación.

#### Modularización del dominio

- El cálculo dejó de vivir en un único archivo: ahora está en
  `src/calculations/` (tipos, helpers, vigas, columnas, losas y registro).
- El modelo de proyecto local está en `src/project/`; presets en `src/presets/`;
  formularios por elemento en `src/components/forms/`.
- Se mantienen barrels de compatibilidad (`@/utils/necCalculations`, etc.).

#### Diseño simplificado en vigas, columnas y losas

Los tres módulos proponen geometría y refuerzo preliminar, con criterios de
cumplimiento, procedimiento trazable y el mismo alcance técnico (anteproyecto /
uso académico; no sustituye diseño definitivo).

- **Vigas:** peralte según apoyo; flexión (As, cuantías, varillas, φMn ≥ Mu);
  corte (Vu, Vc, estribos).
- **Columnas:** Pu a partir de área tributaria y pisos; sección y φPn amarrada;
  acero longitudinal propuesto; estribos; revisión de cuantía y esbeltez.
- **Losas:** espesor `L/25` (maciza) o `L/21` (nervada); Mu por metro según
  apoyo; barras a flexión; acero de temperatura / distribución.

#### Posicionamiento orgánico y páginas indexables

- Se configuraron títulos, descripciones, URL canónica, Open Graph y metadatos
  para compartir la aplicación.
- Se añadieron datos estructurados JSON-LD para describir la aplicación y la
  sección de preguntas frecuentes.
- Se publicaron `robots.txt`, `sitemap.xml` y `manifest.webmanifest`.
- Se crearon páginas independientes e indexables para las calculadoras de
  vigas, columnas y losas.
- Se añadió una guía introductoria de predimensionamiento NEC con preguntas
  frecuentes, enlaces internos y advertencias sobre el alcance técnico.
- No se incorporaron cookies, Google Analytics ni otros mecanismos de
  seguimiento.

#### Identidad visual y PWA

- Se integró el logo SVG de PreDim NEC en la interfaz, reportes y aviso de
  instalación.
- Se actualizaron el favicon de la pestaña del navegador, los íconos Apple y
  los íconos de la PWA a partir del mismo logo.
- Se habilitó instalación como PWA (Android/Chrome e instrucciones para iOS).
- Se fijó `turbopack.root` para evitar conflictos con lockfiles del directorio
  padre (causa frecuente del error `Connection closed` en desarrollo).

#### Utilidad académica para estudiantes

- Se añadieron ejemplos listos en vigas, columnas y losas.
- Se incorporaron plantillas de tarea (vivienda y bloque de aulas).
- Se habilitó un comparador de alternativas en el resumen de proyecto.
- Se agregó ayuda contextual en los campos principales de cada formulario.

#### Resumen de proyecto y memoria técnica

- Se integró la vista de resumen siguiendo el diseño exportado de Stitch.
- Los datos de proyecto —nombre, responsable, institución, ubicación, fecha y
  notas— ahora son editables y se guardan automáticamente.
- Se añadieron indicadores dinámicos para vigas, columnas, losas y cumplimiento
  global.
- La tabla consolidada permite buscar, revisar y eliminar elementos guardados.
- Se conectaron las acciones para exportar e importar JSON, crear un proyecto
  nuevo e imprimir o guardar la memoria como PDF.
- La navegación lateral y el encabezado permiten abrir el resumen sin abandonar
  el flujo de cálculo.

## Desarrollo local

Requisitos: Node.js 20 o superior y npm.

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Si aparece `Connection closed` o hay dos servidores Next a la vez:

```bash
# Detener procesos previos de Next y reiniciar
pkill -f "next dev" || true
npm run dev
```

## Módulos

- **Vigas:** peralte según apoyo, flexión (As, varillas, φMn) y corte (Vu, Vc,
  estribos). Entradas: luz, apoyo, carga lineal, f'c, fy, recubrimiento y Ø
  estribo.
- **Columnas:** Pu, sección mínima, φPn, propuesta de acero longitudinal y
  estribos, con revisión de esbeltez y cuantía. Entradas: área tributaria,
  pisos, posición, carga de servicio, altura libre, k, f'c, fy y Ø estribo.
- **Losas:** espesor `L/25` o `L/21`, flexión por metro, propuesta de barras y
  acero de temperatura/distribución. Entradas: luz, sistema, apoyo, carga
  superficial, f'c, fy y recubrimiento.
- **Reportes:** vista técnica imprimible o guardable como PDF para cada módulo,
  con membrete de proyecto, formato A4 de bajo consumo de tinta y espacios para
  firma responsable y revisión estructural.
- **Trazabilidad:** procedimiento, conversiones, redondeos y referencias
  normativas visibles junto a cada resultado.
- **Proyectos locales:** metadatos, elementos etiquetados y resumen persistente
  mediante `localStorage`.
- **Ejemplos listos:** casos residencial, aula y voladizo para empezar un
  cálculo en un clic.
- **Plantillas de tarea:** proyectos demo con elementos etiquetados para
  práctica académica o entrega rápida de memoria.
- **Comparador de alternativas:** contraste de hasta 3 opciones guardadas del
  mismo tipo (incluye Mu/φMn o Pu/φPn y propuestas de acero).
- **Ayuda contextual:** tooltips en campos clave (luz, apoyo, área tributaria,
  carga, etc.).
- **Marca visual:** logo propio en la interfaz, favicon del navegador e íconos
  de instalación.
- **PWA instalable:** manifiesto web, íconos, service worker y aviso para
  instalar en pantalla de inicio, con caché offline básico de las rutas
  principales.
- **Portabilidad:** exportación e importación de proyectos en formato JSON
  versionado.
- **SEO técnico:** metadatos canónicos, Open Graph, JSON-LD, `robots.txt`,
  `sitemap.xml` y manifiesto web.
- **Contenido indexable:** páginas específicas para
  [vigas](https://predim-nec.vercel.app/calculadora-vigas-nec),
  [columnas](https://predim-nec.vercel.app/calculadora-columnas-nec),
  [losas](https://predim-nec.vercel.app/calculadora-losas-nec) y una
  [guía con preguntas frecuentes](https://predim-nec.vercel.app/guia-predimensionamiento-nec).

## Arquitectura

El código se organiza por dominio para poder añadir módulos NEC sin inflar un
solo archivo:

| Carpeta | Responsabilidad |
| --- | --- |
| `src/calculations/` | Dominio puro: tipos, helpers, `beam` / `column` / `slab`, registro |
| `src/project/` | Modelo de proyecto local, persistencia tipada y parseo JSON |
| `src/presets/` | Ejemplos listos y plantillas de tarea |
| `src/components/forms/` | Formularios por elemento + primitivas UI compartidas |
| `src/components/` | Resultados, reportes, dashboard, SEO, PWA |
| `src/context/` | Provider React del proyecto activo |
| `src/lib/` | SEO, alcance técnico y barrels de compatibilidad |

**API estable (preferida):** `@/calculations`, `@/project`, `@/presets`,
`@/components/forms`.

**Compatibilidad:** `@/utils/necCalculations`, `@/lib/studyPresets` y
`@/components/CalculatorForms` reexportan los módulos nuevos.

Para un módulo de cálculo nuevo:

1. Añadir tipos y `calculateX` en `src/calculations/`.
2. Registrarlo en `src/calculations/registry.ts`.
3. Crear formulario en `src/components/forms/` y presets en `src/presets/`.
4. Conectar la pestaña en `StructuralDashboard` y, si aplica, página SEO.

El alcance técnico compartido vive en `src/lib/scope.ts`. El proyecto activo se
almacena con la clave `predim_nec_active_project`. Los datos permanecen en el
navegador, salvo exportación JSON.

> Nota: elementos guardados con versiones anteriores del esquema de columnas o
> losas pueden requerir recalcularse para ver las nuevas propuestas de acero.

## Verificación

```bash
npm run lint
npm test
npm run build
# o todo junto:
npm run check
```

Los tests viven junto al dominio (`src/calculations/*.test.ts`,
`src/project/*.test.ts`). El CI de GitHub Actions ejecuta la misma secuencia.

## Alcance técnico

PreDim NEC calcula dimensiones y refuerzo simplificado de vigas, columnas y
losas para anteproyecto o uso académico.

**El diseño final requiere análisis estructural, combinaciones de carga,
detallado y revisión de un profesional.** Los resultados no constituyen una
memoria de cálculo firmable.

La aplicación está desplegada en Vercel:
[predim-nec.vercel.app](https://predim-nec.vercel.app).
