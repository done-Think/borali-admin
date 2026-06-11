import { api } from '@shared/services/api'
import type { PendingDriver } from '../types'

export async function fetchPendingDrivers(): Promise<PendingDriver[]> {
  const res = await api.get('/admin/drivers', { params: { status: 'PENDING' } })
  let payload = res.data

  // Desempacota envelope { data: ..., timestamp: ... } se existir
  if (payload && typeof payload === 'object' && 'timestamp' in payload && 'data' in payload) {
    payload = payload.data
  }

  // A API retorna { drivers: [...], total, page, limit }
  if (payload && typeof payload === 'object' && Array.isArray(payload.drivers)) {
    return payload.drivers as PendingDriver[]
  }

  // Fallback: array direto
  return Array.isArray(payload) ? (payload as PendingDriver[]) : []
}

export async function approveDriver(driverId: string): Promise<void> {
  await api.patch(`/admin/drivers/${driverId}/review`, { status: 'APPROVED' })
}

export async function rejectDriver(driverId: string, reason: string): Promise<void> {
  await api.patch(`/admin/drivers/${driverId}/review`, { status: 'REJECTED', reason })
}

export async function reviewDocument(docId: string, status: 'APPROVED' | 'REJECTED', notes?: string): Promise<void> {
  await api.patch(`/admin/documents/${docId}/review`, { status, notes })
}
