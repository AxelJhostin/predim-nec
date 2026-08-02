import type { Metadata } from "next";
import { StructuralDashboard } from "@/components/StructuralDashboard";
import { ProjectProvider } from "@/context/ProjectContext";
import {
  createPageMetadata,
  PREDIM_DESCRIPTION,
  PREDIM_NAME,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: `${PREDIM_NAME} - Predimensionamiento estructural NEC`,
  description: PREDIM_DESCRIPTION,
  path: "/predim",
});

export default function PredimPage() {
  return (
    <ProjectProvider>
      <StructuralDashboard />
    </ProjectProvider>
  );
}
