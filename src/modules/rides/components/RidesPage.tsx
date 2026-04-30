import { useEffect, useMemo, useState } from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import RouteIcon from '@mui/icons-material/Route'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  GlobalStyles,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { io } from 'socket.io-client'
import { activeRides as dashboardActiveRides, recentRides, statusStyles } from '@modules/dashboard/data/mockDashboardData'
import type { ActiveRide, RecentRide, RideStatus } from '@modules/dashboard/types'
import { currencyFormatter } from '@modules/dashboard/utils/formatters'
import { getMapTileLayer } from '@modules/dashboard/utils/mapConfig'
import { useActivePaletteMode } from '@modules/dashboard/utils/useActivePaletteMode'

type RideTab = 'active' | 'history' | 'waiting'
type ActiveRideStatus = 'A caminho' | 'Em corrida' | 'Chegando' | 'Aguardando embarque'
type HistoryStatusFilter = 'all' | RideStatus
type WaitingRideStatus = 'Buscando motorista' | 'Oferta enviada' | 'Alta demanda'

type ActiveRideView = ActiveRide & {
  status: ActiveRideStatus
  startedAt: string
}

type HistoryRide = RecentRide & {
  completedAt: string
}

type WaitingRide = {
  id: string
  passenger: string
  origin: string
  destination: string
  estimatedValue: number
  requestedAt: string
  status: WaitingRideStatus
  nearbyDrivers: number
  category: string
}

const statusConfig: Record<ActiveRideStatus, { color: string; label: string }> = {
  'A caminho': { color: '#2563EB', label: 'A caminho' },
  'Em corrida': { color: '#0ABEE9', label: 'Em corrida' },
  Chegando: { color: '#F59E0B', label: 'Chegando' },
  'Aguardando embarque': { color: '#8B5CF6', label: 'Aguardando embarque' },
}

const waitingStatusConfig: Record<WaitingRideStatus, { color: string; label: string }> = {
  'Buscando motorista': { color: '#0ABEE9', label: 'Buscando motorista' },
  'Oferta enviada': { color: '#F59E0B', label: 'Oferta enviada' },
  'Alta demanda': { color: '#EF4444', label: 'Alta demanda' },
}

const initialActiveRides: ActiveRideView[] = dashboardActiveRides.map((ride, index) => ({
  ...ride,
  status: (['Em corrida', 'A caminho', 'Chegando', 'Aguardando embarque', 'Em corrida'] as ActiveRideStatus[])[index] ?? 'Em corrida',
  startedAt: new Date(Date.now() - (index + 8) * 60_000).toISOString(),
}))

const historyRides: HistoryRide[] = recentRides.map((ride, index) => ({
  ...ride,
  completedAt: new Date(Date.now() - index * 86_400_000 - (index + 1) * 18 * 60_000).toISOString(),
}))

const initialWaitingRides: WaitingRide[] = [
  {
    id: 'BRL-84231',
    passenger: 'Camila Torres',
    origin: 'Rua Oscar Freire, 620',
    destination: 'Shopping Iguatemi',
    estimatedValue: 31.4,
    requestedAt: new Date(Date.now() - 4 * 60_000).toISOString(),
    status: 'Buscando motorista',
    nearbyDrivers: 6,
    category: 'Conforto',
  },
  {
    id: 'BRL-84232',
    passenger: 'Mateus Ferreira',
    origin: 'Metro Vila Mariana',
    destination: 'Av. Brigadeiro Faria Lima',
    estimatedValue: 44.9,
    requestedAt: new Date(Date.now() - 7 * 60_000).toISOString(),
    status: 'Oferta enviada',
    nearbyDrivers: 3,
    category: 'Economico',
  },
  {
    id: 'BRL-84233',
    passenger: 'Renata Assis',
    origin: 'Barra Funda',
    destination: 'Vila Olimpia',
    estimatedValue: 58.2,
    requestedAt: new Date(Date.now() - 11 * 60_000).toISOString(),
    status: 'Alta demanda',
    nearbyDrivers: 1,
    category: 'Executivo',
  },
]

const rideTableCellSx = {
  px: 1,
  fontSize: 12,
  fontWeight: 700,
  overflowWrap: 'anywhere',
  verticalAlign: 'middle',
}

