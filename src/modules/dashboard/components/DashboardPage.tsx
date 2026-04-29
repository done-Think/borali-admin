import { useState, type ReactElement } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import TimelineIcon from '@mui/icons-material/Timeline'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import {
  Box,
  ButtonBase,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  GlobalStyles,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import L from 'leaflet'
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import { useNavigate } from 'react-router'
import 'leaflet/dist/leaflet.css'

type KpiCard = {
  id: 'active-rides' | 'online-drivers' | 'daily-revenue' | 'pending-approvals' | 'alert-rides'
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

type ActiveRide = {
  id: string
  driver: string
  passenger: string
  origin: string
  destination: string
  value: number
}

type AlertRide = ActiveRide & {
  alertedBy: 'Motorista' | 'Passageiro'
  threatenedPerson: string
  alertReason: string
  alertTime: string
}

type DriverAvailability = {
  id: string
  name: string
  phone: string
  city: string
  vehicle: string
  lastSeen: string
}

type DriverApplication = {
  id: string
  name: string
  cpf: string
  phone: string
  email: string
  city: string
  vehicle: string
  plate: string
  category: string
  requestedAt: string
  expiresIn: string
}

type RevenuePeriod = 'day' | 'week' | 'month'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const kpiCards: KpiCard[] = [
  {
    id: 'active-rides',
    title: 'Corridas ativas',
    value: '38',
    subtitle: '+14% entrando agora',
    icon: <LocalTaxiIcon />,
    color: '#0ABEE9',
  },
  {
    id: 'online-drivers',
    title: 'Motoristas online',
    value: '214',
    subtitle: '+18 novos hoje',
    icon: <DirectionsCarIcon />,
    color: '#2DD4A0',
  },
  {
    id: 'daily-revenue',
    title: 'Receita do dia',
    value: currencyFormatter.format(18420),
    subtitle: '+8,4% vs. ontem',
    icon: <MonetizationOnIcon />,
    color: '#F59E0B',
  },
  {
    id: 'pending-approvals',
    title: 'Aprovacoes pend.',
    value: '17',
    subtitle: '5 expiram em 2h',
    icon: <PendingActionsIcon />,
    color: '#8B5CF6',
  },
  {
    id: 'alert-rides',
    title: 'Corrida em Alerta',
    value: '3',
    subtitle: '1 alerta critico agora',
    icon: <WarningAmberIcon />,
    color: '#EF4444',
  },
]

const activeRides: ActiveRide[] = [
  { id: 'BRL-84211', driver: 'Rafael Souza', passenger: 'Marina Lopes', origin: 'Av. Paulista, 1578', destination: 'Centro Historico', value: 48.9 },
  { id: 'BRL-84212', driver: 'Bianca Costa', passenger: 'Joao Lima', origin: 'Moema', destination: 'Aeroporto de Congonhas', value: 36.5 },
  { id: 'BRL-84213', driver: 'Luis Prado', passenger: 'Ana Beatriz', origin: 'Pinheiros', destination: 'Itaim Bibi', value: 29.8 },
  { id: 'BRL-84214', driver: 'Clara Alves', passenger: 'Pedro Rocha', origin: 'Vila Madalena', destination: 'Se', value: 42.2 },
  { id: 'BRL-84215', driver: 'Andre Mota', passenger: 'Luiza Martins', origin: 'Tatuape', destination: 'Jardins', value: 64.7 },
]

const alertRides: AlertRide[] = [
  {
    id: 'BRL-84216',
    driver: 'Helena Duarte',
    passenger: 'Roberto Maia',
    origin: 'Rua Augusta, 900',
    destination: 'Barra Funda',
    value: 52.4,
    alertedBy: 'Passageiro',
    threatenedPerson: 'Roberto Maia',
    alertReason: 'Passageiro relatou desvio de rota e comportamento agressivo',
    alertTime: 'agora',
  },
  {
    id: 'BRL-84217',
    driver: 'Igor Santana',
    passenger: 'Patricia Nogueira',
    origin: 'Vila Olimpia',
    destination: 'Liberdade',
    value: 44.8,
    alertedBy: 'Motorista',
    threatenedPerson: 'Igor Santana',
    alertReason: 'Motorista acionou alerta por ameaça verbal durante a corrida',
    alertTime: 'ha 4 min',
  },
  {
    id: 'BRL-84218',
    driver: 'Diego Ramos',
    passenger: 'Fernanda Lima',
    origin: 'Santana',
    destination: 'Pinheiros',
    value: 71.2,
    alertedBy: 'Passageiro',
    threatenedPerson: 'Fernanda Lima',
    alertReason: 'Passageira se sentiu ameaçada no embarque',
    alertTime: 'ha 9 min',
  },
]

const driversAcceptingRides: DriverAvailability[] = [
  { id: 'DRV-1001', name: 'Renato Almeida', phone: '(21) 99218-4402', city: 'Rio de Janeiro, RJ', vehicle: 'Toyota Corolla 2022', lastSeen: 'aceitando agora' },
  { id: 'DRV-1002', name: 'Patricia Nogueira', phone: '(41) 99731-6508', city: 'Curitiba, PR', vehicle: 'Honda City 2021', lastSeen: 'aceitando ha 2 min' },
  { id: 'DRV-1006', name: 'Fernanda Lima', phone: '(85) 99810-1247', city: 'Sao Paulo, SP', vehicle: 'Jeep Compass 2022', lastSeen: 'aceitando ha 4 min' },
  { id: 'DRV-1009', name: 'Igor Santana', phone: '(71) 98720-4410', city: 'Sao Paulo, SP', vehicle: 'Toyota Corolla 2021', lastSeen: 'aceitando ha 6 min' },
]

const driversAppOpenOnly: DriverAvailability[] = [
  { id: 'DRV-1003', name: 'Bruno Martins', phone: '(11) 98140-2208', city: 'Sao Paulo, SP', vehicle: 'Veiculo cadastrado', lastSeen: 'app aberto ha 3 min' },
  { id: 'DRV-1007', name: 'Gustavo Moreira', phone: '(62) 98845-9012', city: 'Sao Paulo, SP', vehicle: 'Veiculo cadastrado', lastSeen: 'app aberto ha 8 min' },
  { id: 'DRV-1010', name: 'Juliana Freitas', phone: '(48) 99670-1123', city: 'Sao Paulo, SP', vehicle: 'Veiculo cadastrado', lastSeen: 'app aberto ha 11 min' },
]

const driverApplications: DriverApplication[] = [
  {
    id: 'REQ-2026-0428-01',
    name: 'Samuel Andrade',
    cpf: '840.217.390-12',
    phone: '(11) 98244-1188',
    email: 'samuel.andrade@email.com',
    city: 'Sao Paulo, SP',
    vehicle: 'Hyundai HB20 2023',
    plate: 'SMA-2D18',
    category: 'Conforto',
    requestedAt: 'Hoje as 10:12',
    expiresIn: 'expira em 2h',
  },
  {
    id: 'REQ-2026-0428-02',
    name: 'Taina Ribeiro',
    cpf: '219.684.730-55',
    phone: '(21) 99830-7741',
    email: 'taina.ribeiro@email.com',
    city: 'Rio de Janeiro, RJ',
    vehicle: 'Jeep Compass 2022',
    plate: 'TRB-9A42',
    category: 'Executivo',
    requestedAt: 'Hoje as 11:03',
    expiresIn: 'expira em 4h',
  },
  {
    id: 'REQ-2026-0428-03',
    name: 'Carla Teixeira',
    cpf: '501.738.920-44',
    phone: '(31) 98418-5530',
    email: 'carla.teixeira@email.com',
    city: 'Belo Horizonte, MG',
    vehicle: 'Toyota Corolla 2021',
    plate: 'CTE-7H21',
    category: 'Economico',
    requestedAt: 'Ontem as 18:40',
    expiresIn: 'expira em 8h',
  },
]

const revenueComparisons: Record<
  RevenuePeriod,
  {
    label: string
    currentLabel: string
    previousLabel: string
    data: Array<{ label: string; atual: number; anterior: number }>
  }
> = {
  day: {
    label: 'Hoje vs ontem',
    currentLabel: 'Hoje',
    previousLabel: 'Ontem',
    data: [
      { label: '00h', atual: 420, anterior: 380 },
      { label: '04h', atual: 610, anterior: 520 },
      { label: '08h', atual: 2480, anterior: 2210 },
      { label: '12h', atual: 3890, anterior: 3420 },
      { label: '16h', atual: 5220, anterior: 4660 },
      { label: '20h', atual: 5800, anterior: 5010 },
    ],
  },
  week: {
    label: 'Semana vs semana atras',
    currentLabel: 'Esta semana',
    previousLabel: 'Semana anterior',
    data: [
      { label: 'Seg', atual: 12800, anterior: 11300 },
      { label: 'Ter', atual: 14200, anterior: 13050 },
      { label: 'Qua', atual: 18420, anterior: 16980 },
      { label: 'Qui', atual: 17600, anterior: 15840 },
      { label: 'Sex', atual: 21300, anterior: 19620 },
      { label: 'Sab', atual: 23800, anterior: 21550 },
      { label: 'Dom', atual: 20100, anterior: 18430 },
    ],
  },
  month: {
    label: 'Mes vs mes atras',
    currentLabel: 'Mes atual',
    previousLabel: 'Mes anterior',
    data: [
      { label: 'Sem 1', atual: 84200, anterior: 79100 },
      { label: 'Sem 2', atual: 92600, anterior: 86100 },
      { label: 'Sem 3', atual: 101400, anterior: 94400 },
      { label: 'Sem 4', atual: 110800, anterior: 103200 },
    ],
  },
}

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
  { id: 'act-1', type: 'ride', title: 'Corridas ativas no momento', description: '38 corridas em andamento na operacao', timestamp: 'agora' },
  { id: 'act-2', type: 'payment', title: 'Valor Medio Arrecadado', description: 'Ticket medio atual de R$ 42,80', timestamp: 'ha 3 min' },
  { id: 'act-3', type: 'driver', title: 'Motoristas online', description: '214 motoristas disponiveis na plataforma', timestamp: 'ha 7 min' },
  { id: 'act-4', type: 'alert', title: 'Cancelamento medio', description: 'Media operacional em 4,2% nas ultimas horas', timestamp: 'ha 12 min' },
  { id: 'act-5', type: 'done', title: 'Corridas concluida', description: '126 corridas finalizadas hoje', timestamp: 'ha 18 min' },
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
  const [activeRidesOpen, setActiveRidesOpen] = useState(false)
  const [revenueOpen, setRevenueOpen] = useState(false)
  const [approvalsOpen, setApprovalsOpen] = useState(false)
  const [alertRidesOpen, setAlertRidesOpen] = useState(false)
  const [onlineDriversOpen, setOnlineDriversOpen] = useState(false)

  function handleKpiClick(card: KpiCard) {
    if (card.id === 'active-rides') {
      setActiveRidesOpen(true)
    }

    if (card.id === 'daily-revenue') {
      setRevenueOpen(true)
    }

    if (card.id === 'online-drivers') {
      setOnlineDriversOpen(true)
    }

    if (card.id === 'pending-approvals') {
      setApprovalsOpen(true)
    }

    if (card.id === 'alert-rides') {
      setAlertRidesOpen(true)
    }
  }

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
            lg: 'repeat(5, minmax(0, 1fr))',
          },
        }}
      >
        {kpiCards.map((card) => (
          <MetricCard key={card.id} card={card} onClick={() => handleKpiClick(card)} />
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
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'minmax(0, 0.9fr) minmax(520px, 1.1fr)',
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
                  <Bar dataKey="rides" radius={[6, 6, 0, 0]} isAnimationActive={false}>
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
              <Table size="small" sx={{ width: '100%', tableLayout: 'fixed' }}>
                <TableHead>
                  <TableRow>
                    {[
                      { label: '#', width: '13%' },
                      { label: 'Passageiro', width: '16%' },
                      { label: 'Motorista', width: '16%' },
                      { label: 'Rota', width: '21%' },
                      { label: 'Valor', width: '13%' },
                      { label: 'Status', width: '21%' },
                    ].map((header) => (
                      <TableCell key={header.label} sx={{ width: header.width, color: 'text.secondary', fontWeight: 800, px: 1 }}>
                        {header.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentRides.map((ride) => (
                    <TableRow key={ride.id} hover>
                      <TableCell sx={rideTableCellSx}>{ride.id}</TableCell>
                      <TableCell sx={rideTableCellSx}>{ride.passenger}</TableCell>
                      <TableCell sx={rideTableCellSx}>{ride.driver}</TableCell>
                      <TableCell sx={rideTableCellSx}>{ride.route}</TableCell>
                      <TableCell sx={{ ...rideTableCellSx, fontWeight: 800 }}>{currencyFormatter.format(ride.value)}</TableCell>
                      <TableCell sx={{ ...rideTableCellSx, pr: 0 }}>
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

      <ActiveRidesDialog open={activeRidesOpen} onClose={() => setActiveRidesOpen(false)} />
      <RevenueDialog open={revenueOpen} onClose={() => setRevenueOpen(false)} />
      <PendingApprovalsDialog open={approvalsOpen} onClose={() => setApprovalsOpen(false)} />
      <AlertRidesDialog open={alertRidesOpen} onClose={() => setAlertRidesOpen(false)} />
      <OnlineDriversDialog open={onlineDriversOpen} onClose={() => setOnlineDriversOpen(false)} />
    </Box>
  )
}

function MetricCard({ card, onClick }: { card: KpiCard; onClick: () => void }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        transition: '160ms ease',
        '&:hover': {
          borderColor: card.color,
          boxShadow: 3,
        },
      }}
    >
      <ButtonBase
        onClick={onClick}
        sx={{
          width: '100%',
          height: '100%',
          display: 'block',
          textAlign: 'left',
          borderRadius: 'inherit',
        }}
      >
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
      </ButtonBase>
    </Card>
  )
}

function ActiveRidesDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4">Corridas ativas</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Motoristas em corrida, passageiro, rota e valor atual.
            </Typography>
          </Box>
          <Chip label={`${activeRides.length} em andamento`} color="secondary" variant="outlined" sx={{ fontWeight: 800 }} />
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <TableContainer>
          <Table size="small" sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                {['#', 'Motorista', 'Passageiro', 'Partida', 'Destino', 'Valor'].map((header) => (
                  <TableCell key={header} sx={{ color: 'text.secondary', fontWeight: 800 }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {activeRides.map((ride) => (
                <TableRow key={ride.id} hover>
                  <TableCell sx={{ fontWeight: 800 }}>{ride.id}</TableCell>
                  <TableCell>{ride.driver}</TableCell>
                  <TableCell>{ride.passenger}</TableCell>
                  <TableCell>{ride.origin}</TableCell>
                  <TableCell>{ride.destination}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{currencyFormatter.format(ride.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  )
}

function AlertRidesDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4">Corridas em alerta</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Alertas acionados durante corridas em andamento.
            </Typography>
          </Box>
          <Chip label={`${alertRides.length} alertas ativos`} color="error" variant="outlined" sx={{ fontWeight: 800 }} />
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <TableContainer>
          <Table size="small" sx={{ minWidth: 960 }}>
            <TableHead>
              <TableRow>
                {['#', 'Alerta', 'Quem se sentiu ameacado', 'Motorista', 'Passageiro', 'Partida', 'Destino', 'Valor'].map((header) => (
                  <TableCell key={header} sx={{ color: 'text.secondary', fontWeight: 800 }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {alertRides.map((ride) => (
                <TableRow key={ride.id} hover>
                  <TableCell sx={{ fontWeight: 800 }}>{ride.id}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          color: '#EF4444',
                          bgcolor: 'rgba(239, 68, 68, 0.14)',
                          flex: '0 0 auto',
                        }}
                      >
                        <WarningAmberIcon fontSize="small" />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 13 }}>{ride.alertedBy}</Typography>
                        <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                          {ride.alertTime}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 900 }}>{ride.threatenedPerson}</Typography>
                    <Typography color="error.main" sx={{ fontSize: 12, fontWeight: 700 }}>
                      {ride.alertReason}
                    </Typography>
                  </TableCell>
                  <TableCell>{ride.driver}</TableCell>
                  <TableCell>{ride.passenger}</TableCell>
                  <TableCell>{ride.origin}</TableCell>
                  <TableCell>{ride.destination}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{currencyFormatter.format(ride.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  )
}

function OnlineDriversDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()

  function openDriverDetails(driverId: string) {
    navigate('/drivers', {
      state: {
        selectedDriverId: driverId,
        selectedDriverTab: 0,
      },
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4">Motoristas online</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Motoristas aceitando corrida e motoristas apenas com o app aberto.
            </Typography>
          </Box>
          <Chip label={`${driversAcceptingRides.length + driversAppOpenOnly.length} com app ativo`} color="secondary" variant="outlined" sx={{ fontWeight: 800 }} />
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
            alignItems: 'start',
          }}
        >
          <DriverAvailabilitySection
            title="Aceitando corrida"
            subtitle="Motoristas online, ativos e disponiveis para receber chamadas."
            color="#2DD4A0"
            drivers={driversAcceptingRides}
            onSelectDriver={openDriverDetails}
          />
          <DriverAvailabilitySection
            title="App aberto, não ativos"
            subtitle="Motoristas com aplicativo aberto, mas sem aceitar chamadas no momento."
            color="#F59E0B"
            drivers={driversAppOpenOnly}
            onSelectDriver={openDriverDetails}
          />
        </Box>
      </DialogContent>
    </Dialog>
  )
}

function DriverAvailabilitySection({
  title,
  subtitle,
  color,
  drivers,
  onSelectDriver,
}: {
  title: string
  subtitle: string
  color: string
  drivers: DriverAvailability[]
  onSelectDriver: (driverId: string) => void
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4">{title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          </Box>
          <Chip label={drivers.length} size="small" sx={{ color, borderColor: color, fontWeight: 900 }} variant="outlined" />
        </Stack>

        <Stack spacing={1.25}>
          {drivers.map((driver) => (
            <Box
              key={driver.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectDriver(driver.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectDriver(driver.id)
                }
              }}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.5,
                p: 1.5,
                cursor: 'pointer',
                transition: '160ms ease',
                '&:hover': {
                  borderColor: color,
                  boxShadow: 2,
                },
              }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flex: '0 0 auto' }} />
                    <Typography sx={{ fontWeight: 900 }}>{driver.name}</Typography>
                  </Stack>
                  <Typography color="text.secondary" sx={{ mt: 0.35, fontSize: 12 }}>
                    {driver.phone} | {driver.city}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 13 }}>{driver.vehicle}</Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                    {driver.lastSeen}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

function RevenueDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useTheme()
  const [period, setPeriod] = useState<RevenuePeriod>('day')
  const comparison = revenueComparisons[period]
  const currentTotal = comparison.data.reduce((total, item) => total + item.atual, 0)
  const previousTotal = comparison.data.reduce((total, item) => total + item.anterior, 0)
  const variation = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0

  function handlePeriodChange(_: React.MouseEvent<HTMLElement>, value: RevenuePeriod | null) {
    if (value) {
      setPeriod(value)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4">Receita do dia</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Comparativo de receita por periodo.
            </Typography>
          </Box>

          <ToggleButtonGroup exclusive size="small" value={period} onChange={handlePeriodChange} aria-label="Periodo de comparacao">
            <ToggleButton value="day">Hoje vs ontem</ToggleButton>
            <ToggleButton value="week">Semana</ToggleButton>
            <ToggleButton value="month">Mes</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            }}
          >
            <RevenueMetric label={comparison.currentLabel} value={currencyFormatter.format(currentTotal)} color="secondary.main" />
            <RevenueMetric label={comparison.previousLabel} value={currencyFormatter.format(previousTotal)} color="text.secondary" />
            <RevenueMetric label="Variacao" value={`${variation >= 0 ? '+' : ''}${variation.toFixed(1)}%`} color={variation >= 0 ? 'success.main' : 'error.main'} />
          </Box>

          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
                <Box>
                  <Typography fontWeight={800}>{comparison.label}</Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.25 }}>
                    Valores acumulados em {comparison.data.length} pontos do periodo.
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ height: 360 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparison.data} margin={{ top: 12, right: 16, bottom: 0, left: 4 }}>
                    <CartesianGrid stroke={theme.palette.divider} vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => currencyFormatter.format(Number(value)).replace(',00', '')}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(10, 190, 233, 0.08)' }}
                      formatter={(value, name) => [currencyFormatter.format(Number(value)), name === 'atual' ? comparison.currentLabel : comparison.previousLabel]}
                      contentStyle={{
                        borderRadius: 8,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[6],
                      }}
                    />
                    <Legend />
                    <Bar dataKey="anterior" name={comparison.previousLabel} fill={alpha(theme.palette.text.secondary, 0.45)} radius={[6, 6, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="atual" name={comparison.currentLabel} fill={theme.palette.secondary.main} radius={[6, 6, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

function RevenueMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      <Typography color="text.secondary" fontWeight={700}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ color, mt: 0.75 }}>
        {value}
      </Typography>
    </Box>
  )
}

function PendingApprovalsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const navigate = useNavigate()

  function openDriverRequest(requestId: string) {
    navigate('/drivers', {
      state: {
        openNewDriverDialog: true,
        expandedRequestId: requestId,
      },
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4">Aprovacoes pendentes</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Novos possiveis motoristas aguardando analise cadastral.
            </Typography>
          </Box>
          <Chip label={`${driverApplications.length} cadastros`} color="secondary" variant="outlined" sx={{ fontWeight: 800 }} />
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={1.5}>
          {driverApplications.map((application) => {
            const expanded = expandedId === application.id

            return (
              <Card key={application.id} variant="outlined">
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1.5}
                    alignItems={{ xs: 'stretch', md: 'center' }}
                    justifyContent="space-between"
                  >
                    <Box
                      sx={{
                        display: 'grid',
                        gap: 1.5,
                        gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr 1fr' },
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <CompactApplicationField label="Nome" value={application.name} />
                      <CompactApplicationField label="CPF" value={application.cpf} />
                      <CompactApplicationField label="Telefone" value={application.phone} />
                    </Box>

                    <ButtonBase
                      onClick={() => setExpandedId(expanded ? null : application.id)}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1.5,
                        px: 1.5,
                        py: 1,
                        fontWeight: 800,
                        color: 'text.primary',
                        minWidth: 118,
                      }}
                    >
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <span>{expanded ? 'Recolher' : 'Expandir'}</span>
                        <ExpandMoreIcon
                          fontSize="small"
                          sx={{
                            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 160ms ease',
                          }}
                        />
                      </Stack>
                    </ButtonBase>
                  </Stack>

                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Box
                      sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        display: 'grid',
                        gap: 1.5,
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
                      }}
                    >
                      <ApplicationDetail label="E-mail" value={application.email} />
                      <ApplicationDetail label="Cidade" value={application.city} />
                      <ApplicationDetail label="Veiculo" value={application.vehicle} />
                      <ApplicationDetail label="Placa" value={application.plate} />
                      <ApplicationDetail label="Categoria" value={application.category} />
                      <ApplicationDetail label="Solicitado em" value={application.requestedAt} />
                      <ApplicationDetail label="Prazo" value={application.expiresIn} />
                      <ApplicationDetail label="Protocolo" value={application.id} />
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gridColumn: { xs: 'auto', md: 'span 4' },
                        }}
                      >
                        <ButtonBase
                          onClick={() => openDriverRequest(application.id)}
                          sx={{
                            border: '1px solid',
                            borderColor: 'secondary.main',
                            borderRadius: 1.5,
                            color: 'secondary.main',
                            px: 2,
                            py: 1,
                            fontWeight: 800,
                          }}
                        >
                          Ver cadastro completo em Motoristas
                        </ButtonBase>
                      </Box>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            )
          })}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

function CompactApplicationField({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="baseline" sx={{ minWidth: 0 }}>
      <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800, flex: '0 0 auto' }}>
        {label}
      </Typography>
      <Typography noWrap sx={{ fontWeight: 800, minWidth: 0 }}>
        {value}
      </Typography>
    </Stack>
  )
}

function ApplicationDetail({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 1.5 }}>
      <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 0.5, fontWeight: 800 }}>{value}</Typography>
    </Box>
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

