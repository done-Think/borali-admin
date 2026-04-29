import type { PaletteMode } from '@mui/material'

const tileLayerAttribution = '&copy; OpenStreetMap &copy; CARTO'

export const mapTileLayers: Record<PaletteMode, { attribution: string; url: string }> = {
  light: {
    attribution: tileLayerAttribution,
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  },
  dark: {
    attribution: tileLayerAttribution,
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  },
}

export function getMapTileLayer(mode: PaletteMode) {
  return mapTileLayers[mode]
}
