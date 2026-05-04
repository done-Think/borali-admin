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
  SubscriptionRenewal,
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
  { plan: 'Básico', total: 412, color: '#22D3EE' },
  { plan: 'Premium', total: 184, color: '#22C55E' },
]

export const expiringTrials: TrialExpiration[] = [
  {
    id: 'trial-DRV-1004',
    driverId: 'DRV-1004',
    driverName: 'Carla Teixeira',
    plan: 'Pro',
    expiresInDays: 0,
    city: 'Belo Horizonte',
    monthlyValue: 89.9,
  },
  {
    id: 'trial-DRV-1008',
    driverId: 'DRV-1008',
    driverName: 'Helena Duarte',
    plan: 'Premium',
    expiresInDays: 1,
    city: 'Campinas',
    monthlyValue: 129.9,
  },
  {
    id: 'trial-DRV-1002',
    driverId: 'DRV-1002',
    driverName: 'Patrícia Nogueira',
    plan: 'Básico',
    expiresInDays: 2,
    city: 'Curitiba',
    monthlyValue: 49.9,
  },
  {
    id: 'trial-DRV-4211',
    driverId: 'DRV-4211',
    driverName: 'Rafael Souza',
    plan: 'Pro',
    expiresInDays: 4,
    city: 'São Paulo',
    monthlyValue: 89.9,
  },
  {
    id: 'trial-DRV-4207',
    driverId: 'DRV-4207',
    driverName: 'André Mota',
    plan: 'Básico',
    expiresInDays: 7,
    city: 'São Paulo',
    monthlyValue: 49.9,
  },
]

export const driverSubscriptions: DriverSubscription[] = [
  {
    id: 'sub-1001',
    driverName: 'André Luiz',
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
    plan: 'Básico',
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
    plan: 'Básico',
    status: 'TRIAL',
    nextBillingAt: '2026-05-11',
    monthlyValue: 49.9,
  },
]

export const subscriptionRenewalsByDriverId: Record<string, SubscriptionRenewal[]> = {
  'DRV-1004': [
    { id: 'ren-1004-01', date: '04/05/2026', plan: 'Pro', value: 89.9, status: 'Pendente', method: 'Trial em conversão' },
    { id: 'ren-1004-02', date: '04/04/2026', plan: 'Pro', value: 0, status: 'Pago', method: 'Trial gratuito' },
    { id: 'ren-1004-03', date: '29/03/2026', plan: 'Pro', value: 0, status: 'Pago', method: 'Cadastro aprovado' },
  ],
  'DRV-1008': [
    { id: 'ren-1008-01', date: '05/05/2026', plan: 'Premium', value: 129.9, status: 'Pendente', method: 'Trial em conversão' },
    { id: 'ren-1008-02', date: '05/04/2026', plan: 'Premium', value: 0, status: 'Pago', method: 'Trial gratuito' },
  ],
  'DRV-1002': [
    { id: 'ren-1002-01', date: '06/05/2026', plan: 'Básico', value: 49.9, status: 'Pendente', method: 'Cartão final 6508' },
    { id: 'ren-1002-02', date: '06/04/2026', plan: 'Premium', value: 129.9, status: 'Pago', method: 'Cartão final 6508' },
    { id: 'ren-1002-03', date: '06/03/2026', plan: 'Premium', value: 129.9, status: 'Pago', method: 'Cartão final 6508' },
  ],
  'DRV-4211': [
    { id: 'ren-4211-01', date: '08/05/2026', plan: 'Pro', value: 89.9, status: 'Pendente', method: 'Pix recorrente' },
    { id: 'ren-4211-02', date: '08/04/2026', plan: 'Pro', value: 89.9, status: 'Pago', method: 'Pix recorrente' },
    { id: 'ren-4211-03', date: '08/03/2026', plan: 'Pro', value: 89.9, status: 'Pago', method: 'Pix recorrente' },
  ],
  'DRV-4207': [
    { id: 'ren-4207-01', date: '11/05/2026', plan: 'Básico', value: 49.9, status: 'Pendente', method: 'Cartão final 4402' },
    { id: 'ren-4207-02', date: '11/04/2026', plan: 'Pro', value: 89.9, status: 'Falhou', method: 'Cartão final 4402' },
    { id: 'ren-4207-03', date: '12/04/2026', plan: 'Pro', value: 89.9, status: 'Pago', method: 'Retentativa automática' },
  ],
}

export function getSubscriptionKpiCards(theme: Theme): SubscriptionKpiCard[] {
  return [
    {
      id: 'monthly-mrr',
      title: 'MRR Mensal',
      value: currencyFormatter.format(84200),
      helper: `+${percentFormatter.format(12.4)}% vs. mês anterior`,
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
        { label: 'Básico', value: '412', color: 'info' },
        { label: 'Pro', value: '688', color: 'primary' },
        { label: 'Premium', value: '184', color: 'success' },
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
      title: 'Receita total do mês',
      value: currencyFormatter.format(118450),
      helper: 'Assinaturas, upgrades e reativações',
      icon: <AccountBalanceWalletOutlinedIcon />,
      color: theme.palette.success.main,
    },
  ]
}
