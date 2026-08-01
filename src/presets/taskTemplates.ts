import {
  calculateBeam,
  calculateColumn,
  calculateSlab,
} from "@/calculations";
import {
  PROJECT_SCHEMA_VERSION,
  createSavedElement,
  type LocalProject,
} from "@/project";
import { beamExamples } from "./beamExamples";
import { columnExamples } from "./columnExamples";
import { slabExamples } from "./slabExamples";

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
