import { supportTickets } from '@modules/support/services'
import { currencyFormatter, numberFormatter } from '@shared/utils/formatters'
import { formatCpf, getInitials, normalizeSearch } from '@shared/utils/text'
import { driverDetailsById } from '../data/driversData'
import type { Driver, DriverCategory, DriverDetails, DriverFilter, DriverRide, DriverSituation, DriverSortKey, DriverStatus, DriverSubscription } from '../types'

export { currencyFormatter, formatCpf, getInitials, normalizeSearch, numberFormatter }

export const filters: Array<{ value: DriverFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'online', label: 'Online' },
  { value: 'approved', label: 'Aprovados' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'blocked', label: 'Bloqueados' },
]

export const categorySortOrder: Record<DriverCategory, number> = {
  Executivo: 1,
  Conforto: 2,
  Econômico: 3,
}

export const statusSortOrder: Record<DriverStatus, number> = {
  Online: 1,
  Offline: 2,
}

export const situationSortOrder: Record<DriverSituation, number> = {
  Aprovado: 1,
  'Análise pendente': 2,
  Reprovado: 3,
  Suspenso: 4,
}

export const subscriptionSortOrder: Record<DriverSubscription, number> = {
  Premium: 1,
  Pro: 2,
  Básico: 3,
  Trial: 4,
}

export function getDriverSortValue(driver: Driver, key: DriverSortKey) {
  if (key === 'category') return categorySortOrder[driver.category]
  if (key === 'status') return statusSortOrder[driver.status]
  if (key === 'situation') return situationSortOrder[driver.situation]
  if (key === 'subscription') return subscriptionSortOrder[driver.subscription]
  return driver[key]
}

export function getDriverComplaints(driver: Driver, fallbackComplaints: DriverDetails['complaints'] = []) {
  const linkedComplaints = supportTickets
    .filter(
      (ticket) =>
        ticket.user.role === 'driver' &&
        (ticket.user.driverId === driver.id || ticket.user.phone === driver.phone || ticket.user.email === getDriverDetailsBase(driver).email),
    )
    .map((ticket) => ({
      id: ticket.protocol,
      date: ticket.occurrence.createdAt.split(' às ')[0],
      title: ticket.occurrence.title,
      status: ticket.status,
    }))

  return linkedComplaints.length > 0 ? linkedComplaints : fallbackComplaints
}

export function getDriverDetailsBase(driver: Driver): DriverDetails {
  return (
    driverDetailsById[driver.id] ?? {
      photoLabel: `Foto do motorista ${driver.name}`,
      cpf: '000.000.000-00',
      email: `${normalizeSearch(driver.name).replace(/\s+/g, '.')}@email.com`,
      city: 'São Paulo, SP',
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      state: '',
      referencePoint: '',
      vehicle: 'Veículo cadastrado',
      plate: 'BRL-0000',
      joinedAt: '10/01/2025',
      lastOnline: driver.status === 'Online' ? 'Agora' : 'Sem atividade recente',
      rideHistory: [
        { id: 'BRL-83010', date: '25/04/2026', from: 'Centro', to: 'Zona Sul', value: 42, status: 'Finalizada' },
        { id: 'BRL-82977', date: '24/04/2026', from: 'Aeroporto', to: 'Hotel', value: 58, status: 'Finalizada' },
      ],
      complaints:
        driver.situation === 'Suspenso'
          ? [{ id: 'REC-1180', date: '18/04/2026', title: 'Conduta em análise pelo suporte', status: 'Aberta' }]
          : [],
      monthlyAverage: {
        rides: Math.max(12, Math.round(driver.rides / 5)),
        earnings: driver.monthlyEarnings,
        rating: driver.rating,
        cancellationRate: driver.situation === 'Suspenso' ? 9.4 : 3.1,
      },
    }
  )
}

export function getDriverDetails(driver: Driver, override?: Partial<DriverDetails>): DriverDetails {
  const details = getDriverDetailsBase(driver)
  const mergedDetails = {
    ...details,
    ...override,
    monthlyAverage: {
      ...details.monthlyAverage,
      ...override?.monthlyAverage,
    },
  }

  return {
    ...mergedDetails,
    complaints: getDriverComplaints(driver, mergedDetails.complaints),
  }
}

export function getDriverRideDetails(ride: DriverRide) {
  const details: Record<string, { duration: string; distance: string; path: string[] }> = {
    'BRL-84007': {
      duration: '32 min',
      distance: '13,2 km',
      path: ['Copacabana', 'Aterro do Flamengo', 'Santos Dumont'],
    },
    'BRL-83980': {
      duration: '46 min',
      distance: '24,8 km',
      path: ['Barra da Tijuca', 'Linha Amarela', 'Centro'],
    },
    'BRL-83892': {
      duration: '18 min',
      distance: '7,4 km',
      path: ['Ipanema', 'Lagoa', 'Botafogo'],
    },
    'BRL-83640': {
      duration: '16 min',
      distance: '6,1 km',
      path: ['Batel', 'Praça do Japão', 'Centro Cívico'],
    },
    'BRL-83598': {
      duration: '38 min',
      distance: '18,9 km',
      path: ['Agua Verde', 'BR-277', 'Aeroporto Afonso Pena'],
    },
    'BRL-83010': {
      duration: '24 min',
      distance: '9,6 km',
      path: ['Centro', 'Corredor principal', 'Zona Sul'],
    },
    'BRL-82977': {
      duration: '29 min',
      distance: '12,1 km',
      path: ['Aeroporto', 'Via expressa', 'Hotel'],
    },
  }

  return (
    details[ride.id] ?? {
      duration: '24 min',
      distance: '9,6 km',
      path: [ride.from, 'Rota principal registrada', ride.to],
    }
  )
}

