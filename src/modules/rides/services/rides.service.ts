import { api } from '@shared/services/api'
import { type ApiEnvelope, unwrap } from '@shared/services/apiResponse'
import { type ApiRide, mapActiveRide } from '@shared/services/adminMappers'

export async function listAdminActiveRides() {
  const payload = unwrap(await api.get<ApiRide[] | ApiEnvelope<ApiRide[]>>('/admin/rides/active'))
  return payload.map(mapActiveRide)
}
