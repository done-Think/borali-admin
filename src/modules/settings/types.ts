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
}

export type CitySettings = {
  id: string
  name: string
  state: string
  updatedAt: string
  fares: Record<RideCategory, CategoryFareSettings>
  driverSearch: DriverSearchSettings
  operations: CityOperationsSettings
}
