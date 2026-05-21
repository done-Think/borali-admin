import { useQuery } from '@tanstack/react-query'
import { listAdminActiveRides } from '@modules/rides/services'
import { ADMIN_LIVE_REFETCH_INTERVAL, withMockFallback } from '@shared/services'
import { getAdminDashboardMetrics } from '../services'

export const dashboardQueryKeys = {
  access: ['admin', 'dashboard'] as const,
}

export function useGetDashboardAccess() {
  return useQuery({
    queryKey: dashboardQueryKeys.access,
    queryFn: () =>
      withMockFallback(
        async () => {
          const [metrics, activeRides] = await Promise.all([getAdminDashboardMetrics(), listAdminActiveRides()])
          return {
            activeRides: activeRides.length,
            onlineDrivers: metrics.activeDrivers,
            revenueToday: metrics.revenue.today,
          }
        },
        {
          fallback: null,
          warning: 'Nao foi possivel carregar metricas da API. Usando mocks locais.',
        },
      ),
    refetchInterval: ADMIN_LIVE_REFETCH_INTERVAL,
  })
}
