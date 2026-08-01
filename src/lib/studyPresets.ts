import {
  createSavedElement,
  type LocalProject,
  PROJECT_SCHEMA_VERSION,
} from "@/context/ProjectContext";
import {
  calculateBeam,
  calculateColumn,
  calculateSlab,
  type BeamInputs,
  type ColumnInputs,
  type SlabInputs,
} from "@/utils/necCalculations";

export interface ExamplePreset<T> {
  id: string;
  label: string;
  description: string;
  values: T;
}

export const beamExamples: ExamplePreset<BeamInputs>[] = [
  {
    id: "beam-residential",
    label: "Residencial",
    description: "Viga continua de entrepiso, luz típica 5,0 m.",
    values: {
      spanM: 5,
      supportType: "Ambos extremos continuos",
      designLoadKnM: 7.5,
      steelYieldMpa: 420,
      coverCm: 4,
    },
  },
  {
    id: "beam-classroom",
    label: "Aula",
    description: "Viga de aula o pasillo, luz 7,0 m y mayor carga.",
    values: {
      spanM: 7,
      supportType: "Un extremo continuo",
      designLoadKnM: 12,
      steelYieldMpa: 420,
      coverCm: 4,
    },
  },
  {
    id: "beam-cantilever",
    label: "Voladizo",
    description: "Balcón o voladizo corto, luz 2,0 m.",
    values: {
      spanM: 2,
      supportType: "Voladizo",
      designLoadKnM: 6,
      steelYieldMpa: 420,
      coverCm: 4,
    },
  },
];

export const columnExamples: ExamplePreset<ColumnInputs>[] = [
  {
    id: "column-central",
    label: "Central",
    description: "Columna interior de vivienda de 3 pisos.",
    values: {
      tributaryAreaM2: 20,
      floors: 3,
      columnType: "Central",
      serviceLoadKnM2: 8,
      clearHeightM: 2.8,
      effectiveLengthFactor: 1,
      longitudinalSteelCm2: 16,
    },
  },
  {
    id: "column-perimeter",
    label: "Perimetral",
    description: "Columna de fachada, 4 niveles y área media.",
    values: {
      tributaryAreaM2: 16,
      floors: 4,
      columnType: "Perimetral",
      serviceLoadKnM2: 9,
      clearHeightM: 3,
      effectiveLengthFactor: 1,
      longitudinalSteelCm2: 18,
    },
  },
  {
    id: "column-corner",
    label: "Esquina",
    description: "Columna esquinera con mayor factor de posición.",
    values: {
      tributaryAreaM2: 12,
      floors: 4,
      columnType: "Esquina",
      serviceLoadKnM2: 9,
      clearHeightM: 3,
      effectiveLengthFactor: 1,
      longitudinalSteelCm2: 20,
    },
  },
];

export const slabExamples: ExamplePreset<SlabInputs>[] = [
  {
    id: "slab-solid",
    label: "Maciza",
    description: "Losa maciza residencial, luz 4,5 m.",
    values: {
      spanM: 4.5,
      slabType: "solid",
    },
  },
  {
    id: "slab-ribbed",
    label: "Nervada",
    description: "Losa aligerada de aula, luz 6,0 m.",
    values: {
      spanM: 6,
      slabType: "ribbed",
    },
  },
];

export interface TaskTemplate {
  id: string;
  title: string;
  summary: string;
  build: () => LocalProject;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export const taskTemplates: TaskTemplate[] = [
  {
    id: "housing-assignment",
    title: "Tarea: vivienda de 2 plantas",
    summary:
      "Proyecto demo con vigas, columnas y losas etiquetadas para entregar una memoria rápida.",
    build() {
      const beamMain = calculateBeam(beamExamples[0].values);
      const beamCantilever = calculateBeam(beamExamples[2].values);
      const columnCentral = calculateColumn(columnExamples[0].values);
      const columnCorner = calculateColumn(columnExamples[2].values);
      const slabSolid = calculateSlab(slabExamples[0].values);
      const slabRibbed = calculateSlab({
        ...slabExamples[1].values,
        spanM: 5,
      });

      return {
        schemaVersion: PROJECT_SCHEMA_VERSION,
        metadata: {
          name: "Tarea académica · Vivienda 2 plantas",
          responsible: "Estudiante",
          location: "Portoviejo, Manabí",
          institution: "PUCE sede Portoviejo",
          date: today(),
          notes:
            "Plantilla educativa PreDim NEC. Compara alternativas, revisa el procedimiento y completa tus metadatos antes de imprimir la memoria.",
        },
        elements: [
          createSavedElement("V-101", beamMain),
          createSavedElement("V-201-VOL", beamCantilever),
          createSavedElement("C-1", columnCentral),
          createSavedElement("C-4", columnCorner),
          createSavedElement("L-1", slabSolid),
          createSavedElement("L-2", slabRibbed),
        ],
      };
    },
  },
  {
    id: "classroom-assignment",
    title: "Tarea: bloque de aulas",
    summary:
      "Caso con luces más largas y columnas perimetrales, útil para comparar secciones.",
    build() {
      const beamClassroom = calculateBeam(beamExamples[1].values);
      const beamAlt = calculateBeam({
        ...beamExamples[1].values,
        supportType: "Ambos extremos continuos",
        designLoadKnM: 10,
      });
      const columnPerimeter = calculateColumn(columnExamples[1].values);
      const columnCorner = calculateColumn({
        ...columnExamples[2].values,
        floors: 5,
        tributaryAreaM2: 14,
      });
      const slabRibbed = calculateSlab(slabExamples[1].values);

      return {
        schemaVersion: PROJECT_SCHEMA_VERSION,
        metadata: {
          name: "Tarea académica · Bloque de aulas",
          responsible: "Estudiante",
          location: "Manabí, Ecuador",
          institution: "PUCE sede Portoviejo",
          date: today(),
          notes:
            "Usa el comparador para contrastar V-Aula-A y V-Aula-B. Documenta cuál opción conviene y por qué.",
        },
        elements: [
          createSavedElement("V-Aula-A", beamClassroom),
          createSavedElement("V-Aula-B", beamAlt),
          createSavedElement("C-P1", columnPerimeter),
          createSavedElement("C-E1", columnCorner),
          createSavedElement("L-Aula", slabRibbed),
        ],
      };
    },
  },
];
