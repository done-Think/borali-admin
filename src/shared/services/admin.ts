import { api } from './api'
import type { Driver, DriverDetails } from '@modules/drivers/types'
import type { Passenger, PassengerDetails } from '@modules/passengers/types'
import {
  type ApiDriver,
  type ApiRide,
  type ApiUser,
  mapActiveRide,
  mapDriver,
  mapDriverDetails,
  mapPassenger,
  mapPassengerDetails,
} from './adminMappers'

type ApiEnvelope<T> = {
  data: T
  timestamp: string
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

export async function listAdminActiveRides() {
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
