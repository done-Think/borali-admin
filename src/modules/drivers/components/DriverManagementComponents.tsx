import { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined'
import { Avatar, Box, Button, Card, CardContent, Chip, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Tab, TableCell, TableSortLabel, Tabs, TextField, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router'
import type { Driver, DriverCategory, DriverDetails, DriverEditForm, DriverRequest, DriverRide, DriverStatus, DriverSubscription, SortDirection } from '../types'
import { currencyFormatter, formatCpf, getDriverDetails, getDriverRideDetails, numberFormatter } from '../utils/drivers'

import { categoryPalette, statusPalette, subscriptionPalette, type BadgePalette } from '../utils/driverPalettes'

export function DriverDetailsDialog({
  driver,
  detailsOverride,
  tab,
  onTabChange,
  onClose,
}: {
  driver: Driver | null
  detailsOverride?: Partial<DriverDetails>
  tab: number
  onTabChange: (value: number) => void
  onClose: () => void
}) {
  const theme = useTheme()
  const navigate = useNavigate()
  const [selectedRide, setSelectedRide] = useState<DriverRide | null>(null)

  if (!driver) {
    return null
  }

  const details = getDriverDetails(driver, detailsOverride)

  return (
    <Dialog open={Boolean(driver)} onClose={onClose} fullWidth maxWidth="lg">
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
              {driver.initials}
            </Avatar>
            <Box>
              <Typography variant="h4">{driver.name}</Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                <DriverBadge label={driver.category} palette={categoryPalette[driver.category]} />
                <DriverBadge label={driver.status} palette={statusPalette[driver.status]} />
                <DriverBadge label={driver.subscription} palette={subscriptionPalette[driver.subscription]} />
              </Stack>
            </Box>
          </Stack>

          <IconButton aria-label="Fechar detalhes do motorista" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Tabs value={tab} onChange={(_, value) => onTabChange(value)} variant="scrollable" scrollButtons="auto" sx={{ mb: 3 }}>
          <Tab label="Cadastro" />
          <Tab label="Histórico de corridas" />
          <Tab label="Reclamações" />
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
            <DriverInfo label="Nome completo" value={driver.name} />
            <DriverInfo label="CPF" value={details.cpf} />
            <DriverInfo label="Telefone" value={driver.phone} />
            <DriverInfo label="E-mail" value={details.email} />
            <DriverInfo label="Cidade" value={details.city} />
            <DriverInfo label="Data de cadastro" value={details.joinedAt} />
            <DriverInfo label="Veículo" value={details.vehicle} />
            <DriverInfo label="Placa" value={details.plate} />
            <DriverInfo label="Último online" value={details.lastOnline} />
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
                      <Typography fontWeight={700}>{ride.from} → {ride.to}</Typography>
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
              <Box
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                }}
              >
                <Typography fontWeight={700}>Sem reclamações registradas</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Este motorista não possui reclamações no histórico mockado.
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
                    <Chip label={complaint.status} color={complaint.status === 'Aberta' ? 'warning' : 'success'} variant="outlined" />
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
            <DriverMetric title="Corridas/mês" value={numberFormatter.format(details.monthlyAverage.rides)} />
            <DriverMetric title="Ganhos/mês" value={currencyFormatter.format(details.monthlyAverage.earnings)} />
            <DriverMetric title="Avaliação média" value={details.monthlyAverage.rating.toFixed(1)} />
            <DriverMetric title="Cancelamentos" value={`${details.monthlyAverage.cancellationRate.toFixed(1)}%`} />
          </Box>
        )}
      </DialogContent>
      <DriverRideDetailsDialog ride={selectedRide} onClose={() => setSelectedRide(null)} />
    </Dialog>
  )
}

