import { Box, Card, CardContent, Stack, Typography, useTheme } from '@mui/material'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import { mapMarkers, rideLine, secondRideLine } from '../data/mockDashboardData'
import { getMapTileLayer } from '../utils/mapConfig'
import { driverIcon, passengerIcon } from '../utils/mapIcons'
import { useActivePaletteMode } from '../utils/useActivePaletteMode'
import { MapLegend } from './MapLegend'

export function DashboardLiveMap() {
  const theme = useTheme()
  const activeMode = useActivePaletteMode()
  const tileLayer = getMapTileLayer(activeMode)

  return (
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

        <Box sx={{ height: { xs: 340, md: 460 }, overflow: 'hidden', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
          <MapContainer center={[-23.5573, -46.6412]} zoom={13} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
            <TileLayer key={activeMode} attribution={tileLayer.attribution} url={tileLayer.url} />
            <Polyline positions={rideLine} pathOptions={{ color: '#0ABEE9', weight: 5, opacity: 0.88 }} />
            <Polyline positions={secondRideLine} pathOptions={{ color: '#2DD4A0', weight: 4, opacity: 0.76, dashArray: '8 10' }} />
            {mapMarkers.map((marker) => (
              <Marker key={marker.id} position={marker.position} icon={marker.type === 'driver' ? driverIcon : passengerIcon} title={marker.label} />
            ))}
          </MapContainer>
        </Box>
      </CardContent>
    </Card>
  )
}
