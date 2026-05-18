import { useQuery } from '@tanstack/react-query'
import { withMockFallback } from '@shared/services'
import { drivers } from '../data/mockDrivers'
import { listAllAdminDrivers } from '../services'

export const driversQueryKeys = {
  access: ['admin', 'drivers'] as const,
  all: () => [...driversQueryKeys.access, 'all'] as const,
}

export function useGetAllDriversAccess() {
  return useQuery({
    queryKey: driversQueryKeys.all(),
    queryFn: () =>
      withMockFallback(listAllAdminDrivers, {
        fallback: { rows: drivers, details: {}, total: drivers.length },
        warning: 'Nao foi possivel carregar motoristas da API. Usando mocks locais.',
      }),
    placeholderData: { rows: drivers, details: {}, total: drivers.length },
  })
}
