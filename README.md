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

## Módulos

- **Vigas:** peralte según condición de apoyo, ancho mínimo de 25 cm y
  verificación flexional aproximada con carga lineal.
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

Los resultados son únicamente de predimensionamiento. No sustituyen el análisis
estructural, las combinaciones de carga, el detallado del refuerzo ni una
memoria de cálculo revisada y firmada por un profesional competente.

La aplicación está desplegada en Vercel:
[predim-nec.vercel.app](https://predim-nec.vercel.app).
