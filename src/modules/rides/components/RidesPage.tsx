import { useEffect, useMemo, useState } from 'react'
import { Box, Card, CardContent, GlobalStyles, Tab, Tabs, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useQueryClient } from '@tanstack/react-query'
import 'leaflet/dist/leaflet.css'
import { useSnackbar } from 'notistack'
import { useLocation } from 'react-router'
import { io } from 'socket.io-client'
import { getMapTileLayer } from '@modules/dashboard/utils/mapConfig'
import { useActivePaletteMode } from '@modules/dashboard/utils/useActivePaletteMode'
import { ridesQueryKeys, useGetActiveRidesAccess } from '../queries'
import { historyRides, initialActiveRides, initialScheduledRides } from '../data/mockRides'
import type { ActiveMapLimit, ActiveRideView, HistoryStatusFilter, RideTab, ScheduledRide } from '../types'
import { normalizeRide, prioritizeActiveRides } from '../utils/rides'
import { ActiveRidesPanel } from './ActiveRidesPanel'
import { HistoryRidesPanel } from './HistoryRidesPanel'
import { ScheduledRidesPanel } from './ScheduledRidesPanel'

type RidesNavigationState = {
  selectedTab?: RideTab
  selectedRideId?: string
  highlightAlert?: boolean
}

