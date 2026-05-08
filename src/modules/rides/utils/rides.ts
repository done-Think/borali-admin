import L from 'leaflet'
import { alpha } from '@mui/material/styles'
import { alertColor, statusConfig } from '../data/mockRides'
import type { ActiveRideStatus, ActiveRideView } from '../types'

export function normalizeRide(ride: ActiveRideView): ActiveRideView {
  return {
    ...ride,
    status: ride.status ?? 'Em corrida',
    startedAt: ride.startedAt ?? new Date().toISOString(),
  }
}

export function prioritizeActiveRides(rides: ActiveRideView[], selectedRideId: string) {
  return [...rides].sort((firstRide, secondRide) => {
    if (firstRide.id === selectedRideId) return -1
    if (secondRide.id === selectedRideId) return 1
    if (Boolean(firstRide.alert) !== Boolean(secondRide.alert)) return firstRide.alert ? -1 : 1
    return 0
  })
}

export function getElapsedMinutes(startedAt: string) {
  const elapsed = Date.now() - new Date(startedAt).getTime()
  return Math.max(1, Math.round(elapsed / 60_000))
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function createRideStatusIcon(status: ActiveRideStatus, selected = false, alert = false) {
  const color = alert ? alertColor : statusConfig[status].color
  const size = selected || alert ? 24 : 18
  const anchor = size / 2

  return L.divIcon({
    className: '',
    html: `<span style="
      width: ${size}px;
      height: ${size}px;
      display: block;
      border-radius: 999px;
      background: ${color};
      border: 3px solid #ffffff;
      box-shadow: 0 0 0 ${selected || alert ? 9 : 6}px ${alpha(color, selected || alert ? 0.34 : 0.26)}, 0 12px 24px rgba(0, 0, 0, 0.28);
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
  })
}
