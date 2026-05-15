import { useQuery } from '@tanstack/react-query'
import { drivers } from '../data/mockDrivers'
import { listAllAdminDrivers } from '../services'

export const driversQueryKeys = {
  access: ['admin', 'drivers'] as const,
  all: () => [...driversQueryKeys.access, 'all'] as const,
}

export function useGetAllDriversAccess() {
  return useQuery({
    queryKey: driversQueryKeys.all(),
    queryFn: async () => {
      try {
        return await listAllAdminDrivers()
      } catch (error) {
        console.warn('Nao foi possivel carregar motoristas da API. Usando mocks locais.', error)
        return { rows: drivers, details: {}, total: drivers.length }
      }
    },
    placeholderData: { rows: drivers, details: {}, total: drivers.length },
  })
}
