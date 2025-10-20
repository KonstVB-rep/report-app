export const parseFormattedNumber = (value: string): number => {
  if (!value) return 0
  const cleanedValue = value.replace(/\s+/g, "").replace(",", ".")
  return parseFloat(cleanedValue) || 0
}

export const formatNumber = (value: number): string => {
  if (Number.isNaN(value)) return "0,00"
  if (value <= 0) return "0,00"
  return value
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0")
}
