import { api } from '@shared/services/api'
import { type ApiEnvelope, listAllPages, unwrap } from '@shared/services/apiResponse'
import {
  type ApiUser,
  mapPassenger,
  mapPassengerDetails,
} from '@shared/services/adminMappers'
import type { Passenger, PassengerDetails } from '../types'

type PaginatedPassengers = {
  users: ApiUser[]
  total: number
  page: number
  limit: number
}

export type AdminPassengersPayload = {
  rows: Passenger[]
  details: Record<string, Partial<PassengerDetails>>
  total: number
}

const ADMIN_PASSENGERS_PAGE_SIZE = 50

function mergePassengerPayloads(payloads: AdminPassengersPayload[]): AdminPassengersPayload {
  return {
    rows: payloads.flatMap((payload) => payload.rows),
    details: Object.assign({}, ...payloads.map((payload) => payload.details)) as Record<string, Partial<PassengerDetails>>,
    total: payloads[0]?.total ?? 0,
  }
}

export async function listAdminPassengers(page = 1, limit = ADMIN_PASSENGERS_PAGE_SIZE): Promise<AdminPassengersPayload> {
  const payload = unwrap(await api.get<PaginatedPassengers | ApiEnvelope<PaginatedPassengers>>('/admin/passengers', { params: { page, limit } }))
  return {
    rows: payload.users.map(mapPassenger),
    details: Object.fromEntries(payload.users.map((user) => [user.id, mapPassengerDetails(user)])),
    total: payload.total,
  }
}

export async function listAllAdminPassengers(): Promise<AdminPassengersPayload> {
  return mergePassengerPayloads(await listAllPages(listAdminPassengers, ADMIN_PASSENGERS_PAGE_SIZE))
}
