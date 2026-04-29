import type { ReactElement } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import TimelineIcon from '@mui/icons-material/Timeline'
import {
  Box,
  Card,
  CardContent,
  Chip,
  GlobalStyles,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
import L from 'leaflet'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

type KpiCard = {
  title: string
  value: string
  subtitle: string
  icon: ReactElement
  color: string
}

type MapMarker = {
  id: string
  type: 'driver' | 'passenger'
  label: string
  position: [number, number]
}

type ActivityType = 'ride' | 'payment' | 'driver' | 'alert' | 'done'

type Activity = {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
}

type RideStatus = 'Concluida' | 'Cancelada' | 'Em andamento'

type RecentRide = {
  id: string
  passenger: string
  driver: string
  route: string
  value: number
  status: RideStatus
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const kpiCards: KpiCard[] = [
  {
    title: 'Corridas ativas',
    value: '38',
    subtitle: '+14% entrando agora',
    icon: <LocalTaxiIcon />,
    color: '#0ABEE9',
  },
  {
    title: 'Motoristas online',
    value: '214',
    subtitle: '+18 novos hoje',
    icon: <DirectionsCarIcon />,
    color: '#2DD4A0',
  },
  {
    title: 'Receita do dia',
    value: currencyFormatter.format(18420),
    subtitle: '+8,4% vs. ontem',
    icon: <MonetizationOnIcon />,
    color: '#F59E0B',
  },
  {
    title: 'Aprovacoes pend.',
    value: '17',
    subtitle: '5 expiram em 2h',
    icon: <PendingActionsIcon />,
    color: '#8B5CF6',
  },
]

const rideLine: [number, number][] = [
  [-23.5617, -46.6559],
  [-23.5569, -46.6482],
  [-23.5505, -46.6333],
  [-23.5446, -46.6271],
]

const secondRideLine: [number, number][] = [
  [-23.5731, -46.6413],
  [-23.5662, -46.6352],
  [-23.5586, -46.628],
]

const mapMarkers: MapMarker[] = [
  { id: 'driver-1', type: 'driver', label: 'Rafael Souza - motorista', position: [-23.5617, -46.6559] },
  { id: 'driver-2', type: 'driver', label: 'Bianca Costa - motorista', position: [-23.5731, -46.6413] },
  { id: 'driver-3', type: 'driver', label: 'Luis Prado - motorista', position: [-23.5484, -46.6388] },
  { id: 'passenger-1', type: 'passenger', label: 'Marina Lopes - passageira', position: [-23.5446, -46.6271] },
  { id: 'passenger-2', type: 'passenger', label: 'Joao Lima - passageiro', position: [-23.5586, -46.628] },
  { id: 'passenger-3', type: 'passenger', label: 'Ana Beatriz - passageira', position: [-23.5569, -46.6482] },
]

const ridesPerHour = [
  { hour: '00h', rides: 18 },
  { hour: '01h', rides: 14 },
  { hour: '02h', rides: 10 },
  { hour: '03h', rides: 8 },
  { hour: '04h', rides: 12 },
  { hour: '05h', rides: 22 },
  { hour: '06h', rides: 41 },
  { hour: '07h', rides: 68 },
  { hour: '08h', rides: 92 },
  { hour: '09h', rides: 76 },
  { hour: '10h', rides: 64 },
  { hour: '11h', rides: 72 },
  { hour: '12h', rides: 88 },
  { hour: '13h', rides: 83 },
  { hour: '14h', rides: 79 },
  { hour: '15h', rides: 84 },
  { hour: '16h', rides: 96 },
  { hour: '17h', rides: 118 },
  { hour: '18h', rides: 132 },
  { hour: '19h', rides: 124 },
  { hour: '20h', rides: 101 },
  { hour: '21h', rides: 89 },
  { hour: '22h', rides: 57 },
  { hour: '23h', rides: 34 },
]

const activities: Activity[] = [
  { id: 'act-1', type: 'ride', title: 'Corrida iniciada', description: 'BRL-84211 saiu da Av. Paulista', timestamp: 'agora' },
  { id: 'act-2', type: 'payment', title: 'Pagamento aprovado', description: 'R$ 48,90 via cartao', timestamp: 'ha 3 min' },
  { id: 'act-3', type: 'driver', title: 'Motorista online', description: 'Carla Teixeira entrou na zona Centro', timestamp: 'ha 7 min' },
  { id: 'act-4', type: 'alert', title: 'Cancelamento acima da media', description: 'Pinheiros teve 4 cancelamentos', timestamp: 'ha 12 min' },
  { id: 'act-5', type: 'done', title: 'Corrida concluida', description: 'BRL-84203 finalizada em 22 min', timestamp: 'ha 18 min' },
]

const recentRides: RecentRide[] = [
  { id: 'BRL-84211', passenger: 'Marina Lopes', driver: 'Rafael Souza', route: 'Paulista -> Centro', value: 48.9, status: 'Em andamento' },
  { id: 'BRL-84210', passenger: 'Joao Lima', driver: 'Bianca Costa', route: 'Moema -> Congonhas', value: 36.5, status: 'Concluida' },
  { id: 'BRL-84209', passenger: 'Ana Beatriz', driver: 'Luis Prado', route: 'Pinheiros -> Itaim', value: 29.8, status: 'Cancelada' },
  { id: 'BRL-84208', passenger: 'Pedro Rocha', driver: 'Clara Alves', route: 'Vila Madalena -> Se', value: 42.2, status: 'Concluida' },
  { id: 'BRL-84207', passenger: 'Luiza Martins', driver: 'Andre Mota', route: 'Tatuape -> Jardins', value: 64.7, status: 'Em andamento' },
]

const activityStyles: Record<ActivityType, { icon: ReactElement; color: string }> = {
  ride: { icon: <TimelineIcon fontSize="small" />, color: '#0ABEE9' },
  payment: { icon: <MonetizationOnIcon fontSize="small" />, color: '#F59E0B' },
  driver: { icon: <DirectionsCarIcon fontSize="small" />, color: '#2DD4A0' },
  alert: { icon: <ReportProblemIcon fontSize="small" />, color: '#EF4444' },
  done: { icon: <CheckCircleIcon fontSize="small" />, color: '#0ABEE9' },
}

const statusStyles: Record<RideStatus, { label: string; color: string; background: string; border: string }> = {
  Concluida: {
    label: 'Concluida',
    color: '#15803D',
    background: '#DCFCE7',
    border: '#86EFAC',
  },
  Cancelada: {
    label: 'Cancelada',
    color: '#B91C1C',
    background: '#FEE2E2',
    border: '#FCA5A5',
  },
  'Em andamento': {
    label: 'Em andamento',
    color: '#B45309',
    background: '#FEF3C7',
    border: '#FCD34D',
  },
}

function createMapIcon(type: MapMarker['type']) {
  const isDriver = type === 'driver'
  const color = isDriver ? '#2563EB' : '#22D3EE'
  const shadow = isDriver ? 'rgba(37, 99, 235, 0.28)' : 'rgba(34, 211, 238, 0.28)'

  return L.divIcon({
    className: '',
    html: `<span style="
      width: 18px;
      height: 18px;
      display: block;
      border-radius: 999px;
      background: ${color};
      border: 3px solid #ffffff;
      box-shadow: 0 0 0 6px ${shadow}, 0 12px 24px rgba(0, 0, 0, 0.28);
    "></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

const driverIcon = createMapIcon('driver')
const passengerIcon = createMapIcon('passenger')
const peakRides = Math.max(...ridesPerHour.map((item) => item.rides))

export default function DashboardPage() {
  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <GlobalStyles
        styles={{
          '.leaflet-container': {
            minHeight: '100%',
            backgroundColor: '#0A0E1A',
            fontFamily: 'inherit',
          },
          '.leaflet-control-attribution': {
            backgroundColor: 'rgba(10, 14, 26, 0.78) !important',
            color: '#CBD5E1 !important',
          },
          '.leaflet-control-attribution a': {
            color: '#67E8F9 !important',
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
            lg: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        {kpiCards.map((card) => (
          <MetricCard key={card.title} card={card} />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'minmax(0, 1.35fr) minmax(320px, 0.65fr)',
          },
          alignItems: 'stretch',
        }}
      >
        <Card variant="outlined" sx={{ overflow: 'hidden' }}>
          <CardContent sx={{ p: 2.25 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h4">Mapa ao vivo</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.25 }}>
                  Motoristas, passageiros e linhas de corrida em andamento.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flexShrink: 0 }}>
                <MapLegend color="#2563EB" label="Motorista" />
                <MapLegend color="#22D3EE" label="Passageiro" />
              </Stack>
            </Stack>

            <Box
              sx={{
                height: { xs: 340, md: 460 },
                overflow: 'hidden',
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <MapContainer
                center={[-23.5573, -46.6412]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap &copy; CARTO'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <Polyline positions={rideLine} pathOptions={{ color: '#0ABEE9', weight: 5, opacity: 0.88 }} />
                <Polyline positions={secondRideLine} pathOptions={{ color: '#2DD4A0', weight: 4, opacity: 0.76, dashArray: '8 10' }} />
                {mapMarkers.map((marker) => (
                  <Marker
                    key={marker.id}
                    position={marker.position}
                    icon={marker.type === 'driver' ? driverIcon : passengerIcon}
                    title={marker.label}
                  />
                ))}
              </MapContainer>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent sx={{ p: 2.25 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
              <Typography variant="h4">Resumo ao vivo</Typography>
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
          gridTemplateColumns: {
            xs: '1fr',
            xl: 'minmax(0, 0.95fr) minmax(540px, 1.05fr)',
          },
          alignItems: 'stretch',
        }}
      >
        <Card variant="outlined">
          <CardContent sx={{ p: 2.25 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h4">Corridas / hora - Ultimas 24h</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.25 }}>
                  Volume por faixa horaria com destaque para o pico.
                </Typography>
              </Box>
              <Chip label="pico 18h" size="small" color="secondary" variant="outlined" sx={{ fontWeight: 800 }} />
            </Stack>

            <Box sx={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ridesPerHour} margin={{ top: 12, right: 8, bottom: 0, left: -24 }}>
                  <CartesianGrid stroke={theme.palette.divider} vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(10, 190, 233, 0.08)' }}
                    contentStyle={{
                      borderRadius: 8,
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: theme.shadows[6],
                    }}
                  />
                  <Bar dataKey="rides" radius={[6, 6, 0, 0]}>
                    {ridesPerHour.map((entry) => (
                      <Cell key={entry.hour} fill={entry.rides === peakRides ? '#22D3EE' : '#2563EB'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent sx={{ p: 2.25 }}>
            <Typography variant="h4">Ultimas corridas</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.25, mb: 2 }}>
              Corridas mais recentes registradas pela operacao.
            </Typography>

            <TableContainer>
              <Table size="small" sx={{ minWidth: 680 }}>
                <TableHead>
                  <TableRow>
                    {['#', 'Passageiro', 'Motorista', 'Rota', 'Valor', 'Status'].map((header) => (
                      <TableCell key={header} sx={{ color: 'text.secondary', fontWeight: 800 }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentRides.map((ride) => (
                    <TableRow key={ride.id} hover>
                      <TableCell sx={{ fontWeight: 800 }}>{ride.id}</TableCell>
                      <TableCell>{ride.passenger}</TableCell>
                      <TableCell>{ride.driver}</TableCell>
                      <TableCell>{ride.route}</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>{currencyFormatter.format(ride.value)}</TableCell>
                      <TableCell>
                        <RideStatusBadge status={ride.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

function MetricCard({ card }: { card: KpiCard }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              flex: '0 0 auto',
              color: card.color,
              bgcolor: `${card.color}1F`,
              '& svg': {
                fontSize: 24,
              },
            }}
          >
            {card.icon}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography color="text.secondary" fontWeight={700}>
              {card.title}
            </Typography>
            <Typography variant="h3" sx={{ mt: 0.5, lineHeight: 1.1 }}>
              {card.value}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
              {card.subtitle}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

function MapLegend({ color, label }: { color: string; label: string }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: color }} />
      <Typography color="text.secondary" fontWeight={700} sx={{ fontSize: 12 }}>
        {label}
      </Typography>
    </Stack>
  )
}

function ActivityList({ items, compact = false }: { items: Activity[]; compact?: boolean }) {
  return (
    <Stack
      spacing={1.25}
      sx={{
        bgcolor: '#111827',
        borderRadius: 2,
        p: compact ? 1 : 1.25,
      }}
    >
      {items.map((item) => {
        const style = activityStyles[item.type]

        return (
          <Stack
            key={item.id}
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{
              minHeight: compact ? 56 : 66,
              borderRadius: 1.5,
              border: '1px solid rgba(148, 163, 184, 0.12)',
              bgcolor: '#0F172A',
              px: 1.25,
              py: 1,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                flex: '0 0 auto',
                color: style.color,
                bgcolor: `${style.color}22`,
              }}
            >
              {style.icon}
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
                <Typography sx={{ color: '#FFFFFF', fontSize: 13, fontWeight: 800, lineHeight: 1.25 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: '#7EA1D1', fontSize: 11, flex: '0 0 auto', pt: 0.15 }}>{item.timestamp}</Typography>
              </Stack>
              <Typography noWrap sx={{ color: '#9CC8F5', fontSize: 12, mt: 0.35 }}>
                {item.description}
              </Typography>
            </Box>
          </Stack>
        )
      })}
    </Stack>
  )
}

function RideStatusBadge({ status }: { status: RideStatus }) {
  const style = statusStyles[status]

  return (
    <Chip
      label={style.label}
      size="small"
      sx={{
        color: style.color,
        bgcolor: style.background,
        border: `1px solid ${style.border}`,
        fontWeight: 800,
      }}
    />
  )
}
