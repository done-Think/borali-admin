import type { Driver, DriverCategory, DriverDetails, DriverSituation, DriverStatus, DriverSubscription } from '@modules/drivers/types'
import type { ApiDriver } from './api.types'
import { formatDate, initials, mapRideStatus, rideCancellationRate, toNumber } from './common'

export function mapDriverCategory(category?: string): DriverCategory {
  if (category === 'COMFORT') return 'Conforto'
  if (category === 'EXECUTIVE') return 'Executivo'
  return 'Econômico'
}

export function mapDriverStatus(driver: Pick<ApiDriver, 'isOnline'>): DriverStatus {
  return driver.isOnline ? 'Online' : 'Offline'
}

export function mapDriverSituation(driver: Pick<ApiDriver, 'status'>): DriverSituation {
  if (driver.status === 'PENDING') return 'Análise pendente'
  if (driver.status === 'APPROVED') return 'Aprovado'
  if (driver.status === 'REJECTED') return 'Reprovado'
  return 'Suspenso'
}

export function mapSubscription(driver: Pick<ApiDriver, 'subscription'>): DriverSubscription {
  if (driver.subscription?.status === 'TRIAL') return 'Trial'
  if (driver.subscription?.plan === 'PREMIUM') return 'Premium'
  if (driver.subscription?.plan === 'PRO') return 'Pro'
  return 'Básico'
}

function vehicleLabel(driver: ApiDriver) {
  const vehicle = driver.vehicles?.[0]
  if (!vehicle) return 'Veículo não informado'
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
    userId: driver.user.id,
    name: driver.user.name,
    initials: initials(driver.user.name),
    phone: driver.user.phone ?? 'Sem telefone',
    category: mapDriverCategory(vehicle?.category),
    status: mapDriverStatus(driver),
    situation: mapDriverSituation(driver),
    rides: driver.totalRides,
    rating: driver.rating ?? 0,
    subscription: mapSubscription(driver),
    monthlyEarnings: driverMonthlyEarnings(driver),
  }
}

export function mapDriverDetails(driver: ApiDriver): Partial<DriverDetails> {
  const rides = driver.rides ?? []
  const u = driver.user

  return {
    photoLabel: `Foto do motorista ${u.name}`,
    cpf: 'Não informado',
    email: u.email,
    city: u.city ?? 'Não informado',
    faceCheckStatus: u.faceCheckStatus ?? null,
    faceCheckUrl: u.faceCheckUrl ?? null,
    zipCode: u.zipCode ?? '',
    street: u.street ?? '',
    number: u.number ?? '',
    complement: u.complement ?? '',
    neighborhood: u.neighborhood ?? '',
    state: u.state ?? '',
    referencePoint: u.referencePoint ?? '',
    vehicle: vehicleLabel(driver),
    plate: driver.vehicles?.[0]?.plate ?? 'Não informado',
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
      rating: driver.rating ?? 0,
      cancellationRate: rideCancellationRate(rides),
    },
  }
}
