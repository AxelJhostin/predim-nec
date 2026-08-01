import { StructuralDashboard } from "@/components/StructuralDashboard";
import { ProjectProvider } from "@/context/ProjectContext";

export default function Home() {
  return (
    <ProjectProvider>
      <StructuralDashboard />
    </ProjectProvider>
  );
}
