import { useQuery } from '@tanstack/react-query'
import { withMockFallback } from '@shared/services'
import { passengers } from '../data/mockPassengers'
import { listAllAdminPassengers } from '../services'

export const passengersQueryKeys = {
  access: ['admin', 'passengers'] as const,
  all: () => [...passengersQueryKeys.access, 'all'] as const,
}

export function useGetAllPassengersAccess() {
  return useQuery({
    queryKey: passengersQueryKeys.all(),
    queryFn: () =>
      withMockFallback(listAllAdminPassengers, {
        fallback: { rows: passengers, details: {}, total: passengers.length },
        warning: 'Nao foi possivel carregar passageiros da API. Usando mocks locais.',
      }),
    placeholderData: { rows: passengers, details: {}, total: passengers.length },
  })
}
