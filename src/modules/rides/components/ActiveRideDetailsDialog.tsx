import { useEffect } from 'react'
import { Box, Chip, Dialog, DialogContent, DialogTitle, Divider, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import L from 'leaflet'
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { currencyFormatter } from '@modules/dashboard/utils/formatters'
import { getMapTileLayer } from '@modules/dashboard/utils/mapConfig'
import { useActivePaletteMode } from '@modules/dashboard/utils/useActivePaletteMode'
import { alertColor, statusConfig } from '../data/mockRides'
import type { ActiveRideView } from '../types'
import { createRideStatusIcon, getElapsedMinutes } from '../utils/rides'

type ActiveRideDetailsDialogProps = {
  ride: ActiveRideView | null
  onClose: () => void
}

export function ActiveRideDetailsDialog({ ride, onClose }: ActiveRideDetailsDialogProps) {
  const activeMode = useActivePaletteMode()
  const tileLayer = getMapTileLayer(activeMode)

  if (!ride) return null

  const status = statusConfig[ride.status]
  const accentColor = ride.alert ? alertColor : status.color
  const driverProfile = buildDriverProfile(ride)
  const passengerProfile = buildPassengerProfile(ride)
  const alertHistory = buildAlertHistory(ride)

  return (
    <Dialog open={Boolean(ride)} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
          <Box>
            <Typography variant="h4">Corrida {ride.id}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {ride.driver} levando {ride.passenger} para {ride.destination}.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            {ride.alert && <Chip label="Alerta ativo" size="small" sx={{ bgcolor: alpha(alertColor, 0.14), color: alertColor, fontWeight: 900 }} />}
            <Chip label={ride.status} size="small" sx={{ bgcolor: alpha(accentColor, 0.14), color: accentColor, fontWeight: 900 }} />
            <Chip label={currencyFormatter.format(ride.value)} color="secondary" variant="outlined" sx={{ fontWeight: 900 }} />
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' } }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
              <DetailSection title="Cadastro do motorista" items={driverProfile} />
              <DetailSection title="Cadastro do passageiro" items={passengerProfile} />
            </Box>

            <RideInProgressSection ride={ride} tileLayer={tileLayer} activeMode={activeMode} />
          </Stack>

          <Box sx={{ border: '1px solid', borderColor: ride.alert ? alpha(alertColor, 0.45) : 'divider', borderRadius: 2, p: 2, bgcolor: ride.alert ? alpha(alertColor, 0.04) : 'background.default' }}>
            <Typography variant="h4">Historico e alertas</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
              Ocorrencias relacionadas ao motorista, passageiro ou corrida atual.
            </Typography>

            <Stack spacing={1.5}>
              {alertHistory.map((item) => (
                <Box key={item.title} sx={{ border: '1px solid', borderColor: item.severity === 'critical' ? alpha(alertColor, 0.42) : 'divider', borderRadius: 1.5, p: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontWeight: 900 }}>{item.title}</Typography>
                    <Chip
                      size="small"
                      label={item.severity === 'critical' ? 'critico' : 'ok'}
                      sx={{
                        bgcolor: item.severity === 'critical' ? alpha(alertColor, 0.14) : 'action.hover',
                        color: item.severity === 'critical' ? alertColor : 'text.secondary',
                        fontWeight: 900,
                      }}
                    />
                  </Stack>
                  <Typography color="text.secondary" sx={{ mt: 0.75, fontSize: 13 }}>
                    {item.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

function RideInProgressSection({ ride, tileLayer, activeMode }: { ride: ActiveRideView; tileLayer: { attribution: string; url: string }; activeMode: 'light' | 'dark' }) {
  const status = statusConfig[ride.status]
  const lineColor = ride.alert ? alertColor : status.color

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, bgcolor: 'background.default' }}>
      <Typography variant="h4">Corrida em andamento</Typography>
      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 220px' }, alignItems: 'stretch' }}>
        <Box sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' } }}>
          {[
            { label: 'Origem', value: ride.origin },
            { label: 'Destino', value: ride.destination },
            { label: 'Valor atual', value: currencyFormatter.format(ride.value) },
            { label: 'Tempo decorrido', value: `${getElapsedMinutes(ride.startedAt)} min` },
            { label: 'Status', value: ride.status },
            { label: 'Coordenada motorista', value: ride.driverPosition.join(', ') },
            { label: 'Coordenada passageiro', value: ride.passengerPosition.join(', ') },
          ].map((item) => (
            <Box key={item.label} sx={{ minWidth: 0 }}>
              <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
                {item.label}
              </Typography>
              <Typography noWrap sx={{ fontWeight: 800 }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ height: { xs: 190, md: '100%' }, minHeight: 170, overflow: 'hidden', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <MapContainer center={ride.driverPosition} zoom={13} scrollWheelZoom={false} zoomControl={false} attributionControl={false} style={{ width: '100%', height: '100%' }}>
            <TileLayer key={activeMode} attribution={tileLayer.attribution} url={tileLayer.url} />
            <MiniRideMapFocus ride={ride} />
            {ride.alert && <Polyline positions={ride.path} pathOptions={{ color: alertColor, weight: 8, opacity: 0.3 }} />}
            <Polyline positions={ride.path} pathOptions={{ color: lineColor, weight: 5, opacity: 0.92 }} />
            <Marker position={ride.driverPosition} icon={createRideStatusIcon(ride.status, true, Boolean(ride.alert))}>
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                Motorista: {ride.driver}
              </Tooltip>
            </Marker>
            <CircleMarker center={ride.passengerPosition} radius={9} pathOptions={{ color: '#FFFFFF', weight: 3, fillColor: lineColor, fillOpacity: 0.95 }}>
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                Passageiro: {ride.passenger}
              </Tooltip>
            </CircleMarker>
          </MapContainer>
        </Box>
      </Box>
    </Box>
  )
}

function MiniRideMapFocus({ ride }: { ride: ActiveRideView }) {
  const map = useMap()

  useEffect(() => {
    const bounds = L.latLngBounds([...ride.path, ride.driverPosition, ride.passengerPosition])
    map.fitBounds(bounds, { animate: false, padding: [24, 24], maxZoom: 15 })
  }, [map, ride])

  return null
}

function DetailSection({ title, items }: { title: string; items: Array<{ label: string; value: string }> }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, bgcolor: 'background.default' }}>
      <Typography variant="h4">{title}</Typography>
      <Divider sx={{ my: 1.5 }} />
      <Box sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' } }}>
        {items.map((item) => (
          <Box key={item.label} sx={{ minWidth: 0 }}>
            <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
              {item.label}
            </Typography>
            <Typography noWrap sx={{ fontWeight: 800 }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function buildDriverProfile(ride: ActiveRideView) {
  return [
    { label: 'Nome', value: ride.driver },
    { label: 'Cadastro', value: `DRV-${ride.id.slice(-4)}` },
    { label: 'Telefone', value: '(11) 9' + ride.id.slice(-4) + '-4402' },
    { label: 'Veiculo', value: 'Toyota Corolla 2022' },
    { label: 'Placa', value: `BRL-${ride.id.slice(-2)}A` },
    { label: 'Avaliacao', value: ride.alert?.activatedBy === 'Motorista' ? '4.7' : '4.9' },
  ]
}

function buildPassengerProfile(ride: ActiveRideView) {
  return [
    { label: 'Nome', value: ride.passenger },
    { label: 'Cadastro', value: `PSG-${ride.id.slice(-4)}` },
    { label: 'Telefone', value: '(11) 9' + ride.id.slice(-4) + '-1188' },
    { label: 'Forma pagamento', value: 'Cartao' },
    { label: 'Corridas realizadas', value: ride.alert ? '42' : '68' },
    { label: 'Avaliacao media', value: ride.alert?.activatedBy === 'Passageiro' ? '4.8' : '4.9' },
  ]
}

function buildAlertHistory(ride: ActiveRideView) {
  if (!ride.alert) {
    return [
      {
        title: 'Sem alertas ativos',
        description: 'Nao existem ocorrencias recentes vinculadas ao motorista, passageiro ou corrida atual.',
        severity: 'normal' as const,
      },
      {
        title: 'Historico operacional',
        description: 'Ultimas corridas foram concluidas sem registro de seguranca.',
        severity: 'normal' as const,
      },
    ]
  }

  return [
    {
      title: `Alerta acionado por ${ride.alert.activatedBy}`,
      description: ride.alert.reason,
      severity: 'critical' as const,
    },
    {
      title: 'Prioridade operacional',
      description: 'Corrida destacada no mapa e priorizada no topo da lista ativa ate resolucao do alerta.',
      severity: 'critical' as const,
    },
    {
      title: 'Historico relacionado',
      description: ride.alert.activatedBy === 'Motorista' ? 'Motorista sem alertas anteriores; ocorrencia atual exige acompanhamento.' : 'Passageiro acionou suporte preventivo em corrida anterior.',
      severity: 'normal' as const,
    },
  ]
}
