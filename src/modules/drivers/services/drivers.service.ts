import { api } from '@shared/services/api'
import { type ApiEnvelope, listAllPages, unwrap } from '@shared/services/apiResponse'
import {
  type ApiDriver,
  mapDriver,
  mapDriverDetails,
} from '@shared/services/mappers'
import type { Driver, DriverDetails } from '../types'

type PaginatedDrivers = {
  drivers: ApiDriver[]
  total: number
  page: number
  limit: number
}

export type AdminDriversPayload = {
  rows: Driver[]
  details: Record<string, Partial<DriverDetails>>
  total: number
}

const ADMIN_DRIVERS_PAGE_SIZE = 50

function mergeDriverPayloads(payloads: AdminDriversPayload[]): AdminDriversPayload {
  return {
    rows: payloads.flatMap((payload) => payload.rows),
    details: Object.assign({}, ...payloads.map((payload) => payload.details)) as Record<string, Partial<DriverDetails>>,
    total: payloads[0]?.total ?? 0,
  }
}

export async function listAdminDrivers(page = 1, limit = ADMIN_DRIVERS_PAGE_SIZE): Promise<AdminDriversPayload> {
  const payload = unwrap(await api.get<PaginatedDrivers | ApiEnvelope<PaginatedDrivers>>('/admin/drivers', { params: { page, limit } }))
  return {
    rows: payload.drivers.map(mapDriver),
    details: Object.fromEntries(payload.drivers.map((driver) => [driver.id, mapDriverDetails(driver)])),
    total: payload.total,
  }
}

export async function listAllAdminDrivers(): Promise<AdminDriversPayload> {
  return mergeDriverPayloads(await listAllPages(listAdminDrivers, ADMIN_DRIVERS_PAGE_SIZE))
}

export async function suspendAdminDriver(driverId: string, reason = 'Bloqueio realizado pelo painel administrativo') {
  await api.patch(`/admin/drivers/${driverId}/suspend`, { reason })
}

export async function approveAdminDriver(driverId: string) {
  await api.patch(`/admin/drivers/${driverId}/review`, { status: 'APPROVED' })
}
