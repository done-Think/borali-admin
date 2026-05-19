import type { ActiveRideView } from '@modules/rides/types'
import type { ApiRide } from './api.types'
import { toNumber } from './common'

function mapActiveRideStatus(status: string): ActiveRideView['status'] {
  if (status === 'IN_PROGRESS') return 'Em corrida'
  if (status === 'DRIVER_ARRIVING') return 'Chegando'
  if (status === 'ACCEPTED') return 'A caminho'
  return 'Aguardando embarque'
}

export function mapActiveRide(ride: ApiRide): ActiveRideView {
  const driverPosition: [number, number] = ride.driver?.location
    ? [ride.driver.location.latitude, ride.driver.location.longitude]
    : [ride.originLat, ride.originLng]

  return {
    id: ride.id,
    driver: ride.driver?.user.name ?? 'Sem motorista',
    passenger: ride.passenger?.name ?? 'Passageiro',
    origin: ride.originAddress,
    destination: ride.destAddress,
    value: toNumber(ride.fare ?? ride.estimatedFare),
    path: [
      [ride.originLat, ride.originLng],
      [ride.destLat, ride.destLng],
    ],
    driverPosition,
    passengerPosition: [ride.originLat, ride.originLng],
    status: mapActiveRideStatus(ride.status),
    startedAt: ride.startedAt ?? ride.createdAt,
  }
}
