import type { DriverCategory, DriverStatus, DriverSubscription } from '../types'

export type BadgePalette = {
  color: string
  background: string
  border: string
}

export const categoryPalette: Record<DriverCategory, BadgePalette> = {
  Conforto: {
    color: '#0ABEE9',
    background: 'rgba(10, 190, 233, 0.12)',
    border: 'rgba(10, 190, 233, 0.36)',
  },
  Econômico: {
    color: '#22C55E',
    background: 'rgba(34, 197, 94, 0.12)',
    border: 'rgba(34, 197, 94, 0.36)',
  },
  Executivo: {
    color: '#F59E0B',
    background: 'rgba(245, 158, 11, 0.14)',
    border: 'rgba(245, 158, 11, 0.38)',
  },
}

export const statusPalette: Record<DriverStatus, BadgePalette> = {
  Online: {
    color: '#22C55E',
    background: 'rgba(34, 197, 94, 0.12)',
    border: 'rgba(34, 197, 94, 0.36)',
  },
  Offline: {
    color: '#6B7280',
    background: 'rgba(107, 114, 128, 0.12)',
    border: 'rgba(107, 114, 128, 0.32)',
  },
  Pendente: {
    color: '#F59E0B',
    background: 'rgba(245, 158, 11, 0.14)',
    border: 'rgba(245, 158, 11, 0.38)',
  },
  Bloqueado: {
    color: '#EF4444',
    background: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.36)',
  },
}

export const subscriptionPalette: Record<DriverSubscription, BadgePalette> = {
  Pro: {
    color: '#8B5CF6',
    background: 'rgba(139, 92, 246, 0.12)',
    border: 'rgba(139, 92, 246, 0.36)',
  },
  Básico: {
    color: '#0ABEE9',
    background: 'rgba(10, 190, 233, 0.12)',
    border: 'rgba(10, 190, 233, 0.36)',
  },
  Premium: {
    color: '#D97706',
    background: 'rgba(245, 158, 11, 0.16)',
    border: 'rgba(217, 119, 6, 0.38)',
  },
  Trial: {
    color: '#6B7280',
    background: 'rgba(107, 114, 128, 0.12)',
    border: 'rgba(107, 114, 128, 0.32)',
  },
}
