import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { liveModules } from "./modules";
import { moduleFaqs } from "./moduleFaqs";

const root = join(import.meta.dirname, "../..");

/** Herramientas con FAQ en ToolkitShell / PreDim (no páginas solo contenido). */
const TOOL_FAQ_IDS = [
  "predim",
  "geo",
  "units",
  "calculus",
  "tributary",
  "combinations",
  "footing",
  "deflection",
] as const;

function pageExistsForHref(href: string): boolean {
  const relative = href.replace(/^\//, "");
  return existsSync(join(root, "src/app", relative, "page.tsx"));
}

describe("catálogo CivilKit (consistencia)", () => {
  it("cada módulo live con href tiene página en app/", () => {
    const missing = liveModules
      .filter((module) => module.href)
      .filter((module) => !pageExistsForHref(module.href!))
      .map((module) => `${module.id} → ${module.href}`);

    expect(missing).toEqual([]);
  });

  it("sitemap se deriva del catálogo (liveModules)", () => {
    const sitemapSource = readFileSync(
      join(root, "src/app/sitemap.ts"),
      "utf8",
    );
    expect(sitemapSource).toContain("liveModules");
    expect(sitemapSource).toContain("fromCatalog");
  });

  it("service worker precachea las herramientas live", () => {
    const sw = readFileSync(join(root, "public/sw.js"), "utf8");
    const toolHrefs = liveModules
      .filter(
        (module) =>
          module.href &&
          TOOL_FAQ_IDS.includes(
            module.id as (typeof TOOL_FAQ_IDS)[number],
          ),
      )
      .map((module) => module.href!);

    expect(toolHrefs.filter((href) => !sw.includes(`"${href}"`))).toEqual([]);
  });

  it("moduleFaqs cubre las herramientas ToolkitShell / PreDim", () => {
    for (const id of TOOL_FAQ_IDS) {
      expect(moduleFaqs[id]?.length).toBeGreaterThan(0);
    }
  });
});
