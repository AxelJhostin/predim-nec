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

- **Vigas:** peralte `L/12` y ancho mínimo de 25 cm.
- **Columnas:** carga de servicio, área bruta, dimensión mínima de 30 cm,
  esbeltez y cuantía longitudinal preliminar.
- **Losas:** relaciones `L/25` para maciza y `L/21` para nervada.
- **Reportes:** vista técnica imprimible o guardable como PDF para cada módulo.

La lógica de cálculo está centralizada en
`src/utils/necCalculations.ts`. Los componentes de interfaz se encuentran en
`src/components/`.

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
