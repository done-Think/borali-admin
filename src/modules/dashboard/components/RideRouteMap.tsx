import { Box, useTheme } from '@mui/material'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import { getMapTileLayer } from '../utils/mapConfig'
import { driverIcon, passengerIcon } from '../utils/mapIcons'
import { useActivePaletteMode } from '../utils/useActivePaletteMode'

export function RideRouteMap({
  path,
  driverPosition,
  passengerPosition,
  driverLabel,
  passengerLabel,
  height = { xs: 360, md: 520 },
}: {
  path: [number, number][]
  driverPosition: [number, number]
  passengerPosition: [number, number]
  driverLabel: string
  passengerLabel: string
  height?: { xs: number; md: number }
}) {
  const theme = useTheme()
  const activeMode = useActivePaletteMode()
  const tileLayer = getMapTileLayer(activeMode)

  return (
    <Box sx={{ height, overflow: 'hidden', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
      <MapContainer center={driverPosition} zoom={13} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
        <TileLayer key={activeMode} attribution={tileLayer.attribution} url={tileLayer.url} />
        <Polyline positions={path} pathOptions={{ color: '#0ABEE9', weight: 5, opacity: 0.9 }} />
        <Marker position={driverPosition} icon={driverIcon} title={driverLabel} />
        <Marker position={passengerPosition} icon={passengerIcon} title={passengerLabel} />
      </MapContainer>
    </Box>
  )
}
