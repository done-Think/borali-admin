import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'
import type { Theme } from '@mui/material/styles'
import type {
  DriverSubscription,
  MonthlyMrrPoint,
  PlanDistributionPoint,
  SubscriptionMovementSummary,
  SubscriptionPaymentRecord,
  SubscriptionRenewal,
  SubscriptionKpiCard,
  TrialExpiration,
} from '../types'

export const monthlyMrrGrowth: MonthlyMrrPoint[] = []
export const planDistribution: PlanDistributionPoint[] = []
export const expiringTrials: TrialExpiration[] = []
export const driverSubscriptions: DriverSubscription[] = []
export const subscriptionPaymentHistoryBySubscriptionId: Record<string, SubscriptionPaymentRecord[]> = {}
export const subscriptionMovementBySubscriptionId: Record<string, SubscriptionMovementSummary> = {}
export const subscriptionRenewalsByDriverId: Record<string, SubscriptionRenewal[]> = {}

export function getSubscriptionKpiCards(theme: Theme): SubscriptionKpiCard[] {
  return [
    {
      id: 'monthly-mrr',
      title: 'MRR Mensal',
      value: '—',
      helper: 'Aguardando dados',
      icon: <PaidOutlinedIcon />,
      color: theme.palette.primary.main,
    },
    {
      id: 'active-subscriptions',
      title: 'Assinaturas ativas',
      value: '—',
      helper: 'Aguardando dados',
      icon: <WorkspacePremiumOutlinedIcon />,
      color: theme.palette.secondary.main,
    },
    {
      id: 'trial-subscriptions',
      title: 'Em trial',
      value: '—',
      helper: 'Aguardando dados',
      icon: <ScheduleOutlinedIcon />,
      color: theme.palette.warning.main,
    },
    {
      id: 'cancellations',
      title: 'Cancelamentos',
      value: '—',
      helper: 'Aguardando dados',
      icon: <CancelOutlinedIcon />,
      color: theme.palette.error.main,
    },
    {
      id: 'month-revenue',
      title: 'Receita total do mês',
      value: '—',
      helper: 'Aguardando dados',
      icon: <AccountBalanceWalletOutlinedIcon />,
      color: theme.palette.success.main,
    },
  ]
}
