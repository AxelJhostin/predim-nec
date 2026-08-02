import type { Metadata } from "next";
import { StructuralDashboard } from "@/components/StructuralDashboard";
import { ProjectProvider } from "@/context/ProjectContext";
import {
  parsePredimHandoff,
  searchParamsToURLSearchParams,
} from "@/lib/predimHandoff";
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

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PredimPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolved = await searchParams;
  const handoff = parsePredimHandoff(searchParamsToURLSearchParams(resolved));

  return (
    <ProjectProvider>
      <StructuralDashboard initialTab={handoff.tab} handoff={handoff} />
    </ProjectProvider>
  );
}
