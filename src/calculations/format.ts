/** Formateo numérico compartido (es-EC). */
export function formatNumber(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("es-EC", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}