const rideTableCellSx = {
  px: 1,
  fontSize: 12,
  fontWeight: 700,
  overflowWrap: 'anywhere',
  verticalAlign: 'middle',
}

function ActivityList({ items, compact = false }: { items: Activity[]; compact?: boolean }) {
  const theme = useTheme()

  return (
    <Stack
      spacing={1.25}
      sx={{
        bgcolor: alpha(theme.palette.secondary.main, 0.06),
        borderRadius: 2,
        p: compact ? 1 : 1.25,
        '[data-toolpad-color-scheme="dark"] &': {
          bgcolor: alpha(theme.palette.common.black, 0.22),
        },
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
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              px: 1.25,
              py: 1,
              '[data-toolpad-color-scheme="dark"] &': {
                bgcolor: alpha(theme.palette.background.default, 0.5),
              },
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
                <Typography sx={{ color: 'text.primary', fontSize: 13, fontWeight: 800, lineHeight: 1.25 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 11, flex: '0 0 auto', pt: 0.15 }}>{item.timestamp}</Typography>
              </Stack>
              <Typography
                noWrap
                sx={{
                  color: 'secondary.dark',
                  fontSize: 12,
                  mt: 0.35,
                  '[data-toolpad-color-scheme="dark"] &': {
                    color: 'secondary.light',
                  },
                }}
              >
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
        maxWidth: '100%',
        fontSize: 11,
        fontWeight: 800,
      }}
    />
  )
}
