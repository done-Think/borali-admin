export type PassengerFilter = 'all' | 'active' | 'pending' | 'blocked'
export type PassengerStatus = 'Ativo' | 'Inativo' | 'Pendente' | 'Bloqueado'
export type PassengerTier = 'Regular' | 'Prata' | 'Ouro' | 'VIP'
export type PassengerTierFilter = 'all' | PassengerTier
export type PassengerPayment = 'Cartão' | 'Pix' | 'Carteira' | 'Dinheiro'
export type PassengerSortKey = 'tier' | 'status' | 'rides' | 'rating' | 'payment' | 'monthlySpend'
export type SortDirection = 'asc' | 'desc'

export type Passenger = {
  id: string
  name: string
  initials: string
  phone: string
  tier: PassengerTier
  status: PassengerStatus
  rides: number
  rating: number
  payments: PassengerPayment[]
  monthlySpend: number
}

export type PassengerDetails = {
  photoLabel: string
  cpf: string
  email: string
  city: string
  joinedAt: string
  lastRide: string
  preferredRegion: string
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
    spend: number
    rating: number
    cancellationRate: number
  }
}

export type PassengerRide = PassengerDetails['rideHistory'][number]

export type PassengersLocationState = {
  selectedPassengerId?: string
  selectedPassengerName?: string
  selectedPassengerTab?: number
}

export type PassengerEditForm = Passenger & {
  cpf: string
  email: string
  city: string
  joinedAt: string
  lastRide: string
  preferredRegion: string
}
