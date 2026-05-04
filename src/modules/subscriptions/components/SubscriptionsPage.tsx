import { Box, Stack, Typography, useTheme } from '@mui/material'
import { getSubscriptionKpiCards } from '../data/mockSubscriptions'
import { SubscriptionKpiCards } from './SubscriptionKpiCards'

export default function SubscriptionsPage() {
  const theme = useTheme()
  const kpiCards = getSubscriptionKpiCards(theme)

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
    </Stack>
  )
}
