import { useState } from 'react'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import {
  driverSubscriptions,
  expiringTrials,
  getSubscriptionKpiCards,
  monthlyMrrGrowth,
  planDistribution,
} from '../data/mockSubscriptions'
import type { DriverSubscription } from '../types'
import { ExpiringTrialsPanel } from './ExpiringTrialsPanel'
import { SubscriptionCharts } from './SubscriptionCharts'
import { SubscriptionKpiCards } from './SubscriptionKpiCards'
import { CanceledSubscriptionsPanel, SubscriptionsTable } from './SubscriptionsTable'

export default function SubscriptionsPage() {
  const theme = useTheme()
  const kpiCards = getSubscriptionKpiCards(theme)
  const [activeSubscriptions, setActiveSubscriptions] = useState(driverSubscriptions)
  const [canceledSubscriptions, setCanceledSubscriptions] = useState<DriverSubscription[]>([])

  function handleRegisterPayment(subscription: DriverSubscription) {
    setActiveSubscriptions((current) =>
      current.map((item) => (item.id === subscription.id ? { ...item, status: 'EXPIRADO' } : item)),
    )
  }

  function handleCancelPayment(subscription: DriverSubscription, previousStatus: DriverSubscription['status']) {
    setActiveSubscriptions((current) =>
      current.map((item) => (item.id === subscription.id ? { ...item, status: previousStatus } : item)),
    )
  }

  function handleCancelSubscription(subscription: DriverSubscription) {
    setActiveSubscriptions((current) => current.filter((item) => item.id !== subscription.id))
    setCanceledSubscriptions((current) => [{ ...subscription, status: 'ATRASADO' }, ...current])
  }

  function handleRenewSubscription(subscription: DriverSubscription) {
    setCanceledSubscriptions((current) => current.filter((item) => item.id !== subscription.id))
    setActiveSubscriptions((current) => [{ ...subscription, status: 'ATIVO' }, ...current])
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" component="h1">
          Planos
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Acompanhe assinaturas, trials, cancelamentos e receita recorrente dos motoristas.
        </Typography>
      </Box>

      <SubscriptionKpiCards cards={kpiCards} />

      <SubscriptionCharts mrrGrowth={monthlyMrrGrowth} planDistribution={planDistribution} />

      <ExpiringTrialsPanel trials={expiringTrials} />

      <SubscriptionsTable
        subscriptions={activeSubscriptions}
        onRegisterPayment={handleRegisterPayment}
        onCancelPayment={handleCancelPayment}
        onCancelSubscription={handleCancelSubscription}
      />

      <CanceledSubscriptionsPanel subscriptions={canceledSubscriptions} onRenewSubscription={handleRenewSubscription} />
    </Stack>
  )
}
