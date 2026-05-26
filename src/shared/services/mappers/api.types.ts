export type ApiUser = {
  id: string
  name: string
  email: string
  phone?: string | null
  passengerRating?: number
  totalRidesAsPassenger?: number
  cancelCount?: number
  createdAt: string
  ridesAsPassenger?: ApiRide[]
}

export type ApiDriver = {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
  isOnline: boolean
  lastSeenAt?: string | null
  rating: number | null
  totalRides: number
  createdAt: string
  user: ApiUser
  subscription?: {
    plan: 'BASIC' | 'PRO' | 'PREMIUM'
    status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED'
  } | null
  location?: {
    latitude: number
    longitude: number
  } | null
  vehicles?: Array<{
    brand: string
    model: string
    year: number
    plate: string
    category: 'ECONOMY' | 'COMFORT' | 'EXECUTIVE'
  }>
  rides?: ApiRide[]
  earnings?: Array<{ grossAmount: string | number }>
}

export type ApiRide = {
  id: string
  status: string
  originAddress: string
  originLat: number
  originLng: number
  destAddress: string
  destLat: number
  destLng: number
  estimatedFare?: string | number | null
  fare?: string | number | null
  paymentMethod?: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | null
  createdAt: string
  startedAt?: string | null
  completedAt?: string | null
  passenger?: ApiUser
  driver?: ApiDriver | null
  payment?: {
    amount: string | number
    method: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH'
  } | null
}
