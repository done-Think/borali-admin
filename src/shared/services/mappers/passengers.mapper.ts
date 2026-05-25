import type { Passenger, PassengerDetails, PassengerPayment, PassengerStatus, PassengerTier } from '@modules/passengers/types'
import type { ApiUser } from './api.types'
import { formatDate, initials, mapRideStatus, rideCancellationRate, toNumber } from './common'

function mapPayment(method?: string | null): PassengerPayment {
  if (method === 'PIX') return 'Pix'
  if (method === 'CASH') return 'Dinheiro'
  if (method === 'CREDIT_CARD' || method === 'DEBIT_CARD') return 'Cartão'
  return 'Pix'
}

function mapPassengerTier(totalRides: number): PassengerTier {
  if (totalRides >= 200) return 'VIP'
  if (totalRides >= 100) return 'Ouro'
  if (totalRides >= 50) return 'Prata'
  return 'Regular'
}

function mapPassengerStatus(user: ApiUser): PassengerStatus {
  return user.cancelCount && user.cancelCount >= 10 ? 'Bloqueado' : 'Ativo'
}

function passengerMonthlySpend(user: ApiUser) {
  return (user.ridesAsPassenger ?? []).reduce((total, ride) => {
    return total + toNumber(ride.payment?.amount ?? ride.fare ?? ride.estimatedFare)
  }, 0)
}

export function passengerCancellationRate(user: Pick<ApiUser, 'ridesAsPassenger' | 'totalRidesAsPassenger'>) {
  const rides = user.ridesAsPassenger ?? []
  if (rides.length === 0) {
    return user.totalRidesAsPassenger && user.totalRidesAsPassenger > 0 ? null : 0
  }

  return rideCancellationRate(rides)
}

export function mapPassenger(user: ApiUser): Passenger {
  const payments = Array.from(new Set((user.ridesAsPassenger ?? []).map((ride) => mapPayment(ride.payment?.method ?? ride.paymentMethod))))

  return {
    id: user.id,
    name: user.name,
    initials: initials(user.name),
    phone: user.phone ?? 'Sem telefone',
    tier: mapPassengerTier(user.totalRidesAsPassenger ?? 0),
    status: mapPassengerStatus(user),
    rides: user.totalRidesAsPassenger ?? 0,
    rating: user.passengerRating ?? 5,
    payments: payments.length ? payments : ['Pix'],
    monthlySpend: passengerMonthlySpend(user),
  }
}

export function mapPassengerDetails(user: ApiUser): Partial<PassengerDetails> {
  const rides = user.ridesAsPassenger ?? []

  return {
    photoLabel: `Foto do passageiro ${user.name}`,
    cpf: 'Não informado',
    email: user.email,
    city: 'Não informado',
    joinedAt: formatDate(user.createdAt),
    lastRide: rides[0] ? formatDate(rides[0].createdAt) : 'Sem corrida recente',
    preferredRegion: 'Não informado',
    rideHistory: rides.map((ride) => ({
      id: ride.id,
      date: formatDate(ride.completedAt ?? ride.createdAt),
      from: ride.originAddress,
      to: ride.destAddress,
      value: toNumber(ride.payment?.amount ?? ride.fare ?? ride.estimatedFare),
      status: mapRideStatus(ride.status),
    })),
    monthlyAverage: {
      rides: rides.length,
      spend: passengerMonthlySpend(user),
      rating: user.passengerRating ?? 5,
      cancellationRate: passengerCancellationRate(user),
    },
  }
}
