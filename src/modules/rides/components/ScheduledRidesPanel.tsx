import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EventIcon from '@mui/icons-material/Event'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import RouteIcon from '@mui/icons-material/Route'
import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { currencyFormatter } from '@modules/dashboard/utils/formatters'
import { scheduledStatusConfig } from '../data/mockRides'
import type { ScheduledRide } from '../types'
import { formatDateTime } from '../utils/rides'

export function ScheduledRidesPanel({ rides }: { rides: ScheduledRide[] }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4">Corridas programadas</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.25 }}>
              Passageiros que agendaram uma corrida para data e horario especificos.
            </Typography>
          </Box>
          <Chip label={`${rides.length} programadas`} size="small" sx={{ fontWeight: 800, alignSelf: { xs: 'flex-start', md: 'center' } }} />
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          {rides.map((ride) => (
            <ScheduledRideCard key={ride.id} ride={ride} />
          ))}
        </Box>

        {rides.length === 0 && (
          <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 3, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 800 }}>Nenhuma corrida programada</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Novas programacoes aparecem aqui quando um passageiro agendar uma corrida.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

function ScheduledRideCard({ ride }: { ride: ScheduledRide }) {
  const status = scheduledStatusConfig[ride.status]

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
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ fontWeight: 850 }}>
                {ride.passenger.name}
              </Typography>
              <Typography color="text.secondary" noWrap sx={{ fontSize: 12, fontWeight: 700 }}>
                {ride.passenger.phone} - CPF {ride.passenger.document}
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1 }}>
            <Info label="Avaliacao" value={ride.passenger.rating.toFixed(1)} />
            <Info label="Corridas" value={String(ride.passenger.ridesCount)} />
          </Box>

          <Divider />

          <Box sx={{ display: 'grid', gap: 0.75 }}>
            <Info label="Partida" value={ride.origin} />
            <Info label="Destino final" value={ride.destination} />
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Chip size="small" label={ride.category} sx={{ fontWeight: 800 }} />
            <Typography sx={{ fontWeight: 900 }}>{currencyFormatter.format(ride.estimatedValue)}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: 0 }}>
              <EventIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography color="text.secondary" noWrap sx={{ fontSize: 12, fontWeight: 800 }}>
                {formatDateTime(ride.scheduledFor)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
                pedido {formatDateTime(ride.requestedAt)}
              </Typography>
            </Stack>
          </Stack>

          {ride.notes && (
            <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 700 }}>
              {ride.notes}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
        {label}
      </Typography>
      <Typography noWrap sx={{ fontSize: 13, fontWeight: 750 }}>
        {value}
      </Typography>
    </Box>
  )
}
