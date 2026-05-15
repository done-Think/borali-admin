import { api } from '@shared/services/api'
import { type ApiEnvelope, unwrap } from '@shared/services/apiResponse'

type DevTokenResponse = {
  accessToken: string
}

export async function requestAdminDevToken(email: string) {
  return unwrap(await api.post<DevTokenResponse | ApiEnvelope<DevTokenResponse>>('/auth/dev-token', { email }))
}
