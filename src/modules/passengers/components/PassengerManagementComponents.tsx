import { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined'
import { Avatar, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, ListItemText, MenuItem, Select, Stack, Tab, Tabs, TextField, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router'
import { DataBadge, type BadgePalette } from '@shared/ui/DataBadge'
import { SortableHeader } from '@shared/ui/SortableHeader'
import type { Passenger, PassengerDetails, PassengerEditForm, PassengerPayment, PassengerRide, PassengerStatus, PassengerTier } from '../types'
import { currencyFormatter, formatCpf, getPassengerDetails, getPassengerRideDetails, numberFormatter, paymentOptions, paymentPalette, statusPalette, tierPalette } from '../utils/passengers'

export function PassengerDetailsDialog({
  passenger,
  detailsOverride,
  tab,
  onTabChange,
  onClose,
}: {
  passenger: Passenger | null
  detailsOverride?: Partial<PassengerDetails>
  tab: number
  onTabChange: (value: number) => void
  onClose: () => void
}) {
  const theme = useTheme()
  const navigate = useNavigate()
  const [selectedRide, setSelectedRide] = useState<PassengerRide | null>(null)

  if (!passenger) {
    return null
  }

  const details = getPassengerDetails(passenger, detailsOverride)
  const cancellationRateLabel =
    details.monthlyAverage.cancellationRate == null
      ? 'Sem historico suficiente'
      : `${details.monthlyAverage.cancellationRate.toFixed(1)}%`

  return (
    <Dialog open={Boolean(passenger)} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              aria-label={details.photoLabel}
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'rgba(10, 190, 233, 0.12)',
                color: theme.palette.secondary.main,
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              {passenger.initials}
            </Avatar>
            <Box>
              <Typography variant="h4">{passenger.name}</Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                <PassengerBadge label={passenger.tier} palette={tierPalette[passenger.tier]} />
                <PassengerBadge label={passenger.status} palette={statusPalette[passenger.status]} />
                <PaymentBadges payments={passenger.payments} />
              </Stack>
            </Box>
          </Stack>

          <IconButton aria-label="Fechar detalhes do passageiro" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Tabs value={tab} onChange={(_, value) => onTabChange(value)} variant="scrollable" scrollButtons="auto" sx={{ mb: 3 }}>
          <Tab label="Cadastro" />
          <Tab label="Histórico de corridas" />
          <Tab label="Reclamacoes" />
          <Tab label="Média mensal" />
        </Tabs>

        {tab === 0 && (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            }}
          >
            <PassengerInfo label="Nome completo" value={passenger.name} />
            <PassengerInfo label="CPF" value={details.cpf} />
            <PassengerInfo label="Telefone" value={passenger.phone} />
            <PassengerInfo label="E-mail" value={details.email} />
            <PassengerInfo label="Cidade" value={details.city} />
            <PassengerInfo label="Data de cadastro" value={details.joinedAt} />
            <PassengerInfo label="Ultima corrida" value={details.lastRide} />
            <PassengerInfo label="Regiao preferida" value={details.preferredRegion} />
            <PassengerPaymentInfo payments={passenger.payments} />
          </Box>
        )}

        {tab === 1 && (
          <Stack spacing={1.5}>
            {details.rideHistory.map((ride) => (
              <Box
                key={ride.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedRide(ride)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedRide(ride)
                  }
                }}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  cursor: 'pointer',
                  transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: 'rgba(45, 212, 160, 0.08)',
                    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
                  },
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'grid',
                        placeItems: 'center',
                        color: theme.palette.primary.main,
                        backgroundColor: 'rgba(45, 212, 160, 0.14)',
                      }}
                    >
                      <RouteOutlinedIcon />
                    </Box>
                    <Box>
                      <Typography fontWeight={700}>
                        {ride.from} - {ride.to}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {ride.id} | {ride.date}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={ride.status} color="success" variant="outlined" />
                    <Typography fontWeight={700}>{currencyFormatter.format(ride.value)}</Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}

        {tab === 2 && (
          <Stack spacing={1.5}>
            {details.complaints.length === 0 ? (
              <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 3, textAlign: 'center' }}>
                <Typography fontWeight={700}>Sem reclamacoes registradas</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Este passageiro nao possui reclamacoes no historico mockado.
                </Typography>
              </Box>
            ) : (
              details.complaints.map((complaint) => (
                <Box
                  key={complaint.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/support?ticket=${encodeURIComponent(complaint.id)}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`/support?ticket=${encodeURIComponent(complaint.id)}`)
                    }
                  }}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 2,
                    cursor: 'pointer',
                    transition: theme.transitions.create(['border-color', 'background-color']),
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: 'rgba(45, 212, 160, 0.08)',
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <ReportProblemOutlinedIcon color="warning" />
                      <Box>
                        <Typography fontWeight={700}>{complaint.title}</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {complaint.id} | {complaint.date}
                        </Typography>
                      </Box>
                    </Stack>
                    <Chip label={complaint.status} color={complaint.status === 'Resolvido' ? 'success' : 'warning'} variant="outlined" />
                  </Stack>
                </Box>
              ))
            )}
          </Stack>
        )}

        {tab === 3 && (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
            }}
          >
            <PassengerMetric title="Corridas/mês" value={numberFormatter.format(details.monthlyAverage.rides)} />
            <PassengerMetric title="Gasto/mês" value={currencyFormatter.format(details.monthlyAverage.spend)} />
            <PassengerMetric title="Avaliação média" value={details.monthlyAverage.rating.toFixed(1)} />
            <PassengerMetric title="Cancelamentos" value={cancellationRateLabel} />
          </Box>
        )}
      </DialogContent>
      <PassengerRideDetailsDialog ride={selectedRide} onClose={() => setSelectedRide(null)} />
    </Dialog>
  )
}

