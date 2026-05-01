export const numberFormatter = new Intl.NumberFormat('pt-BR')

export const percentFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
})

export const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

export function formatChartValue(value: unknown) {
  return typeof value === 'number' ? numberFormatter.format(value) : String(value ?? '')
}

export function formatCurrencyValue(value: unknown) {
  return typeof value === 'number' ? currencyFormatter.format(value) : String(value ?? '')
}
