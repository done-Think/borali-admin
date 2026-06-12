import type { AnalyticsSnapshot, ChurnPoint, DemandLevel, DemandRegion, RatingDistribution, RevenuePoint, RideCategory, TimeRange } from '../types'

export const revenueByMonth: RevenuePoint[] = []
export const demandRegions: DemandRegion[] = []
export const churnByMonth: ChurnPoint[] = []
export const ratingDistribution: RatingDistribution[] = []
export const rideCategories: RideCategory[] = []

export const demandMeta: Record<DemandLevel, { label: string; color: string; background: string }> = {
  high: { label: 'Alta demanda', color: '#EF4444', background: 'rgba(239, 68, 68, 0.18)' },
  medium: { label: 'Média demanda', color: '#F59E0B', background: 'rgba(245, 158, 11, 0.18)' },
  low: { label: 'Baixa demanda', color: '#22C55E', background: 'rgba(34, 197, 94, 0.16)' },
}

export const timeRanges: Array<{ value: TimeRange; label: string }> = [
  { value: 'today', label: 'Hoje' },
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '3m', label: '3 meses' },
  { value: '12m', label: '12 meses' },
]

export const chartShortcuts = [
  { label: 'Atividade', href: '#analytics-activity' },
  { label: 'Corridas', href: '#analytics-rides-average' },
  { label: 'Receitas', href: '#analytics-revenue' },
  { label: 'Mapa de calor', href: '#analytics-heatmap' },
  { label: 'Churn', href: '#analytics-churn' },
  { label: 'Estrelas', href: '#analytics-ratings' },
  { label: 'Categorias', href: '#analytics-categories' },
]

const emptySnapshot: AnalyticsSnapshot = {
  activity: [],
  ridesAverage: [],
  ridesCompleted: 0,
  cancellationRate: 0,
  activeDrivers: 0,
  totalDrivers: 0,
  passengerRating: 0,
  driverRating: 0,
}

export const analyticsByRange: Record<TimeRange, AnalyticsSnapshot> = {
  today: emptySnapshot,
  '7d': emptySnapshot,
  '30d': emptySnapshot,
  '3m': emptySnapshot,
  '12m': emptySnapshot,
}
