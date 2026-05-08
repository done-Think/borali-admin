export type RideCategory = 'economic' | 'comfort' | 'executive'

export type CategoryFareSettings = {
  enabled: boolean
  baseFare: number
  pricePerKm: number
  pricePerMinute: number
  minimumFare: number
  cancellationFee: number
  dynamicMultiplier: number
}

export type DriverSearchSettings = {
  initialRadiusKm: number
  maxRadiusKm: number
  expansionStepKm: number
  retryIntervalSeconds: number
  requestTimeoutSeconds: number
}

export type CityOperationsSettings = {
  serviceFeePercent: number
  allowScheduledRides: boolean
  allowCashPayment: boolean
  active: boolean
  riskAreasActive: boolean
  riskAreasAutomatic: boolean
}

export type CityMapStats = {
  activeDrivers: number
  passengersInRide: number
  waitingPassengers: number
  hotspot: string
  center: [number, number]
  markers: CityMapMarker[]
  alert: CityMapAlert
}

export type CityMapMarker = {
  id: string
  label: string
  type: 'drivers' | 'inRide' | 'waiting' | 'hotspot'
  count: number
  position: [number, number]
}

export type CityMapAlert = {
  rideId: string
  label: string
  reason: string
  position: [number, number]
}

export type CitySettings = {
  id: string
  name: string
  state: string
  updatedAt: string
  fares: Record<RideCategory, CategoryFareSettings>
  driverSearch: DriverSearchSettings
  operations: CityOperationsSettings
  mapStats: CityMapStats
}
