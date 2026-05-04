import type { ReactElement } from 'react'

export type SubscriptionPlan = 'Básico' | 'Pro' | 'Premium'

export type SubscriptionKpiCard = {
  id: string
  title: string
  value: string
  helper: string
  icon: ReactElement
  color: string
  details?: {
    label: string
    value: string
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  }[]
}

export type MonthlyMrrPoint = {
  month: string
  mrr: number
}

export type PlanDistributionPoint = {
  plan: SubscriptionPlan
  total: number
  color: string
}

export type TrialExpiration = {
  id: string
  driverName: string
  plan: SubscriptionPlan
  expiresInDays: number
  city: string
  monthlyValue: number
}

export type SubscriptionStatus = 'ATIVO' | 'TRIAL' | 'ATRASADO'

export type DriverSubscription = {
  id: string
  driverName: string
  driverPhone: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  nextBillingAt: string
  monthlyValue: number
}