export function DriverRideDetailsDialog({ ride, onClose }: { ride: DriverRide | null; onClose: () => void }) {
  const theme = useTheme()

  if (!ride) {
    return null
  }

  const details = getDriverRideDetails(ride)

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
            <DriverInfo label="Tempo de corrida" value={details.duration} />
            <DriverInfo label="Distancia percorrida" value={details.distance} />
            <DriverInfo label="Valor" value={currencyFormatter.format(ride.value)} />
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

export function DriverInfo({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={700} sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  )
}

export function DriverEditDialog({
  driver,
  detailsOverride,
  mode = 'edit',
  onClose,
  onSave,
}: {
  driver: Driver | null
  detailsOverride?: Partial<DriverDetails>
  mode?: 'edit' | 'create'
  onClose: () => void
  onSave: (form: DriverEditForm) => void
}) {
  const [form, setForm] = useState<DriverEditForm | null>(null)

  useEffect(() => {
    if (!driver) {
      setForm(null)
      return
    }

    const details = getDriverDetails(driver, detailsOverride)
    setForm({
      ...driver,
      cpf: formatCpf(details.cpf),
      email: details.email,
      city: details.city,
      vehicle: details.vehicle,
      plate: details.plate,
      joinedAt: details.joinedAt,
      lastOnline: details.lastOnline,
    })
  }, [detailsOverride, driver])

  if (!driver || !form) {
    return null
  }

  function updateForm<Key extends keyof DriverEditForm>(key: Key, value: DriverEditForm[Key]) {
    setForm((currentForm) => (currentForm ? { ...currentForm, [key]: value } : currentForm))
  }

  return (
    <Dialog open={Boolean(driver)} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4">
              {mode === 'create' ? 'Cadastrar novo motorista' : 'Editar cadastro do motorista'}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {mode === 'create'
                ? 'Preencha os dados para criar um cadastro manual.'
                : `Altere qualquer informação cadastral de ${driver.name}.`}
            </Typography>
          </Box>
          <IconButton aria-label="Fechar edição do motorista" onClick={onClose}>
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
          <TextField label="Veículo" value={form.vehicle} onChange={(event) => updateForm('vehicle', event.target.value)} />
          <TextField label="Placa" value={form.plate} onChange={(event) => updateForm('plate', event.target.value)} />
          <TextField label="Data de cadastro" value={form.joinedAt} onChange={(event) => updateForm('joinedAt', event.target.value)} />
          <TextField label="Último online" value={form.lastOnline} onChange={(event) => updateForm('lastOnline', event.target.value)} />
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
            label="Ganhos no mês"
            type="number"
            value={form.monthlyEarnings}
            onChange={(event) => updateForm('monthlyEarnings', Number(event.target.value))}
          />

          <FormControl>
            <InputLabel id="driver-category-label">Categoria</InputLabel>
            <Select
              labelId="driver-category-label"
              label="Categoria"
              value={form.category}
              onChange={(event) => updateForm('category', event.target.value as DriverCategory)}
            >
              <MenuItem value="Conforto">Conforto</MenuItem>
              <MenuItem value="Econômico">Econômico</MenuItem>
              <MenuItem value="Executivo">Executivo</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="driver-status-label">Status</InputLabel>
            <Select
              labelId="driver-status-label"
              label="Status"
              value={form.status}
              onChange={(event) => updateForm('status', event.target.value as DriverStatus)}
            >
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Bloqueado">Bloqueado</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="driver-subscription-label">Assinatura</InputLabel>
            <Select
              labelId="driver-subscription-label"
              label="Assinatura"
              value={form.subscription}
              onChange={(event) => updateForm('subscription', event.target.value as DriverSubscription)}
            >
              <MenuItem value="Pro">Pro</MenuItem>
              <MenuItem value="Básico">Básico</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
              <MenuItem value="Trial">Trial</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onSave(form)} disabled={!form.name || !form.phone}>
          {mode === 'create' ? 'Cadastrar motorista' : 'Salvar alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function DriverMetric({ title, value }: { title: string; value: string }) {
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

export function SortableHeader({
  active,
  direction,
  label,
  onClick,
}: {
  active: boolean
  direction: SortDirection
  label: string
  onClick: () => void
}) {
  return (
    <TableCell>
      <TableSortLabel active={active} direction={active ? direction : 'asc'} onClick={onClick}>
        {label}
      </TableSortLabel>
    </TableCell>
  )
}

export function NewDriverDialog({
  open,
  requests,
  initialExpandedRequestId,
  onClose,
  onCreateManual,
  onApprove,
}: {
  open: boolean
  requests: DriverRequest[]
  initialExpandedRequestId?: string
  onClose: () => void
  onCreateManual: () => void
  onApprove: (request: DriverRequest) => void
}) {
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  const theme = useTheme()

  useEffect(() => {
    if (open) {
      setExpandedRequest(initialExpandedRequestId ?? null)
    }
  }, [initialExpandedRequestId, open])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4">Novo motorista</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Cadastre manualmente ou aprove pedidos recebidos pelo app.
            </Typography>
          </Box>
          <IconButton aria-label="Fechar novo motorista" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
          >
            <Box>
              <Typography fontWeight={700}>Cadastro manual</Typography>
              <Typography color="text.secondary">Crie um motorista preenchendo todos os dados do cadastro.</Typography>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateManual}>
              Cadastrar nós mesmos
            </Button>
          </Stack>

          <Divider />

          <Box>
            <Typography fontWeight={700}>Pedidos recebidos</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Cards iniciam minimizados; ao expandir, exibem cadastro completo e anexos enviados.
            </Typography>
          </Box>

          <Stack spacing={1.5}>
            {requests.length === 0 ? (
              <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 3, textAlign: 'center' }}>
                <Typography fontWeight={700}>Nenhum pedido pendente</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Todos os pedidos recebidos já foram analisados.
                </Typography>
              </Box>
            ) : (
              requests.map((request) => {
                const expanded = expandedRequest === request.requestId

                return (
                  <Card key={request.requestId} variant="outlined">
                    <CardContent>
                      <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        alignItems={{ xs: 'stretch', md: 'center' }}
                        justifyContent="space-between"
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              bgcolor: 'rgba(10, 190, 233, 0.12)',
                              color: theme.palette.secondary.main,
                              fontWeight: 700,
                            }}
                          >
                            {request.initials}
                          </Avatar>
                          <Box>
                            <Typography variant="h4">{request.name}</Typography>
                            <Typography color="text.secondary">
                              {request.cpf} | {request.phone}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="flex-end">
                          <Chip label={request.requestId} variant="outlined" />
                          <Button
                            size="small"
                            variant="outlined"
                            endIcon={
                              <ExpandMoreIcon
                                sx={{
                                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: theme.transitions.create('transform'),
                                }}
                              />
                            }
                            onClick={() => setExpandedRequest(expanded ? null : request.requestId)}
                          >
                            {expanded ? 'Recolher' : 'Expandir'}
                          </Button>
                        </Stack>
                      </Stack>

                      <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Box sx={{ mt: 3 }}>
                          <Box
                            sx={{
                              display: 'grid',
                              gap: 2,
                              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                            }}
                          >
                            <DriverInfo label="E-mail" value={request.email} />
                            <DriverInfo label="Cidade" value={request.city} />
                            <DriverInfo label="Solicitado em" value={request.requestedAt} />
                            <DriverInfo label="Categoria" value={request.category} />
                            <DriverInfo label="Veículo" value={request.vehicle} />
                            <DriverInfo label="Placa" value={request.plate} />
                          </Box>

                          <Box sx={{ mt: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                              <ImageOutlinedIcon color="primary" />
                              <Typography fontWeight={700}>Anexos enviados</Typography>
                              <Chip label={request.attachments.length} size="small" color="primary" variant="outlined" />
                            </Stack>

                            <Box
                              sx={{
                                display: 'grid',
                                gap: 1.5,
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
                              }}
                            >
                              {request.attachments.map((attachment) => (
                                <Box
                                  key={attachment.name}
                                  sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '64px 1fr',
                                    gap: 1.5,
                                    alignItems: 'center',
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 2,
                                    p: 1,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 64,
                                      height: 52,
                                      borderRadius: 1.5,
                                      display: 'grid',
                                      placeItems: 'center',
                                      color: theme.palette.secondary.main,
                                      background:
                                        'linear-gradient(135deg, rgba(10, 190, 233, 0.18), rgba(45, 212, 160, 0.16))',
                                    }}
                                  >
                                    <ImageOutlinedIcon />
                                  </Box>
                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography fontWeight={700} noWrap>
                                      {attachment.name}
                                    </Typography>
                                    <Typography color="text.secondary" variant="body2">
                                      {attachment.type} enviado
                                    </Typography>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          </Box>

                          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
                            <Button variant="outlined">Revisar depois</Button>
                            <Button variant="contained" onClick={() => onApprove(request)}>
                              Aprovar motorista
                            </Button>
                          </Stack>
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export function DriverBadge({ label, palette }: { label: string; palette: BadgePalette }) {
  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      sx={{
        color: palette.color,
        borderColor: palette.border,
        backgroundColor: palette.background,
        fontWeight: 700,
      }}
    />
  )
}
