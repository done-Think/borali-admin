export type DriverFilter = 'all' | 'online' | 'approved' | 'pending' | 'blocked'
export type DriverCategory = 'Conforto' | 'Econômico' | 'Executivo'
export type DriverCategoryFilter = 'all' | DriverCategory
export type DriverStatus = 'Online' | 'Offline' | 'Pendente' | 'Bloqueado'
export type DriverSubscription = 'Pro' | 'Básico' | 'Premium' | 'Trial'
export type DriverSortKey = 'category' | 'status' | 'rides' | 'rating' | 'subscription' | 'monthlyEarnings'
export type SortDirection = 'asc' | 'desc'

export type DriversLocationState = {
  selectedDriverId?: string
  selectedDriverName?: string
  selectedDriverTab?: number
}

export type Driver = {
  id: string
  name: string
  initials: string
  phone: string
  category: DriverCategory
  status: DriverStatus
  rides: number
  rating: number
  subscription: DriverSubscription
  monthlyEarnings: number
}

export type DriverDetails = {
  photoLabel: string
  cpf: string
  email: string
  city: string
  vehicle: string
  plate: string
  joinedAt: string
  lastOnline: string
  rideHistory: Array<{
    id: string
    date: string
    from: string
    to: string
    value: number
    status: string
  }>
  complaints: Array<{
    id: string
    date: string
    title: string
    status: string
  }>
  monthlyAverage: {
    rides: number
    earnings: number
    rating: number
    cancellationRate: number
  }
}

export type DriverRide = DriverDetails['rideHistory'][number]

export type DriverEditForm = Driver & {
  cpf: string
  email: string
  city: string
  vehicle: string
  plate: string
  joinedAt: string
  lastOnline: string
}

export type DriverRequest = DriverEditForm & {
  requestId: string
  requestedAt: string
  attachments: Array<{
    name: string
    type: string
  }>
}
