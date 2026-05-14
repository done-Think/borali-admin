import { describe, expect, it } from 'vitest'
import {
  type ApiDriver,
  type ApiRide,
  driverMonthlyEarnings,
  mapActiveRide,
  mapDriver,
  mapDriverCategory,
  mapDriverDetails,
  mapDriverStatus,
  mapPassenger,
  mapPassengerDetails,
  mapSubscription,
  passengerCancellationRate,
} from './adminMappers'

function ride(overrides: Partial<ApiRide> = {}): ApiRide {
  return {
    id: 'ride-1',
    status: 'COMPLETED',
    originAddress: 'Origem',
    originLat: -23.5,
    originLng: -46.6,
    destAddress: 'Destino',
    destLat: -23.6,
    destLng: -46.7,
    createdAt: '2026-05-14T10:00:00.000Z',
    ...overrides,
  }
}

function driver(overrides: Partial<ApiDriver> = {}): ApiDriver {
  return {
    id: 'driver-1',
    status: 'APPROVED',
    isOnline: false,
    rating: 4.8,
    totalRides: 10,
    createdAt: '2026-05-14T10:00:00.000Z',
    user: {
      id: 'user-1',
      name: 'Ana Motorista',
      email: 'ana@example.com',
      createdAt: '2026-05-14T10:00:00.000Z',
    },
    ...overrides,
  }
}

