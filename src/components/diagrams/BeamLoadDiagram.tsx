import { formatNumber, type BeamResult } from "@/calculations";
import {
  ACCENT,
  DimLabel,
  FILL,
  LoadArrow,
  MUTED,
  STROKE,
} from "./svgPrimitives";

function supportGlyph(
  type: BeamResult["inputs"]["supportType"],
  x: number,
  y: number,
  side: "left" | "right",
) {
  if (type === "Voladizo") {
    if (side === "left") {
      return (
        <g>
          <line x1={x} y1={y - 14} x2={x} y2={y + 14} stroke={STROKE} strokeWidth={2.5} />
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={x}
              y1={y - 12 + i * 8}
              x2={x - 8}
              y2={y - 6 + i * 8}
              stroke={STROKE}
              strokeWidth={1.25}
            />
          ))}
        </g>
      );
    }
    return null;
  }

  const continuousLeft =
    type === "Ambos extremos continuos" ||
    (type === "Un extremo continuo" && side === "left");
  const continuousRight =
    type === "Ambos extremos continuos" ||
    (type === "Un extremo continuo" && side === "right");

  if (side === "left" && continuousLeft) {
    return (
      <g>
        <line x1={x - 16} y1={y} x2={x + 2} y2={y} stroke={STROKE} strokeWidth={2.5} />
        <circle cx={x} cy={y} r={3.5} fill="#fff" stroke={STROKE} strokeWidth={1.5} />
      </g>
    );
  }
  if (side === "right" && continuousRight) {
    return (
      <g>
        <line x1={x - 2} y1={y} x2={x + 16} y2={y} stroke={STROKE} strokeWidth={2.5} />
        <circle cx={x} cy={y} r={3.5} fill="#fff" stroke={STROKE} strokeWidth={1.5} />
      </g>
    );
  }

  // pin / roller
  return (
    <g>
      <polygon
        points={`${x},${y} ${x - 7},${y + 12} ${x + 7},${y + 12}`}
        fill="none"
        stroke={STROKE}
        strokeWidth={1.5}
      />
      {side === "right" ? (
        <line
          x1={x - 10}
          y1={y + 14}
          x2={x + 10}
          y2={y + 14}
          stroke={STROKE}
          strokeWidth={1.5}
        />
      ) : (
        <line
          x1={x - 10}
          y1={y + 14}
          x2={x + 10}
          y2={y + 14}
          stroke={STROKE}
          strokeWidth={1.5}
        />
      )}
    </g>
  );
}

export function BeamLoadDiagram({ result }: { result: BeamResult }) {
  const { spanM, supportType, designLoadKnM } = result.inputs;
  const wLabel = `w = ${formatNumber(designLoadKnM, 1)} kN/m`;
  const LLabel = `L = ${formatNumber(spanM, 2)} m`;

  const elevX0 = 36;
  const elevX1 = 210;
  const beamY = 78;
  const arrowYs = [28, 28];
  const nArrows = 5;
  const arrows = Array.from({ length: nArrows }, (_, i) => {
    const t = (i + 0.5) / nArrows;
    return elevX0 + t * (elevX1 - elevX0);
  });

  // Section proportional
  const maxSide = 56;
  const ratio = result.depthCm / Math.max(result.widthCm, 1);
  let secW = maxSide / Math.max(ratio, 1);
  let secH = secW * ratio;
  if (secH > maxSide) {
    secH = maxSide;
    secW = secH / ratio;
  }
  const secX = 248;
  const secY = 40;
  const dRatio = result.effectiveDepthCm / Math.max(result.depthCm, 1);
  const dY = secY + secH * dRatio;

  const cantilever = supportType === "Voladizo";

  return (
    <svg
      viewBox="0 0 340 150"
      className="h-full w-full"
      role="img"
      aria-label={`Esquema de viga: ${wLabel}, ${LLabel}, sección ${formatNumber(result.widthCm)}×${formatNumber(result.depthCm)} cm`}
    >
      {/* Distributed load band */}
      <line
        x1={elevX0}
        y1={arrowYs[0]}
        x2={elevX1}
        y2={arrowYs[0]}
        stroke={ACCENT}
        strokeWidth={1.25}
        strokeDasharray="3 2"
      />
      {arrows.map((x, i) => (
        <LoadArrow
          key={x}
          x={x}
          y1={arrowYs[0]}
          y2={beamY - 4}
          label={i === 2 ? wLabel : undefined}
        />
      ))}

      {/* Beam member */}
      <rect
        x={elevX0}
        y={beamY - 5}
        width={elevX1 - elevX0}
        height={10}
        fill={FILL}
        stroke={STROKE}
        strokeWidth={2}
        rx={1}
      />

      {cantilever ? (
        <>
          {supportGlyph(supportType, elevX0, beamY, "left")}
          <DimLabel x={(elevX0 + elevX1) / 2} y={beamY + 32} text={LLabel} />
          <line
            x1={elevX0}
            y1={beamY + 20}
            x2={elevX1}
            y2={beamY + 20}
            stroke={MUTED}
            strokeWidth={1}
          />
        </>
      ) : (
        <>
          {supportGlyph(supportType, elevX0, beamY + 5, "left")}
          {supportGlyph(supportType, elevX1, beamY + 5, "right")}
          <line
            x1={elevX0}
            y1={beamY + 28}
            x2={elevX1}
            y2={beamY + 28}
            stroke={MUTED}
            strokeWidth={1}
          />
          <DimLabel x={(elevX0 + elevX1) / 2} y={beamY + 40} text={LLabel} />
        </>
      )}

      <DimLabel
        x={(elevX0 + elevX1) / 2}
        y={142}
        text={supportType}
      />

      {/* Cross-section */}
      <rect
        x={secX}
        y={secY}
        width={secW}
        height={secH}
        fill={FILL}
        stroke={STROKE}
        strokeWidth={2}
      />
      <line
        x1={secX + 3}
        y1={dY}
        x2={secX + secW - 3}
        y2={dY}
        stroke={ACCENT}
        strokeWidth={1.25}
        strokeDasharray="3 2"
      />
      <DimLabel
        x={secX + secW / 2}
        y={secY + secH + 14}
        text={`b = ${formatNumber(result.widthCm)} cm`}
      />
      <DimLabel
        x={secX + secW + 6}
        y={secY + secH / 2 + 3}
        text={`h = ${formatNumber(result.depthCm)}`}
        anchor="start"
      />
      <DimLabel
        x={secX + secW + 6}
        y={dY + 3}
        text={`d = ${formatNumber(result.effectiveDepthCm)}`}
        anchor="start"
      />
      <text
        x={secX + secW / 2}
        y={secY - 8}
        textAnchor="middle"
        fill={MUTED}
        fontSize={8}
        fontFamily="ui-monospace, monospace"
        fontWeight={700}
      >
        Sección
      </text>
    </svg>
  );
}
