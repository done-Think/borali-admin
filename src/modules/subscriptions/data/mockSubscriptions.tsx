import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'
import type { Theme } from '@mui/material/styles'
import type { SubscriptionKpiCard } from '../types'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
})

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
