/**
 * Extrae el número de barras de propuestas tipo "6 Ø16 mm" o "4Ø12".
 * Si no hay conteo (p. ej. malla "Ø10 mm @ 20 cm"), devuelve el fallback.
 */
export function parseBarCount(proposal: string, fallback = 4): number {
  const match = proposal.trim().match(/^(\d+)\s*Ø/i);
  if (!match) {
    return fallback;
  }
  const count = Number(match[1]);
  if (!Number.isFinite(count) || count < 1) {
    return fallback;
  }
  return Math.min(Math.round(count), 16);
}
