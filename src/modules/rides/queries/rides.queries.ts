import { useQuery } from '@tanstack/react-query'
import { initialActiveRides } from '../data/mockRides'
import { listAdminActiveRides } from '../services'

export const ridesQueryKeys = {
  access: ['admin', 'rides'] as const,
  active: () => [...ridesQueryKeys.access, 'active'] as const,
}

export function useGetActiveRidesAccess() {
  return useQuery({
    queryKey: ridesQueryKeys.active(),
    queryFn: async () => {
      try {
        return await listAdminActiveRides()
      } catch (error) {
        console.warn('Nao foi possivel carregar corridas ativas da API. Usando mocks locais.', error)
        return initialActiveRides
      }
    },
    placeholderData: initialActiveRides,
    refetchInterval: 30_000,
  })
}
