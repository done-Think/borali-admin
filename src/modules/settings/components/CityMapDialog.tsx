import { useEffect, type ReactElement, type ReactNode } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import { Box, Card, CardContent, Chip, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { getMapTileLayer } from '@modules/dashboard/utils/mapConfig'
import { useActivePaletteMode } from '@modules/dashboard/utils/useActivePaletteMode'
import type { CityMapMarker, CitySettings } from '../types'

type CityMapDialogProps = {
  city: CitySettings
  open: boolean
  onClose: () => void
}

const markerConfig: Record<CityMapMarker['type'], { color: string; fillColor: string; icon: ReactElement }> = {
  drivers: { color: '#2563eb', fillColor: '#3b82f6', icon: <DirectionsCarIcon fontSize="small" /> },
  inRide: { color: '#0891b2', fillColor: '#06b6d4', icon: <PersonPinCircleIcon fontSize="small" /> },
  waiting: { color: '#d97706', fillColor: '#f59e0b', icon: <HourglassTopIcon fontSize="small" /> },
  hotspot: { color: '#7c3aed', fillColor: '#8b5cf6', icon: <MyLocationIcon fontSize="small" /> },
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 1.5,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'action.hover',
              color: 'primary.main',
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h5">{value}</Typography>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

function MapAutoResize({ city, open }: { city: CitySettings; open: boolean }) {
  const map = useMap()

  useEffect(() => {
    if (!open) return

    const timeoutId = window.setTimeout(() => {
      map.invalidateSize()
      map.setView(city.mapStats.center, 14)
    }, 180)

    return () => window.clearTimeout(timeoutId)
  }, [city.id, city.mapStats.center, map, open])

  return null
}

function CityMarker({ marker }: { marker: CityMapMarker }) {
  const config = markerConfig[marker.type]
  const radius = Math.max(10, Math.min(24, 8 + marker.count * 0.35))

  return (
    <CircleMarker
      center={marker.position}
      radius={radius}
      pathOptions={{
        color: config.color,
        fillColor: config.fillColor,
        fillOpacity: marker.type === 'hotspot' ? 0.28 : 0.72,
        opacity: 0.95,
        weight: marker.type === 'hotspot' ? 3 : 2,
      }}
    >
      <Tooltip direction="top" offset={[0, -8]} opacity={1}>
        <Stack spacing={0.25}>
          <Typography variant="caption" sx={{ fontWeight: 900 }}>
            {marker.label}
          </Typography>
          <Typography variant="caption">{marker.count} registros</Typography>
        </Stack>
      </Tooltip>
    </CircleMarker>
  )
}

export function CityMapDialog({ city, open, onClose }: CityMapDialogProps) {
  const activeMode = useActivePaletteMode()
  const tileLayer = getMapTileLayer(activeMode)
  const stats = city.mapStats

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 7 }}>
        <Stack spacing={0.5}>
          <Typography variant="h4">
            Mapa operacional - {city.name}, {city.state}
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip label={city.operations.active ? 'Operação ativa' : 'Fora do ar'} color={city.operations.active ? 'success' : 'error'} size="small" />
            <Chip label={`Maior movimento: ${stats.hotspot}`} size="small" variant="outlined" />
          </Stack>
        </Stack>
        <IconButton aria-label="Fechar mapa" onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, mb: 2 }}>
          <StatCard icon={<DirectionsCarIcon />} label="Motoristas ativos" value={stats.activeDrivers} />
          <StatCard icon={<PersonPinCircleIcon />} label="Passageiros em corrida" value={stats.passengersInRide} />
          <StatCard icon={<HourglassTopIcon />} label="Passageiros aguardando" value={stats.waitingPassengers} />
        </Box>

        <Box
          sx={{
            height: { xs: 320, md: 430 },
            overflow: 'hidden',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            position: 'relative',
            '.leaflet-container': {
              bgcolor: 'background.default',
              fontFamily: 'inherit',
            },
            '.leaflet-control-attribution': {
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.78),
              color: 'text.secondary',
            },
            '.leaflet-tooltip': {
              border: 0,
              borderRadius: 1.5,
              boxShadow: 3,
              color: 'text.primary',
            },
          }}
        >
          <MapContainer center={stats.center} zoom={14} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
            <TileLayer key={activeMode} attribution={tileLayer.attribution} url={tileLayer.url} />
            <MapAutoResize city={city} open={open} />
            {stats.markers.map((marker) => (
              <CityMarker key={marker.id} marker={marker} />
            ))}
          </MapContainer>

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={{
              position: 'absolute',
              left: 12,
              bottom: 12,
              zIndex: 500,
              maxWidth: 'calc(100% - 24px)',
            }}
          >
            {Object.entries(markerConfig).map(([type, config]) => (
              <Chip
                key={type}
                size="small"
                icon={config.icon}
                label={
                  type === 'drivers'
                    ? 'Motoristas'
                    : type === 'inRide'
                      ? 'Em corrida'
                      : type === 'waiting'
                        ? 'Aguardando'
                        : 'Maior movimento'
                }
                sx={{
                  bgcolor: 'background.paper',
                  color: config.color,
                  fontWeight: 850,
                  boxShadow: 2,
                  '& .MuiChip-icon': { color: config.color },
                }}
              />
            ))}
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
