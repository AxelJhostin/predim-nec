import { formatNumber, type SlabResult } from "@/calculations";
import {
  ACCENT,
  DimLabel,
  FILL,
  LoadArrow,
  MUTED,
  STROKE,
} from "./svgPrimitives";

export function SlabLoadDiagram({ result }: { result: SlabResult }) {
  const { spanM, designLoadKnM2, slabType, supportType } = result.inputs;
  const qLabel = `q = ${formatNumber(designLoadKnM2, 1)} kN/m²`;
  const LLabel = `L = ${formatNumber(spanM, 2)} m`;
  const hLabel = `h = ${formatNumber(result.thicknessCm)} cm`;
  const ribbed = slabType === "ribbed";

  const x0 = 40;
  const x1 = 300;
  const slabTop = 72;
  // thickness visual (scaled, capped)
  const tPx = Math.min(28, Math.max(10, result.thicknessCm * 0.55));

  const arrows = Array.from({ length: 6 }, (_, i) => {
    const t = (i + 0.5) / 6;
    return x0 + t * (x1 - x0);
  });

  return (
    <svg
      viewBox="0 0 340 150"
      className="h-full w-full"
      role="img"
      aria-label={`Esquema de losa: ${qLabel}, ${LLabel}, ${hLabel}`}
    >
      <line
        x1={x0}
        y1={30}
        x2={x1}
        y2={30}
        stroke={ACCENT}
        strokeWidth={1.25}
        strokeDasharray="3 2"
      />
      {arrows.map((x, i) => (
        <LoadArrow
          key={x}
          x={x}
          y1={30}
          y2={slabTop - 2}
          label={i === 2 ? qLabel : undefined}
        />
      ))}

      {/* Slab strip */}
      <rect
        x={x0}
        y={slabTop}
        width={x1 - x0}
        height={tPx}
        fill={FILL}
        stroke={STROKE}
        strokeWidth={2}
      />

      {ribbed
        ? [0.2, 0.4, 0.6, 0.8].map((t) => {
            const x = x0 + t * (x1 - x0);
            return (
              <rect
                key={t}
                x={x - 4}
                y={slabTop + tPx}
                width={8}
                height={14}
                fill="#bae6fd"
                stroke={STROKE}
                strokeWidth={1}
              />
            );
          })
        : null}

      {/* Supports */}
      <polygon
        points={`${x0},${slabTop + tPx} ${x0 - 7},${slabTop + tPx + 12} ${x0 + 7},${slabTop + tPx + 12}`}
        fill="none"
        stroke={STROKE}
        strokeWidth={1.5}
      />
      <polygon
        points={`${x1},${slabTop + tPx} ${x1 - 7},${slabTop + tPx + 12} ${x1 + 7},${slabTop + tPx + 12}`}
        fill="none"
        stroke={STROKE}
        strokeWidth={1.5}
      />

      <line
        x1={x0}
        y1={slabTop + tPx + 22}
        x2={x1}
        y2={slabTop + tPx + 22}
        stroke={MUTED}
        strokeWidth={1}
      />
      <DimLabel x={(x0 + x1) / 2} y={slabTop + tPx + 34} text={LLabel} />

      <DimLabel
        x={x1 + 8}
        y={slabTop + tPx / 2 + 3}
        text={hLabel}
        anchor="start"
      />

      <DimLabel
        x={(x0 + x1) / 2}
        y={142}
        text={`${ribbed ? "Aligerada" : "Maciza"} · ${supportType}`}
      />
    </svg>
  );
}
