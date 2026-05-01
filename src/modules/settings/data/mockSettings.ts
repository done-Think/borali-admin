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
  { id: 'piranguinho-mg', name: 'Piranguinho', updatedAt: '01/05/2026 às 09:20', base: 5.9, km: 2.15, active: true, cash: true, executive: true, radius: 14, fee: 12, mapStats: createMapStats([-22.4025, -45.5328], 18, 9, 4, 'Centro') },
  { id: 'itajuba-mg', name: 'Itajubá', updatedAt: '30/04/2026 às 17:45', base: 5.5, km: 2.05, active: true, cash: true, executive: true, radius: 16, fee: 11, mapStats: createMapStats([-22.4256, -45.4528], 42, 27, 11, 'Av. BPS') },
  { id: 'pirangucu-mg', name: 'Piranguçu', updatedAt: '29/04/2026 às 11:10', base: 4.9, km: 1.95, active: true, cash: false, executive: false, radius: 12, fee: 10, mapStats: createMapStats([-22.5245, -45.4944], 10, 4, 3, 'Praça Central') },
  { id: 'santa-rita-do-sapucai-mg', name: 'Santa Rita do Sapucaí', updatedAt: '01/05/2026 às 08:35', base: 5.2, km: 2, active: true, cash: true, executive: true, radius: 15, fee: 11, mapStats: createMapStats([-22.2529, -45.7033], 26, 14, 7, 'Inatel') },
  { id: 'pouso-alegre-mg', name: 'Pouso Alegre', updatedAt: '01/05/2026 às 10:05', base: 5.7, km: 2.12, active: true, cash: true, executive: true, radius: 18, fee: 12, mapStats: createMapStats([-22.227, -45.938], 58, 36, 15, 'Centro') },
  { id: 'maria-da-fe-mg', name: 'Maria da Fé', updatedAt: '30/04/2026 às 16:20', base: 4.8, km: 1.9, active: true, cash: false, executive: false, radius: 11, fee: 9, mapStats: createMapStats([-22.3047, -45.3789], 8, 3, 2, 'Rodoviária') },
  { id: 'brazopolis-mg', name: 'Brazópolis', updatedAt: '30/04/2026 às 15:55', base: 4.9, km: 1.92, active: false, cash: true, executive: false, radius: 12, fee: 9, mapStats: createMapStats([-22.4747, -45.6166], 6, 1, 0, 'Centro') },
  { id: 'wenceslau-braz-mg', name: 'Wenceslau Braz', updatedAt: '29/04/2026 às 18:30', base: 4.6, km: 1.82, active: true, cash: false, executive: false, radius: 10, fee: 8, mapStats: createMapStats([-22.5342, -45.3638], 5, 2, 1, 'Trevo principal') },
  { id: 'sao-jose-do-alegre-mg', name: 'São José do Alegre', updatedAt: '29/04/2026 às 14:15', base: 4.7, km: 1.86, active: true, cash: true, executive: false, radius: 10, fee: 8, mapStats: createMapStats([-22.3291, -45.5263], 7, 3, 1, 'Praça Matriz') },
  { id: 'delfim-moreira-mg', name: 'Delfim Moreira', updatedAt: '28/04/2026 às 19:05', base: 5, km: 1.98, active: false, cash: false, executive: false, radius: 13, fee: 9, mapStats: createMapStats([-22.5097, -45.2798], 4, 1, 0, 'Centro histórico') },
]

function createMapStats(center: [number, number], activeDrivers: number, passengersInRide: number, waitingPassengers: number, hotspot: string): CityMapStats {
  const [lat, lng] = center

  return {
    activeDrivers,
    passengersInRide,
    waitingPassengers,
    hotspot,
    center,
    markers: [
      {
        id: 'drivers',
        label: 'Motoristas ativos',
        type: 'drivers',
        count: activeDrivers,
        position: [lat + 0.006, lng - 0.007],
      },
      {
        id: 'in-ride',
        label: 'Passageiros em corrida',
        type: 'inRide',
        count: passengersInRide,
        position: [lat - 0.004, lng + 0.008],
      },
      {
        id: 'waiting',
        label: 'Passageiros aguardando',
        type: 'waiting',
        count: waitingPassengers,
        position: [lat - 0.007, lng - 0.004],
      },
      {
        id: 'hotspot',
        label: hotspot,
        type: 'hotspot',
        count: activeDrivers + passengersInRide + waitingPassengers,
        position: center,
      },
    ],
  }
}

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
