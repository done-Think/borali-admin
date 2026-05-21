import type { ApiRide } from './api.types'

export function toNumber(value: string | number | null | undefined) {
  if (value == null) return 0
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatDate(value?: string | null) {
  if (!value) return 'Sem registro'
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function mapRideStatus(status: string) {
  if (status === 'COMPLETED') return 'Finalizada'
  if (status === 'CANCELLED') return 'Cancelada'
  return 'Em andamento'
}

export function rideCancellationRate(rides: ApiRide[]) {
  if (rides.length === 0) return 0
  const cancelledRides = rides.filter((ride) => ride.status === 'CANCELLED').length
  return (cancelledRides / rides.length) * 100
}
