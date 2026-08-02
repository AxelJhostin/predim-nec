# CivilKit EC

Suite web gratuita de herramientas de ingeniería civil para **pregrado en
Ecuador (NEC)**. Sin cuentas ni base de datos: todo corre en el navegador.

Desarrollada por **Hernández Axel · PUCE sede Portoviejo**.

## Aplicación desplegada

[Abrir CivilKit EC](https://predim-nec.vercel.app)

## Qué incluye hoy

### Shell CivilKit EC

- Home de suite con catálogo de módulos (disponibles y próximos).
- Marca: **Gratis · Ecuador · Pregrado · NEC**.
- Plan maestro en [`docs/CIVILKIT-EC-PLAN.md`](docs/CIVILKIT-EC-PLAN.md).

### PreDim NEC (módulo activo)

Calculadoras de predimensionamiento y diseño simplificado:

- **Vigas:** flexión, corte, acero y estribos.
- **Columnas:** Pu, φPn, acero longitudinal y amarraderos.
- **Losas:** espesor, flexión por metro y acero de temperatura.

También: proyectos locales, memoria imprimible, ejemplos, plantillas de tarea,
comparador, PWA y páginas SEO por calculadora.

Entrada directa: [/predim](https://predim-nec.vercel.app/predim)

### Herramientas básicas (activas)

- **GeoSecciones** — área, inercia y módulo de sección ([/geosecciones](https://predim-nec.vercel.app/geosecciones)).
- **Unidades EC** — conversiones SI para civil ([/unidades-ec](https://predim-nec.vercel.app/unidades-ec)).

### Flujo de tarea (activas)

- **Combinaciones NEC** — 1.4D y 1.2D+1.6L → q_u / w ([/combinaciones-nec](https://predim-nec.vercel.app/combinaciones-nec)).
- **Tributarias** — At de columna y w de viga ([/tributarias](https://predim-nec.vercel.app/tributarias)).

Flujo sugerido: Combinaciones → Tributarias → PreDim (pegar valores).

### Próximos módulos (roadmap)

Zapatas PreDim · Deflexión aprox. · ampliar Guía NEC (detalle en el plan).

## Desarrollo local

```bash
npm install
npm run dev
```

Abra [http://127.0.0.1:3000](http://127.0.0.1:3000).

Si aparece `Connection closed`:

```bash
pkill -f "next dev" || true
npm run dev
```

## Verificación

```bash
npm run check   # lint + test + build
```

## Arquitectura

| Carpeta | Responsabilidad |
| --- | --- |
| `src/lib/modules.ts` | Catálogo CivilKit |
| `src/calculations/` | Dominio de cálculo |
| `src/project/` | Proyecto local y migraciones |
| `src/presets/` | Ejemplos y plantillas |
| `src/components/forms/` | Formularios por elemento |
| `docs/CIVILKIT-EC-PLAN.md` | Plan de producto |

## Alcance técnico

CivilKit EC es educativo. Sus resultados orientan anteproyecto y práctica
académica.

**El diseño final requiere análisis estructural, combinaciones de carga,
detallado y revisión de un profesional.**
