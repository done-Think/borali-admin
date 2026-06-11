import { useQuery } from '@tanstack/react-query'
import { listAllAdminPassengers } from '../services'

export const passengersQueryKeys = {
  access: ['admin', 'passengers'] as const,
  all: () => [...passengersQueryKeys.access, 'all'] as const,
}

export function useGetAllPassengersAccess() {
  return useQuery({
    queryKey: passengersQueryKeys.all(),
    queryFn: listAllAdminPassengers,
  })
}
