import { activeRides as dashboardActiveRides, recentRides } from '@modules/dashboard/data/mockDashboardData'
import type { ActiveRideStatus, ActiveRideView, HistoryRide, WaitingRide, WaitingRideStatus } from '../types'

export const alertColor = '#EF4444'

export const statusConfig: Record<ActiveRideStatus, { color: string; label: string }> = {
  'A caminho': { color: '#2563EB', label: 'A caminho' },
  'Em corrida': { color: '#0ABEE9', label: 'Em corrida' },
  Chegando: { color: '#F59E0B', label: 'Chegando' },
  'Aguardando embarque': { color: '#8B5CF6', label: 'Aguardando embarque' },
}

export const waitingStatusConfig: Record<WaitingRideStatus, { color: string; label: string }> = {
  'Buscando motorista': { color: '#0ABEE9', label: 'Buscando motorista' },
  'Oferta enviada': { color: '#F59E0B', label: 'Oferta enviada' },
  'Alta demanda': { color: alertColor, label: 'Alta demanda' },
}

export const initialActiveRides: ActiveRideView[] = [
  ...dashboardActiveRides.map<ActiveRideView>((ride, index) => ({
    ...ride,
    status: (['Em corrida', 'A caminho', 'Chegando', 'Aguardando embarque', 'Em corrida'] as ActiveRideStatus[])[index] ?? 'Em corrida',
    startedAt: new Date(Date.now() - (index + 8) * 60_000).toISOString(),
    alert:
      index === 2
        ? {
            activatedBy: 'Passageiro',
            reason: 'Passageiro acionou alerta durante a corrida',
          }
        : undefined,
  })),
  {
    id: 'BRL-84219',
    driver: 'Marcos Vidal',
    passenger: 'Sofia Campos',
    origin: 'Bela Vista',
    destination: 'Hospital Sirio-Libanes',
    value: 26.9,
    path: [[-23.5585, -46.6462], [-23.5568, -46.6502], [-23.555, -46.6538], [-23.5572, -46.6567]],
    driverPosition: [-23.5568, -46.6502],
    passengerPosition: [-23.5572, -46.6567],
    status: 'A caminho',
    startedAt: new Date(Date.now() - 12 * 60_000).toISOString(),
  },
  {
    id: 'BRL-84220',
    driver: 'Nicolas Reis',
    passenger: 'Helena Duarte',
    origin: 'Republica',
    destination: 'Barra Funda',
    value: 39.6,
    path: [[-23.5443, -46.6427], [-23.5358, -46.6502], [-23.5288, -46.6617], [-23.5256, -46.6671]],
    driverPosition: [-23.5358, -46.6502],
    passengerPosition: [-23.5256, -46.6671],
    status: 'Em corrida',
    startedAt: new Date(Date.now() - 17 * 60_000).toISOString(),
    alert: {
      activatedBy: 'Motorista',
      reason: 'Motorista acionou alerta por comportamento agressivo',
    },
  },
  {
    id: 'BRL-84221',
    driver: 'Priscila Nunes',
    passenger: 'Eduardo Pires',
    origin: 'Paraiso',
    destination: 'Aclimacao',
    value: 22.4,
    path: [[-23.5745, -46.6409], [-23.5766, -46.6348], [-23.5722, -46.6296], [-23.5681, -46.6264]],
    driverPosition: [-23.5766, -46.6348],
    passengerPosition: [-23.5681, -46.6264],
    status: 'Chegando',
    startedAt: new Date(Date.now() - 6 * 60_000).toISOString(),
  },
]

export const historyRides: HistoryRide[] = recentRides.map((ride, index) => ({
  ...ride,
  completedAt: new Date(Date.now() - index * 86_400_000 - (index + 1) * 18 * 60_000).toISOString(),
}))

export const initialWaitingRides: WaitingRide[] = [
  {
    id: 'BRL-84231',
    passenger: 'Camila Torres',
    origin: 'Rua Oscar Freire, 620',
    destination: 'Shopping Iguatemi',
    estimatedValue: 31.4,
    requestedAt: new Date(Date.now() - 4 * 60_000).toISOString(),
    status: 'Buscando motorista',
    nearbyDrivers: 6,
    category: 'Conforto',
  },
  {
    id: 'BRL-84232',
    passenger: 'Mateus Ferreira',
    origin: 'Metro Vila Mariana',
    destination: 'Av. Brigadeiro Faria Lima',
    estimatedValue: 44.9,
    requestedAt: new Date(Date.now() - 7 * 60_000).toISOString(),
    status: 'Oferta enviada',
    nearbyDrivers: 3,
    category: 'Economico',
  },
  {
    id: 'BRL-84233',
    passenger: 'Renata Assis',
    origin: 'Barra Funda',
    destination: 'Vila Olimpia',
    estimatedValue: 58.2,
    requestedAt: new Date(Date.now() - 11 * 60_000).toISOString(),
    status: 'Alta demanda',
    nearbyDrivers: 1,
    category: 'Executivo',
  },
]
