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
import { runVivienda2PlantasFlow } from "@/lib/vivienda2Plantas";
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
      "Flujo coherente D=5, L=2, vano 4×4, bt=2 m, 2 pisos. Misma base que /tarea-vivienda-2-plantas.",
    build() {
      const flow = runVivienda2PlantasFlow();

      return {
        schemaVersion: PROJECT_SCHEMA_VERSION,
        metadata: {
          name: "Tarea académica · Vivienda 2 plantas",
          responsible: "Estudiante",
          location: "Portoviejo, Manabí",
          institution: "PUCE sede Portoviejo",
          date: today(),
          notes:
            "Plantilla coherente CivilKit EC: q_u=9.2 kN/m², w=18.4 kN/m, At=16 m², 2 pisos. Recorrido guiado en /tarea-vivienda-2-plantas. Contrasta con NEC-SE-VIVIENDA oficial.",
        },
        elements: [
          createSavedElement("L-1", flow.slab),
          createSavedElement("V-101", flow.beam),
          createSavedElement("C-1", flow.column),
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
