import { useEffect, useMemo, useState } from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import RouteIcon from '@mui/icons-material/Route'
import { Box, Card, CardContent, Chip, Divider, GlobalStyles, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, Tooltip } from 'react-leaflet'
import { io } from 'socket.io-client'
import { activeRides as dashboardActiveRides } from '@modules/dashboard/data/mockDashboardData'
import type { ActiveRide } from '@modules/dashboard/types'
import { currencyFormatter } from '@modules/dashboard/utils/formatters'
import { getMapTileLayer } from '@modules/dashboard/utils/mapConfig'
import { useActivePaletteMode } from '@modules/dashboard/utils/useActivePaletteMode'

type ActiveRideStatus = 'A caminho' | 'Em corrida' | 'Chegando' | 'Aguardando embarque'

type ActiveRideView = ActiveRide & {
  status: ActiveRideStatus
  startedAt: string
}

const statusConfig: Record<ActiveRideStatus, { color: string; label: string }> = {
  'A caminho': { color: '#2563EB', label: 'A caminho' },
  'Em corrida': { color: '#0ABEE9', label: 'Em corrida' },
  Chegando: { color: '#F59E0B', label: 'Chegando' },
  'Aguardando embarque': { color: '#8B5CF6', label: 'Aguardando embarque' },
}

const initialActiveRides: ActiveRideView[] = dashboardActiveRides.map((ride, index) => ({
  ...ride,
  status: (['Em corrida', 'A caminho', 'Chegando', 'Aguardando embarque', 'Em corrida'] as ActiveRideStatus[])[index] ?? 'Em corrida',
  startedAt: new Date(Date.now() - (index + 8) * 60_000).toISOString(),
}))

