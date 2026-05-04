import type { ReactElement } from 'react'

export type SubscriptionPlan = 'Basico' | 'Pro' | 'Premium'

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
