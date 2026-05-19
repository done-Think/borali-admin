import type { Driver, DriverCategory, DriverDetails, DriverStatus, DriverSubscription } from '@modules/drivers/types'
import type { ApiDriver } from './api.types'
import { formatDate, initials, mapRideStatus, rideCancellationRate, toNumber } from './common'

export function mapDriverCategory(category?: string): DriverCategory {
  if (category === 'COMFORT') return 'Conforto'
  if (category === 'EXECUTIVE') return 'Executivo'
  return 'Econômico'
}

export function mapDriverStatus(driver: Pick<ApiDriver, 'status' | 'isOnline'>): DriverStatus {
  if (driver.status === 'SUSPENDED' || driver.status === 'REJECTED') return 'Bloqueado'
  if (driver.status === 'PENDING') return 'Pendente'
  return driver.isOnline ? 'Online' : 'Offline'
}

export function mapSubscription(driver: Pick<ApiDriver, 'subscription'>): DriverSubscription {
  if (driver.subscription?.status === 'TRIAL') return 'Trial'
  if (driver.subscription?.plan === 'PREMIUM') return 'Premium'
  if (driver.subscription?.plan === 'PRO') return 'Pro'
  return 'Básico'
}

function vehicleLabel(driver: ApiDriver) {
  const vehicle = driver.vehicles?.[0]
  if (!vehicle) return 'VeÃƒÂ­culo nÃƒÂ£o informado'
  return `${vehicle.brand} ${vehicle.model} ${vehicle.year}`
}

export function driverMonthlyEarnings(driver: Pick<ApiDriver, 'earnings' | 'rides'>) {
  if (driver.earnings?.length) {
    return driver.earnings.reduce((total, earning) => total + toNumber(earning.grossAmount), 0)
  }

  return (driver.rides ?? []).reduce((total, ride) => total + toNumber(ride.payment?.amount ?? ride.fare), 0)
}

export function mapDriver(driver: ApiDriver): Driver {
  const vehicle = driver.vehicles?.[0]

  return {
    id: driver.id,
    name: driver.user.name,
    initials: initials(driver.user.name),
    phone: driver.user.phone ?? 'Sem telefone',
    category: mapDriverCategory(vehicle?.category),
    status: mapDriverStatus(driver),
    rides: driver.totalRides,
    rating: driver.rating,
    subscription: mapSubscription(driver),
    monthlyEarnings: driverMonthlyEarnings(driver),
  }
}

export function mapDriverDetails(driver: ApiDriver): Partial<DriverDetails> {
  const rides = driver.rides ?? []

  return {
    photoLabel: `Foto do motorista ${driver.user.name}`,
    cpf: 'NÃƒÂ£o informado',
    email: driver.user.email,
    city: 'NÃƒÂ£o informado',
    vehicle: vehicleLabel(driver),
    plate: driver.vehicles?.[0]?.plate ?? 'NÃƒÂ£o informado',
    joinedAt: formatDate(driver.createdAt),
    lastOnline: driver.isOnline ? 'Agora' : formatDate(driver.lastSeenAt),
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
      earnings: driverMonthlyEarnings(driver),
      rating: driver.rating,
      cancellationRate: rideCancellationRate(rides),
    },
  }
}
