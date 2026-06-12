import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import TimelineIcon from '@mui/icons-material/Timeline'
import type { ReactElement } from 'react'
import type {
  ActiveRide,
  Activity,
  ActivityType,
  AlertRide,
  DriverApplication,
  DriverAvailability,
  HeatZone,
  MapMarker,
  RecentRide,
  RevenueComparison,
  RevenuePeriod,
  RideStatus,
} from '../types'

export const activeRides: ActiveRide[] = []
export const alertRides: AlertRide[] = []
export const driversAcceptingRides: DriverAvailability[] = []
export const driversAppOpenOnly: DriverAvailability[] = []
export const driverApplications: DriverApplication[] = []
export const heatZones: HeatZone[] = []
export const mapMarkers: MapMarker[] = []
export const rideLine: [number, number][] = []
export const secondRideLine: [number, number][] = []
export const recentRides: RecentRide[] = []
export const ridesPerHour: { hour: string; rides: number }[] = []
export const activities: Activity[] = []

export const revenueComparisons: Record<RevenuePeriod, RevenueComparison> = {
  day: { label: 'Hoje vs ontem', currentLabel: 'Hoje', previousLabel: 'Ontem', data: [] },
  week: { label: 'Esta semana vs semana anterior', currentLabel: 'Esta semana', previousLabel: 'Semana anterior', data: [] },
  month: { label: 'Este mês vs mês anterior', currentLabel: 'Mês atual', previousLabel: 'Mês anterior', data: [] },
}

export const activityStyles: Record<ActivityType, { icon: ReactElement; color: string }> = {
  ride: { icon: <TimelineIcon fontSize="small" />, color: '#0ABEE9' },
  payment: { icon: <MonetizationOnIcon fontSize="small" />, color: '#F59E0B' },
  driver: { icon: <DirectionsCarIcon fontSize="small" />, color: '#2DD4A0' },
  alert: { icon: <ReportProblemIcon fontSize="small" />, color: '#EF4444' },
  done: { icon: <CheckCircleIcon fontSize="small" />, color: '#0ABEE9' },
}

export const statusStyles: Record<RideStatus, { label: string; color: string; background: string; border: string }> = {
  Concluida: { label: 'Concluida', color: '#15803D', background: '#DCFCE7', border: '#86EFAC' },
  Cancelada: { label: 'Cancelada', color: '#B91C1C', background: '#FEE2E2', border: '#FCA5A5' },
  'Em andamento': { label: 'Em andamento', color: '#B45309', background: '#FEF3C7', border: '#FCD34D' },
}
