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
  SubscriptionKpiCard,
  TrialExpiration,
} from '../types'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
})

export const monthlyMrrGrowth: MonthlyMrrPoint[] = [
  { month: 'Nov', mrr: 54800 },
  { month: 'Dez', mrr: 59300 },
  { month: 'Jan', mrr: 64100 },
  { month: 'Fev', mrr: 71300 },
  { month: 'Mar', mrr: 74900 },
  { month: 'Abr', mrr: 84200 },
]

export const planDistribution: PlanDistributionPoint[] = [
  { plan: 'Pro', total: 688, color: '#2563EB' },
  { plan: 'Basico', total: 412, color: '#22D3EE' },
  { plan: 'Premium', total: 184, color: '#22C55E' },
]

export const expiringTrials: TrialExpiration[] = [
  {
    id: 'drv-1048',
    driverName: 'Marcos Vinicius',
    plan: 'Pro',
    expiresInDays: 0,
    city: 'Sao Paulo',
    monthlyValue: 89.9,
  },
  {
    id: 'drv-1182',
    driverName: 'Carla Menezes',
    plan: 'Premium',
    expiresInDays: 1,
    city: 'Campinas',
    monthlyValue: 129.9,
  },
  {
    id: 'drv-1207',
    driverName: 'Rafael Costa',
    plan: 'Basico',
    expiresInDays: 2,
    city: 'Santos',
    monthlyValue: 49.9,
  },
  {
    id: 'drv-1324',
    driverName: 'Patricia Nogueira',
    plan: 'Pro',
    expiresInDays: 4,
    city: 'Santo Andre',
    monthlyValue: 89.9,
  },
  {
    id: 'drv-1411',
    driverName: 'Leandro Barros',
    plan: 'Basico',
    expiresInDays: 7,
    city: 'Osasco',
    monthlyValue: 49.9,
  },
]

export const driverSubscriptions: DriverSubscription[] = [
  {
    id: 'sub-1001',
    driverName: 'Andre Luiz',
    driverPhone: '(11) 98831-2044',
    plan: 'Pro',
    status: 'ATIVO',
    nextBillingAt: '2026-05-12',
    monthlyValue: 89.9,
  },
  {
    id: 'sub-1002',
    driverName: 'Juliana Paiva',
    driverPhone: '(19) 97742-3110',
    plan: 'Premium',
    status: 'ATIVO',
    nextBillingAt: '2026-05-15',
    monthlyValue: 129.9,
  },
  {
    id: 'sub-1003',
    driverName: 'Marcos Vinicius',
    driverPhone: '(11) 96418-7721',
    plan: 'Pro',
    status: 'TRIAL',
    nextBillingAt: '2026-05-04',
    monthlyValue: 89.9,
  },
  {
    id: 'sub-1004',
    driverName: 'Renata Campos',
    driverPhone: '(13) 98877-4102',
    plan: 'Basico',
    status: 'ATRASADO',
    nextBillingAt: '2026-04-29',
    monthlyValue: 49.9,
  },
  {
    id: 'sub-1005',
    driverName: 'Carla Menezes',
    driverPhone: '(19) 98442-2190',
    plan: 'Premium',
    status: 'TRIAL',
    nextBillingAt: '2026-05-05',
    monthlyValue: 129.9,
  },
  {
    id: 'sub-1006',
    driverName: 'Leandro Barros',
    driverPhone: '(11) 94021-0098',
    plan: 'Basico',
    status: 'TRIAL',
    nextBillingAt: '2026-05-11',
    monthlyValue: 49.9,
  },
]

export function getSubscriptionKpiCards(theme: Theme): SubscriptionKpiCard[] {
  return [
    {
      id: 'monthly-mrr',
      title: 'MRR Mensal',
      value: currencyFormatter.format(84200),
      helper: `+${percentFormatter.format(12.4)}% vs. mes anterior`,
      icon: <PaidOutlinedIcon />,
      color: theme.palette.primary.main,
    },
    {
      id: 'active-subscriptions',
      title: 'Assinaturas ativas',
      value: '1.284',
      helper: 'Base pagante atual',
      icon: <WorkspacePremiumOutlinedIcon />,
      color: theme.palette.secondary.main,
      details: [
        { label: 'Basico', value: '412', color: 'info' },
        { label: 'Pro', value: '688', color: 'primary' },
        { label: 'Prem', value: '184', color: 'success' },
      ],
    },
    {
      id: 'trial-subscriptions',
      title: 'Em trial',
      value: '146',
      helper: 'Expiram em 7 dias: 23',
      icon: <ScheduleOutlinedIcon />,
      color: theme.palette.warning.main,
    },
    {
      id: 'cancellations',
      title: 'Cancelamentos',
      value: '38',
      helper: `Churn ${percentFormatter.format(2.9)}%`,
      icon: <CancelOutlinedIcon />,
      color: theme.palette.error.main,
    },
    {
      id: 'month-revenue',
      title: 'Receita total mes',
      value: currencyFormatter.format(118450),
      helper: 'Assinaturas, upgrades e reativacoes',
      icon: <AccountBalanceWalletOutlinedIcon />,
      color: theme.palette.success.main,
    },
  ]
}