export default function RidesPage() {
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const activeMode = useActivePaletteMode()
  const tileLayer = getMapTileLayer(activeMode)
  const queryClient = useQueryClient()
  const [selectedTab, setSelectedTab] = useState<RideTab>('active')
  const [activeMapLimit, setActiveMapLimit] = useState<ActiveMapLimit>(5)
  const [selectedActiveRideId, setSelectedActiveRideId] = useState(initialActiveRides[0]?.id ?? '')
  const [expandedActiveRideId, setExpandedActiveRideId] = useState(initialActiveRides[0]?.id ?? '')
  const [activeRideSearch, setActiveRideSearch] = useState('')
  const [scheduledRides, setScheduledRides] = useState<ScheduledRide[]>(initialScheduledRides)
  const [historyStartDate, setHistoryStartDate] = useState('')
  const [historyEndDate, setHistoryEndDate] = useState('')
  const [historyStatus, setHistoryStatus] = useState<HistoryStatusFilter>('all')
  const [, setNow] = useState(() => Date.now())

  const activeRidesQuery = useGetActiveRidesAccess()
  const activeRidesData = activeRidesQuery.data ?? initialActiveRides
  const activeRides = useMemo(() => activeRidesData.map(normalizeRide), [activeRidesData])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const navigationState = location.state as RidesNavigationState | null
    if (!navigationState?.selectedRideId) return

    setSelectedTab(navigationState.selectedTab ?? 'active')
    setSelectedActiveRideId(navigationState.selectedRideId)
    setExpandedActiveRideId(navigationState.selectedRideId)
    setActiveRideSearch('')
    setActiveMapLimit('all')

    if (navigationState.highlightAlert) {
      enqueueSnackbar(`Corrida ${navigationState.selectedRideId} em alerta destacada.`, { variant: 'warning' })
    }
  }, [enqueueSnackbar, location.state])

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL
    if (!socketUrl) return undefined

    const socket = io(socketUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnectionAttempts: 5,
    })

    const replaceActiveRides = (rides: ActiveRideView[]) => {
      queryClient.setQueryData<ActiveRideView[]>(ridesQueryKeys.active(), rides.map(normalizeRide))
    }
    const upsertRide = (ride: ActiveRideView) => {
      queryClient.setQueryData<ActiveRideView[]>(ridesQueryKeys.active(), (current = initialActiveRides) => {
        const nextRide = normalizeRide(ride)
        const exists = current.some((item) => item.id === nextRide.id)
        return exists ? current.map((item) => (item.id === nextRide.id ? { ...item, ...nextRide } : item)) : [nextRide, ...current]
      })
    }
    const removeRide = (ride: ActiveRideView | { id: string }) => {
      queryClient.setQueryData<ActiveRideView[]>(ridesQueryKeys.active(), (current = initialActiveRides) => current.filter((item) => item.id !== ride.id))
      setSelectedActiveRideId((current) => (current === ride.id ? '' : current))
      setExpandedActiveRideId((current) => (current === ride.id ? '' : current))
    }
    const replaceScheduledRides = (rides: ScheduledRide[]) => setScheduledRides(rides)
    const upsertScheduledRide = (ride: ScheduledRide) => {
      setScheduledRides((current) => {
        const nextRide = ride
        const exists = current.some((item) => item.id === nextRide.id)
        return exists ? current.map((item) => (item.id === nextRide.id ? { ...item, ...nextRide } : item)) : [nextRide, ...current]
      })
    }
    const removeScheduledRide = (ride: ScheduledRide | { id: string }) => {
      setScheduledRides((current) => current.filter((item) => item.id !== ride.id))
    }

    socket.on('rides:active', replaceActiveRides)
    socket.on('active-rides', replaceActiveRides)
    socket.on('ride:created', upsertRide)
    socket.on('ride:updated', upsertRide)
    socket.on('ride:alert', upsertRide)
    socket.on('ride:completed', removeRide)
    socket.on('ride:cancelled', removeRide)
    socket.on('rides:scheduled', replaceScheduledRides)
    socket.on('scheduled-rides', replaceScheduledRides)
    socket.on('ride:scheduled', upsertScheduledRide)
    socket.on('ride:schedule-updated', upsertScheduledRide)
    socket.on('ride:schedule-cancelled', removeScheduledRide)

    return () => {
      socket.disconnect()
    }
  }, [queryClient])

  const mapCenter = useMemo<[number, number]>(() => activeRides[0]?.driverPosition ?? [-23.5573, -46.6412], [activeRides])
  const selectedActiveRide = useMemo(
    () => activeRides.find((ride) => ride.id === selectedActiveRideId) ?? activeRides[0] ?? null,
    [activeRides, selectedActiveRideId],
  )
  const filteredActiveRides = useMemo(() => {
    const normalizedSearch = activeRideSearch.trim().toLocaleLowerCase('pt-BR')
    if (!normalizedSearch) return activeRides

    return activeRides.filter((ride) => {
      return ride.driver.toLocaleLowerCase('pt-BR').includes(normalizedSearch) || ride.passenger.toLocaleLowerCase('pt-BR').includes(normalizedSearch)
    })
  }, [activeRideSearch, activeRides])
  const prioritizedActiveRides = useMemo(() => prioritizeActiveRides(filteredActiveRides, selectedActiveRideId), [filteredActiveRides, selectedActiveRideId])
  const mapActiveRides = useMemo(() => {
    const limitedRides = activeMapLimit === 'all' ? prioritizedActiveRides : prioritizedActiveRides.slice(0, activeMapLimit)
    if (!selectedActiveRide || limitedRides.some((ride) => ride.id === selectedActiveRide.id)) return limitedRides
    return [...limitedRides, selectedActiveRide]
  }, [activeMapLimit, prioritizedActiveRides, selectedActiveRide])
  const filteredHistoryRides = useMemo(() => {
    return historyRides.filter((ride) => {
      const rideDate = ride.completedAt.slice(0, 10)
      const matchesStartDate = !historyStartDate || rideDate >= historyStartDate
      const matchesEndDate = !historyEndDate || rideDate <= historyEndDate
      const matchesOccurrences = historyStatus === 'all' || (historyStatus === 'with-alert' ? Boolean(ride.alert) : !ride.alert)
      return matchesStartDate && matchesEndDate && matchesOccurrences
    })
  }, [historyEndDate, historyStartDate, historyStatus])

  function cancelScheduledRide(rideId: string) {
    setScheduledRides((current) => current.filter((ride) => ride.id !== rideId))
    enqueueSnackbar(`Agendamento ${rideId} cancelado.`, { variant: 'success' })
  }

  function sendScheduledRideMessage(ride: ScheduledRide, message: string) {
    void message
    enqueueSnackbar(`Mensagem enviada para ${ride.passenger.name}.`, { variant: 'success' })
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
        <Typography variant="h3">Corridas</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Acompanhe corridas em andamento e a distribuicao operacional em tempo real.
        </Typography>
      </Box>

      <Card variant="outlined">
        <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value as RideTab)} aria-label="Abas de corridas" sx={{ px: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tab value="active" label={`Ativas (${activeRides.length})`} />
          <Tab value="history" label="Historico" />
          <Tab value="scheduled" label={`Corrida Programada (${scheduledRides.length})`} />
        </Tabs>

        <CardContent sx={{ p: 2.25 }}>
          {selectedTab === 'active' && (
            <ActiveRidesPanel
              activeRides={activeRides}
              activeMode={activeMode}
              expandedRideId={expandedActiveRideId}
              filteredActiveRides={prioritizedActiveRides}
              mapRides={mapActiveRides}
              mapLimit={activeMapLimit}
              mapCenter={mapCenter}
              selectedRide={selectedActiveRide}
              selectedRideId={selectedActiveRide?.id ?? ''}
              theme={theme}
              tileLayer={tileLayer}
              search={activeRideSearch}
              onExpandedRideChange={setExpandedActiveRideId}
              onMapLimitChange={setActiveMapLimit}
              onSearchChange={setActiveRideSearch}
              onRideSelect={setSelectedActiveRideId}
            />
          )}

          {selectedTab === 'history' && (
            <HistoryRidesPanel
              rides={filteredHistoryRides}
              startDate={historyStartDate}
              endDate={historyEndDate}
              status={historyStatus}
              onStartDateChange={setHistoryStartDate}
              onEndDateChange={setHistoryEndDate}
              onStatusChange={setHistoryStatus}
            />
          )}

          {selectedTab === 'scheduled' && <ScheduledRidesPanel rides={scheduledRides} onCancelRide={cancelScheduledRide} onSendMessage={sendScheduledRideMessage} />}
        </CardContent>
      </Card>
    </Box>
  )
}
