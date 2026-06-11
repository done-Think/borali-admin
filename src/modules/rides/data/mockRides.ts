import type { ActiveRideStatus, ActiveRideView, HistoryRide, ScheduledRide } from '../types'

export const alertColor = '#EF4444'

export const statusConfig: Record<ActiveRideStatus, { color: string; label: string }> = {
  'A caminho': { color: '#2563EB', label: 'A caminho' },
  'Em corrida': { color: '#0ABEE9', label: 'Em corrida' },
  Chegando: { color: '#F59E0B', label: 'Chegando' },
  'Aguardando embarque': { color: '#8B5CF6', label: 'Aguardando embarque' },
}

export const scheduledStatusConfig: Record<ScheduledRide['status'], { color: string; label: string }> = {
  Programada: { color: '#0ABEE9', label: 'Programada' },
  Confirmada: { color: '#2DD4A0', label: 'Confirmada' },
  Pendente: { color: '#F59E0B', label: 'Pendente' },
}

export const initialActiveRides: ActiveRideView[] = []
export const historyRides: HistoryRide[] = []
export const initialScheduledRides: ScheduledRide[] = []
