import type { ReactNode } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import RouteIcon from '@mui/icons-material/Route'
import { Box, Card, CardContent, Chip, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material'
import type { CitySettings } from '../types'

type CityMapDialogProps = {
  city: CitySettings
  open: boolean
  onClose: () => void
}

const mapMarkers = [
  { label: 'Motoristas', icon: <DirectionsCarIcon fontSize="small" />, top: '24%', left: '22%', color: 'success.main' },
  { label: 'Em corrida', icon: <PersonPinCircleIcon fontSize="small" />, top: '54%', left: '58%', color: 'primary.main' },
  { label: 'Aguardando', icon: <HourglassTopIcon fontSize="small" />, top: '68%', left: '34%', color: 'warning.main' },
]

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

export function CityMapDialog({ city, open, onClose }: CityMapDialogProps) {
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
            position: 'relative',
            minHeight: { xs: 280, md: 360 },
            overflow: 'hidden',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.default',
            backgroundImage:
              'linear-gradient(90deg, rgba(148, 163, 184, 0.18) 1px, transparent 1px), linear-gradient(rgba(148, 163, 184, 0.18) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: '22% 10% 18% 12%',
              borderTop: 4,
              borderRight: 4,
              borderColor: 'primary.main',
              borderRadius: '48% 42% 56% 36%',
              opacity: 0.35,
              transform: 'rotate(-8deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: '34% 18% 26% 20%',
              borderBottom: 4,
              borderLeft: 4,
              borderColor: 'secondary.main',
              borderRadius: '35% 58% 34% 50%',
              opacity: 0.28,
              transform: 'rotate(10deg)',
            }}
          />

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              position: 'absolute',
              left: 16,
              top: 16,
              px: 1.2,
              py: 0.8,
              borderRadius: 1.5,
              bgcolor: 'background.paper',
              boxShadow: 2,
            }}
          >
            <RouteIcon color="primary" fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 850 }}>
              Visão em tempo real
            </Typography>
          </Stack>

          {mapMarkers.map((marker) => (
            <Stack
              key={marker.label}
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{
                position: 'absolute',
                top: marker.top,
                left: marker.left,
                px: 1,
                py: 0.75,
                borderRadius: 1.5,
                bgcolor: 'background.paper',
                boxShadow: 3,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Box sx={{ display: 'grid', placeItems: 'center', color: marker.color }}>{marker.icon}</Box>
              <Typography variant="caption" sx={{ fontWeight: 900 }}>
                {marker.label}
              </Typography>
            </Stack>
          ))}

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              px: 1.2,
              py: 0.8,
              borderRadius: 1.5,
              bgcolor: 'background.paper',
              boxShadow: 2,
            }}
          >
            <MyLocationIcon color="secondary" fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 850 }}>
              {stats.hotspot}
            </Typography>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
