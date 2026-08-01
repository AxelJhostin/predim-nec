# PreDim NEC

Calculadora web gratuita para predimensionamiento preliminar de vigas, columnas
y losas según criterios de la Norma Ecuatoriana de la Construcción (NEC).
Funciona completamente en el navegador, sin cuentas ni base de datos.

Desarrollada por **Hernández Axel · PUCE sede Portoviejo**.

## Aplicación desplegada

[Abrir PreDim NEC](https://predim-nec.vercel.app)

## Estado actual

La aplicación incluye tres calculadoras interactivas, trazabilidad normativa,
reportes imprimibles y gestión de proyectos sin servidor. Los metadatos y
elementos guardados permanecen en el navegador y pueden trasladarse mediante
archivos JSON.

### Cambios recientes

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

#### Diseño simplificado de vigas

- Las vigas ahora calculan As requerido, cuantías mín/máx, propuesta de varillas
  y verificación φMn ≥ Mu.
- Se añadió diseño a corte con Vu, Vc, Vs y propuesta de estribos.
- Mu y Vu dependen del tipo de apoyo (simple, continuo o voladizo).

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

- **Vigas:** peralte según condición de apoyo, diseño simplificado a flexión
  (As, cuantías, propuesta de varillas, φMn) y a corte (Vu, Vc, estribos).
- **Columnas:** carga y área ajustadas por posición, dimensión mínima de 30 cm,
  esbeltez y cuantía longitudinal preliminar.
- **Losas:** relaciones `L/25` para maciza y `L/21` para nervada.
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
  mismo tipo, con recomendación preliminar.
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

La lógica de cálculo está centralizada en
`src/utils/necCalculations.ts`. Los componentes de interfaz se encuentran en
`src/components/`.

El proyecto activo se almacena con la clave
`predim_nec_active_project`. Los datos permanecen únicamente en el navegador
del usuario, salvo que se exporten manualmente a un archivo JSON.

## Verificación

```bash
npm run lint
npm run build
```

## Alcance técnico

PreDim NEC calcula dimensiones y, en vigas, un refuerzo simplificado a flexión
y corte para anteproyecto o uso académico.

**El diseño final requiere análisis estructural, combinaciones de carga,
detallado y revisión de un profesional.** Los resultados no constituyen una
memoria de cálculo firmable.

La aplicación está desplegada en Vercel:
[predim-nec.vercel.app](https://predim-nec.vercel.app).
