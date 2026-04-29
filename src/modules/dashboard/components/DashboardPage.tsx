import { useState } from 'react'
import { Box, Card, CardContent, Chip, GlobalStyles, Stack, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import 'leaflet/dist/leaflet.css'
import { activities, kpiCards } from '../data/mockDashboardData'
import type { KpiCard } from '../types'
import { ActivityList } from './ActivityList'
import { DashboardLiveMap } from './DashboardLiveMap'
import { KpiCardButton } from './KpiCardButton'
import { RecentRidesTable } from './RecentRidesTable'
import { RidesPerHourChart } from './RidesPerHourChart'
import { ActiveRidesDialog } from './dialogs/ActiveRidesDialog'
import { AlertRidesDialog } from './dialogs/AlertRidesDialog'
import { OnlineDriversDialog } from './dialogs/OnlineDriversDialog'
import { PendingApprovalsDialog } from './dialogs/PendingApprovalsDialog'
import { RevenueDialog } from './dialogs/RevenueDialog'
import { useActivePaletteMode } from '../utils/useActivePaletteMode'

export default function DashboardPage() {
  const theme = useTheme()
  const activeMode = useActivePaletteMode()
  const [activeRidesOpen, setActiveRidesOpen] = useState(false)
  const [revenueOpen, setRevenueOpen] = useState(false)
  const [approvalsOpen, setApprovalsOpen] = useState(false)
  const [alertRidesOpen, setAlertRidesOpen] = useState(false)
  const [onlineDriversOpen, setOnlineDriversOpen] = useState(false)

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
        {kpiCards.map((card) => (
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
            <ActivityList items={activities} compact />
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
    </Box>
  )
}
