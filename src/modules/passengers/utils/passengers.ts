import { supportTickets } from '@modules/support/services'
import { currencyFormatter, numberFormatter } from '@shared/utils/formatters'
import { formatCpf, getInitials, normalizeSearch } from '@shared/utils/text'
import type { BadgePalette } from '@shared/ui/DataBadge'
import { passengerDetailsById } from '../data/mockPassengers'
import type { Passenger, PassengerDetails, PassengerFilter, PassengerPayment, PassengerRide, PassengerSortKey, PassengerStatus, PassengerTier } from '../types'

export { currencyFormatter, formatCpf, getInitials, normalizeSearch, numberFormatter }

export const filters: Array<{ value: PassengerFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'blocked', label: 'Bloqueados' },
]

export const tierSortOrder: Record<PassengerTier, number> = {
  VIP: 1,
  Ouro: 2,
  Prata: 3,
  Regular: 4,
}

export const statusSortOrder: Record<PassengerStatus, number> = {
  Ativo: 1,
  Inativo: 2,
  Pendente: 3,
  Bloqueado: 4,
}

export const paymentSortOrder: Record<PassengerPayment, number> = {
  Carteira: 1,
  Cartão: 2,
  Pix: 3,
  Dinheiro: 4,
}

export const paymentOptions: PassengerPayment[] = ['Cartão', 'Pix', 'Carteira', 'Dinheiro']

export const tierPalette: Record<PassengerTier, BadgePalette> = {
  VIP: { color: '#7C3AED', background: 'rgba(124, 58, 237, 0.14)', border: 'rgba(124, 58, 237, 0.35)' },
  Ouro: { color: '#B45309', background: 'rgba(245, 158, 11, 0.16)', border: 'rgba(180, 83, 9, 0.35)' },
  Prata: { color: '#4B5563', background: 'rgba(107, 114, 128, 0.12)', border: 'rgba(107, 114, 128, 0.32)' },
  Regular: { color: '#047857', background: 'rgba(16, 185, 129, 0.12)', border: 'rgba(5, 150, 105, 0.32)' },
}

export const statusPalette: Record<PassengerStatus, BadgePalette> = {
  Ativo: { color: '#047857', background: 'rgba(16, 185, 129, 0.12)', border: 'rgba(5, 150, 105, 0.32)' },
  Inativo: { color: '#6B7280', background: 'rgba(107, 114, 128, 0.12)', border: 'rgba(107, 114, 128, 0.32)' },
  Pendente: { color: '#B45309', background: 'rgba(245, 158, 11, 0.16)', border: 'rgba(180, 83, 9, 0.35)' },
  Bloqueado: { color: '#B91C1C', background: 'rgba(239, 68, 68, 0.12)', border: 'rgba(220, 38, 38, 0.32)' },
}

export const paymentPalette: Record<PassengerPayment, BadgePalette> = {
  'Cartão': { color: '#2563EB', background: 'rgba(37, 99, 235, 0.12)', border: 'rgba(37, 99, 235, 0.32)' },
  Pix: { color: '#0F766E', background: 'rgba(20, 184, 166, 0.12)', border: 'rgba(15, 118, 110, 0.32)' },
  Carteira: { color: '#7C3AED', background: 'rgba(124, 58, 237, 0.14)', border: 'rgba(124, 58, 237, 0.35)' },
  Dinheiro: { color: '#4B5563', background: 'rgba(107, 114, 128, 0.12)', border: 'rgba(107, 114, 128, 0.32)' },
}

export type { BadgePalette }

export function getPassengerSortValue(passenger: Passenger, key: PassengerSortKey) {
  if (key === 'tier') {
    return tierSortOrder[passenger.tier]
  }

  if (key === 'status') {
    return statusSortOrder[passenger.status]
  }

  if (key === 'payment') {
    return Math.min(...passenger.payments.map((payment) => paymentSortOrder[payment]))
  }

  return passenger[key]
}

export function getPassengerDetailsBase(passenger: Passenger): PassengerDetails {
  return (
    passengerDetailsById[passenger.id] ?? {
      photoLabel: `Foto do passageiro ${passenger.name}`,
      cpf: '000.000.000-00',
      email: `${normalizeSearch(passenger.name).replace(/\s+/g, '.')}@email.com`,
      city: 'São Paulo, SP',
      joinedAt: '10/01/2025',
      lastRide: passenger.status === 'Ativo' ? 'Hoje' : 'Sem corrida recente',
      preferredRegion: 'Centro',
      rideHistory: [
        { id: 'BRL-83110', date: '25/04/2026', from: 'Centro', to: 'Zona Sul', value: 42, status: 'Finalizada' },
        { id: 'BRL-82984', date: '21/04/2026', from: 'Shopping', to: 'Residência', value: 31, status: 'Finalizada' },
      ],
      complaints:
        passenger.status === 'Bloqueado'
          ? [{ id: 'SUP-1188', date: '18/04/2026', title: 'Conta bloqueada por revisão de conduta', status: 'Aberta' }]
          : [],
      monthlyAverage: {
        rides: Math.max(2, Math.round(passenger.rides / 8)),
        spend: passenger.monthlySpend,
        rating: passenger.rating,
        cancellationRate: passenger.status === 'Bloqueado' ? 12.4 : 3.8,
      },
    }
  )
}

export function getPassengerComplaints(passenger: Passenger, fallbackComplaints: PassengerDetails['complaints'] = []) {
  const details = getPassengerDetailsBase(passenger)
  const linkedComplaints = supportTickets
    .filter(
      (ticket) =>
        ticket.user.role === 'passenger' &&
        (ticket.user.phone === passenger.phone || ticket.user.email === details.email || normalizeSearch(ticket.user.name) === normalizeSearch(passenger.name)),
    )
    .map((ticket) => ({
      id: ticket.protocol,
      date: ticket.occurrence.createdAt.split(' às ')[0],
      title: ticket.occurrence.title,
      status: ticket.status,
    }))

  return linkedComplaints.length > 0 ? linkedComplaints : fallbackComplaints
}

export function getPassengerDetails(passenger: Passenger, override?: Partial<PassengerDetails>): PassengerDetails {
  const details = getPassengerDetailsBase(passenger)
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
    complaints: getPassengerComplaints(passenger, mergedDetails.complaints),
  }
}

export function getPassengerRideDetails(ride: PassengerRide) {
  const details: Record<string, { duration: string; distance: string; path: string[] }> = {
    'BRL-83921': {
      duration: '34 min',
      distance: '18,4 km',
      path: ['Jardins', 'Av. 23 de Maio', 'Aeroporto de Congonhas'],
    },
    'BRL-83815': {
      duration: '22 min',
      distance: '8,7 km',
      path: ['Moema', 'Av. Santo Amaro', 'Pinheiros'],
    },
    'BRL-83692': {
      duration: '14 min',
      distance: '5,2 km',
      path: ['Vila Mariana', 'Paraiso', 'Paulista'],
    },
    'BRL-83774': {
      duration: '31 min',
      distance: '14,2 km',
      path: ['Savassi', 'Av. Antonio Carlos', 'Pampulha'],
    },
    'BRL-83544': {
      duration: '12 min',
      distance: '4,3 km',
      path: ['Centro', 'Av. Afonso Pena', 'Funcionarios'],
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
