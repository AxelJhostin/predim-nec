export interface ContentArticle {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  eyebrow: string;
  lead: string;
  sections: { heading: string; body: string[] }[];
  toolHref: string;
  toolLabel: string;
}

export const contentArticles: ContentArticle[] = [
  {
    slug: "area-tributaria-columnas",
    title: "Cómo calcular el área tributaria de una columna",
    description:
      "Guía corta para estimar At de columnas interior, borde y esquina en retícula rectangular, y llevarla a PreDim NEC. CivilKit EC.",
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
  },
  {
    slug: "combinaciones-nec-se-cg",
    title: "Combinaciones de carga NEC-SE-CG para anteproyecto",
    description:
      "Explicación de 1.4D y 1.2D+1.6L para obtener q_u en anteproyecto académico según NEC Ecuador. CivilKit EC.",
    keywords: [
      "combinaciones de carga NEC",
      "1.2D+1.6L",
      "NEC-SE-CG Ecuador",
    ],
    eyebrow: "Combinaciones",
    lead: "Para anteproyecto gravitacional, dos casos suelen gobernar la carga de área mayorada: 1.4D y 1.2D + 1.6L. CivilKit compara ambos y adopta el mayor como q_u.",
    sections: [
      {
        heading: "Fórmulas",
        body: [
          "1.4 D",
          "1.2 D + 1.6 L",
          "qservicio = D + L (útil en columnas de PreDim).",
        ],
      },
      {
        heading: "Qué no incluye esta simplificación",
        body: [
          "Viento, sismo, nieve ni factores de uso especiales.",
          "El diseño final debe aplicar el juego completo de NEC-SE-CG y el análisis estructural.",
        ],
      },
    ],
    toolHref: "/combinaciones-nec",
    toolLabel: "Abrir Combinaciones NEC",
  },
  {
    slug: "zapata-aislada-predimensionamiento",
    title: "Predimensionar una zapata aislada cuadrada",
    description:
      "Pasos de anteproyecto: área por qa, espesor por corte/punzonamiento y malla inferior. Calculadora CivilKit EC.",
    keywords: [
      "zapata aislada predimensionamiento",
      "zapata cuadrada qa",
      "punzonamiento zapata",
    ],
    eyebrow: "Cimentación",
    lead: "Una zapata aislada preliminar parte de la carga axial de la columna y de la capacidad admisible del suelo qa. Luego se verifica corte y se propone acero inferior.",
    sections: [
      {
        heading: "Secuencia típica",
        body: [
          "Areq = Pservicio / qa → lado B ≈ √A, redondeado.",
          "Con Pu (p. ej. 1.2 Pservicio) se obtiene qu y el momento de voladizo.",
          "El espesor se itera hasta cumplir corte unidireccional y punzonamiento.",
        ],
      },
      {
        heading: "Límite de alcance",
        body: [
          "CivilKit asume zapata cuadrada centrada y carga axial dominante.",
          "Momentos grandes, suelos estratificados o diseño sísmico de cimentación quedan fuera.",
        ],
      },
    ],
    toolHref: "/zapatas-predim",
    toolLabel: "Abrir Zapatas PreDim",
  },
  {
    slug: "deflexion-viga-l240",
    title: "Chequeo de deflexión de vigas L/240",
    description:
      "Cómo estimar la deflexión elástica inmediata de una viga y compararla con L/240 o L/360 en anteproyecto. CivilKit EC.",
    keywords: [
      "deflexión viga L/240",
      "flecha elástica viga",
      "límite de servicio vigas",
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
        heading: "Interpretación",
        body: [
          "Si δ > L/n, aumenta el peralte o reduce luz/carga antes del análisis fino.",
          "El diseño final debe considerar fisuración y efectos de larga duración.",
        ],
      },
    ],
    toolHref: "/deflexion-aprox",
    toolLabel: "Abrir Deflexión aprox.",
  },
  {
    slug: "convertir-mpa-a-kgf-cm2",
    title: "Convertir MPa a kgf/cm² (y otras unidades civil)",
    description:
      "Factores útiles en Ecuador: MPa ↔ kgf/cm², kN ↔ kgf, m ↔ cm. Usa el conversor Unidades EC de CivilKit.",
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
];

export function getContentArticle(slug: string) {
  return contentArticles.find((article) => article.slug === slug);
}
