import type { AnalyticsSnapshot, ChurnPoint, DemandLevel, DemandRegion, RatingDistribution, RevenuePoint, RideCategory, TimeRange } from '../types'

export const revenueByMonth: RevenuePoint[] = [
  { label: 'Nov', revenue: 84200 },
  { label: 'Dez', revenue: 91800 },
  { label: 'Jan', revenue: 97600 },
  { label: 'Fev', revenue: 104400 },
  { label: 'Mar', revenue: 118900 },
  { label: 'Abr', revenue: 127300, current: true },
]

export const demandRegions: DemandRegion[] = [
  { name: 'Centro', demand: 'high', rides: 184, position: [-23.5505, -46.6333], x: 52, y: 48 },
  { name: 'Zona Norte', demand: 'medium', rides: 96, position: [-23.5027, -46.6245], x: 47, y: 24 },
  { name: 'Zona Sul', demand: 'high', rides: 152, position: [-23.6107, -46.6677], x: 58, y: 74 },
  { name: 'Zona Leste', demand: 'medium', rides: 108, position: [-23.5428, -46.4756], x: 74, y: 45 },
  { name: 'Zona Oeste', demand: 'low', rides: 54, position: [-23.5615, -46.7019], x: 27, y: 52 },
  { name: 'Aeroporto', demand: 'high', rides: 139, position: [-23.6261, -46.6566], x: 78, y: 70 },
  { name: 'Universidades', demand: 'low', rides: 43, position: [-23.5596, -46.7317], x: 35, y: 77 },
]

export const demandMeta: Record<DemandLevel, { label: string; color: string; background: string }> = {
  high: {
    label: 'Alta demanda',
    color: '#EF4444',
    background: 'rgba(239, 68, 68, 0.18)',
  },
  medium: {
    label: 'Média demanda',
    color: '#F59E0B',
    background: 'rgba(245, 158, 11, 0.18)',
  },
  low: {
    label: 'Baixa demanda',
    color: '#22C55E',
    background: 'rgba(34, 197, 94, 0.16)',
  },
}

export const churnByMonth: ChurnPoint[] = [
  { label: 'Nov', churn: 3.8 },
  { label: 'Dez', churn: 4.4 },
  { label: 'Jan', churn: 5.2 },
  { label: 'Fev', churn: 7.8, peak: true },
  { label: 'Mar', churn: 4.9 },
  { label: 'Abr', churn: 3.6 },
]

export const ratingDistribution: RatingDistribution[] = [
  { stars: 5, percentage: 62 },
  { stars: 4, percentage: 24 },
  { stars: 3, percentage: 9 },
  { stars: 2, percentage: 3 },
  { stars: 1, percentage: 2 },
]

export const rideCategories: RideCategory[] = [
  {
    name: 'Econômico',
    usage: 54,
    rides: 3128,
    averageTicket: 24,
    color: '#0ABEE9',
  },
  {
    name: 'Conforto',
    usage: 31,
    rides: 1794,
    averageTicket: 38,
    color: '#2DD4A0',
  },
  {
    name: 'Executivo',
    usage: 15,
    rides: 864,
    averageTicket: 62,
    color: '#6366F1',
  },
]

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

