import { api } from './api'
import type { Driver, DriverCategory, DriverDetails, DriverStatus, DriverSubscription } from '@modules/drivers/types'
import type { Passenger, PassengerDetails, PassengerPayment, PassengerStatus, PassengerTier } from '@modules/passengers/types'
import type { ActiveRideView } from '@modules/rides/types'

type ApiEnvelope<T> = {
  data: T
  timestamp: string
}

type ApiUser = {
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

type ApiDriver = {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
  isOnline: boolean
  lastSeenAt?: string | null
  rating: number
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

type ApiRide = {
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

type PaginatedDrivers = {
  drivers: ApiDriver[]
  total: number
  page: number
  limit: number
}

type PaginatedPassengers = {
  users: ApiUser[]
  total: number
  page: number
  limit: number
}

export type AdminDriversPayload = {
  rows: Driver[]
  details: Record<string, Partial<DriverDetails>>
  total: number
}

export type AdminPassengersPayload = {
  rows: Passenger[]
  details: Record<string, Partial<PassengerDetails>>
  total: number
}

export type AdminDashboardMetrics = {
  rides: {
    completed: number
    requested: number
    cancelled: number
  }
  activeDrivers: number
  revenue: {
    today: number
    month: number
  }
}

const ADMIN_USERS_PAGE_SIZE = 50

function mergeDriverPayloads(payloads: AdminDriversPayload[]): AdminDriversPayload {
  return {
    rows: payloads.flatMap((payload) => payload.rows),
    details: Object.assign({}, ...payloads.map((payload) => payload.details)) as Record<string, Partial<DriverDetails>>,
    total: payloads[0]?.total ?? 0,
  }
}

function mergePassengerPayloads(payloads: AdminPassengersPayload[]): AdminPassengersPayload {
  return {
    rows: payloads.flatMap((payload) => payload.rows),
    details: Object.assign({}, ...payloads.map((payload) => payload.details)) as Record<string, Partial<PassengerDetails>>,
    total: payloads[0]?.total ?? 0,
  }
}

async function listAllPages<T extends { total: number }>(
  fetchPage: (page: number, limit: number) => Promise<T>,
): Promise<T[]> {
  const firstPage = await fetchPage(1, ADMIN_USERS_PAGE_SIZE)
  const pageCount = Math.ceil(firstPage.total / ADMIN_USERS_PAGE_SIZE)

  if (pageCount <= 1) return [firstPage]

  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) => fetchPage(index + 2, ADMIN_USERS_PAGE_SIZE)),
  )

  return [firstPage, ...remainingPages]
}

function isApiEnvelope<T>(payload: ApiEnvelope<T> | T): payload is ApiEnvelope<T> {
  return Boolean(
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    'timestamp' in payload &&
    typeof payload.timestamp === 'string',
  )
}

function unwrap<T>(response: { data: ApiEnvelope<T> | T }): T {
  const payload = response.data
  return isApiEnvelope(payload) ? payload.data : payload
}

