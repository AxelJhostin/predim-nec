import { OFFICIAL_NEC_HUBS } from "./officialNec";

export interface ContentArticle {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  eyebrow: string;
  lead: string;
  sections: { heading: string; body: string[] }[];
  toolHref?: string;
  toolLabel?: string;
  officialHref?: string;
  officialLabel?: string;
}

export const contentArticles: ContentArticle[] = [
  {
    slug: "que-es-la-nec",
    title: "Qué es la NEC y por qué debes usarla en la universidad",
    description:
      "Introducción a la Norma Ecuatoriana de la Construcción: ejes NEC-SE, NEC-HS y NEC-SB, obligatoriedad y dónde descargarla oficialmente.",
    keywords: [
      "qué es la NEC",
      "Norma Ecuatoriana de la Construcción",
      "NEC Ecuador estudiantes",
    ],
    eyebrow: "Normativa",
    lead: "La NEC es el marco técnico obligatorio en Ecuador para diseñar y construir con requisitos mínimos de seguridad y habitabilidad. En pregrado es tu referencia; CivilKit solo orienta anteproyecto.",
    sections: [
      {
        heading: "Tres ejes",
        body: [
          "NEC-SE: seguridad estructural (cargas, sismo, hormigón, acero, geotecnia…).",
          "NEC-HS: habitabilidad y salud (incendios, accesibilidad, energía…).",
          "NEC-SB: servicios básicos (eléctricas, telecomunicaciones, gases…).",
        ],
      },
      {
        heading: "Dónde leerla en fuente oficial",
        body: [
          "Ministerio de Infraestructura y Transporte (MIT): portal de descarga de capítulos.",
          "MIDUVI: presentación y documentos normativos históricos / guías prácticas.",
          "Evita copias no oficiales en Scribd u otros repositorios sin control de versión.",
        ],
      },
    ],
    toolHref: "/norma-nec",
    toolLabel: "Ver capítulos oficiales",
    officialHref: OFFICIAL_NEC_HUBS.mitNec,
    officialLabel: "Abrir portal NEC del MIT",
  },
  {
    slug: "mapa-capitulos-nec",
    title: "Mapa de capítulos NEC-SE para estudiantes de civil",
    description:
      "Qué capítulo NEC usar según tu tarea: CG, DS, HM, GC, vivienda y más. Enlaces a la fuente oficial.",
    keywords: [
      "capítulos NEC-SE",
      "NEC-SE-HM",
      "NEC-SE-CG",
      "norma NEC capítulos",
    ],
    eyebrow: "Normativa",
    lead: "No necesitas memorizar toda la NEC de golpe. Identifica el capítulo según el tipo de problema y trabaja con el PDF oficial.",
    sections: [
      {
        heading: "Si tu tarea es de…",
        body: [
          "Cargas gravitacionales / combinaciones → NEC-SE-CG.",
          "Sismo, espectro, deriva → NEC-SE-DS.",
          "Vigas, columnas, losas de hormigón → NEC-SE-HM (+ ACI 318 adoptado).",
          "Suelos y zapatas → NEC-SE-GC.",
          "Casa de 1–2 pisos, luces cortas → NEC-SE-VIVIENDA.",
        ],
      },
      {
        heading: "Cómo usarlo con CivilKit",
        body: [
          "CivilKit simplifica anteproyecto; la NEC oficial manda en el diseño y la memoria firmada.",
          "Desde /norma-nec puedes saltar al hub oficial y a la calculadora relacionada.",
        ],
      },
    ],
    toolHref: "/norma-nec",
    toolLabel: "Abrir Norma NEC (CivilKit)",
    officialHref: OFFICIAL_NEC_HUBS.miduviChapters,
    officialLabel: "Documentos MIDUVI",
  },
  {
    slug: "area-tributaria-columnas",
    title: "Cómo calcular el área tributaria de una columna",
    description:
      "Guía corta para estimar At de columnas interior, borde y esquina en retícula rectangular, y llevarla a PreDim NEC.",
    keywords: [
      "área tributaria columna",
      "área tributaria NEC",
      "carga tributaria columna Ecuador",
    ],
    eyebrow: "Flujo de cargas",
    lead: "En pregrado suele pedirse la área tributaria At para estimar la carga axial de una columna. CivilKit simplifica la retícula rectangular; el plano del proyecto manda si hay irregularidades.",
    sections: [
      {
        heading: "Regla práctica por posición",
        body: [
          "Interior: At ≈ Lx × Ly (vano completo).",
          "Borde: At ≈ 0.5 × Lx × Ly (mitad en el eje que da a fachada).",
          "Esquina: At ≈ 0.25 × Lx × Ly.",
        ],
      },
      {
        heading: "De At a PreDim",
        body: [
          "Con q de servicio (D+L en kN/m²), Pservicio ≈ q · At · pisos (con factores de posición en PreDim).",
          "Usa Tributarias → «Usar At en columna» para abrir PreDim con At y q precargados.",
        ],
      },
    ],
    toolHref: "/tributarias",
    toolLabel: "Abrir Tributarias",
    officialHref: OFFICIAL_NEC_HUBS.mitNec,
    officialLabel: "Consultar NEC-SE-CG (oficial)",
  },
  {
    slug: "combinaciones-nec-se-cg",
    title: "Combinaciones de carga NEC-SE-CG para anteproyecto",
    description:
      "Explicación de 1.4D y 1.2D+1.6L para obtener q_u en anteproyecto académico según NEC Ecuador.",
    keywords: [
      "combinaciones de carga NEC",
      "1.2D+1.6L",
      "NEC-SE-CG Ecuador",
    ],
    eyebrow: "Combinaciones",
    lead: "Para anteproyecto gravitacional, dos casos suelen gobernar la carga de área mayorada: 1.4D y 1.2D + 1.6L. CivilKit compara ambos y adopta el mayor como q_u.",
    sections: [
      {
        heading: "Fórmulas de trabajo académico",
        body: [
          "1.4 D",
          "1.2 D + 1.6 L",
          "qservicio = D + L (útil en columnas de PreDim).",
        ],
      },
      {
        heading: "Qué dice la norma oficial",
        body: [
          "Debes contrastar siempre con el capítulo NEC-SE-CG vigente (cargas no sísmicas).",
          "Viento, sismo y casos especiales no están en la calculadora simplificada de CivilKit.",
        ],
      },
    ],
    toolHref: "/combinaciones-nec",
    toolLabel: "Abrir Combinaciones NEC",
    officialHref: OFFICIAL_NEC_HUBS.mitNec,
    officialLabel: "Descargar NEC-SE-CG (MIT)",
  },
  {
    slug: "predimensionar-viga-nec",
    title: "Predimensionar una viga según NEC-SE-HM",
    description:
      "Pasos de anteproyecto para vigas de hormigón: luz, apoyo, w, peralte, flexión y corte. Enlace a PreDim y a la NEC oficial.",
    keywords: [
      "predimensionar viga NEC",
      "diseño viga hormigón NEC-SE-HM",
      "calculadora vigas Ecuador",
    ],
    eyebrow: "Hormigón",
    lead: "Una viga de anteproyecto se dimensiona con luz, condición de apoyo y carga lineal mayorada. PreDim propone b×h, acero y estribos; NEC-SE-HM / ACI 318 rigen el diseño final.",
    sections: [
      {
        heading: "Datos mínimos",
        body: [
          "Luz L y tipo de apoyo (simple, continua, voladizo).",
          "Carga de diseño w (kN/m), obtenida de Combinaciones + Tributarias.",
          "f'c, fy y recubrimiento.",
        ],
      },
      {
        heading: "Flujo recomendado",
        body: [
          "Combinaciones → Tributarias → PreDim (pestaña Vigas).",
          "Chequea deflexión aproximada (L/240) si tu enunciado lo pide.",
          "Contrasta el procedimiento con NEC-SE-HM oficial.",
        ],
      },
    ],
    toolHref: "/predim",
    toolLabel: "Abrir PreDim (vigas)",
    officialHref: OFFICIAL_NEC_HUBS.mitNec,
    officialLabel: "Consultar NEC-SE-HM (oficial)",
  },
  {
    slug: "predimensionar-columna-nec",
    title: "Predimensionar una columna de hormigón (NEC)",
    description:
      "De área tributaria y pisos a sección y acero longitudinal. Guía académica alineada a NEC-SE-HM.",
    keywords: [
      "predimensionar columna NEC",
      "columna hormigón armado Ecuador",
      "Pu columna tributaria",
    ],
    eyebrow: "Hormigón",
    lead: "La columna de anteproyecto parte de At, número de pisos, q de servicio y posición (central, perimetral, esquina). PreDim estima Pu, lado y acero.",
    sections: [
      {
        heading: "Entradas típicas",
        body: [
          "At (m²) desde Tributarias.",
          "q servicio (kN/m²) = D + L.",
          "Pisos soportados, altura libre y factor k.",
        ],
      },
      {
        heading: "Límites académicos",
        body: [
          "CivilKit no resuelve flexocompresión biaxial ni sismo detallado.",
          "El diseño final exige modelo y NEC-SE-HM + NEC-SE-DS.",
        ],
      },
    ],
    toolHref: "/calculadora-columnas-nec",
    toolLabel: "Calculadora columnas NEC",
    officialHref: OFFICIAL_NEC_HUBS.mitNec,
    officialLabel: "Consultar NEC-SE-HM (oficial)",
  },
  {
    slug: "predimensionar-losa-nec",
    title: "Predimensionar losas macizas y nervadas",
    description:
      "Espesor preliminar, flexión por metro y acero de temperatura. Criterios de anteproyecto NEC / ACI.",
    keywords: [
      "predimensionar losa NEC",
      "losa maciza nervada Ecuador",
      "espesor losa luz",
    ],
    eyebrow: "Hormigón",
    lead: "El espesor de losa se orienta con relaciones luz/espesor y luego se verifica flexión por franja con q_u. PreDim documenta el procedimiento.",
    sections: [
      {
        heading: "Datos",
        body: [
          "Luz principal del paño.",
          "Sistema macizo o nervado y apoyo (simple/continuo).",
          "q_u desde Combinaciones NEC.",
        ],
      },
      {
        heading: "Siguiente paso",
        body: [
          "Usa PreDim → Losas o la página SEO /calculadora-losas-nec.",
          "Revisa siempre el capítulo NEC-SE-HM para el diseño definitivo.",
        ],
      },
    ],
    toolHref: "/calculadora-losas-nec",
    toolLabel: "Calculadora losas NEC",
    officialHref: OFFICIAL_NEC_HUBS.mitNec,
    officialLabel: "Consultar NEC-SE-HM (oficial)",
  },
  {
    slug: "zapata-aislada-predimensionamiento",
    title: "Predimensionar una zapata aislada cuadrada",
    description:
      "Pasos de anteproyecto: área por qa, espesor por corte/punzonamiento y malla inferior. Complementa NEC-SE-GC.",
    keywords: [
      "zapata aislada predimensionamiento",
      "zapata cuadrada qa",
      "NEC-SE-GC cimentaciones",
    ],
    eyebrow: "Cimentación",
    lead: "Una zapata aislada preliminar parte de la carga axial de la columna y de la capacidad admisible del suelo qa. El estudio geotécnico oficial rige el diseño.",
    sections: [
      {
        heading: "Secuencia típica",
        body: [
          "Areq = Pservicio / qa → lado B ≈ √A, redondeado.",
          "Con Pu se obtiene qu y el momento de voladizo.",
          "El espesor se itera hasta cumplir corte unidireccional y punzonamiento.",
        ],
      },
      {
        heading: "Norma oficial",
        body: [
          "Consulta NEC-SE-GC (geotecnia y cimentaciones) y el informe de suelos del proyecto.",
          "CivilKit no sustituye el diseño de cimentación sísmica ni zapatas excéntricas.",
        ],
      },
    ],
    toolHref: "/zapatas-predim",
    toolLabel: "Abrir Zapatas PreDim",
    officialHref: OFFICIAL_NEC_HUBS.mitNec,
    officialLabel: "Consultar NEC-SE-GC (oficial)",
  },
  {
    slug: "deflexion-viga-l240",
    title: "Chequeo de deflexión de vigas L/240",
    description:
      "Cómo estimar la deflexión elástica inmediata de una viga y compararla con L/240 o L/360 en anteproyecto.",
    keywords: [
      "deflexión viga L/240",
      "flecha elástica viga",
      "límite de servicio vigas NEC",
    ],
    eyebrow: "Servicio",
    lead: "En anteproyecto conviene chequear si una sección b×h tentada produce una flecha elástica razonable frente a L/240 (o L/360 según el enunciado).",
    sections: [
      {
        heading: "Modelo de CivilKit",
        body: [
          "δ = k · w · L⁴ / (E · I) con I de sección bruta.",
          "Ec = 4700 √f'c (MPa).",
          "k depende del apoyo: simple 5/384, continuo 1/384, voladizo 1/8.",
        ],
      },
      {
        heading: "Norma y diseño final",
        body: [
          "Los límites de servicio definitivos se verifican con NEC-SE-HM / ACI 318 (fisuración y larga duración).",
          "Si δ > L/n en anteproyecto, aumenta peralte antes del modelo fino.",
        ],
      },
    ],
    toolHref: "/deflexion-aprox",
    toolLabel: "Abrir Deflexión aprox.",
    officialHref: OFFICIAL_NEC_HUBS.mitNec,
    officialLabel: "Consultar NEC-SE-HM (oficial)",
  },
  {
    slug: "que-es-nec-se-ds",
    title: "NEC-SE-DS: sismo en pocas palabras (para pregrado)",
    description:
      "Qué cubre el capítulo de peligro sísmico y diseño sismo resistente, y por qué CivilKit no lo resuelve automáticamente.",
    keywords: [
      "NEC-SE-DS",
      "diseño sismo resistente Ecuador",
      "peligro sísmico NEC",
    ],
    eyebrow: "Sismo",
    lead: "Ecuador es un país sísmico: el diseño final de casi toda edificación pasa por NEC-SE-DS. CivilKit se limita a anteproyecto gravitacional para que aprendas el flujo de cargas y secciones.",
    sections: [
      {
        heading: "Ideas clave del capítulo",
        body: [
          "Zonificación sísmica y espectro de diseño.",
          "Factores de importancia, irregularidad y reducción de respuesta.",
          "Derivas, diafragmas y requisitos de detallado sismo-resistente.",
        ],
      },
      {
        heading: "Cómo estudiarlo",
        body: [
          "Descarga el PDF oficial NEC-SE-DS desde el portal del MIT o MIDUVI.",
          "Úsalo junto a tu modelo (ETABS/SAP u otro) y a NEC-SE-HM para el detallado.",
          "No copies espectros de apuntes sin verificar la edición vigente.",
        ],
      },
    ],
    toolHref: "/norma-nec",
    toolLabel: "Ver catálogo NEC",
    officialHref: OFFICIAL_NEC_HUBS.mitNec,
    officialLabel: "Abrir NEC-SE-DS (portal oficial)",
  },
  {
    slug: "vivienda-2-pisos-nec",
    title: "Tarea típica: vivienda de 2 pisos con NEC-SE-VIVIENDA",
    description:
      "Cómo encadenar Combinaciones → Tributarias → PreDim → Zapatas para una vivienda baja, contrastando con NEC-SE-VIVIENDA.",
    keywords: [
      "NEC-SE-VIVIENDA",
      "vivienda 2 pisos NEC",
      "tarea predimensionamiento Ecuador",
    ],
    eyebrow: "Flujo de tarea",
    lead: "Muchos enunciados de pregrado piden una vivienda de hasta 2 pisos. El capítulo NEC-SE-VIVIENDA acota luces y tipología; CivilKit ayuda a armar el anteproyecto.",
    sections: [
      {
        heading: "Secuencia CivilKit",
        body: [
          "1) Combinaciones NEC → q_u.",
          "2) Tributarias → At y w.",
          "3) PreDim → losa, viga y columna.",
          "4) Deflexión aprox. y Zapatas PreDim.",
        ],
      },
      {
        heading: "Contraste normativo",
        body: [
          "Lee NEC-SE-VIVIENDA (oficial) para límites de tipología y criterios simplificados.",
          "Si tu proyecto sale del alcance (más pisos, luces grandes), aplica el resto de NEC-SE.",
        ],
      },
    ],
    toolHref: "/predim",
    toolLabel: "Empezar en PreDim",
    officialHref: OFFICIAL_NEC_HUBS.mitNec,
    officialLabel: "Consultar NEC-SE-VIVIENDA (oficial)",
  },
  {
    slug: "convertir-mpa-a-kgf-cm2",
    title: "Convertir MPa a kgf/cm² (y otras unidades civil)",
    description:
      "Factores útiles en Ecuador: MPa ↔ kgf/cm², kN ↔ kgf, m ↔ cm. Usa el conversor Unidades EC.",
    keywords: [
      "convertir MPa a kgf/cm²",
      "MPa a kg/cm2",
      "unidades ingeniería civil Ecuador",
    ],
    eyebrow: "Unidades",
    lead: "En enunciados y tablas locales aún aparece kgf/cm² junto a MPa. Tener el factor claro evita errores de orden de magnitud en f'c o esfuerzos admisibles.",
    sections: [
      {
        heading: "Factores clave",
        body: [
          "1 MPa ≈ 10,197 kgf/cm².",
          "1 kgf/cm² ≈ 0,0980665 MPa.",
          "1 kN ≈ 101,97 kgf; 1 tf = 9,80665 kN.",
        ],
      },
      {
        heading: "Herramienta",
        body: [
          "Unidades EC convierte longitud, fuerza, esfuerzo y cargas lineales/superficiales sin salir del navegador.",
        ],
      },
    ],
    toolHref: "/unidades-ec",
    toolLabel: "Abrir Unidades EC",
  },
  {
    slug: "propiedades-seccion-hormigon",
    title: "Propiedades de sección para hormigón (área e inercia)",
    description:
      "Por qué necesitas A, I y S antes del diseño, y cómo calcularlas con GeoSecciones.",
    keywords: [
      "inercia sección rectangular",
      "módulo de sección hormigón",
      "área bruta columna",
    ],
    eyebrow: "Básico",
    lead: "Antes de hablar de Mu o φPn conviene dominar la geometría de la sección. GeoSecciones calcula A, I, S y radios de giro para formas usuales.",
    sections: [
      {
        heading: "Formas cubiertas",
        body: [
          "Rectángulo (vigas y columnas).",
          "Círculo (pilares o elementos redondos).",
          "T (vigas con ala colaborante aproximada).",
        ],
      },
      {
        heading: "Uso con PreDim",
        body: [
          "PreDim ya dimensiona b×h; GeoSecciones sirve para tareas de resistencia de materiales o chequeos rápidos de I.",
        ],
      },
    ],
    toolHref: "/geosecciones",
    toolLabel: "Abrir GeoSecciones",
    officialHref: OFFICIAL_NEC_HUBS.mitNec,
    officialLabel: "Marco NEC-SE-HM (oficial)",
  },
];

export function getContentArticle(slug: string) {
  return contentArticles.find((article) => article.slug === slug);
}
