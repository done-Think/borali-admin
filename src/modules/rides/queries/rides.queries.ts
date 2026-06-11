import { useQuery } from '@tanstack/react-query'
import { ADMIN_LIVE_REFETCH_INTERVAL } from '@shared/services'
import { listAdminActiveRides } from '../services'

export const ridesQueryKeys = {
  access: ['admin', 'rides'] as const,
  active: () => [...ridesQueryKeys.access, 'active'] as const,
}

export function useGetActiveRidesAccess() {
  return useQuery({
    queryKey: ridesQueryKeys.active(),
    queryFn: listAdminActiveRides,
    refetchInterval: ADMIN_LIVE_REFETCH_INTERVAL,
  })
}
