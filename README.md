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
| **Combinaciones NEC** | `/combinaciones-nec` | 1.4D y 1.2D+1.6L → q_u / w |
| **Tributarias** | `/tributarias` | At de columna y w de viga |
| **Zapatas PreDim** | `/zapatas-predim` | Zapata aislada preliminar |
| **Deflexión aprox.** | `/deflexion-aprox` | Chequeo elástico L/n |
| **Guía NEC** | `/guia-predimensionamiento-nec` | FAQ, mapa de módulos, flujo |

SEO legado de PreDim (vigas/columnas/losas): `/calculadora-*-nec`.

### Flujo recomendado

1. **Combinaciones NEC** → obtener `q_u`
2. **Tributarias** → `At` o `w`
3. **PreDim** → sección y acero (deep-link desde los botones *Usar en PreDim*)
4. **Deflexión** / **Zapatas** → servicio y cimentación preliminar

Ejemplo de deep-link:

```text
/predim?tab=beam&w=36.8&L=6&from=tributarias
/predim?tab=column&At=20&q=8&floors=2
/predim?tab=slab&q=9.2&L=5&from=combinaciones
```

Plan de producto: [`docs/CIVILKIT-EC-PLAN.md`](docs/CIVILKIT-EC-PLAN.md).

## Desarrollo local

```bash
npm install
npm run dev
```

Abra [http://127.0.0.1:3000](http://127.0.0.1:3000).

### Si el dev server falla o muestra errores raros de Turbopack

Errores del tipo `chunk.reason.enqueueModel is not a function` suelen ser
caché/HMR de Next 16 + Turbopack. Limpia y reinicia:

```bash
pkill -f "next dev" || true
rm -rf .next
npm run dev
```

Si persiste, prueba build de producción local:

```bash
npm run build && npm start
```

## Verificación

```bash
npm run check   # lint + test + build
```

## Arquitectura

| Carpeta | Responsabilidad |
| --- | --- |
| `src/lib/modules.ts` | Catálogo CivilKit |
| `src/lib/predimHandoff.ts` | Deep-link de cargas → PreDim |
| `src/calculations/` | Dominio de cálculo + tests |
| `src/project/` | Proyecto local y migraciones |
| `src/presets/` | Ejemplos y plantillas |
| `src/components/forms/` | Formularios PreDim |
| `src/components/tools/` | Herramientas CivilKit (ToolkitShell) |
| `docs/CIVILKIT-EC-PLAN.md` | Plan de producto |

## Alcance técnico

CivilKit EC es educativo. Sus resultados orientan anteproyecto y práctica
académica.

**El diseño final requiere análisis estructural, combinaciones de carga,
detallado y revisión de un profesional.**
