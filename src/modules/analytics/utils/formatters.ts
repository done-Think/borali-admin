import { compactCurrencyFormatter, numberFormatter, percentFormatter } from '@shared/utils/formatters'

export { numberFormatter, percentFormatter }

export const currencyFormatter = compactCurrencyFormatter

export function formatChartValue(value: unknown) {
  return typeof value === 'number' ? numberFormatter.format(value) : String(value ?? '')
}

export function formatCurrencyValue(value: unknown) {
  return typeof value === 'number' ? currencyFormatter.format(value) : String(value ?? '')
}
