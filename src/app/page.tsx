import type { Metadata } from "next";
import { CivilKitHome } from "@/components/CivilKitHome";
import { createPageMetadata, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: `${SITE_NAME} - Herramientas de ingeniería civil Ecuador`,
    description: SITE_DESCRIPTION,
    path: "/",
  }),
  title: {
    absolute: `${SITE_NAME} - Herramientas de ingeniería civil Ecuador`,
  },
};

export default function Home() {
  return <CivilKitHome />;
}