describe('admin mappers', () => {
  describe('mapDriverStatus', () => {
    it('maps suspended and rejected drivers as blocked', () => {
      expect(mapDriverStatus(driver({ status: 'SUSPENDED', isOnline: true }))).toBe('Bloqueado')
      expect(mapDriverStatus(driver({ status: 'REJECTED', isOnline: false }))).toBe('Bloqueado')
    })

    it('maps pending drivers as pending before checking online state', () => {
      expect(mapDriverStatus(driver({ status: 'PENDING', isOnline: true }))).toBe('Pendente')
    })

    it('maps approved drivers from online state', () => {
      expect(mapDriverStatus(driver({ status: 'APPROVED', isOnline: true }))).toBe('Online')
      expect(mapDriverStatus(driver({ status: 'APPROVED', isOnline: false }))).toBe('Offline')
    })
  })

  describe('mapDriverCategory', () => {
    it('maps vehicle categories and falls back to economy', () => {
      expect(mapDriverCategory('COMFORT')).toBe('Conforto')
      expect(mapDriverCategory('EXECUTIVE')).toBe('Executivo')
      expect(mapDriverCategory('ECONOMY')).toBe('Econômico')
      expect(mapDriverCategory()).toBe('Econômico')
    })
  })

  describe('mapSubscription', () => {
    it('prioritizes trial status over plan name', () => {
      expect(mapSubscription(driver({ subscription: { plan: 'PREMIUM', status: 'TRIAL' } }))).toBe('Trial')
    })

    it('maps paid plans and falls back to basic', () => {
      expect(mapSubscription(driver({ subscription: { plan: 'PREMIUM', status: 'ACTIVE' } }))).toBe('Premium')
      expect(mapSubscription(driver({ subscription: { plan: 'PRO', status: 'ACTIVE' } }))).toBe('Pro')
      expect(mapSubscription(driver({ subscription: { plan: 'BASIC', status: 'ACTIVE' } }))).toBe('Básico')
      expect(mapSubscription(driver({ subscription: null }))).toBe('Básico')
    })
  })

  describe('driverMonthlyEarnings', () => {
    it('uses earnings when they are available', () => {
      expect(driverMonthlyEarnings(driver({ earnings: [{ grossAmount: '10.50' }, { grossAmount: 20 }] }))).toBe(30.5)
    })

    it('falls back to ride payments and fares', () => {
      expect(
        driverMonthlyEarnings(
          driver({
            rides: [
              ride({ payment: { amount: '12.25', method: 'PIX' } }),
              ride({ fare: '17.75' }),
              ride({ fare: 'valor invalido' }),
            ],
          }),
        ),
      ).toBe(30)
    })
  })

  describe('mapDriver and mapDriverDetails', () => {
    it('maps API driver data to admin row and details', () => {
      const apiDriver = driver({
        status: 'APPROVED',
        isOnline: true,
        vehicles: [{ brand: 'Toyota', model: 'Corolla', year: 2024, plate: 'ABC-1234', category: 'COMFORT' }],
        rides: [
          ride({
            id: 'ride-completed',
            status: 'COMPLETED',
            payment: { amount: 44.5, method: 'PIX' },
            completedAt: '2026-05-14T12:00:00.000Z',
          }),
          ride({ id: 'ride-cancelled', status: 'CANCELLED', fare: 20 }),
        ],
      })

      expect(mapDriver(apiDriver)).toMatchObject({
        id: 'driver-1',
        name: 'Ana Motorista',
        initials: 'AM',
        category: 'Conforto',
        status: 'Online',
        monthlyEarnings: 64.5,
      })
      expect(mapDriverDetails(apiDriver)).toMatchObject({
        email: 'ana@example.com',
        vehicle: 'Toyota Corolla 2024',
        plate: 'ABC-1234',
        lastOnline: 'Agora',
        monthlyAverage: {
          rides: 2,
          earnings: 64.5,
          rating: 4.8,
          cancellationRate: 50,
        },
      })
      expect(mapDriverDetails(apiDriver).rideHistory).toHaveLength(2)
      expect(mapDriverDetails(apiDriver).rideHistory?.[1]).toMatchObject({ status: 'Cancelada' })
    })
  })

  describe('passengerCancellationRate', () => {
    it('calculates cancelled rides percentage from available history', () => {
      expect(
        passengerCancellationRate({
          totalRidesAsPassenger: 4,
          ridesAsPassenger: [
            ride({ status: 'COMPLETED' }),
            ride({ status: 'CANCELLED' }),
            ride({ status: 'CANCELLED' }),
            ride({ status: 'IN_PROGRESS' }),
          ],
        }),
      ).toBe(50)
    })

    it('returns null when total rides exists but history is missing', () => {
      expect(passengerCancellationRate({ totalRidesAsPassenger: 8 })).toBeNull()
    })

    it('returns zero when the passenger has no rides', () => {
      expect(passengerCancellationRate({ totalRidesAsPassenger: 0, ridesAsPassenger: [] })).toBe(0)
    })
  })

  describe('mapPassenger and mapPassengerDetails', () => {
    it('maps API passenger data and calculates cancellation rate', () => {
      const user = {
        id: 'passenger-1',
        name: 'Bea Passageira',
        email: 'bea@example.com',
        phone: null,
        passengerRating: 4.6,
        totalRidesAsPassenger: 2,
        createdAt: '2026-05-01T10:00:00.000Z',
        ridesAsPassenger: [
          ride({ id: 'completed', status: 'COMPLETED', payment: { amount: 30, method: 'CREDIT_CARD' } }),
          ride({ id: 'cancelled', status: 'CANCELLED', paymentMethod: 'CASH', estimatedFare: 15 }),
        ],
      }

      expect(mapPassenger(user)).toMatchObject({
        id: 'passenger-1',
        name: 'Bea Passageira',
        initials: 'BP',
        phone: 'Sem telefone',
        tier: 'Regular',
        status: 'Ativo',
        payments: ['Cartão', 'Dinheiro'],
        monthlySpend: 45,
      })
      expect(mapPassengerDetails(user)).toMatchObject({
        email: 'bea@example.com',
        monthlyAverage: {
          rides: 2,
          spend: 45,
          rating: 4.6,
          cancellationRate: 50,
        },
      })
      expect(mapPassengerDetails(user).rideHistory?.[1]).toMatchObject({ status: 'Cancelada' })
    })

    it('marks passengers with high cancellation count as blocked', () => {
      expect(
        mapPassenger({
          id: 'blocked-passenger',
          name: 'Conta Bloqueada',
          email: 'blocked@example.com',
          cancelCount: 10,
          createdAt: '2026-05-01T10:00:00.000Z',
        }).status,
      ).toBe('Bloqueado')
    })
  })

  describe('mapActiveRide', () => {
    it('maps active ride data using driver location when available', () => {
      expect(
        mapActiveRide(
          ride({
            status: 'IN_PROGRESS',
            fare: '25.50',
            passenger: {
              id: 'passenger-1',
              name: 'Passageira',
              email: 'passageira@example.com',
              createdAt: '2026-05-14T10:00:00.000Z',
            },
            driver: driver({
              location: { latitude: -23.7, longitude: -46.8 },
            }),
          }),
        ),
      ).toMatchObject({
        driver: 'Ana Motorista',
        passenger: 'Passageira',
        value: 25.5,
        driverPosition: [-23.7, -46.8],
        status: 'Em corrida',
      })
    })
  })
})
