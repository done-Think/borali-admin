export const numberFormatter = new Intl.NumberFormat('pt-BR')

export const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export const compactCurrencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

export const percentFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
})
