/** Primitivos SVG compartidos para esquemas PreDim. */

export const ACCENT = "#E65100";
export const STROKE = "#334155";
export const FILL = "#e0f2fe";
export const MUTED = "#64748b";

/** Flecha de carga vertical apuntando hacia abajo (y1 arriba → y2 abajo). */
export function LoadArrow({
  x,
  y1,
  y2,
  label,
}: {
  x: number;
  y1: number;
  y2: number;
  label?: string;
}) {
  const top = Math.min(y1, y2);
  const tip = Math.max(y1, y2);
  return (
    <g>
      <line
        x1={x}
        y1={top}
        x2={x}
        y2={tip - 6}
        stroke={ACCENT}
        strokeWidth={1.75}
      />
      <polygon
        points={`${x},${tip} ${x - 4},${tip - 8} ${x + 4},${tip - 8}`}
        fill={ACCENT}
      />
      {label ? (
        <text
          x={x}
          y={top - 4}
          textAnchor="middle"
          fill={ACCENT}
          fontSize={9}
          fontFamily="ui-monospace, monospace"
          fontWeight={600}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

export function DimLabel({
  x,
  y,
  text,
  anchor = "middle",
}: {
  x: number;
  y: number;
  text: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={MUTED}
      fontSize={9}
      fontFamily="ui-monospace, monospace"
      fontWeight={600}
    >
      {text}
    </text>
  );
}
