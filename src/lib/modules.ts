/**
 * Catálogo de módulos CivilKit EC.
 * Fuente única para home, SEO y roadmap de UI.
 */
export type ModuleStatus = "live" | "soon";

export interface ToolkitModule {
  id: string;
  name: string;
  shortName: string;
  level: "Básico" | "Intermedio" | "Contenido";
  status: ModuleStatus;
  description: string;
  href?: string;
  cta?: string;
}

export const toolkitModules: ToolkitModule[] = [
  {
    id: "predim",
    name: "PreDim NEC",
    shortName: "PreDim",
    level: "Intermedio",
    status: "live",
    description:
      "Diseño simplificado de vigas, columnas y losas: sección, acero propuesto, cumplimiento y memoria imprimible.",
    href: "/predim",
    cta: "Abrir PreDim",
  },
  {
    id: "geo",
    name: "GeoSecciones",
    shortName: "Geo",
    level: "Básico",
    status: "live",
    description:
      "Área, inercia y módulo de sección para formas usuales en hormigón y acero.",
    href: "/geosecciones",
    cta: "Abrir GeoSecciones",
  },
  {
    id: "units",
    name: "Unidades EC",
    shortName: "Unidades",
    level: "Básico",
    status: "live",
    description:
      "Conversiones SI útiles en civil: kN, MPa, kgf/cm², m↔cm y más.",
    href: "/unidades-ec",
    cta: "Abrir Unidades EC",
  },
  {
    id: "tributary",
    name: "Tributarias",
    shortName: "Tributarias",
    level: "Intermedio",
    status: "live",
    description:
      "Áreas tributarias y cargas de piso hacia columnas o vigas (kN / kN/m).",
    href: "/tributarias",
    cta: "Abrir Tributarias",
  },
  {
    id: "combinations",
    name: "Combinaciones NEC",
    shortName: "Combinaciones",
    level: "Intermedio",
    status: "live",
    description:
      "Combinaciones simplificadas NEC-SE-CG para obtener cargas de anteproyecto.",
    href: "/combinaciones-nec",
    cta: "Abrir Combinaciones",
  },
  {
    id: "footing",
    name: "Zapatas PreDim",
    shortName: "Zapatas",
    level: "Intermedio",
    status: "soon",
    description:
      "Zapata aislada preliminar: área, espesor y chequeos básicos de anteproyecto.",
  },
  {
    id: "deflection",
    name: "Deflexión aprox.",
    shortName: "Deflexión",
    level: "Intermedio",
    status: "soon",
    description:
      "Deflexión elástica aproximada de vigas para chequeos L/240 y similares.",
  },
  {
    id: "guide",
    name: "Guía NEC Estudiante",
    shortName: "Guía",
    level: "Contenido",
    status: "live",
    description:
      "Alcance, flujo de tarea, preguntas frecuentes y enlaces a las calculadoras.",
    href: "/guia-predimensionamiento-nec",
    cta: "Leer guía",
  },
];

export const liveModules = toolkitModules.filter(
  (module) => module.status === "live",
);

export const soonModules = toolkitModules.filter(
  (module) => module.status === "soon",
);
