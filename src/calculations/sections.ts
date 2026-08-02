import { formatNumber } from "./format";

export type SectionShape = "rectangle" | "circle" | "tee";

export interface RectangleSectionInputs {
  shape: "rectangle";
  widthCm: number;
  heightCm: number;
}

export interface CircleSectionInputs {
  shape: "circle";
  diameterCm: number;
}

export interface TeeSectionInputs {
  shape: "tee";
  flangeWidthCm: number;
  flangeThicknessCm: number;
  webWidthCm: number;
  webHeightCm: number;
}

export type SectionInputs =
  | RectangleSectionInputs
  | CircleSectionInputs
  | TeeSectionInputs;

export interface SectionResult {
  kind: "section";
  inputs: SectionInputs;
  areaCm2: number;
  centroidYCm: number;
  inertiaXCm4: number;
  inertiaYCm4: number;
  sectionModulusTopCm3: number;
  sectionModulusBottomCm3: number;
  radiusGyrationXCm: number;
  radiusGyrationYCm: number;
  summary: string;
  procedure: { title: string; detail: string }[];
}

function assertPositive(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} debe ser mayor que cero.`);
  }
}

function rectangleProperties(widthCm: number, heightCm: number) {
  const areaCm2 = widthCm * heightCm;
  const inertiaXCm4 = (widthCm * heightCm ** 3) / 12;
  const inertiaYCm4 = (heightCm * widthCm ** 3) / 12;
  const sectionModulus = inertiaXCm4 / (heightCm / 2);
  return {
    areaCm2,
    centroidYCm: heightCm / 2,
    inertiaXCm4,
    inertiaYCm4,
    sectionModulusTopCm3: sectionModulus,
    sectionModulusBottomCm3: sectionModulus,
    radiusGyrationXCm: Math.sqrt(inertiaXCm4 / areaCm2),
    radiusGyrationYCm: Math.sqrt(inertiaYCm4 / areaCm2),
  };
}

function circleProperties(diameterCm: number) {
  const radiusCm = diameterCm / 2;
  const areaCm2 = Math.PI * radiusCm ** 2;
  const inertiaCm4 = (Math.PI * diameterCm ** 4) / 64;
  const sectionModulus = inertiaCm4 / radiusCm;
  const radiusGyration = Math.sqrt(inertiaCm4 / areaCm2);
  return {
    areaCm2,
    centroidYCm: radiusCm,
    inertiaXCm4: inertiaCm4,
    inertiaYCm4: inertiaCm4,
    sectionModulusTopCm3: sectionModulus,
    sectionModulusBottomCm3: sectionModulus,
    radiusGyrationXCm: radiusGyration,
    radiusGyrationYCm: radiusGyration,
  };
}

function teeProperties(
  flangeWidthCm: number,
  flangeThicknessCm: number,
  webWidthCm: number,
  webHeightCm: number,
) {
  if (webWidthCm > flangeWidthCm) {
    throw new Error("El alma no puede ser más ancha que el ala.");
  }

  const areaFlange = flangeWidthCm * flangeThicknessCm;
  const areaWeb = webWidthCm * webHeightCm;
  const areaCm2 = areaFlange + areaWeb;
  const totalHeight = flangeThicknessCm + webHeightCm;

  // Origen en la base del alma.
  const yFlange = webHeightCm + flangeThicknessCm / 2;
  const yWeb = webHeightCm / 2;
  const centroidYCm = (areaFlange * yFlange + areaWeb * yWeb) / areaCm2;

  const iFlangeOwn = (flangeWidthCm * flangeThicknessCm ** 3) / 12;
  const iWebOwn = (webWidthCm * webHeightCm ** 3) / 12;
  const iFlangeParallel = areaFlange * (yFlange - centroidYCm) ** 2;
  const iWebParallel = areaWeb * (yWeb - centroidYCm) ** 2;
  const inertiaXCm4 = iFlangeOwn + iFlangeParallel + iWebOwn + iWebParallel;

  // Iy aproximada respecto al eje vertical de simetría.
  const inertiaYCm4 =
    (flangeThicknessCm * flangeWidthCm ** 3) / 12 +
    (webHeightCm * webWidthCm ** 3) / 12;

  const yTop = totalHeight - centroidYCm;
  const yBottom = centroidYCm;

  return {
    areaCm2,
    centroidYCm,
    inertiaXCm4,
    inertiaYCm4,
    sectionModulusTopCm3: inertiaXCm4 / yTop,
    sectionModulusBottomCm3: inertiaXCm4 / yBottom,
    radiusGyrationXCm: Math.sqrt(inertiaXCm4 / areaCm2),
    radiusGyrationYCm: Math.sqrt(inertiaYCm4 / areaCm2),
    totalHeight,
  };
}

export function calculateSection(inputs: SectionInputs): SectionResult {
  if (inputs.shape === "rectangle") {
    assertPositive(inputs.widthCm, "El ancho b");
    assertPositive(inputs.heightCm, "El peralte h");
    const props = rectangleProperties(inputs.widthCm, inputs.heightCm);
    return {
      kind: "section",
      inputs,
      ...props,
      summary: `Rectángulo ${formatNumber(inputs.widthCm)} × ${formatNumber(inputs.heightCm)} cm`,
      procedure: [
        {
          title: "1. Área",
          detail: `A = b·h = ${formatNumber(inputs.widthCm)} × ${formatNumber(inputs.heightCm)} = ${formatNumber(props.areaCm2, 2)} cm².`,
        },
        {
          title: "2. Momentos de inercia",
          detail: `Ix = b·h³/12 = ${formatNumber(props.inertiaXCm4, 2)} cm⁴; Iy = h·b³/12 = ${formatNumber(props.inertiaYCm4, 2)} cm⁴.`,
        },
        {
          title: "3. Módulo de sección y radio de giro",
          detail: `Sx = Ix/(h/2) = ${formatNumber(props.sectionModulusTopCm3, 2)} cm³; rx = √(Ix/A) = ${formatNumber(props.radiusGyrationXCm, 2)} cm.`,
        },
      ],
    };
  }

  if (inputs.shape === "circle") {
    assertPositive(inputs.diameterCm, "El diámetro");
    const props = circleProperties(inputs.diameterCm);
    return {
      kind: "section",
      inputs,
      ...props,
      summary: `Círculo Ø ${formatNumber(inputs.diameterCm)} cm`,
      procedure: [
        {
          title: "1. Área",
          detail: `A = π·D²/4 = ${formatNumber(props.areaCm2, 2)} cm².`,
        },
        {
          title: "2. Inercia y módulo",
          detail: `I = π·D⁴/64 = ${formatNumber(props.inertiaXCm4, 2)} cm⁴; S = I/(D/2) = ${formatNumber(props.sectionModulusTopCm3, 2)} cm³.`,
        },
        {
          title: "3. Radio de giro",
          detail: `r = √(I/A) = ${formatNumber(props.radiusGyrationXCm, 2)} cm.`,
        },
      ],
    };
  }

  assertPositive(inputs.flangeWidthCm, "El ancho del ala bf");
  assertPositive(inputs.flangeThicknessCm, "El espesor del ala tf");
  assertPositive(inputs.webWidthCm, "El ancho del alma bw");
  assertPositive(inputs.webHeightCm, "La altura del alma hw");
  const props = teeProperties(
    inputs.flangeWidthCm,
    inputs.flangeThicknessCm,
    inputs.webWidthCm,
    inputs.webHeightCm,
  );

  return {
    kind: "section",
    inputs,
    areaCm2: props.areaCm2,
    centroidYCm: props.centroidYCm,
    inertiaXCm4: props.inertiaXCm4,
    inertiaYCm4: props.inertiaYCm4,
    sectionModulusTopCm3: props.sectionModulusTopCm3,
    sectionModulusBottomCm3: props.sectionModulusBottomCm3,
    radiusGyrationXCm: props.radiusGyrationXCm,
    radiusGyrationYCm: props.radiusGyrationYCm,
    summary: `T: bf=${formatNumber(inputs.flangeWidthCm)} · tf=${formatNumber(inputs.flangeThicknessCm)} · bw=${formatNumber(inputs.webWidthCm)} · hw=${formatNumber(inputs.webHeightCm)} cm`,
    procedure: [
      {
        title: "1. Área y centroide",
        detail: `A = ${formatNumber(props.areaCm2, 2)} cm². Centroide desde la base: ȳ = ${formatNumber(props.centroidYCm, 2)} cm.`,
      },
      {
        title: "2. Inercia Ix (Steiner)",
        detail: `Ix = Σ(Ipropia + A·d²) = ${formatNumber(props.inertiaXCm4, 2)} cm⁴. Altura total = ${formatNumber(props.totalHeight)} cm.`,
      },
      {
        title: "3. Módulos de sección",
        detail: `Ssuperior = Ix/y_top = ${formatNumber(props.sectionModulusTopCm3, 2)} cm³; Sinferior = Ix/y_bot = ${formatNumber(props.sectionModulusBottomCm3, 2)} cm³.`,
      },
    ],
  };
}
