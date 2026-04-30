import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import RouteIcon from '@mui/icons-material/Route'
import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { currencyFormatter } from '@modules/dashboard/utils/formatters'
import { waitingStatusConfig } from '../data/mockRides'
import type { WaitingRide } from '../types'
import { getElapsedMinutes } from '../utils/rides'

export function WaitingRidesPanel({ rides }: { rides: WaitingRide[] }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4">Passageiros em espera</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.25 }}>
              Chamadas abertas aguardando aceite ou deslocamento de motorista.
            </Typography>
          </Box>
          <Chip label={`${rides.length} aguardando`} size="small" sx={{ fontWeight: 800, alignSelf: { xs: 'flex-start', md: 'center' } }} />
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          {rides.map((ride) => (
            <WaitingRideCard key={ride.id} ride={ride} />
          ))}
        </Box>

        {rides.length === 0 && (
          <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 3, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 800 }}>Nenhum passageiro em espera</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Novas chamadas aparecem aqui enquanto aguardam um motorista.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

function WaitingRideCard({ ride }: { ride: WaitingRide }) {
  const status = waitingStatusConfig[ride.status]

  return (
    <Card variant="outlined" sx={{ bgcolor: 'background.default' }}>
      <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
              <RouteIcon fontSize="small" sx={{ color: status.color }} />
              <Typography sx={{ fontWeight: 900 }}>{ride.id}</Typography>
            </Stack>
            <Chip size="small" label={status.label} sx={{ bgcolor: alpha(status.color, 0.14), color: status.color, fontWeight: 800 }} />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            <PersonPinCircleIcon fontSize="small" color="action" />
            <Typography noWrap sx={{ fontWeight: 800 }}>
              {ride.passenger}
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
              Origem
            </Typography>
            <Typography noWrap sx={{ fontSize: 13, fontWeight: 700 }}>
              {ride.origin}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800, mt: 0.5 }}>
              Destino
            </Typography>
            <Typography noWrap sx={{ fontSize: 13, fontWeight: 700 }}>
              {ride.destination}
            </Typography>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Chip size="small" label={ride.category} sx={{ fontWeight: 800 }} />
            <Typography sx={{ fontWeight: 900 }}>{currencyFormatter.format(ride.estimatedValue)}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
              {ride.nearbyDrivers} motoristas proximos
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
                {getElapsedMinutes(ride.requestedAt)} min
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
