import L from 'leaflet'
import type { MapMarker } from '../types'

export function createMapIcon(type: MapMarker['type']) {
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

export const driverIcon = createMapIcon('driver')
export const passengerIcon = createMapIcon('passenger')