function toNumber(value: string | number | null | undefined) {
  if (value == null) return 0
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatDate(value?: string | null) {
  if (!value) return 'Sem registro'
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function mapDriverCategory(category?: string): DriverCategory {
  if (category === 'COMFORT') return 'Conforto'
  if (category === 'EXECUTIVE') return 'Executivo'
  return 'Econômico'
}

function mapDriverStatus(driver: ApiDriver): DriverStatus {
  if (driver.status === 'SUSPENDED' || driver.status === 'REJECTED') return 'Bloqueado'
  if (driver.status === 'PENDING') return 'Pendente'
  return driver.isOnline ? 'Online' : 'Offline'
}

function mapSubscription(driver: ApiDriver): DriverSubscription {
  if (driver.subscription?.status === 'TRIAL') return 'Trial'
  if (driver.subscription?.plan === 'PREMIUM') return 'Premium'
  if (driver.subscription?.plan === 'PRO') return 'Pro'
  return 'Básico'
}

function mapPayment(method?: string | null): PassengerPayment {
  if (method === 'PIX') return 'Pix'
  if (method === 'CASH') return 'Dinheiro'
  if (method === 'CREDIT_CARD' || method === 'DEBIT_CARD') return 'Cartão'
  return 'Pix'
}

function mapRideStatus(status: string) {
  if (status === 'COMPLETED') return 'Finalizada'
  if (status === 'CANCELLED') return 'Cancelada'
  return 'Em andamento'
}

function vehicleLabel(driver: ApiDriver) {
  const vehicle = driver.vehicles?.[0]
  if (!vehicle) return 'Veículo não informado'
  return `${vehicle.brand} ${vehicle.model} ${vehicle.year}`
}

function driverMonthlyEarnings(driver: ApiDriver) {
  if (driver.earnings?.length) {
    return driver.earnings.reduce((total, earning) => total + toNumber(earning.grossAmount), 0)
  }

  return (driver.rides ?? []).reduce((total, ride) => total + toNumber(ride.payment?.amount ?? ride.fare), 0)
}

function mapDriver(driver: ApiDriver): Driver {
  const vehicle = driver.vehicles?.[0]

  return {
    id: driver.id,
    name: driver.user.name,
    initials: initials(driver.user.name),
    phone: driver.user.phone ?? 'Sem telefone',
    category: mapDriverCategory(vehicle?.category),
    status: mapDriverStatus(driver),
    rides: driver.totalRides,
    rating: driver.rating,
    subscription: mapSubscription(driver),
    monthlyEarnings: driverMonthlyEarnings(driver),
  }
}

function mapDriverDetails(driver: ApiDriver): Partial<DriverDetails> {
  const rides = driver.rides ?? []

  return {
    photoLabel: `Foto do motorista ${driver.user.name}`,
    cpf: 'Não informado',
    email: driver.user.email,
    city: 'Não informado',
    vehicle: vehicleLabel(driver),
    plate: driver.vehicles?.[0]?.plate ?? 'Não informado',
    joinedAt: formatDate(driver.createdAt),
    lastOnline: driver.isOnline ? 'Agora' : formatDate(driver.lastSeenAt),
    rideHistory: rides.map((ride) => ({
      id: ride.id,
      date: formatDate(ride.completedAt ?? ride.createdAt),
      from: ride.originAddress,
      to: ride.destAddress,
      value: toNumber(ride.payment?.amount ?? ride.fare ?? ride.estimatedFare),
      status: mapRideStatus(ride.status),
    })),
    monthlyAverage: {
      rides: rides.length,
      earnings: driverMonthlyEarnings(driver),
      rating: driver.rating,
      cancellationRate: 0,
    },
  }
}

function mapPassengerTier(totalRides: number): PassengerTier {
  if (totalRides >= 200) return 'VIP'
  if (totalRides >= 100) return 'Ouro'
  if (totalRides >= 50) return 'Prata'
  return 'Regular'
}

function mapPassengerStatus(user: ApiUser): PassengerStatus {
  return user.cancelCount && user.cancelCount >= 10 ? 'Bloqueado' : 'Ativo'
}

function passengerMonthlySpend(user: ApiUser) {
  return (user.ridesAsPassenger ?? []).reduce((total, ride) => {
    return total + toNumber(ride.payment?.amount ?? ride.fare ?? ride.estimatedFare)
  }, 0)
}

function passengerCancellationRate(user: ApiUser) {
  const rides = user.ridesAsPassenger ?? []
  if (rides.length === 0) {
    return user.totalRidesAsPassenger && user.totalRidesAsPassenger > 0 ? null : 0
  }

  const cancelledRides = rides.filter((ride) => ride.status === 'CANCELLED').length
  return (cancelledRides / rides.length) * 100
}

function mapPassenger(user: ApiUser): Passenger {
  const payments = Array.from(new Set((user.ridesAsPassenger ?? []).map((ride) => mapPayment(ride.payment?.method ?? ride.paymentMethod))))

  return {
    id: user.id,
    name: user.name,
    initials: initials(user.name),
    phone: user.phone ?? 'Sem telefone',
    tier: mapPassengerTier(user.totalRidesAsPassenger ?? 0),
    status: mapPassengerStatus(user),
    rides: user.totalRidesAsPassenger ?? 0,
    rating: user.passengerRating ?? 5,
    payments: payments.length ? payments : ['Pix'],
    monthlySpend: passengerMonthlySpend(user),
  }
}

function mapPassengerDetails(user: ApiUser): Partial<PassengerDetails> {
  const rides = user.ridesAsPassenger ?? []

  return {
    photoLabel: `Foto do passageiro ${user.name}`,
    cpf: 'Não informado',
    email: user.email,
    city: 'Não informado',
    joinedAt: formatDate(user.createdAt),
    lastRide: rides[0] ? formatDate(rides[0].createdAt) : 'Sem corrida recente',
    preferredRegion: 'Não informado',
    rideHistory: rides.map((ride) => ({
      id: ride.id,
      date: formatDate(ride.completedAt ?? ride.createdAt),
      from: ride.originAddress,
      to: ride.destAddress,
      value: toNumber(ride.payment?.amount ?? ride.fare ?? ride.estimatedFare),
      status: mapRideStatus(ride.status),
    })),
    monthlyAverage: {
      rides: rides.length,
      spend: passengerMonthlySpend(user),
      rating: user.passengerRating ?? 5,
      cancellationRate: passengerCancellationRate(user),
    },
  }
}

function mapActiveRideStatus(status: string): ActiveRideView['status'] {
  if (status === 'IN_PROGRESS') return 'Em corrida'
  if (status === 'DRIVER_ARRIVING') return 'Chegando'
  if (status === 'ACCEPTED') return 'A caminho'
  return 'Aguardando embarque'
}

function mapActiveRide(ride: ApiRide): ActiveRideView {
  const driverPosition: [number, number] = ride.driver?.location
    ? [ride.driver.location.latitude, ride.driver.location.longitude]
    : [ride.originLat, ride.originLng]

  return {
    id: ride.id,
    driver: ride.driver?.user.name ?? 'Sem motorista',
    passenger: ride.passenger?.name ?? 'Passageiro',
    origin: ride.originAddress,
    destination: ride.destAddress,
    value: toNumber(ride.fare ?? ride.estimatedFare),
    path: [
      [ride.originLat, ride.originLng],
      [ride.destLat, ride.destLng],
    ],
    driverPosition,
    passengerPosition: [ride.originLat, ride.originLng],
    status: mapActiveRideStatus(ride.status),
    startedAt: ride.startedAt ?? ride.createdAt,
  }
}

export async function listAdminDrivers(page = 1, limit = ADMIN_USERS_PAGE_SIZE): Promise<AdminDriversPayload> {
  const payload = unwrap(await api.get<PaginatedDrivers | ApiEnvelope<PaginatedDrivers>>('/admin/drivers', { params: { page, limit } }))
  return {
    rows: payload.drivers.map(mapDriver),
    details: Object.fromEntries(payload.drivers.map((driver) => [driver.id, mapDriverDetails(driver)])),
    total: payload.total,
  }
}

export async function listAdminPassengers(page = 1, limit = ADMIN_USERS_PAGE_SIZE): Promise<AdminPassengersPayload> {
  const payload = unwrap(await api.get<PaginatedPassengers | ApiEnvelope<PaginatedPassengers>>('/admin/passengers', { params: { page, limit } }))
  return {
    rows: payload.users.map(mapPassenger),
    details: Object.fromEntries(payload.users.map((user) => [user.id, mapPassengerDetails(user)])),
    total: payload.total,
  }
}

export async function listAllAdminDrivers(): Promise<AdminDriversPayload> {
  return mergeDriverPayloads(await listAllPages(listAdminDrivers))
}

export async function listAllAdminPassengers(): Promise<AdminPassengersPayload> {
  return mergePassengerPayloads(await listAllPages(listAdminPassengers))
}

export async function listAdminActiveRides(): Promise<ActiveRideView[]> {
  const payload = unwrap(await api.get<ApiRide[] | ApiEnvelope<ApiRide[]>>('/admin/rides/active'))
  return payload.map(mapActiveRide)
}

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  return unwrap(await api.get<AdminDashboardMetrics | ApiEnvelope<AdminDashboardMetrics>>('/analytics/dashboard'))
}

export async function suspendAdminDriver(driverId: string, reason = 'Bloqueio realizado pelo painel administrativo') {
  await api.patch(`/admin/drivers/${driverId}/suspend`, { reason })
}

export async function approveAdminDriver(driverId: string) {
  await api.patch(`/admin/drivers/${driverId}/review`, { status: 'APPROVED' })
}
