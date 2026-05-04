import { useState, type MouseEvent } from 'react'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { useNavigate } from 'react-router'
import { driverDetailsById, drivers } from '../../drivers/data/mockDrivers'
import { subscriptionRenewalsByDriverId } from '../data/mockSubscriptions'
import type { SubscriptionRenewal, TrialExpiration } from '../types'

type ExpiringTrialsPanelProps = {
  trials: TrialExpiration[]
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

const planColors = {
  Básico: '#22D3EE',
  Pro: '#2563EB',
  Premium: '#22C55E',
}

function getUrgencyMeta(days: number) {
  if (days <= 1) {
    return {
      color: 'error' as const,
      label: days === 0 ? 'Expira hoje' : '1 dia restante',
    }
  }

  if (days <= 3) {
    return {
      color: 'warning' as const,
      label: `${days} dias restantes`,
    }
  }

  return {
    color: 'info' as const,
    label: `${days} dias restantes`,
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function getRenewalStatusColor(status: SubscriptionRenewal['status']) {
  if (status === 'Pago') {
    return 'success' as const
  }

  if (status === 'Falhou') {
    return 'error' as const
  }

  return 'warning' as const
}

export function ExpiringTrialsPanel({ trials }: ExpiringTrialsPanelProps) {
  const theme = useTheme()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [selectedTrial, setSelectedTrial] = useState<TrialExpiration | null>(null)
  const criticalTrials = trials.filter((trial) => trial.expiresInDays <= 1).length
  const selectedDriver = selectedTrial ? drivers.find((driver) => driver.id === selectedTrial.driverId) : null
  const selectedDriverDetails = selectedDriver ? driverDetailsById[selectedDriver.id] : null
  const selectedRenewals = selectedTrial ? subscriptionRenewalsByDriverId[selectedTrial.driverId] ?? [] : []
  const selectedUrgency = selectedTrial ? getUrgencyMeta(selectedTrial.expiresInDays) : null

  function openDriverSummary(event: MouseEvent<HTMLButtonElement>, trial: TrialExpiration) {
    event.stopPropagation()
    setSelectedTrial(trial)
  }

  function openFullDriverProfile() {
    if (!selectedTrial) {
      return
    }

    navigate('/drivers', { state: { selectedDriverId: selectedTrial.driverId, selectedDriverTab: 0 } })
  }

  return (
    <Card variant="outlined">
      <ButtonBase
        onClick={() => setExpanded((current) => !current)}
        sx={{ width: '100%', display: 'block', textAlign: 'left', borderRadius: 'inherit' }}
        aria-expanded={expanded}
        aria-controls="expiring-trials-content"
      >
        <CardContent sx={{ p: 2.25, '&:last-child': { pb: 2.25 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4">Trials expirando (7 dias)</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.25 }}>
                {expanded
                  ? 'Motoristas que precisam de acompanhamento antes da conversão.'
                  : `${trials.length} trials em atenção, ${criticalTrials} com urgência alta.`}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                icon={<AccessTimeOutlinedIcon />}
                label={`${trials.length} em atenção`}
                color="warning"
                variant="outlined"
                sx={{ fontWeight: 800 }}
              />
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 1.5,
                  display: 'grid',
                  placeItems: 'center',
                  color: 'text.secondary',
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: theme.transitions.create('transform', { duration: theme.transitions.duration.shortest }),
                }}
              >
                <ExpandMoreIcon fontSize="small" />
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </ButtonBase>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent
          id="expiring-trials-content"
          sx={{ pt: 0, px: 2.25, pb: 2.25, '&:last-child': { pb: 2.25 } }}
        >
          <Stack divider={<Divider flexItem />} spacing={0}>
            {trials.map((trial) => {
              const urgency = getUrgencyMeta(trial.expiresInDays)

              return (
                <Stack
                  key={trial.id}
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  justifyContent="space-between"
                  sx={{ py: 1.5 }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor: `${planColors[trial.plan]}1F`,
                        color: planColors[trial.plan],
                        fontWeight: 900,
                        fontSize: 13,
                      }}
                    >
                      {getInitials(trial.driverName)}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={800} noWrap>
                        {trial.driverName}
                      </Typography>
                      <Typography color="text.secondary" variant="body2" noWrap>
                        {trial.city} - {currencyFormatter.format(trial.monthlyValue)}/mês
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
                    sx={{ minWidth: { sm: 300 } }}
                  >
                    <Chip
                      label={trial.plan}
                      size="small"
                      variant="outlined"
                      sx={{
                        color: planColors[trial.plan],
                        borderColor: planColors[trial.plan],
                        fontWeight: 800,
                      }}
                    />
                    <Chip label={urgency.label} size="small" color={urgency.color} sx={{ fontWeight: 800 }} />
                    <Button
                      size="small"
                      variant="text"
                      onClick={(event) => openDriverSummary(event, trial)}
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 800,
                        textTransform: 'none',
                      }}
                    >
                      Ver perfil
                    </Button>
                  </Stack>
                </Stack>
              )
            })}
          </Stack>
        </CardContent>
      </Collapse>

      <Dialog open={Boolean(selectedTrial)} onClose={() => setSelectedTrial(null)} fullWidth maxWidth="md">
        <DialogTitle sx={{ pr: 7 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: selectedTrial ? `${planColors[selectedTrial.plan]}1F` : 'action.hover',
                color: selectedTrial ? planColors[selectedTrial.plan] : 'text.secondary',
                fontWeight: 900,
              }}
            >
              {getInitials(selectedDriver?.name ?? selectedTrial?.driverName ?? '')}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" component="span" noWrap>
                {selectedDriver?.name ?? selectedTrial?.driverName ?? 'Motorista'}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {selectedDriver?.id ?? selectedTrial?.driverId} · Resumo de trial e renovações
              </Typography>
            </Box>
          </Stack>

          <IconButton
            aria-label="Fechar resumo do motorista"
            onClick={() => setSelectedTrial(null)}
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedTrial ? (
            <Stack spacing={2.5}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                {[
                  { label: 'Plano em trial', value: selectedTrial.plan },
                  { label: 'Mensalidade', value: `${currencyFormatter.format(selectedTrial.monthlyValue)}/mês` },
                  { label: 'Prazo', value: selectedUrgency?.label ?? 'Sem prazo' },
                ].map((item) => (
                  <Card key={item.label} variant="outlined" sx={{ flex: 1 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Typography color="text.secondary" variant="body2">
                        {item.label}
                      </Typography>
                      <Typography fontWeight={900} sx={{ mt: 0.5 }}>
                        {item.value}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>

              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.5}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      justifyContent="space-between"
                    >
                      <Box>
                        <Typography variant="h5">Resumo do cadastro</Typography>
                        <Typography color="text.secondary" variant="body2">
                          Dados principais do motorista antes de abrir o perfil completo.
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {selectedDriver ? <Chip label={selectedDriver.status} size="small" color="info" /> : null}
                        {selectedDriver ? <Chip label={selectedDriver.category} size="small" variant="outlined" /> : null}
                      </Stack>
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap" useFlexGap>
                      <Box sx={{ minWidth: 170 }}>
                        <Typography color="text.secondary" variant="body2">
                          Telefone
                        </Typography>
                        <Typography fontWeight={800}>{selectedDriver?.phone ?? 'Não informado'}</Typography>
                      </Box>
                      <Box sx={{ minWidth: 170 }}>
                        <Typography color="text.secondary" variant="body2">
                          Cidade
                        </Typography>
                        <Typography fontWeight={800}>{selectedDriverDetails?.city ?? selectedTrial.city}</Typography>
                      </Box>
                      <Box sx={{ minWidth: 170 }}>
                        <Typography color="text.secondary" variant="body2">
                          Veículo
                        </Typography>
                        <Typography fontWeight={800}>{selectedDriverDetails?.vehicle ?? 'Aguardando cadastro'}</Typography>
                      </Box>
                      <Box sx={{ minWidth: 170 }}>
                        <Typography color="text.secondary" variant="body2">
                          Corridas / avaliação
                        </Typography>
                        <Typography fontWeight={800}>
                          {selectedDriver ? `${selectedDriver.rides} · ${selectedDriver.rating.toFixed(1)}` : 'Não informado'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h5">Histórico de renovações</Typography>
                  <Stack divider={<Divider flexItem />} sx={{ mt: 1.5 }}>
                    {selectedRenewals.length > 0 ? (
                      selectedRenewals.map((renewal) => (
                        <Stack
                          key={renewal.id}
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={1.5}
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                          justifyContent="space-between"
                          sx={{ py: 1.25 }}
                        >
                          <Box>
                            <Typography fontWeight={800}>{renewal.date}</Typography>
                            <Typography color="text.secondary" variant="body2">
                              {renewal.plan} · {renewal.method}
                            </Typography>
                          </Box>

                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography fontWeight={900}>{currencyFormatter.format(renewal.value)}</Typography>
                            <Chip
                              label={renewal.status}
                              size="small"
                              color={getRenewalStatusColor(renewal.status)}
                              sx={{ fontWeight: 800 }}
                            />
                          </Stack>
                        </Stack>
                      ))
                    ) : (
                      <Typography color="text.secondary" sx={{ py: 1.5 }}>
                        Nenhuma renovação registrada para este motorista.
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          ) : null}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={() => setSelectedTrial(null)} sx={{ textTransform: 'none', fontWeight: 800 }}>
            Fechar
          </Button>
          <Button variant="contained" onClick={openFullDriverProfile} sx={{ textTransform: 'none', fontWeight: 800 }}>
            Ir para perfil completo
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}
