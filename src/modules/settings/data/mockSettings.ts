import type { CityMapStats, CitySettings, RideCategory } from '../types'

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

const cityPresets: Array<{
  id: string
  name: string
  updatedAt: string
  base: number
  km: number
  active: boolean
  cash: boolean
  executive: boolean
  radius: number
  fee: number
  mapStats: CityMapStats
}> = [
  { id: 'piranguinho-mg', name: 'Piranguinho', updatedAt: '01/05/2026 às 09:20', base: 5.9, km: 2.15, active: true, cash: true, executive: true, radius: 14, fee: 12, mapStats: { activeDrivers: 18, passengersInRide: 9, waitingPassengers: 4, hotspot: 'Centro' } },
  { id: 'itajuba-mg', name: 'Itajubá', updatedAt: '30/04/2026 às 17:45', base: 5.5, km: 2.05, active: true, cash: true, executive: true, radius: 16, fee: 11, mapStats: { activeDrivers: 42, passengersInRide: 27, waitingPassengers: 11, hotspot: 'Av. BPS' } },
  { id: 'pirangucu-mg', name: 'Piranguçu', updatedAt: '29/04/2026 às 11:10', base: 4.9, km: 1.95, active: true, cash: false, executive: false, radius: 12, fee: 10, mapStats: { activeDrivers: 10, passengersInRide: 4, waitingPassengers: 3, hotspot: 'Praça Central' } },
  { id: 'santa-rita-do-sapucai-mg', name: 'Santa Rita do Sapucaí', updatedAt: '01/05/2026 às 08:35', base: 5.2, km: 2, active: true, cash: true, executive: true, radius: 15, fee: 11, mapStats: { activeDrivers: 26, passengersInRide: 14, waitingPassengers: 7, hotspot: 'Inatel' } },
  { id: 'pouso-alegre-mg', name: 'Pouso Alegre', updatedAt: '01/05/2026 às 10:05', base: 5.7, km: 2.12, active: true, cash: true, executive: true, radius: 18, fee: 12, mapStats: { activeDrivers: 58, passengersInRide: 36, waitingPassengers: 15, hotspot: 'Centro' } },
  { id: 'maria-da-fe-mg', name: 'Maria da Fé', updatedAt: '30/04/2026 às 16:20', base: 4.8, km: 1.9, active: true, cash: false, executive: false, radius: 11, fee: 9, mapStats: { activeDrivers: 8, passengersInRide: 3, waitingPassengers: 2, hotspot: 'Rodoviária' } },
  { id: 'brazopolis-mg', name: 'Brazópolis', updatedAt: '30/04/2026 às 15:55', base: 4.9, km: 1.92, active: false, cash: true, executive: false, radius: 12, fee: 9, mapStats: { activeDrivers: 6, passengersInRide: 1, waitingPassengers: 0, hotspot: 'Centro' } },
  { id: 'wenceslau-braz-mg', name: 'Wenceslau Braz', updatedAt: '29/04/2026 às 18:30', base: 4.6, km: 1.82, active: true, cash: false, executive: false, radius: 10, fee: 8, mapStats: { activeDrivers: 5, passengersInRide: 2, waitingPassengers: 1, hotspot: 'Trevo principal' } },
  { id: 'sao-jose-do-alegre-mg', name: 'São José do Alegre', updatedAt: '29/04/2026 às 14:15', base: 4.7, km: 1.86, active: true, cash: true, executive: false, radius: 10, fee: 8, mapStats: { activeDrivers: 7, passengersInRide: 3, waitingPassengers: 1, hotspot: 'Praça Matriz' } },
  { id: 'delfim-moreira-mg', name: 'Delfim Moreira', updatedAt: '28/04/2026 às 19:05', base: 5, km: 1.98, active: false, cash: false, executive: false, radius: 13, fee: 9, mapStats: { activeDrivers: 4, passengersInRide: 1, waitingPassengers: 0, hotspot: 'Centro histórico' } },
]

export const initialCitySettings: CitySettings[] = cityPresets.map((city, index) => ({
  id: city.id,
  name: city.name,
  state: 'MG',
  updatedAt: city.updatedAt,
  fares: {
    economic: {
      enabled: true,
      baseFare: city.base,
      pricePerKm: city.km,
      pricePerMinute: 0.36 + index * 0.01,
      minimumFare: Math.round(city.base * 2),
      cancellationFee: 6 + (index % 3),
      dynamicMultiplier: 1,
    },
    comfort: {
      enabled: true,
      baseFare: city.base + 1.7,
      pricePerKm: city.km + 0.55,
      pricePerMinute: 0.48 + index * 0.01,
      minimumFare: Math.round(city.base * 2.7),
      cancellationFee: 8 + (index % 3),
      dynamicMultiplier: 1.04 + (index % 4) * 0.01,
    },
    executive: {
      enabled: city.executive,
      baseFare: city.base + 6,
      pricePerKm: city.km + 1.8,
      pricePerMinute: 0.72 + index * 0.01,
      minimumFare: Math.round(city.base * 4.7),
      cancellationFee: 12 + (index % 4),
      dynamicMultiplier: 1.1 + (index % 4) * 0.01,
    },
  },
  driverSearch: {
    initialRadiusKm: index % 2 === 0 ? 3 : 4,
    maxRadiusKm: city.radius,
    expansionStepKm: index % 3 === 0 ? 1.5 : 2,
    retryIntervalSeconds: index % 2 === 0 ? 25 : 30,
    requestTimeoutSeconds: 80 + (index % 4) * 10,
  },
  operations: {
    serviceFeePercent: city.fee,
    allowScheduledRides: true,
    allowCashPayment: city.cash,
    active: city.active,
    riskAreasActive: false,
    riskAreasAutomatic: true,
  },
  mapStats: city.mapStats,
}))
