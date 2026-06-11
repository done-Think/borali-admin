import { useQuery } from '@tanstack/react-query'
import { listAllAdminDrivers } from '../services'

export const driversQueryKeys = {
  access: ['admin', 'drivers'] as const,
  all: () => [...driversQueryKeys.access, 'all'] as const,
}

export function useGetAllDriversAccess() {
  return useQuery({
    queryKey: driversQueryKeys.all(),
    queryFn: listAllAdminDrivers,
  })
}
