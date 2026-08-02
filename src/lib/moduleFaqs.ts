export interface FaqItem {
  question: string;
  answer: string;
}

export const moduleFaqs = {
  geo: [
    {
      question: "¿Qué propiedades calcula GeoSecciones?",
      answer:
        "Área, centroide, momentos de inercia Ix e Iy, módulos de sección y radios de giro para rectángulo, círculo y sección T. Es geometría de sección, no diseño a flexión.",
    },
    {
      question: "¿Puedo usar el resultado directamente en el diseño NEC?",
      answer:
        "Sirve para anteproyecto y tareas de resistencia de materiales. El diseño de hormigón armado también exige cargas, φMn, corte y detallado según NEC-SE-HM / ACI 318.",
    },
  ],
  units: [
    {
      question: "¿Cuánto es 1 MPa en kgf/cm²?",
      answer:
        "Aproximadamente 10,197 kgf/cm² (1 kgf/cm² ≈ 0,0980665 MPa). Unidades EC usa ese factor para convertir esfuerzo.",
    },
    {
      question: "¿Qué categorías incluye el conversor?",
      answer:
        "Longitud, fuerza, esfuerzo/presión, carga lineal (kN/m) y carga superficial (kN/m²), con unidades habituales en civil ecuatoriano.",
    },
  ],
  combinations: [
    {
      question: "¿Qué combinaciones usa Combinaciones NEC?",
      answer:
        "Casos gravitacionales simplificados 1.4D y 1.2D + 1.6L, orientados a anteproyecto académico. No sustituyen el juego completo de NEC-SE-CG con viento o sismo.",
    },
    {
      question: "¿q_u es la carga que debo pegar en PreDim?",
      answer:
        "Sí para losas (kN/m²). Para vigas convierte a w = q_u · bt en Tributarias o con el ancho tributario opcional de esta herramienta.",
    },
  ],
  tributary: [
    {
      question: "¿Cómo se calcula el área tributaria de una columna?",
      answer:
        "En retícula rectangular simplificada: interior At = Lx·Ly, borde ≈ 0.5·Lx·Ly (o según el eje de borde) y esquina ≈ 0.25·Lx·Ly. Verifica siempre con el plano de tu enunciado.",
    },
    {
      question: "¿Qué es el ancho tributario de una viga?",
      answer:
        "Es el ancho de losa que descarga a la viga (a menudo el espaciamiento entre vigas). La carga lineal es w = q · bt.",
    },
  ],
  footing: [
    {
      question: "¿Qué chequea Zapatas PreDim?",
      answer:
        "Área por capacidad admisible del suelo qa, espesor por corte unidireccional y punzonamiento, y una malla inferior tentativa a flexión de voladizo.",
    },
    {
      question: "¿Sirve para zapata con momento o corrida?",
      answer:
        "No. El módulo es zapata aislada cuadrada con carga axial dominante. Excentricidad, volcamiento o zapatas corridas requieren otro procedimiento.",
    },
  ],
  deflection: [
    {
      question: "¿La deflexión incluye fisuración y fluencia?",
      answer:
        "No. Es δ elástica inmediata con sección bruta y Ec = 4700√f'c. Los límites L/240 o L/360 de servicio suelen exigir factores de larga duración en el diseño final.",
    },
    {
      question: "¿Qué coeficiente de apoyo usa?",
      answer:
        "Simplemente apoyada 5/384, ambos extremos continuos 1/384, un extremo continuo ≈1/185 y voladizo 1/8, sobre δ = k·w·L⁴/(E·I).",
    },
  ],
  predim: [
    {
      question: "¿PreDim NEC reemplaza al ingeniero estructural?",
      answer:
        "No. Es una herramienta académica de anteproyecto. El diseño final exige modelo, combinaciones, sismo, detallado y revisión profesional.",
    },
    {
      question: "¿Puedo pasar cargas desde otras herramientas?",
      answer:
        "Sí. Combinaciones, Tributarias y Deflexión tienen botones «Usar en PreDim» que abren /predim con q_u, w o At en la URL.",
    },
  ],
} as const satisfies Record<string, FaqItem[]>;
