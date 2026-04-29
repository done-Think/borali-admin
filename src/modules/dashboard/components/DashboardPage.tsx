import type { ReactElement } from 'react'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import {
  Box,
  Card,
  CardContent,
  Chip,
  GlobalStyles,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import L from 'leaflet'
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
            <Typography variant="h4">Resumo ao vivo</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Esta area fica preparada para receber feed, alertas ou detalhe da corrida selecionada.
            </Typography>

            <Stack spacing={1.5} sx={{ mt: 3 }}>
              <LiveSummary label="Corridas no mapa" value="12" color="#0ABEE9" />
              <LiveSummary label="Motoristas em rota" value="8" color="#2563EB" />
              <LiveSummary label="Passageiros aguardando" value="4" color="#22D3EE" />
            </Stack>
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

function LiveSummary({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 1.5,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
        <Typography fontWeight={700}>{label}</Typography>
      </Stack>
      <Chip label={value} size="small" sx={{ fontWeight: 800 }} />
    </Stack>
  )
}
