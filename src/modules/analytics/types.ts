export type TimeRange = 'today' | '7d' | '30d' | '3m' | '12m'

export type ActivityPoint = {
  label: string
  usersEntering: number
  activeNow: number
}

export type RidePoint = {
  label: string
  ridesAverage: number
}

export type RevenuePoint = {
  label: string
  revenue: number
  current?: boolean
}

export type DemandLevel = 'low' | 'medium' | 'high'

export type DemandRegion = {
  name: string
  demand: DemandLevel
  rides: number
  x: number
  y: number
}

export type ChurnPoint = {
  label: string
  churn: number
  peak?: boolean
}

export type RatingDistribution = {
  stars: number
  percentage: number
}

export type RideCategory = {
  name: string
  usage: number
  rides: number
  averageTicket: number
  color: string
}

export type AnalyticsSnapshot = {
  activity: ActivityPoint[]
  ridesAverage: RidePoint[]
  ridesCompleted: number
  cancellationRate: number
  activeDrivers: number
  totalDrivers: number
  passengerRating: number
  driverRating: number
}
