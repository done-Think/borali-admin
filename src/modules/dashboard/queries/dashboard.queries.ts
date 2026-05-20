import { useQuery } from '@tanstack/react-query'
import { listAdminActiveRides } from '@modules/rides/services'
import { getAdminDashboardMetrics } from '../services'

export const dashboardQueryKeys = {
  access: ['admin', 'dashboard'] as const,
}

export function useGetDashboardAccess() {
  return useQuery({
    queryKey: dashboardQueryKeys.access,
    queryFn: async () => {
      try {
        const [metrics, activeRides] = await Promise.all([getAdminDashboardMetrics(), listAdminActiveRides()])
        return {
          activeRides: activeRides.length,
          onlineDrivers: metrics.activeDrivers,
          revenueToday: metrics.revenue.today,
        }
      } catch (error) {
        console.warn('Nao foi possivel carregar metricas da API. Usando mocks locais.', error)
        return null
      }
    },
    refetchInterval: 30_000,
  })
}
