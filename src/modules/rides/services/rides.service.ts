import { api } from '@shared/services/api'
import { type ApiEnvelope, unwrap } from '@shared/services/apiResponse'
import { type ApiRide, mapActiveRide } from '@shared/services/mappers'

type ActiveRidesResponse = { rides: ApiRide[]; total: number; page: number; limit: number }

export async function listAdminActiveRides() {
  const payload = unwrap(await api.get<ActiveRidesResponse | ApiEnvelope<ActiveRidesResponse>>('/admin/rides/active'))
  return payload.rides.map(mapActiveRide)
}
