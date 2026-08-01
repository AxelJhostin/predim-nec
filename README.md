# PreDim NEC

Calculadora web gratuita para predimensionamiento preliminar de vigas, columnas
y losas según criterios de la Norma Ecuatoriana de la Construcción (NEC).
Funciona completamente en el navegador, sin cuentas ni base de datos.

## Aplicación desplegada

[Abrir PreDim NEC](https://predim-nec.vercel.app)

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
- **Reportes:** vista técnica imprimible o guardable como PDF para cada módulo.
- **Trazabilidad:** procedimiento, conversiones, redondeos y referencias
  normativas visibles junto a cada resultado.
- **Proyectos locales:** metadatos, elementos etiquetados y resumen persistente
  mediante `localStorage`.
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
