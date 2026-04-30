import { useEffect, useState } from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import RouteIcon from '@mui/icons-material/Route'
import { Box, Card, CardContent, Chip, Divider, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import L from 'leaflet'
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { currencyFormatter } from '@modules/dashboard/utils/formatters'
import { alertColor, statusConfig } from '../data/mockRides'
import type { ActiveMapLimit, ActiveRideView } from '../types'
import { createRideStatusIcon, getElapsedMinutes } from '../utils/rides'
import { ActiveRideDetailsDialog } from './ActiveRideDetailsDialog'

type ActiveRidesPanelProps = {
  activeRides: ActiveRideView[]
  activeMode: 'light' | 'dark'
  expandedRideId: string
  filteredActiveRides: ActiveRideView[]
  mapRides: ActiveRideView[]
  mapLimit: ActiveMapLimit
  mapCenter: [number, number]
  selectedRide: ActiveRideView | null
  selectedRideId: string
  theme: Theme
  tileLayer: { attribution: string; url: string }
  search: string
  onExpandedRideChange: (rideId: string) => void
  onMapLimitChange: (limit: ActiveMapLimit) => void
  onSearchChange: (value: string) => void
  onRideSelect: (rideId: string) => void
}

export function ActiveRidesPanel({
  activeRides,
  activeMode,
  expandedRideId,
  filteredActiveRides,
  mapRides,
  mapLimit,
  mapCenter,
  selectedRide,
  selectedRideId,
  theme,
  tileLayer,
  search,
  onExpandedRideChange,
  onMapLimitChange,
  onSearchChange,
  onRideSelect,
}: ActiveRidesPanelProps) {
  const [detailsRide, setDetailsRide] = useState<ActiveRideView | null>(null)

  function openRideCard(rideId: string) {
    onSearchChange('')
    onRideSelect(rideId)
    onExpandedRideChange(rideId)
  }

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
                {mapRides.length} de {activeRides.length} corridas visiveis no mapa.
              </Typography>
            </Box>
            <Stack spacing={1} alignItems="flex-end">
              <ToggleButtonGroup
                exclusive
                size="small"
                value={mapLimit}
                onChange={(_, value: ActiveMapLimit | null) => {
                  if (value) onMapLimitChange(value)
                }}
                aria-label="Filtro de usuarios no mapa"
              >
                <ToggleButton value={5} aria-label="Mostrar 5 usuarios">
                  5
                </ToggleButton>
                <ToggleButton value={10} aria-label="Mostrar 10 usuarios">
                  10
                </ToggleButton>
                <ToggleButton value={30} aria-label="Mostrar 30 usuarios">
                  30
                </ToggleButton>
                <ToggleButton value="all" aria-label="Mostrar todos os usuarios">
                  Todos
                </ToggleButton>
              </ToggleButtonGroup>

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
          </Stack>

          <Box sx={{ flex: 1, minHeight: 360, overflow: 'hidden', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
            <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
              <TileLayer key={activeMode} attribution={tileLayer.attribution} url={tileLayer.url} />
              <MapRideFocus ride={selectedRide} />
              {mapRides.map((ride) => (
                <MapRide key={ride.id} ride={ride} selected={ride.id === selectedRideId} onSelect={() => openRideCard(ride.id)} />
              ))}
            </MapContainer>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent sx={{ p: 2.25 }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Box>
              <Typography variant="h4">Corridas ativas</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.25 }}>
                {filteredActiveRides.length} de {activeRides.length} em acompanhamento agora
              </Typography>
            </Box>
            <Chip label="tempo real" size="small" sx={{ fontWeight: 800 }} />
          </Stack>

          <TextField
            size="small"
            label="Buscar motorista ou passageiro"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            fullWidth
            sx={{ mb: 1.5 }}
          />

          <Box
            sx={{
              display: 'grid',
              gap: 1,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                xl: 'repeat(3, minmax(0, 1fr))',
              },
              alignItems: 'start',
            }}
          >
            {filteredActiveRides.map((ride) => (
              <ActiveRideCard
                key={ride.id}
                ride={ride}
                expanded={ride.id === expandedRideId}
                selected={ride.id === selectedRideId}
                onSelect={() => {
                  if (expandedRideId === ride.id) {
                    setDetailsRide(ride)
                    return
                  }

                  onRideSelect(ride.id)
                  onExpandedRideChange(ride.id)
                }}
              />
            ))}
          </Box>

          <Stack spacing={1} sx={{ mt: filteredActiveRides.length === 0 ? 0 : 1 }}>
            {filteredActiveRides.length === 0 && (
              <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 3, textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 800 }}>{activeRides.length === 0 ? 'Nenhuma corrida ativa agora' : 'Nenhuma corrida encontrada'}</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {activeRides.length === 0 ? 'Novas corridas entram aqui assim que forem emitidas pelo socket.' : 'Tente buscar por outro motorista ou passageiro.'}
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      <ActiveRideDetailsDialog ride={detailsRide} onClose={() => setDetailsRide(null)} />
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

function MapRide({ ride, selected, onSelect }: { ride: ActiveRideView; selected: boolean; onSelect: () => void }) {
  const status = statusConfig[ride.status]
  const lineColor = ride.alert ? alertColor : status.color

  return (
    <>
      {selected && <Polyline positions={ride.path} pathOptions={{ color: '#FFFFFF', weight: 9, opacity: 0.72 }} />}
      {ride.alert && <Polyline positions={ride.path} pathOptions={{ color: alertColor, weight: selected ? 11 : 8, opacity: selected ? 0.42 : 0.3 }} />}
      <Polyline positions={ride.path} pathOptions={{ color: lineColor, weight: selected || ride.alert ? 6 : 4, opacity: selected || ride.alert ? 1 : 0.42 }} />
      <Marker position={ride.driverPosition} icon={createRideStatusIcon(ride.status, selected, Boolean(ride.alert))} title={`${ride.id} - ${ride.status}`} eventHandlers={{ click: onSelect }}>
        <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
          {ride.alert ? 'ALERTA - ' : ''}
          {ride.id} - {ride.driver}
        </Tooltip>
      </Marker>
      <CircleMarker
        center={ride.passengerPosition}
        radius={selected || ride.alert ? 10 : 7}
        pathOptions={{ color: '#FFFFFF', weight: selected || ride.alert ? 3 : 2, fillColor: lineColor, fillOpacity: selected || ride.alert ? 1 : 0.78 }}
        eventHandlers={{ click: onSelect }}
      >
        <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
          {ride.alert ? 'ALERTA - ' : ''}
          {ride.passenger} - passageiro
        </Tooltip>
      </CircleMarker>
    </>
  )
}

function ActiveRideCard({
  ride,
  expanded,
  selected,
  onSelect,
}: {
  ride: ActiveRideView
  expanded: boolean
  selected: boolean
  onSelect: () => void
}) {
  const status = statusConfig[ride.status]
  const accentColor = ride.alert ? alertColor : status.color

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
        bgcolor: selected ? alpha(accentColor, 0.08) : ride.alert ? alpha(alertColor, 0.045) : 'background.default',
        borderColor: selected || ride.alert ? accentColor : 'divider',
        boxShadow: selected ? `0 0 0 2px ${alpha(accentColor, 0.16)}` : ride.alert ? `inset 3px 0 0 ${accentColor}` : 'none',
        cursor: 'pointer',
        transition: 'border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
        '&:hover': {
          borderColor: accentColor,
          transform: 'translateY(-1px)',
        },
        '&:focus-visible': {
          outline: `3px solid ${alpha(accentColor, 0.32)}`,
          outlineOffset: 2,
        },
        gridColumn: {
          xs: 'span 1',
          sm: expanded ? 'span 2' : 'span 1',
          xl: expanded ? 'span 3' : 'span 1',
        },
      }}
    >
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: { xs: '1fr', sm: 'minmax(150px, 1.15fr) minmax(130px, 0.95fr) minmax(96px, 0.7fr)' },
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: '18px 1fr', columnGap: 1, rowGap: 0.32, minWidth: 0 }}>
            {ride.alert ? <ReportProblemIcon sx={{ fontSize: 17, color: accentColor, mt: 0.1 }} /> : <RouteIcon sx={{ fontSize: 17, color: accentColor, mt: 0.1 }} />}
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ fontWeight: 900, lineHeight: 1.25 }}>
                {ride.id}
              </Typography>
              {ride.alert && (
                <Chip
                  size="small"
                  label="Alerta"
                  sx={{ height: 20, bgcolor: alpha(alertColor, 0.16), color: alertColor, fontSize: 10, fontWeight: 900 }}
                />
              )}
            </Stack>
            <LocalTaxiIcon sx={{ fontSize: 17, color: 'text.secondary', mt: 0.1 }} />
            <Typography noWrap sx={{ fontSize: 13, fontWeight: 850, lineHeight: 1.25 }}>
              {ride.driver}
            </Typography>
            <PersonPinCircleIcon sx={{ fontSize: 17, color: 'text.secondary', mt: 0.1 }} />
            <Typography noWrap sx={{ fontSize: 13, fontWeight: 750, lineHeight: 1.25 }}>
              {ride.passenger}
            </Typography>
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography color="text.secondary" sx={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
              Destino
            </Typography>
            <Typography noWrap sx={{ fontSize: 13, fontWeight: 800 }}>
              {ride.destination}
            </Typography>
            {expanded && (
              <>
                <Typography color="text.secondary" sx={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', mt: 0.75 }}>
                  Origem
                </Typography>
                <Typography noWrap sx={{ fontSize: 12.5, fontWeight: 700 }}>
                  {ride.origin}
                </Typography>
              </>
            )}
          </Box>

          <Stack spacing={0.55} alignItems={{ xs: 'flex-start', sm: 'flex-end' }} sx={{ minWidth: 0 }}>
            <Chip
              size="small"
              label={ride.status}
              sx={{
                bgcolor: alpha(accentColor, 0.14),
                color: accentColor,
                fontWeight: 800,
                maxWidth: '100%',
              }}
            />
            {expanded && <Typography sx={{ fontSize: 13, fontWeight: 900 }}>{currencyFormatter.format(ride.value)}</Typography>}
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTimeIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
              <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
                {getElapsedMinutes(ride.startedAt)} min
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {expanded && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 700 }} noWrap>
              {ride.origin} {'->'} {ride.destination}
            </Typography>
            {ride.alert && (
              <Typography sx={{ color: alertColor, fontSize: 12, fontWeight: 900, mt: 0.5 }} noWrap>
                Alerta acionado por {ride.alert.activatedBy}: {ride.alert.reason}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
