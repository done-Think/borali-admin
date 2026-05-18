import { useQuery } from '@tanstack/react-query'
import { ADMIN_LIVE_REFETCH_INTERVAL, withMockFallback } from '@shared/services'
import { initialActiveRides } from '../data/mockRides'
import { listAdminActiveRides } from '../services'

export const ridesQueryKeys = {
  access: ['admin', 'rides'] as const,
  active: () => [...ridesQueryKeys.access, 'active'] as const,
}

export function useGetActiveRidesAccess() {
  return useQuery({
    queryKey: ridesQueryKeys.active(),
    queryFn: () =>
      withMockFallback(listAdminActiveRides, {
        fallback: initialActiveRides,
        warning: 'Nao foi possivel carregar corridas ativas da API. Usando mocks locais.',
      }),
    placeholderData: initialActiveRides,
    refetchInterval: ADMIN_LIVE_REFETCH_INTERVAL,
  })
}
