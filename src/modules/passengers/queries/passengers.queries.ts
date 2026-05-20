import { useQuery } from '@tanstack/react-query'
import { passengers } from '../data/mockPassengers'
import { listAllAdminPassengers } from '../services'

export const passengersQueryKeys = {
  access: ['admin', 'passengers'] as const,
  all: () => [...passengersQueryKeys.access, 'all'] as const,
}

export function useGetAllPassengersAccess() {
  return useQuery({
    queryKey: passengersQueryKeys.all(),
    queryFn: async () => {
      try {
        return await listAllAdminPassengers()
      } catch (error) {
        console.warn('Nao foi possivel carregar passageiros da API. Usando mocks locais.', error)
        return { rows: passengers, details: {}, total: passengers.length }
      }
    },
    placeholderData: { rows: passengers, details: {}, total: passengers.length },
  })
}
