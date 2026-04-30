import type { ActiveRide, RecentRide, RideStatus } from '@modules/dashboard/types'

export type RideTab = 'active' | 'history' | 'waiting'
export type ActiveMapLimit = 5 | 10 | 30 | 'all'
export type ActiveRideStatus = 'A caminho' | 'Em corrida' | 'Chegando' | 'Aguardando embarque'
export type HistoryStatusFilter = 'all' | RideStatus
export type WaitingRideStatus = 'Buscando motorista' | 'Oferta enviada' | 'Alta demanda'

export type ActiveRideView = ActiveRide & {
  status: ActiveRideStatus
  startedAt: string
  alert?: {
    activatedBy: 'Motorista' | 'Passageiro'
    reason: string
  }
}

export type HistoryRide = RecentRide & {
  completedAt: string
}

export type WaitingRide = {
  id: string
  passenger: string
  origin: string
  destination: string
  estimatedValue: number
  requestedAt: string
  status: WaitingRideStatus
  nearbyDrivers: number
  category: string
}
