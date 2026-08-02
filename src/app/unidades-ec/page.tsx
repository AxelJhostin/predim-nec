import type { Metadata } from "next";
import { UnitsTool } from "@/components/tools/UnitsTool";
import { createPageMetadata } from "@/lib/seo";

const description =
  "Conversor de unidades para ingeniería civil en Ecuador: MPa ↔ kgf/cm², kN ↔ kgf, longitudes y cargas. Gratis, para estudiantes de pregrado. CivilKit EC.";

export const metadata: Metadata = createPageMetadata({
  title: "Unidades EC - Conversor para ingeniería civil",
  description,
  path: "/unidades-ec",
});

export default function UnitsPage() {
  return <UnitsTool />;
}
