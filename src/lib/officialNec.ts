/**
 * Enlaces oficiales a la Norma Ecuatoriana de la Construcción (NEC).
 * Preferir siempre fuentes de gobierno; no alojamos PDFs de terceros.
 */

export const OFFICIAL_NEC_HUBS = {
  miduviChapters:
    "https://www.habitatyvivienda.gob.ec/documentos-normativos-nec-norma-ecuatoriana-de-la-construccion/",
  miduviIntro:
    "https://www.habitatyvivienda.gob.ec/presentacion-norma-ecuatoriana-de-la-construccion/",
  mitNec:
    "https://www.mit.gob.ec/norma-ecuatoriana-de-la-construccion/",
} as const;

export interface OfficialNecChapter {
  code: string;
  name: string;
  axis: "SE" | "HS" | "SB" | "GUIA";
  summary: string;
  /** Hub oficial donde se listan/descargan los capítulos. */
  href: string;
  relatedToolHref?: string;
  relatedToolLabel?: string;
  relatedArticleSlug?: string;
}

export const officialNecChapters: OfficialNecChapter[] = [
  {
    code: "NEC-SE-CG",
    name: "Cargas no sísmicas",
    axis: "SE",
    summary:
      "Cargas muertas, vivas y combinaciones gravitacionales. Base para Combinaciones NEC y PreDim.",
    href: OFFICIAL_NEC_HUBS.mitNec,
    relatedToolHref: "/combinaciones-nec",
    relatedToolLabel: "Combinaciones NEC",
    relatedArticleSlug: "combinaciones-nec-se-cg",
  },
  {
    code: "NEC-SE-DS",
    name: "Peligro sísmico y diseño sismo resistente",
    axis: "SE",
    summary:
      "Espectro de diseño, factores de zona y criterios sismo-resistentes. Fuera del alcance de CivilKit, esencial en el diseño final.",
    href: OFFICIAL_NEC_HUBS.mitNec,
    relatedArticleSlug: "que-es-nec-se-ds",
  },
  {
    code: "NEC-SE-RE",
    name: "Riesgo sísmico, evaluación y rehabilitación",
    axis: "SE",
    summary:
      "Evaluación y rehabilitación de estructuras existentes frente a sismo.",
    href: OFFICIAL_NEC_HUBS.mitNec,
  },
  {
    code: "NEC-SE-GC",
    name: "Geotecnia y cimentaciones",
    axis: "SE",
    summary:
      "Estudios de suelos y criterios de cimentación. Complementa Zapatas PreDim (solo anteproyecto).",
    href: OFFICIAL_NEC_HUBS.mitNec,
    relatedToolHref: "/zapatas-predim",
    relatedToolLabel: "Zapatas PreDim",
    relatedArticleSlug: "zapata-aislada-predimensionamiento",
  },
  {
    code: "NEC-SE-HM",
    name: "Estructuras de hormigón armado",
    axis: "SE",
    summary:
      "Diseño de hormigón armado (adopta ACI 318). Base de PreDim: vigas, columnas y losas.",
    href: OFFICIAL_NEC_HUBS.mitNec,
    relatedToolHref: "/predim",
    relatedToolLabel: "PreDim NEC",
    relatedArticleSlug: "predimensionar-viga-nec",
  },
  {
    code: "NEC-SE-AC",
    name: "Estructuras de acero",
    axis: "SE",
    summary: "Diseño de estructuras de acero. No cubierto aún por CivilKit.",
    href: OFFICIAL_NEC_HUBS.mitNec,
  },
  {
    code: "NEC-SE-MP",
    name: "Mampostería estructural",
    axis: "SE",
    summary: "Mampostería confinada y reforzada.",
    href: OFFICIAL_NEC_HUBS.mitNec,
  },
  {
    code: "NEC-SE-MD",
    name: "Estructuras de madera",
    axis: "SE",
    summary: "Diseño de estructuras de madera.",
    href: OFFICIAL_NEC_HUBS.mitNec,
  },
  {
    code: "NEC-SE-VIVIENDA",
    name: "Vivienda hasta 2 pisos (luces ≤ 5 m)",
    axis: "SE",
    summary:
      "Capítulo simplificado para vivienda baja. Útil como marco de tarea de pregrado.",
    href: OFFICIAL_NEC_HUBS.mitNec,
    relatedArticleSlug: "vivienda-2-pisos-nec",
  },
  {
    code: "NEC-SE-GUADUA",
    name: "Estructuras de guadúa",
    axis: "SE",
    summary: "Diseño de estructuras de guadúa / bambú estructural.",
    href: OFFICIAL_NEC_HUBS.mitNec,
  },
  {
    code: "NEC-HS-AU",
    name: "Accesibilidad universal",
    axis: "HS",
    summary: "Criterios de accesibilidad en edificaciones.",
    href: OFFICIAL_NEC_HUBS.mitNec,
  },
  {
    code: "NEC-HS-CI",
    name: "Contra incendios",
    axis: "HS",
    summary: "Protección contra incendios en edificaciones.",
    href: OFFICIAL_NEC_HUBS.mitNec,
  },
  {
    code: "NEC-HS-EE",
    name: "Eficiencia energética",
    axis: "HS",
    summary: "Eficiencia energética en edificaciones.",
    href: OFFICIAL_NEC_HUBS.mitNec,
  },
  {
    code: "NEC-SB-IE",
    name: "Instalaciones eléctricas",
    axis: "SB",
    summary: "Instalaciones eléctricas en edificaciones.",
    href: OFFICIAL_NEC_HUBS.mitNec,
  },
  {
    code: "NEC-SB-TE",
    name: "Telecomunicaciones (infraestructura civil común)",
    axis: "SB",
    summary: "Infraestructura civil común en telecomunicaciones.",
    href: OFFICIAL_NEC_HUBS.mitNec,
  },
  {
    code: "NEC-SB-IG",
    name: "Instalaciones de gases combustibles",
    axis: "SB",
    summary: "Gases combustibles para uso residencial, comercial e industrial.",
    href: OFFICIAL_NEC_HUBS.mitNec,
  },
  {
    code: "Guías prácticas NEC",
    name: "Guías de diseño (hormigón, acero, madera, geotécnica…)",
    axis: "GUIA",
    summary:
      "Documentos de apoyo oficial alineados a la NEC. Ideal para estudiar procedimiento paso a paso.",
    href: OFFICIAL_NEC_HUBS.miduviChapters,
  },
];

export const necAxisLabels: Record<OfficialNecChapter["axis"], string> = {
  SE: "Seguridad estructural (NEC-SE)",
  HS: "Habitabilidad y salud (NEC-HS)",
  SB: "Servicios básicos (NEC-SB)",
  GUIA: "Guías prácticas",
};
