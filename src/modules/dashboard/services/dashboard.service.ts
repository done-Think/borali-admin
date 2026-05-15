import { api } from '@shared/services/api'
import { type ApiEnvelope, unwrap } from '@shared/services/apiResponse'

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

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  return unwrap(await api.get<AdminDashboardMetrics | ApiEnvelope<AdminDashboardMetrics>>('/analytics/dashboard'))
}
