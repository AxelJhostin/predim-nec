import { formatNumber, type ColumnResult } from "@/calculations";
import { parseBarCount } from "./parseBarCount";
import {
  ACCENT,
  DimLabel,
  FILL,
  MUTED,
  STROKE,
} from "./svgPrimitives";

function barPositions(count: number, cx: number, cy: number, size: number) {
  const inset = size * 0.22;
  const left = cx - size / 2 + inset;
  const right = cx + size / 2 - inset;
  const top = cy - size / 2 + inset;
  const bottom = cy + size / 2 - inset;
  const midY = cy;
  const midX = cx;

  if (count <= 4) {
    return [
      [left, top],
      [right, top],
      [left, bottom],
      [right, bottom],
    ].slice(0, count);
  }
  if (count === 5) {
    return [
      [left, top],
      [right, top],
      [left, bottom],
      [right, bottom],
      [midX, midY],
    ];
  }
  // 6+ : corners + mid-sides
  const pts: number[][] = [
    [left, top],
    [midX, top],
    [right, top],
    [left, midY],
    [right, midY],
    [left, bottom],
    [midX, bottom],
    [right, bottom],
  ];
  if (count <= 8) {
    return pts.slice(0, count);
  }
  // denser: add near-corner mids
  const extra = [
    [(left + midX) / 2, top],
    [(midX + right) / 2, top],
    [(left + midX) / 2, bottom],
    [(midX + right) / 2, bottom],
    [left, (top + midY) / 2],
    [right, (top + midY) / 2],
    [left, (midY + bottom) / 2],
    [right, (midY + bottom) / 2],
  ];
  return [...pts, ...extra].slice(0, count);
}

export function ColumnLoadDiagram({ result }: { result: ColumnResult }) {
  const H = result.inputs.clearHeightM;
  const Pu = result.ultimateLoadKn;
  const barCount = parseBarCount(result.longitudinalBarProposal, 4);
  const sideLabel = `${formatNumber(result.sideCm)} × ${formatNumber(result.sideCm)} cm`;

  const colTop = 48;
  const colBottom = 118;
  const colX = 70;
  const colW = 28;

  const secSize = 64;
  const secCx = 230;
  const secCy = 78;
  const bars = barPositions(barCount, secCx, secCy, secSize);

  return (
    <svg
      viewBox="0 0 340 150"
      className="h-full w-full"
      role="img"
      aria-label={`Esquema de columna: Pu = ${formatNumber(Pu, 1)} kN, H = ${formatNumber(H, 2)} m, sección ${sideLabel}`}
    >
      {/* Axial load arrow */}
      <line
        x1={colX + colW / 2}
        y1={18}
        x2={colX + colW / 2}
        y2={colTop - 4}
        stroke={ACCENT}
        strokeWidth={1.75}
      />
      <polygon
        points={`${colX + colW / 2},${colTop - 2} ${colX + colW / 2 - 5},${colTop - 12} ${colX + colW / 2 + 5},${colTop - 12}`}
        fill={ACCENT}
      />
      <text
        x={colX + colW / 2 + 36}
        y={28}
        textAnchor="start"
        fill={ACCENT}
        fontSize={9}
        fontFamily="ui-monospace, monospace"
        fontWeight={600}
      >
        {`Pu = ${formatNumber(Pu, 1)} kN`}
      </text>

      {/* Column elevation */}
      <rect
        x={colX}
        y={colTop}
        width={colW}
        height={colBottom - colTop}
        fill={FILL}
        stroke={STROKE}
        strokeWidth={2}
      />
      {/* Foundation hint */}
      <rect
        x={colX - 16}
        y={colBottom}
        width={colW + 32}
        height={8}
        fill="#cbd5e1"
        stroke={STROKE}
        strokeWidth={1.25}
      />

      <line
        x1={colX + colW + 10}
        y1={colTop}
        x2={colX + colW + 10}
        y2={colBottom}
        stroke={MUTED}
        strokeWidth={1}
      />
      <DimLabel
        x={colX + colW + 16}
        y={(colTop + colBottom) / 2 + 3}
        text={`H = ${formatNumber(H, 2)} m`}
        anchor="start"
      />
      <DimLabel
        x={colX + colW / 2}
        y={colBottom + 22}
        text={result.inputs.columnType}
      />

      {/* Section */}
      <rect
        x={secCx - secSize / 2}
        y={secCy - secSize / 2}
        width={secSize}
        height={secSize}
        fill={FILL}
        stroke={STROKE}
        strokeWidth={2}
      />
      {bars.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.2} fill={ACCENT} />
      ))}
      <DimLabel
        x={secCx}
        y={secCy + secSize / 2 + 14}
        text={`lado = ${formatNumber(result.sideCm)} cm`}
      />
      <text
        x={secCx}
        y={secCy - secSize / 2 - 8}
        textAnchor="middle"
        fill={MUTED}
        fontSize={8}
        fontFamily="ui-monospace, monospace"
        fontWeight={700}
      >
        Sección · {barCount} barras
      </text>
      <DimLabel
        x={secCx}
        y={142}
        text={`λ ≈ ${formatNumber(result.slenderness, 1)}`}
      />
    </svg>
  );
}
