import type { CitySettings, RideCategory } from '../types'

export const rideCategoryLabels: Record<RideCategory, string> = {
  economic: 'Econômico',
  comfort: 'Conforto',
  executive: 'Executivo',
}

export const rideCategoryDescriptions: Record<RideCategory, string> = {
  economic: 'Preço mais acessível para maior volume de corridas.',
  comfort: 'Categoria intermediária com veículos melhor avaliados.',
  executive: 'Categoria premium para viagens corporativas ou alta exigência.',
}

export const initialCitySettings: CitySettings[] = []
