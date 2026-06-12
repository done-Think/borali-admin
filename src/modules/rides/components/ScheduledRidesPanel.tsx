import { useState } from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend'
import EventIcon from '@mui/icons-material/Event'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import RouteIcon from '@mui/icons-material/Route'
import SendIcon from '@mui/icons-material/Send'
import { Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TextField, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { currencyFormatter } from '@modules/dashboard/utils/formatters'
import { scheduledStatusConfig } from '../data/ridesData'
import type { ScheduledRide } from '../types'
import { formatDateTime } from '../utils/rides'

type ScheduledRidesPanelProps = {
  rides: ScheduledRide[]
  onCancelRide: (rideId: string) => void
  onSendMessage: (ride: ScheduledRide, message: string) => void
}

export function ScheduledRidesPanel({ rides, onCancelRide, onSendMessage }: ScheduledRidesPanelProps) {
  const [selectedRide, setSelectedRide] = useState<ScheduledRide | null>(null)

  function handleCancelRide(ride: ScheduledRide) {
    onCancelRide(ride.id)
    setSelectedRide(null)
  }

  function handleSendMessage(ride: ScheduledRide, message: string) {
    onSendMessage(ride, message)
    setSelectedRide(null)
  }

  return (
    <>
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
              <ScheduledRideCard key={ride.id} ride={ride} onSelect={() => setSelectedRide(ride)} />
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

      <ScheduledRideDetailsDialog ride={selectedRide} onClose={() => setSelectedRide(null)} onCancelRide={handleCancelRide} onSendMessage={handleSendMessage} />
    </>
  )
}

function ScheduledRideCard({ ride, onSelect }: { ride: ScheduledRide; onSelect: () => void }) {
  const status = scheduledStatusConfig[ride.status]

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
        bgcolor: 'background.default',
        cursor: 'pointer',
        transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
        '&:hover': {
          borderColor: alpha(status.color, 0.7),
          boxShadow: `0 10px 28px ${alpha(status.color, 0.12)}`,
          transform: 'translateY(-1px)',
        },
        '&:focus-visible': {
          outline: `2px solid ${alpha(status.color, 0.72)}`,
          outlineOffset: 2,
        },
      }}
    >
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

function ScheduledRideDetailsDialog({
  ride,
  onClose,
  onCancelRide,
  onSendMessage,
}: {
  ride: ScheduledRide | null
  onClose: () => void
  onCancelRide: (ride: ScheduledRide) => void
  onSendMessage: (ride: ScheduledRide, message: string) => void
}) {
  const [message, setMessage] = useState('')

  if (!ride) return null

  const currentRide = ride
  const status = scheduledStatusConfig[currentRide.status]
  const defaultMessage = `Ola, ${currentRide.passenger.name}. Estamos acompanhando sua corrida programada de ${currentRide.origin} para ${currentRide.destination}, agendada para ${formatDateTime(currentRide.scheduledFor)}.`
  const messageToSend = message.trim() || defaultMessage

  function handleClose() {
    setMessage('')
    onClose()
  }

  function handleSendMessage() {
    onSendMessage(currentRide, messageToSend)
    setMessage('')
  }

  function handleCancelRide() {
    onCancelRide(currentRide)
    setMessage('')
  }

  return (
    <Dialog open={Boolean(ride)} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
          <Box>
            <Typography variant="h4">Agendamento {ride.id}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {ride.passenger.name} - {formatDateTime(ride.scheduledFor)}
            </Typography>
          </Box>
          <Chip size="small" label={status.label} sx={{ bgcolor: alpha(status.color, 0.14), color: status.color, fontWeight: 900, alignSelf: { xs: 'flex-start', sm: 'center' } }} />
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 300px' } }}>
          <Stack spacing={2}>
            <DetailSection
              title="Dados da corrida"
              items={[
                { label: 'Partida', value: ride.origin },
                { label: 'Destino final', value: ride.destination },
                { label: 'Categoria', value: ride.category },
                { label: 'Valor estimado', value: currencyFormatter.format(ride.estimatedValue) },
                { label: 'Agendada para', value: formatDateTime(ride.scheduledFor) },
                { label: 'Solicitada em', value: formatDateTime(ride.requestedAt) },
              ]}
            />

            <DetailSection
              title="Passageiro"
              items={[
                { label: 'Nome', value: ride.passenger.name },
                { label: 'Telefone', value: ride.passenger.phone },
                { label: 'CPF', value: ride.passenger.document },
                { label: 'Avaliacao', value: ride.passenger.rating.toFixed(1) },
                { label: 'Corridas realizadas', value: String(ride.passenger.ridesCount) },
              ]}
            />

            {ride.notes && (
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5, bgcolor: 'background.default' }}>
                <Typography sx={{ fontWeight: 900 }}>Observacoes</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75, fontSize: 13 }}>
                  {ride.notes}
                </Typography>
              </Box>
            )}
          </Stack>

          <Box sx={{ border: '1px solid', borderColor: alpha(status.color, 0.32), borderRadius: 2, p: 2, bgcolor: alpha(status.color, 0.04), alignSelf: 'start' }}>
            <Typography variant="h4">Mensagem ao passageiro</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, mb: 1.5, fontSize: 13 }}>
              Envie uma atualizacao sobre o agendamento.
            </Typography>
            <TextField
              label="Mensagem"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={defaultMessage}
              multiline
              minRows={5}
              fullWidth
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, flexWrap: 'wrap', gap: 1 }}>
        <Button onClick={handleClose}>Fechar</Button>
        <Button color="error" variant="outlined" startIcon={<CancelScheduleSendIcon />} onClick={handleCancelRide}>
          Cancelar agendamento
        </Button>
        <Button variant="contained" startIcon={<SendIcon />} onClick={handleSendMessage}>
          Enviar mensagem
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function DetailSection({ title, items }: { title: string; items: Array<{ label: string; value: string }> }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5, bgcolor: 'background.default' }}>
      <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
      <Box sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, mt: 1.25 }}>
        {items.map((item) => (
          <Info key={item.label} label={item.label} value={item.value} />
        ))}
      </Box>
    </Box>
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
