import { api } from '@shared/services/api'
import { type ApiEnvelope, unwrap } from '@shared/services/apiResponse'
import { type ApiRide, mapActiveRide } from '@shared/services/mappers'

type ActiveRidesResponse = { rides: ApiRide[]; total: number; page: number; limit: number }

export async function listAdminActiveRides() {
  const payload = unwrap(await api.get<ActiveRidesResponse | ApiEnvelope<ActiveRidesResponse>>('/admin/rides/active'))
  return payload.rides.map(mapActiveRide)
}

export interface RideChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  sentAt: string
}

export interface RideChatHistoryResponse {
  messages: RideChatMessage[]
  total: number
  limit: number
  offset: number
}

type ApiChatMessage = {
  id: string
  senderId: string
  content: string
  sentAt?: string
  createdAt?: string
  sender?: { name: string }
}

type ApiChatHistoryResponse = {
  messages: ApiChatMessage[]
  total: number
  limit: number
  offset: number
}

export async function fetchRideChatHistory(rideId: string, limit = 50, offset = 0): Promise<RideChatHistoryResponse> {
  const { data } = await api.get<ApiChatHistoryResponse | ApiEnvelope<ApiChatHistoryResponse>>(
    `/rides/${rideId}/chat?limit=${limit}&offset=${offset}`,
  )
  const payload = 'data' in data && typeof data.data === 'object' ? (data as ApiEnvelope<ApiChatHistoryResponse>).data : (data as ApiChatHistoryResponse)
  return {
    messages: (payload.messages ?? []).map((m) => ({
      id: m.id,
      senderId: m.senderId,
      senderName: m.sender?.name ?? 'Usuário',
      content: m.content,
      sentAt: m.sentAt ?? m.createdAt ?? new Date().toISOString(),
    })),
    total: payload.total ?? 0,
    limit: payload.limit ?? limit,
    offset: payload.offset ?? offset,
  }
}