export default function RidesPage() {
  const theme = useTheme()
  const activeMode = useActivePaletteMode()
  const tileLayer = getMapTileLayer(activeMode)
  const [selectedTab, setSelectedTab] = useState<RideTab>('active')
  const [activeRides, setActiveRides] = useState<ActiveRideView[]>(initialActiveRides)
  const [selectedActiveRideId, setSelectedActiveRideId] = useState(initialActiveRides[0]?.id ?? '')
  const [waitingRides, setWaitingRides] = useState<WaitingRide[]>(initialWaitingRides)
  const [historyStartDate, setHistoryStartDate] = useState('')
  const [historyEndDate, setHistoryEndDate] = useState('')
  const [historyStatus, setHistoryStatus] = useState<HistoryStatusFilter>('all')
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
      setSelectedActiveRideId((current) => (current === ride.id ? '' : current))
    }
    const replaceWaitingRides = (rides: WaitingRide[]) => setWaitingRides(rides.map(normalizeWaitingRide))
    const upsertWaitingRide = (ride: WaitingRide) => {
      setWaitingRides((current) => {
        const nextRide = normalizeWaitingRide(ride)
        const exists = current.some((item) => item.id === nextRide.id)
        return exists ? current.map((item) => (item.id === nextRide.id ? { ...item, ...nextRide } : item)) : [nextRide, ...current]
      })
    }
    const removeWaitingRide = (ride: WaitingRide | { id: string }) => {
      setWaitingRides((current) => current.filter((item) => item.id !== ride.id))
    }

    socket.on('rides:active', replaceActiveRides)
    socket.on('active-rides', replaceActiveRides)
    socket.on('ride:created', upsertRide)
    socket.on('ride:updated', upsertRide)
    socket.on('ride:completed', removeRide)
    socket.on('ride:cancelled', removeRide)
    socket.on('rides:waiting', replaceWaitingRides)
    socket.on('waiting-rides', replaceWaitingRides)
    socket.on('ride:requested', upsertWaitingRide)
    socket.on('ride:waiting', upsertWaitingRide)
    socket.on('ride:accepted', removeWaitingRide)

    return () => {
      socket.disconnect()
    }
  }, [])

  const mapCenter = useMemo<[number, number]>(() => activeRides[0]?.driverPosition ?? [-23.5573, -46.6412], [activeRides])
  const selectedActiveRide = useMemo(
    () => activeRides.find((ride) => ride.id === selectedActiveRideId) ?? activeRides[0] ?? null,
    [activeRides, selectedActiveRideId],
  )
  const filteredHistoryRides = useMemo(() => {
    return historyRides.filter((ride) => {
      const rideDate = ride.completedAt.slice(0, 10)
      const matchesStartDate = !historyStartDate || rideDate >= historyStartDate
      const matchesEndDate = !historyEndDate || rideDate <= historyEndDate
      const matchesStatus = historyStatus === 'all' || ride.status === historyStatus
      return matchesStartDate && matchesEndDate && matchesStatus
    })
  }, [historyEndDate, historyStartDate, historyStatus])

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
        <Tabs
          value={selectedTab}
          onChange={(_, value) => setSelectedTab(value as RideTab)}
          aria-label="Abas de corridas"
          sx={{ px: 2, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Tab value="active" label={`Ativas (${activeRides.length})`} />
          <Tab value="history" label="Historico" />
          <Tab value="waiting" label={`Em Espera (${waitingRides.length})`} />
        </Tabs>

        <CardContent sx={{ p: 2.25 }}>
          {selectedTab === 'active' && (
            <ActiveRidesPanel
              activeRides={activeRides}
              activeMode={activeMode}
              mapCenter={mapCenter}
              selectedRide={selectedActiveRide}
              selectedRideId={selectedActiveRide?.id ?? ''}
              theme={theme}
              tileLayer={tileLayer}
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

          {selectedTab === 'waiting' && <WaitingRidesPanel rides={waitingRides} />}
        </CardContent>
      </Card>
    </Box>
  )
}

function ActiveRidesPanel({
  activeRides,
  activeMode,
  mapCenter,
  selectedRide,
  selectedRideId,
  theme,
  tileLayer,
  onRideSelect,
}: {
  activeRides: ActiveRideView[]
  activeMode: 'light' | 'dark'
  mapCenter: [number, number]
  selectedRide: ActiveRideView | null
  selectedRideId: string
  theme: Theme
  tileLayer: { attribution: string; url: string }
  onRideSelect: (rideId: string) => void
}) {
  return (
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
              <Typography variant="h4">Mapa - Corridas Ativas</Typography>
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
              <MapRideFocus ride={selectedRide} />
              {activeRides.map((ride) => (
                <MapRide key={ride.id} ride={ride} selected={ride.id === selectedRideId} />
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
              <ActiveRideCard key={ride.id} ride={ride} selected={ride.id === selectedRideId} onSelect={() => onRideSelect(ride.id)} />
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
  )
}

function MapRideFocus({ ride }: { ride: ActiveRideView | null }) {
  const map = useMap()

  useEffect(() => {
    if (!ride) return

    const bounds = L.latLngBounds([...ride.path, ride.driverPosition, ride.passengerPosition])
    map.fitBounds(bounds, { animate: true, duration: 0.7, padding: [46, 46], maxZoom: 15 })
  }, [map, ride])

  return null
}

function MapRide({ ride, selected }: { ride: ActiveRideView; selected: boolean }) {
  const status = statusConfig[ride.status]

  return (
    <>
      {selected && <Polyline positions={ride.path} pathOptions={{ color: '#FFFFFF', weight: 9, opacity: 0.72 }} />}
      <Polyline positions={ride.path} pathOptions={{ color: status.color, weight: selected ? 6 : 4, opacity: selected ? 1 : 0.42 }} />
      <Marker position={ride.driverPosition} icon={createRideStatusIcon(ride.status, selected)} title={`${ride.id} - ${ride.status}`}>
        <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
          {ride.id} - {ride.driver}
        </Tooltip>
      </Marker>
      <CircleMarker
        center={ride.passengerPosition}
        radius={selected ? 10 : 7}
        pathOptions={{ color: '#FFFFFF', weight: selected ? 3 : 2, fillColor: status.color, fillOpacity: selected ? 1 : 0.78 }}
      >
        <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
          {ride.passenger} - passageiro
        </Tooltip>
      </CircleMarker>
    </>
  )
}

function ActiveRideCard({ ride, selected, onSelect }: { ride: ActiveRideView; selected: boolean; onSelect: () => void }) {
  const status = statusConfig[ride.status]

  return (
    <Card
      variant="outlined"
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
      sx={{
        bgcolor: selected ? alpha(status.color, 0.08) : 'background.default',
        borderColor: selected ? status.color : 'divider',
        boxShadow: selected ? `0 0 0 2px ${alpha(status.color, 0.16)}` : 'none',
        cursor: 'pointer',
        transition: 'border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
        '&:hover': {
          borderColor: status.color,
          transform: 'translateY(-1px)',
        },
        '&:focus-visible': {
          outline: `3px solid ${alpha(status.color, 0.32)}`,
          outlineOffset: 2,
        },
      }}
    >
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

function HistoryRidesPanel({
  rides,
  startDate,
  endDate,
  status,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
}: {
  rides: HistoryRide[]
  startDate: string
  endDate: string
  status: HistoryStatusFilter
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onStatusChange: (value: HistoryStatusFilter) => void
}) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'flex-start' }} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4">Historico de corridas</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.25 }}>
              Consulte corridas registradas por periodo e status operacional.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ minWidth: { md: 520 } }}>
            <TextField
              label="Data inicial"
              type="date"
              size="small"
              value={startDate}
              onChange={(event) => onStartDateChange(event.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Data final"
              type="date"
              size="small"
              value={endDate}
              onChange={(event) => onEndDateChange(event.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              select
              label="Status"
              size="small"
              value={status}
              onChange={(event) => onStatusChange(event.target.value as HistoryStatusFilter)}
              fullWidth
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="Em andamento">Em andamento</MenuItem>
              <MenuItem value="Concluida">Concluida</MenuItem>
              <MenuItem value="Cancelada">Cancelada</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        <TableContainer>
          <Table size="small" sx={{ minWidth: 920 }}>
            <TableHead>
              <TableRow>
                {[
                  { label: '#', width: '12%' },
                  { label: 'Passageiro', width: '15%' },
                  { label: 'Motorista', width: '15%' },
                  { label: 'Rota', width: '20%' },
                  { label: 'Valor', width: '12%' },
                  { label: 'Duracao', width: '11%' },
                  { label: 'Data', width: '13%' },
                  { label: 'Status', width: '12%' },
                ].map((header) => (
                  <TableCell key={header.label} sx={{ width: header.width, color: 'text.secondary', fontWeight: 800, px: 1 }}>
                    {header.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rides.map((ride) => (
                <TableRow key={ride.id} hover>
                  <TableCell sx={rideTableCellSx}>{ride.id}</TableCell>
                  <TableCell sx={rideTableCellSx}>{ride.passenger}</TableCell>
                  <TableCell sx={rideTableCellSx}>{ride.driver}</TableCell>
                  <TableCell sx={rideTableCellSx}>{ride.route}</TableCell>
                  <TableCell sx={{ ...rideTableCellSx, fontWeight: 800 }}>{currencyFormatter.format(ride.value)}</TableCell>
                  <TableCell sx={rideTableCellSx}>{ride.duration}</TableCell>
                  <TableCell sx={rideTableCellSx}>{formatDateTime(ride.completedAt)}</TableCell>
                  <TableCell sx={{ ...rideTableCellSx, pr: 0 }}>
                    <RideStatusBadge status={ride.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {rides.length === 0 && (
          <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 3, mt: 2, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 800 }}>Nenhuma corrida encontrada</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Ajuste o periodo ou status para ampliar a busca.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

function RideStatusBadge({ status }: { status: RideStatus }) {
  const style = statusStyles[status]

  return (
    <Chip
      label={style.label}
      size="small"
      sx={{ color: style.color, bgcolor: style.background, border: `1px solid ${style.border}`, maxWidth: '100%', fontSize: 11, fontWeight: 800 }}
    />
  )
}

function WaitingRidesPanel({ rides }: { rides: WaitingRide[] }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4">Passageiros em espera</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.25 }}>
              Chamadas abertas aguardando aceite ou deslocamento de motorista.
            </Typography>
          </Box>
          <Chip label={`${rides.length} aguardando`} size="small" sx={{ fontWeight: 800, alignSelf: { xs: 'flex-start', md: 'center' } }} />
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          {rides.map((ride) => (
            <WaitingRideCard key={ride.id} ride={ride} />
          ))}
        </Box>

        {rides.length === 0 && (
          <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 3, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 800 }}>Nenhum passageiro em espera</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Novas chamadas aparecem aqui enquanto aguardam um motorista.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

function WaitingRideCard({ ride }: { ride: WaitingRide }) {
  const status = waitingStatusConfig[ride.status]

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
              label={status.label}
              sx={{ bgcolor: alpha(status.color, 0.14), color: status.color, fontWeight: 800 }}
            />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            <PersonPinCircleIcon fontSize="small" color="action" />
            <Typography noWrap sx={{ fontWeight: 800 }}>
              {ride.passenger}
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
              Origem
            </Typography>
            <Typography noWrap sx={{ fontSize: 13, fontWeight: 700 }}>
              {ride.origin}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800, mt: 0.5 }}>
              Destino
            </Typography>
            <Typography noWrap sx={{ fontSize: 13, fontWeight: 700 }}>
              {ride.destination}
            </Typography>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Chip size="small" label={ride.category} sx={{ fontWeight: 800 }} />
            <Typography sx={{ fontWeight: 900 }}>{currencyFormatter.format(ride.estimatedValue)}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
              {ride.nearbyDrivers} motoristas proximos
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
                {getElapsedMinutes(ride.requestedAt)} min
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

function normalizeWaitingRide(ride: WaitingRide): WaitingRide {
  return {
    ...ride,
    status: ride.status ?? 'Buscando motorista',
    requestedAt: ride.requestedAt ?? new Date().toISOString(),
    nearbyDrivers: ride.nearbyDrivers ?? 0,
    category: ride.category ?? 'Economico',
  }
}

function getElapsedMinutes(startedAt: string) {
  const elapsed = Date.now() - new Date(startedAt).getTime()
  return Math.max(1, Math.round(elapsed / 60_000))
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function createRideStatusIcon(status: ActiveRideStatus, selected = false) {
  const color = statusConfig[status].color
  const size = selected ? 24 : 18
  const anchor = size / 2

  return L.divIcon({
    className: '',
    html: `<span style="
      width: ${size}px;
      height: ${size}px;
      display: block;
      border-radius: 999px;
      background: ${color};
      border: 3px solid #ffffff;
      box-shadow: 0 0 0 ${selected ? 9 : 6}px ${alpha(color, selected ? 0.34 : 0.26)}, 0 12px 24px rgba(0, 0, 0, 0.28);
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
  })
}
