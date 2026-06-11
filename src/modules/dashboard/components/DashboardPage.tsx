import { useMemo, useState } from 'react'
import { Box, Card, CardContent, Chip, GlobalStyles, Stack, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import 'leaflet/dist/leaflet.css'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { useGetDashboardAccess } from '../queries'
import type { Activity, KpiCard } from '../types'
import { ActivityList } from './ActivityList'
import { DashboardLiveMap } from './DashboardLiveMap'
import { KpiCardButton } from './KpiCardButton'
import { RecentRidesTable } from './RecentRidesTable'
import { RidesPerHourChart } from './RidesPerHourChart'
import { ActiveRidesDialog } from './dialogs/ActiveRidesDialog'
import { AlertRidesDialog } from './dialogs/AlertRidesDialog'
import { ActivitySummaryDialog } from './dialogs/ActivitySummaryDialog'
import { OnlineDriversDialog } from './dialogs/OnlineDriversDialog'
import { PendingApprovalsDialog } from './dialogs/PendingApprovalsDialog'
import { RevenueDialog } from './dialogs/RevenueDialog'
import { useActivePaletteMode } from '../utils/useActivePaletteMode'

const baseKpiCards: KpiCard[] = [
  { id: 'active-rides', title: 'Corridas ativas', value: '—', subtitle: 'aguardando dados', icon: <LocalTaxiIcon />, color: '#0ABEE9' },
  { id: 'online-drivers', title: 'Motoristas online', value: '—', subtitle: 'aguardando dados', icon: <DirectionsCarIcon />, color: '#2DD4A0' },
  { id: 'daily-revenue', title: 'Receita do dia', value: '—', subtitle: 'aguardando dados', icon: <MonetizationOnIcon />, color: '#F59E0B' },
  { id: 'pending-approvals', title: 'Aprovações pend.', value: '—', subtitle: 'aguardando dados', icon: <PendingActionsIcon />, color: '#8B5CF6' },
  { id: 'alert-rides', title: 'Corrida em Alerta', value: '—', subtitle: 'aguardando dados', icon: <WarningAmberIcon />, color: '#EF4444' },
]

export default function DashboardPage() {
  const theme = useTheme()
  const activeMode = useActivePaletteMode()
  const [activeRidesOpen, setActiveRidesOpen] = useState(false)
  const [revenueOpen, setRevenueOpen] = useState(false)
  const [approvalsOpen, setApprovalsOpen] = useState(false)
  const [alertRidesOpen, setAlertRidesOpen] = useState(false)
  const [onlineDriversOpen, setOnlineDriversOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const activities: Activity[] = []

  const dashboardQuery = useGetDashboardAccess()

  const visibleKpiCards = useMemo(() => {
    const liveKpis = dashboardQuery.data
    if (!liveKpis) return baseKpiCards

    return baseKpiCards.map((card) => {
      if (card.id === 'active-rides' && liveKpis.activeRides != null) {
        return { ...card, value: String(liveKpis.activeRides), subtitle: 'corridas ativas na API' }
      }

      if (card.id === 'online-drivers' && liveKpis.onlineDrivers != null) {
        return { ...card, value: String(liveKpis.onlineDrivers), subtitle: 'motoristas online na API' }
      }

      if (card.id === 'daily-revenue' && liveKpis.revenueToday != null) {
        return {
          ...card,
          value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(liveKpis.revenueToday),
          subtitle: 'receita confirmada hoje',
        }
      }

      return card
    })
  }, [dashboardQuery.data])

  function handleKpiClick(card: KpiCard) {
    if (card.id === 'active-rides') setActiveRidesOpen(true)
    if (card.id === 'daily-revenue') setRevenueOpen(true)
    if (card.id === 'online-drivers') setOnlineDriversOpen(true)
    if (card.id === 'pending-approvals') setApprovalsOpen(true)
    if (card.id === 'alert-rides') setAlertRidesOpen(true)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <GlobalStyles
        styles={{
          '.leaflet-container': {
            minHeight: '100%',
            backgroundColor: activeMode === 'dark' ? '#0A0E1A' : '#E5E7EB',
            fontFamily: 'inherit',
          },
          '.leaflet-control-attribution': {
            backgroundColor: `${alpha(theme.palette.background.paper, 0.82)} !important`,
            color: `${theme.palette.text.secondary} !important`,
          },
          '.leaflet-control-attribution a': {
            color: `${theme.palette.secondary.main} !important`,
          },
        }}
      />

      <Box>
        <Typography variant="h3">Dashboard</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Visao operacional das corridas em tempo real.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(5, minmax(0, 1fr))',
          },
        }}
      >
        {visibleKpiCards.map((card) => (
          <KpiCardButton key={card.id} card={card} onClick={() => handleKpiClick(card)} />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.35fr) minmax(320px, 0.65fr)' },
          alignItems: 'stretch',
        }}
      >
        <DashboardLiveMap />
        <Card variant="outlined">
          <CardContent sx={{ p: 2.25 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
              <Typography variant="h4">Feed de Atividade em tempo real</Typography>
              <Chip label="tempo real" size="small" sx={{ fontWeight: 800 }} />
            </Stack>
            {activities.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography color="text.secondary" variant="body2">Nenhuma atividade recente.</Typography>
            </Box>
          ) : (
            <ActivityList items={activities} compact onItemClick={setSelectedActivity} />
          )}
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 0.9fr) minmax(520px, 1.1fr)' },
          alignItems: 'stretch',
        }}
      >
        <RidesPerHourChart />
        <RecentRidesTable />
      </Box>

      <ActiveRidesDialog open={activeRidesOpen} onClose={() => setActiveRidesOpen(false)} />
      <RevenueDialog open={revenueOpen} onClose={() => setRevenueOpen(false)} />
      <PendingApprovalsDialog open={approvalsOpen} onClose={() => setApprovalsOpen(false)} />
      <AlertRidesDialog open={alertRidesOpen} onClose={() => setAlertRidesOpen(false)} />
      <OnlineDriversDialog open={onlineDriversOpen} onClose={() => setOnlineDriversOpen(false)} />
      <ActivitySummaryDialog
        open={Boolean(selectedActivity)}
        activities={activities}
        selectedActivityId={selectedActivity?.id ?? null}
        onClose={() => setSelectedActivity(null)}
      />
    </Box>
  )
}
