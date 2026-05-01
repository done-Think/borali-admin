import type { CategoryFareSettings, CitySettings, DriverSearchSettings, RideCategory } from '../types'

export function updateCitySettings(cities: CitySettings[], cityId: string, updater: (city: CitySettings) => CitySettings) {
  return cities.map((city) => (city.id === cityId ? updater(city) : city))
}

export function updateCategoryFare(
  city: CitySettings,
  category: RideCategory,
  field: keyof CategoryFareSettings,
  value: number | boolean,
): CitySettings {
  return {
    ...city,
    fares: {
      ...city.fares,
      [category]: {
        ...city.fares[category],
        [field]: value,
      },
    },
  }
}

export function updateDriverSearchField(
  city: CitySettings,
  field: keyof DriverSearchSettings,
  value: number,
): CitySettings {
  return {
    ...city,
    driverSearch: {
      ...city.driverSearch,
      [field]: value,
    },
  }
}

export function formatDecimal(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value)
}

export function sanitizeNumber(value: string, fallback = 0) {
  const parsed = Number(value.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : fallback
}