export default function RidesPage() {
  const theme = useTheme()
  const activeMode = useActivePaletteMode()
  const tileLayer = getMapTileLayer(activeMode)
  const [activeRides, setActiveRides] = useState<ActiveRideView[]>(initialActiveRides)
  const [, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL
    if (!socketUrl) return undefined

    const socket = io(socketUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnectionAttempts: 5,
    })

    const replaceActiveRides = (rides: ActiveRideView[]) => setActiveRides(rides.map(normalizeRide))
    const upsertRide = (ride: ActiveRideView) => {
      setActiveRides((current) => {
        const nextRide = normalizeRide(ride)
        const exists = current.some((item) => item.id === nextRide.id)
        return exists ? current.map((item) => (item.id === nextRide.id ? { ...item, ...nextRide } : item)) : [nextRide, ...current]
      })
    }
    const removeRide = (ride: ActiveRideView | { id: string }) => {
      setActiveRides((current) => current.filter((item) => item.id !== ride.id))
    }

    socket.on('rides:active', replaceActiveRides)
    socket.on('active-rides', replaceActiveRides)
    socket.on('ride:created', upsertRide)
    socket.on('ride:updated', upsertRide)
    socket.on('ride:completed', removeRide)
    socket.on('ride:cancelled', removeRide)

    return () => {
      socket.disconnect()
    }
  }, [])

  const mapCenter = useMemo<[number, number]>(() => activeRides[0]?.driverPosition ?? [-23.5573, -46.6412], [activeRides])

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
        <Tabs value="active" aria-label="Abas de corridas" sx={{ px: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tab value="active" label={`Ativas (${activeRides.length})`} />
          <Tab value="history" label="Historico" disabled />
          <Tab value="waiting" label="Em Espera" disabled />
        </Tabs>

        <CardContent sx={{ p: 2.25 }}>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 3fr) minmax(340px, 2fr)' },
              alignItems: 'stretch',
            }}
          >
            <Card variant="outlined" sx={{ minHeight: { xs: 420, lg: 620 }, overflow: 'hidden' }}>
              <CardContent sx={{ height: '100%', p: 2.25, display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="h4">Mapa — Corridas Ativas</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.25 }}>
                      Marcadores coloridos por status atual da corrida.
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="flex-end">
                    {Object.entries(statusConfig).map(([status, config]) => (
                      <Chip
                        key={status}
                        size="small"
                        label={config.label}
                        sx={{
                          bgcolor: alpha(config.color, activeMode === 'dark' ? 0.22 : 0.14),
                          color: config.color,
                          fontWeight: 800,
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>

                <Box sx={{ flex: 1, minHeight: 360, overflow: 'hidden', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                  <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
                    <TileLayer key={activeMode} attribution={tileLayer.attribution} url={tileLayer.url} />
                    {activeRides.map((ride) => (
                      <MapRide key={ride.id} ride={ride} />
                    ))}
                  </MapContainer>
                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent sx={{ p: 2.25 }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="h4">Corridas ativas</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.25 }}>
                      {activeRides.length} em acompanhamento agora
                    </Typography>
                  </Box>
                  <Chip label="tempo real" size="small" sx={{ fontWeight: 800 }} />
                </Stack>

                <Stack spacing={1.5}>
                  {activeRides.map((ride) => (
                    <ActiveRideCard key={ride.id} ride={ride} />
                  ))}
                  {activeRides.length === 0 && (
                    <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 3, textAlign: 'center' }}>
                      <Typography sx={{ fontWeight: 800 }}>Nenhuma corrida ativa agora</Typography>
                      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        Novas corridas entram aqui assim que forem emitidas pelo socket.
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

function MapRide({ ride }: { ride: ActiveRideView }) {
  const status = statusConfig[ride.status]

  return (
    <>
      <Polyline positions={ride.path} pathOptions={{ color: status.color, weight: 4, opacity: 0.72 }} />
      <Marker position={ride.driverPosition} icon={createRideStatusIcon(ride.status)} title={`${ride.id} - ${ride.status}`}>
        <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
          {ride.id} - {ride.driver}
        </Tooltip>
      </Marker>
      <CircleMarker
        center={ride.passengerPosition}
        radius={7}
        pathOptions={{ color: '#FFFFFF', weight: 2, fillColor: status.color, fillOpacity: 0.9 }}
      >
        <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
          {ride.passenger} - passageiro
        </Tooltip>
      </CircleMarker>
    </>
  )
}

function ActiveRideCard({ ride }: { ride: ActiveRideView }) {
  const status = statusConfig[ride.status]

  return (
    <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
      <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
              <RouteIcon fontSize="small" sx={{ color: status.color }} />
              <Typography sx={{ fontWeight: 900 }}>{ride.id}</Typography>
            </Stack>
            <Chip
              size="small"
              label={ride.status}
              sx={{
                bgcolor: alpha(status.color, 0.14),
                color: status.color,
                fontWeight: 800,
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            <PersonPinCircleIcon fontSize="small" color="action" />
            <Typography noWrap sx={{ fontWeight: 800 }}>
              {ride.passenger}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Chip size="small" icon={<LocalTaxiIcon />} label={ride.driver} sx={{ maxWidth: '62%', fontWeight: 800 }} />
            <Typography sx={{ fontWeight: 900 }}>{currencyFormatter.format(ride.value)}</Typography>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography color="text.secondary" sx={{ fontSize: 12 }} noWrap>
              {ride.origin} {'->'} {ride.destination}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
                {getElapsedMinutes(ride.startedAt)} min
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

function normalizeRide(ride: ActiveRideView): ActiveRideView {
  return {
    ...ride,
    status: ride.status ?? 'Em corrida',
    startedAt: ride.startedAt ?? new Date().toISOString(),
  }
}

function getElapsedMinutes(startedAt: string) {
  const elapsed = Date.now() - new Date(startedAt).getTime()
  return Math.max(1, Math.round(elapsed / 60_000))
}

function createRideStatusIcon(status: ActiveRideStatus) {
  const color = statusConfig[status].color

  return L.divIcon({
    className: '',
    html: `<span style="
      width: 18px;
      height: 18px;
      display: block;
      border-radius: 999px;
      background: ${color};
      border: 3px solid #ffffff;
      box-shadow: 0 0 0 6px ${alpha(color, 0.26)}, 0 12px 24px rgba(0, 0, 0, 0.28);
    "></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}
