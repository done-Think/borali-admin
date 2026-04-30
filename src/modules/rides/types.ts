import type { ActiveRide, RecentRide } from '@modules/dashboard/types'

export type RideTab = 'active' | 'history' | 'scheduled'
export type ActiveMapLimit = 5 | 10 | 30 | 'all'
export type ActiveRideStatus = 'A caminho' | 'Em corrida' | 'Chegando' | 'Aguardando embarque'
export type HistoryStatusFilter = 'all' | 'with-alert' | 'without-alert'

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
  status: 'Concluida'
  alert?: {
    activatedBy: 'Motorista' | 'Passageiro'
    reason: string
    resolvedAt: string
  }
  occurrences: Array<{
    id: string
    title: string
    description: string
    createdAt: string
    attachments: Array<{ name: string; type: string }>
  }>
  payment: {
    status: 'Aprovado' | 'Estornado' | 'Em analise'
    method: 'Cartao' | 'Pix' | 'Carteira' | 'Dinheiro'
    transactionId: string
  }
  feedback: Array<{
    author: 'Motorista' | 'Passageiro'
    type: 'Comentario' | 'Elogio'
    message: string
  }>
}

export type ScheduledRide = {
  id: string
  passenger: {
    name: string
    phone: string
    document: string
    rating: number
    ridesCount: number
  }
  origin: string
  destination: string
  estimatedValue: number
  scheduledFor: string
  requestedAt: string
  status: 'Programada' | 'Confirmada' | 'Pendente'
  category: string
  notes?: string
}