export function PassengerRideDetailsDialog({ ride, onClose }: { ride: PassengerRide | null; onClose: () => void }) {
  const theme = useTheme()

  if (!ride) {
    return null
  }

  const details = getPassengerRideDetails(ride)

  return (
    <Dialog open={Boolean(ride)} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4">Detalhes da corrida {ride.id}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Trajeto percorrido, tempo e dados principais da viagem.
            </Typography>
          </Box>
          <IconButton aria-label="Fechar detalhes da corrida" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
            }}
          >
            <PassengerInfo label="Tempo de corrida" value={details.duration} />
            <PassengerInfo label="Distancia percorrida" value={details.distance} />
            <PassengerInfo label="Valor" value={currencyFormatter.format(ride.value)} />
          </Box>

          <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 2 }}>
            <Typography fontWeight={700} sx={{ mb: 2 }}>
              Trajeto percorrido
            </Typography>
            <Stack spacing={1.5}>
              {details.path.map((point, index) => (
                <Stack key={`${point}-${index}`} direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#FFFFFF',
                      bgcolor:
                        index === 0
                          ? theme.palette.primary.main
                          : index === details.path.length - 1
                            ? theme.palette.secondary.main
                            : theme.palette.warning.main,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography fontWeight={index === 0 || index === details.path.length - 1 ? 700 : 500}>
                    {point}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export function PassengerEditDialog({
  passenger,
  detailsOverride,
  onClose,
  onSave,
}: {
  passenger: Passenger | null
  detailsOverride?: Partial<PassengerDetails>
  onClose: () => void
  onSave: (form: PassengerEditForm) => void
}) {
  const [form, setForm] = useState<PassengerEditForm | null>(null)

  useEffect(() => {
    if (!passenger) {
      setForm(null)
      return
    }

    const details = getPassengerDetails(passenger, detailsOverride)
    setForm({
      ...passenger,
      cpf: formatCpf(details.cpf),
      email: details.email,
      city: details.city,
      joinedAt: details.joinedAt,
      lastRide: details.lastRide,
      preferredRegion: details.preferredRegion,
    })
  }, [detailsOverride, passenger])

  if (!passenger || !form) {
    return null
  }

  function updateForm<Key extends keyof PassengerEditForm>(key: Key, value: PassengerEditForm[Key]) {
    setForm((currentForm) => (currentForm ? { ...currentForm, [key]: value } : currentForm))
  }

  return (
    <Dialog open={Boolean(passenger)} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4">Editar cadastro do passageiro</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Altere qualquer informacao cadastral de {passenger.name}.
            </Typography>
          </Box>
          <IconButton aria-label="Fechar edicao do passageiro" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          <TextField label="Nome completo" value={form.name} onChange={(event) => updateForm('name', event.target.value)} />
          <TextField label="Telefone" value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} />
          <TextField
            label="CPF"
            value={form.cpf}
            onChange={(event) => updateForm('cpf', formatCpf(event.target.value))}
            inputProps={{ inputMode: 'numeric', maxLength: 14 }}
          />
          <TextField label="E-mail" value={form.email} onChange={(event) => updateForm('email', event.target.value)} />
          <TextField label="Cidade" value={form.city} onChange={(event) => updateForm('city', event.target.value)} />
          <TextField label="Data de cadastro" value={form.joinedAt} onChange={(event) => updateForm('joinedAt', event.target.value)} />
          <TextField label="Ultima corrida" value={form.lastRide} onChange={(event) => updateForm('lastRide', event.target.value)} />
          <TextField label="Regiao preferida" value={form.preferredRegion} onChange={(event) => updateForm('preferredRegion', event.target.value)} />
          <TextField
            label="Corridas"
            type="number"
            value={form.rides}
            onChange={(event) => updateForm('rides', Number(event.target.value))}
          />
          <TextField
            label="Avaliação"
            type="number"
            value={form.rating}
            onChange={(event) => updateForm('rating', Number(event.target.value))}
            inputProps={{ step: 0.1, min: 0, max: 5 }}
          />
          <TextField
            label="Gasto no mês"
            type="number"
            value={form.monthlySpend}
            onChange={(event) => updateForm('monthlySpend', Number(event.target.value))}
          />

          <FormControl>
            <InputLabel id="passenger-tier-label">Categoria</InputLabel>
            <Select
              labelId="passenger-tier-label"
              label="Categoria"
              value={form.tier}
              onChange={(event) => updateForm('tier', event.target.value as PassengerTier)}
            >
              <MenuItem value="Regular">Regular</MenuItem>
              <MenuItem value="Prata">Prata</MenuItem>
              <MenuItem value="Ouro">Ouro</MenuItem>
              <MenuItem value="VIP">VIP</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="passenger-status-label">Status</InputLabel>
            <Select
              labelId="passenger-status-label"
              label="Status"
              value={form.status}
              onChange={(event) => updateForm('status', event.target.value as PassengerStatus)}
            >
              <MenuItem value="Ativo">Ativo</MenuItem>
              <MenuItem value="Inativo">Inativo</MenuItem>
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Bloqueado">Bloqueado</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="passenger-payment-label">Pagamentos</InputLabel>
            <Select
              multiple
              labelId="passenger-payment-label"
              label="Pagamentos"
              value={form.payments}
              onChange={(event) => {
                const value = event.target.value
                updateForm('payments', typeof value === 'string' ? (value.split(',') as PassengerPayment[]) : (value as PassengerPayment[]))
              }}
              renderValue={(selected) => (selected as PassengerPayment[]).join(', ')}
            >
              {paymentOptions.map((payment) => (
                <MenuItem key={payment} value={payment}>
                  <Checkbox checked={form.payments.includes(payment)} />
                  <ListItemText primary={payment} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onSave(form)} disabled={!form.name || !form.phone || form.payments.length === 0}>
          Salvar alteracoes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function PassengerInfo({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={700} sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  )
}

export function PassengerPaymentInfo({ payments }: { payments: PassengerPayment[] }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      <Typography color="text.secondary">Formas de pagamento</Typography>
      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
        <PaymentBadges payments={payments} />
      </Stack>
    </Box>
  )
}

export function PassengerMetric({ title, value }: { title: string; value: string }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      <Typography color="text.secondary" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ mt: 0.75 }}>
        {value}
      </Typography>
    </Box>
  )
}

export function PaymentBadges({ payments }: { payments: PassengerPayment[] }) {
  return (
    <>
      {payments.map((payment) => (
        <PassengerBadge key={payment} label={payment} palette={paymentPalette[payment]} />
      ))}
    </>
  )
}

export { SortableHeader }

export function PassengerBadge({ label, palette }: { label: string; palette: BadgePalette }) {
  return <DataBadge label={label} palette={palette} />
}