export const analyticsByRange: Record<TimeRange, AnalyticsSnapshot> = {
  today: {
    activity: [
      { label: '06h', usersEntering: 28, activeNow: 18 },
      { label: '09h', usersEntering: 64, activeNow: 43 },
      { label: '12h', usersEntering: 92, activeNow: 67 },
      { label: '15h', usersEntering: 81, activeNow: 58 },
      { label: '18h', usersEntering: 138, activeNow: 102 },
      { label: '21h', usersEntering: 116, activeNow: 84 },
    ],
    ridesAverage: [
      { label: '06h', ridesAverage: 11 },
      { label: '09h', ridesAverage: 24 },
      { label: '12h', ridesAverage: 36 },
      { label: '15h', ridesAverage: 31 },
      { label: '18h', ridesAverage: 52 },
      { label: '21h', ridesAverage: 44 },
    ],
    ridesCompleted: 284,
    cancellationRate: 6.8,
    activeDrivers: 96,
    totalDrivers: 154,
    passengerRating: 4.82,
    driverRating: 4.76,
  },
  '7d': {
    activity: [
      { label: 'Seg', usersEntering: 412, activeNow: 184 },
      { label: 'Ter', usersEntering: 438, activeNow: 201 },
      { label: 'Qua', usersEntering: 491, activeNow: 226 },
      { label: 'Qui', usersEntering: 466, activeNow: 219 },
      { label: 'Sex', usersEntering: 583, activeNow: 278 },
      { label: 'Sab', usersEntering: 628, activeNow: 294 },
      { label: 'Dom', usersEntering: 552, activeNow: 251 },
    ],
    ridesAverage: [
      { label: 'Seg', ridesAverage: 144 },
      { label: 'Ter', ridesAverage: 152 },
      { label: 'Qua', ridesAverage: 169 },
      { label: 'Qui', ridesAverage: 161 },
      { label: 'Sex', ridesAverage: 204 },
      { label: 'Sab', ridesAverage: 227 },
      { label: 'Dom', ridesAverage: 188 },
    ],
    ridesCompleted: 1245,
    cancellationRate: 5.9,
    activeDrivers: 132,
    totalDrivers: 176,
    passengerRating: 4.84,
    driverRating: 4.79,
  },
  '30d': {
    activity: [
      { label: 'Sem 1', usersEntering: 1860, activeNow: 612 },
      { label: 'Sem 2', usersEntering: 2048, activeNow: 684 },
      { label: 'Sem 3', usersEntering: 2196, activeNow: 731 },
      { label: 'Sem 4', usersEntering: 2384, activeNow: 803 },
      { label: 'Atual', usersEntering: 2462, activeNow: 842 },
    ],
    ridesAverage: [
      { label: 'Sem 1', ridesAverage: 156 },
      { label: 'Sem 2', ridesAverage: 171 },
      { label: 'Sem 3', ridesAverage: 183 },
      { label: 'Sem 4', ridesAverage: 198 },
      { label: 'Atual', ridesAverage: 207 },
    ],
    ridesCompleted: 5860,
    cancellationRate: 5.4,
    activeDrivers: 148,
    totalDrivers: 191,
    passengerRating: 4.86,
    driverRating: 4.81,
  },
  '3m': {
    activity: [
      { label: 'Jan', usersEntering: 6740, activeNow: 1820 },
      { label: 'Fev', usersEntering: 7218, activeNow: 2016 },
      { label: 'Mar', usersEntering: 7894, activeNow: 2241 },
      { label: 'Abr', usersEntering: 8426, activeNow: 2468 },
    ],
    ridesAverage: [
      { label: 'Jan', ridesAverage: 168 },
      { label: 'Fev', ridesAverage: 181 },
      { label: 'Mar', ridesAverage: 197 },
      { label: 'Abr', ridesAverage: 214 },
    ],
    ridesCompleted: 17420,
    cancellationRate: 5.1,
    activeDrivers: 173,
    totalDrivers: 214,
    passengerRating: 4.87,
    driverRating: 4.83,
  },
  '12m': {
    activity: [
      { label: 'Mai', usersEntering: 13200, activeNow: 3420 },
      { label: 'Jul', usersEntering: 15180, activeNow: 4018 },
      { label: 'Set', usersEntering: 17860, activeNow: 4682 },
      { label: 'Nov', usersEntering: 20340, activeNow: 5310 },
      { label: 'Jan', usersEntering: 22480, activeNow: 6024 },
      { label: 'Mar', usersEntering: 24920, activeNow: 6881 },
      { label: 'Abr', usersEntering: 26340, activeNow: 7215 },
    ],
    ridesAverage: [
      { label: 'Mai', ridesAverage: 124 },
      { label: 'Jul', ridesAverage: 139 },
      { label: 'Set', ridesAverage: 158 },
      { label: 'Nov', ridesAverage: 174 },
      { label: 'Jan', ridesAverage: 191 },
      { label: 'Mar', ridesAverage: 218 },
      { label: 'Abr', ridesAverage: 232 },
    ],
    ridesCompleted: 68240,
    cancellationRate: 4.8,
    activeDrivers: 206,
    totalDrivers: 246,
    passengerRating: 4.88,
    driverRating: 4.84,
  },
}
