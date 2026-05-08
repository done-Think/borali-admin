import type { ReactElement } from 'react'

export type KpiCardId = 'active-rides' | 'online-drivers' | 'daily-revenue' | 'pending-approvals' | 'alert-rides'

export type KpiCard = {
  id: KpiCardId
  title: string
  value: string
  subtitle: string
  icon: ReactElement
  color: string
}

export type MapMarker = {
  id: string
  type: 'driver' | 'passenger'
  label: string
  position: [number, number]
}

export type HeatZone = {
  id: string
  label: string
  position: [number, number]
  calls: number
  intensity: number
}

export type ActivityType = 'ride' | 'payment' | 'driver' | 'alert' | 'done'

export type Activity = {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  details: Array<{ label: string; value: string }>
  summary: string
}

export type RideStatus = 'Concluida' | 'Cancelada' | 'Em andamento'

export type RecentRide = {
  id: string
  passenger: string
  driver: string
  route: string
  origin: string
  destination: string
  value: number
  status: RideStatus
  duration: string
  requestedAt: string
  path: [number, number][]
  driverPosition: [number, number]
  passengerPosition: [number, number]
}

export type ActiveRide = {
  id: string
  driver: string
  passenger: string
  origin: string
  destination: string
  value: number
  path: [number, number][]
  driverPosition: [number, number]
  passengerPosition: [number, number]
}

export type AlertRide = {
  id: string
  driver: string
  passenger: string
  origin: string
  destination: string
  value: number
  alertedBy: 'Motorista' | 'Passageiro'
  threatenedPerson: string
  alertReason: string
  alertTime: string
}

export type DriverAvailability = {
  id: string
  name: string
  phone: string
  city: string
  vehicle: string
  lastSeen: string
}

export type DriverApplication = {
  id: string
  name: string
  cpf: string
  phone: string
  email: string
  city: string
  vehicle: string
  plate: string
  category: string
  requestedAt: string
  expiresIn: string
}

export type RevenuePeriod = 'day' | 'week' | 'month'

export type RevenueComparison = {
  label: string
  currentLabel: string
  previousLabel: string
  data: Array<{ label: string; atual: number; anterior: number }>
}
