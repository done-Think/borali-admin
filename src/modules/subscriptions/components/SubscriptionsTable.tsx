import { useMemo, useState, type MouseEvent } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import {
  Autocomplete,
  Avatar,
  Box,
  ButtonBase,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { driverDetailsById, drivers } from '../../drivers/data/mockDrivers'
import {
  subscriptionMovementBySubscriptionId,
  subscriptionPaymentHistoryBySubscriptionId,
} from '../data/mockSubscriptions'
import type { DriverSubscription, SubscriptionPaymentRecord, SubscriptionPlan, SubscriptionStatus } from '../types'

type SubscriptionsTableProps = {
  subscriptions: DriverSubscription[]
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const planPalette: Record<SubscriptionPlan, string> = {
  Básico: '#22D3EE',
  Pro: '#2563EB',
  Premium: '#22C55E',
}

const statusPalette: Record<SubscriptionStatus, 'success' | 'warning' | 'error'> = {
  ATIVO: 'success',
  TRIAL: 'warning',
  ATRASADO: 'error',
}

const availablePlans: {
  plan: SubscriptionPlan
  value: number
  helper: string
  improvements: string[]
}[] = [
  {
    plan: 'Básico',
    value: 49.9,
    helper: 'Entrada para operação ativa',
    improvements: ['Perfil ativo no app', 'Suporte padrão', 'Relatórios mensais básicos'],
  },
  {
    plan: 'Pro',
    value: 89.9,
    helper: 'Mais visibilidade e gestão',
    improvements: ['Prioridade em chamadas', 'Relatórios semanais', 'Campanhas de retenção', 'Alertas de desempenho'],
  },
  {
    plan: 'Premium',
    value: 129.9,
    helper: 'Pacote completo para alta operação',
    improvements: ['Maior prioridade na busca', 'Suporte prioritário', 'Insights avançados', 'Benefícios promocionais'],
  },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T12:00:00`))
}

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function getSubscriptionSearchText(subscription: DriverSubscription) {
  return [
    subscription.driverName,
    subscription.driverPhone,
    subscription.plan,
    subscription.status,
    formatDate(subscription.nextBillingAt),
    `${subscription.monthlyValue}`,
  ].join(' ')
}

function getPaymentStatusColor(status: SubscriptionPaymentRecord['status']) {
  if (status === 'Pago') {
    return 'success' as const
  }

  if (status === 'Falhou') {
    return 'error' as const
  }

  return 'warning' as const
}

function getPaymentPunctuality(payments: SubscriptionPaymentRecord[]) {
  const completedPayments = payments.filter((payment) => payment.status === 'Pago')
  const latePayments = completedPayments.filter((payment) => payment.delayDays > 0).length

  if (completedPayments.length === 0) {
    return 'Sem pagamentos concluídos'
  }

  if (latePayments === 0) {
    return 'Sempre em dia'
  }

  return `${latePayments} pagamento${latePayments === 1 ? '' : 's'} com atraso`
}

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedSubscription, setSelectedSubscription] = useState<DriverSubscription | null>(null)
  const [detailsSubscription, setDetailsSubscription] = useState<DriverSubscription | null>(null)
  const [planChangeSubscription, setPlanChangeSubscription] = useState<DriverSubscription | null>(null)
  const menuOpen = Boolean(anchorEl)
  const overdueSubscriptions = subscriptions.filter((subscription) => subscription.status === 'ATRASADO').length
  const overdueLabel = `${overdueSubscriptions} ${
    overdueSubscriptions === 1 ? 'assinatura atrasada' : 'assinaturas atrasadas'
  }`
  const subscriptionSearchOptions = useMemo(
    () =>
      Array.from(new Set(subscriptions.map((subscription) => subscription.driverName))).sort((a, b) =>
        a.localeCompare(b, 'pt-BR'),
      ),
    [subscriptions],
  )
  const filteredSubscriptions = useMemo(() => {
    const normalizedTerm = normalizeSearch(searchTerm)

    if (!normalizedTerm) {
      return subscriptions
    }

    return subscriptions.filter((subscription) =>
      normalizeSearch(getSubscriptionSearchText(subscription)).includes(normalizedTerm),
    )
  }, [searchTerm, subscriptions])

  function handleOpenMenu(event: MouseEvent<HTMLElement>, subscription: DriverSubscription) {
    setAnchorEl(event.currentTarget)
    setSelectedSubscription(subscription)
  }

  function handleCloseMenu() {
    setAnchorEl(null)
    setSelectedSubscription(null)
  }

  function handleOpenDetails() {
    setDetailsSubscription(selectedSubscription)
    handleCloseMenu()
  }

  function handleOpenPlanChange() {
    setPlanChangeSubscription(selectedSubscription)
    handleCloseMenu()
  }

  const detailsDriver = detailsSubscription
    ? drivers.find((driver) => driver.id === detailsSubscription.driverId || driver.phone === detailsSubscription.driverPhone)
    : null
  const detailsDriverProfile = detailsDriver ? driverDetailsById[detailsDriver.id] : null
  const detailsPayments = detailsSubscription
    ? subscriptionPaymentHistoryBySubscriptionId[detailsSubscription.id] ?? []
    : []
  const detailsMovement = detailsSubscription ? subscriptionMovementBySubscriptionId[detailsSubscription.id] : null
  const latestPayment = detailsPayments[0]
  const totalPaid = detailsPayments
    .filter((payment) => payment.status === 'Pago')
    .reduce((total, payment) => total + payment.value, 0)
  const punctualityLabel = getPaymentPunctuality(detailsPayments)

  return (
    <Card variant="outlined">
      <ButtonBase
        onClick={() => setExpanded((current) => !current)}
        sx={{ width: '100%', display: 'block', textAlign: 'left', borderRadius: 'inherit' }}
        aria-expanded={expanded}
        aria-controls="subscriptions-table-content"
      >
        <CardContent sx={{ p: 2.25, '&:last-child': { pb: 2.25 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4">Assinaturas</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.25 }}>
                {expanded
                  ? 'Lista operacional de planos ativos, trials e pagamentos atrasados.'
                  : `${subscriptions.length} registros, ${overdueLabel}.`}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={`${subscriptions.length} registros`} color="primary" variant="outlined" sx={{ fontWeight: 800 }} />
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
          id="subscriptions-table-content"
          sx={{ pt: 0, px: 2.25, pb: 2.25, '&:last-child': { pb: 2.25 } }}
        >
          <Autocomplete
            freeSolo
            options={subscriptionSearchOptions}
            inputValue={searchTerm}
            onInputChange={(_, value) => setSearchTerm(value)}
            size="small"
            sx={{ mb: 1.5, maxWidth: 420 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar assinatura"
                placeholder="Nome, telefone, plano ou status"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <SearchIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <TableContainer>
            <Table sx={{ minWidth: 860 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Motorista</TableCell>
                  <TableCell>Plano</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Próx. cobrança</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell align="right" sx={{ width: 88 }}>
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'rgba(10, 190, 233, 0.12)',
                            color: theme.palette.secondary.main,
                            fontWeight: 800,
                            fontSize: 13,
                          }}
                        >
                          {getInitials(subscription.driverName)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography fontWeight={800} noWrap>
                            {subscription.driverName}
                          </Typography>
                          <Typography color="text.secondary" variant="body2" noWrap>
                            {subscription.driverPhone}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={subscription.plan}
                        size="small"
                        variant="outlined"
                        sx={{
                          color: planPalette[subscription.plan],
                          borderColor: planPalette[subscription.plan],
                          fontWeight: 800,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={subscription.status}
                        size="small"
                        color={statusPalette[subscription.status]}
                        sx={{ fontWeight: 800 }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(subscription.nextBillingAt)}</TableCell>
                    <TableCell>{currencyFormatter.format(subscription.monthlyValue)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ações">
                        <IconButton
                          size="small"
                          aria-label={`Ações de assinatura de ${subscription.driverName}`}
                          onClick={(event) => handleOpenMenu(event, subscription)}
                        >
                          <MoreHorizIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography color="text.secondary" sx={{ py: 2 }}>
                        Nenhuma assinatura encontrada para essa busca.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleOpenDetails}>Ver detalhes</MenuItem>
            <MenuItem onClick={handleOpenPlanChange}>Alterar plano</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Registrar pagamento</MenuItem>
            <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
              Cancelar assinatura
            </MenuItem>
          </Menu>

          {selectedSubscription ? (
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1.5 }}>
              Selecionado: {selectedSubscription.driverName}
            </Typography>
          ) : null}
        </CardContent>
      </Collapse>

      <Dialog open={Boolean(detailsSubscription)} onClose={() => setDetailsSubscription(null)} fullWidth maxWidth="lg">
        <DialogTitle sx={{ pr: 7 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: detailsSubscription ? `${planPalette[detailsSubscription.plan]}1F` : 'action.hover',
                color: detailsSubscription ? planPalette[detailsSubscription.plan] : 'text.secondary',
                fontWeight: 900,
              }}
            >
              {getInitials(detailsSubscription?.driverName ?? '')}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" component="span" noWrap>
                {detailsSubscription?.driverName ?? 'Assinatura'}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {detailsSubscription?.driverPhone} · resumo da assinatura e pagamentos
              </Typography>
            </Box>
          </Stack>

          <IconButton
            aria-label="Fechar detalhes da assinatura"
            onClick={() => setDetailsSubscription(null)}
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {detailsSubscription ? (
            <Stack spacing={2.5}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                {[
                  { label: 'Plano atual', value: detailsSubscription.plan },
                  { label: 'Status', value: detailsSubscription.status },
                  { label: 'Próxima cobrança', value: formatDate(detailsSubscription.nextBillingAt) },
                  { label: 'Total pago no histórico', value: currencyFormatter.format(totalPaid) },
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

              <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                <Card variant="outlined" sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h5">Cadastro resumido</Typography>
                    <Stack divider={<Divider flexItem />} sx={{ mt: 1.5 }}>
                      {[
                        { label: 'Motorista', value: detailsSubscription.driverName },
                        { label: 'Telefone', value: detailsSubscription.driverPhone },
                        { label: 'Cidade', value: detailsDriverProfile?.city ?? 'Não informado' },
                        { label: 'Veículo', value: detailsDriverProfile?.vehicle ?? 'Não informado' },
                        { label: 'Entrada', value: detailsDriverProfile?.joinedAt ?? 'Não informado' },
                      ].map((item) => (
                        <Stack key={item.label} direction="row" justifyContent="space-between" spacing={2} sx={{ py: 1 }}>
                          <Typography color="text.secondary">{item.label}</Typography>
                          <Typography fontWeight={800} textAlign="right">
                            {item.value}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined" sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h5">Pagamento registrado</Typography>
                    {latestPayment ? (
                      <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                          <Chip
                            label={latestPayment.status}
                            size="small"
                            color={getPaymentStatusColor(latestPayment.status)}
                            sx={{ fontWeight: 800 }}
                          />
                          <Chip label={latestPayment.method} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                          <Chip label={punctualityLabel} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                        </Stack>
                        <Typography fontWeight={900}>{currencyFormatter.format(latestPayment.value)}</Typography>
                        <Typography color="text.secondary">
                          Pago via {latestPayment.paidWith} em {latestPayment.date}. Vencimento em {latestPayment.dueDate}.
                        </Typography>
                        <Typography color={latestPayment.delayDays > 0 ? 'error.main' : 'success.main'} fontWeight={800}>
                          {latestPayment.delayDays > 0
                            ? `${latestPayment.delayDays} dia${latestPayment.delayDays === 1 ? '' : 's'} de atraso`
                            : 'Pagamento dentro do prazo'}
                        </Typography>
                      </Stack>
                    ) : (
                      <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                        Nenhum pagamento registrado.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Stack>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h5">Média de movimentação no plano</Typography>
                  {detailsMovement ? (
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 1.5 }}>
                      {[
                        { label: 'Corridas/mês', value: `${detailsMovement.averageRides}` },
                        { label: 'Receita/mês', value: currencyFormatter.format(detailsMovement.averageRevenue) },
                        { label: 'Horas online/mês', value: `${detailsMovement.averageOnlineHours}h` },
                      ].map((item) => (
                        <Box key={item.label} sx={{ flex: 1 }}>
                          <Typography color="text.secondary" variant="body2">
                            {item.label}
                          </Typography>
                          <Typography variant="h5" fontWeight={900}>
                            {item.value}
                          </Typography>
                        </Box>
                      ))}
                      <Box sx={{ flex: 1, minWidth: 180 }}>
                        <Typography color="text.secondary" variant="body2">
                          Uso dos recursos do plano
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.75 }}>
                          <LinearProgress
                            variant="determinate"
                            value={detailsMovement.planUsage}
                            sx={{ flex: 1, height: 8, borderRadius: 999 }}
                          />
                          <Typography fontWeight={900}>{detailsMovement.planUsage}%</Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  ) : (
                    <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                      Sem movimentação consolidada para este plano.
                    </Typography>
                  )}
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h5">Histórico de pagamentos</Typography>
                  <Stack divider={<Divider flexItem />} sx={{ mt: 1.5 }}>
                    {detailsPayments.map((payment) => (
                      <Stack
                        key={payment.id}
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={1.5}
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                        justifyContent="space-between"
                        sx={{ py: 1.25 }}
                      >
                        <Box>
                          <Typography fontWeight={800}>{payment.date}</Typography>
                          <Typography color="text.secondary" variant="body2">
                            {payment.plan} · {payment.paidWith} · venc. {payment.dueDate}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                          <Typography fontWeight={900}>{currencyFormatter.format(payment.value)}</Typography>
                          <Chip label={payment.method} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                          <Chip
                            label={payment.status}
                            size="small"
                            color={getPaymentStatusColor(payment.status)}
                            sx={{ fontWeight: 800 }}
                          />
                          <Chip
                            label={payment.delayDays > 0 ? `${payment.delayDays}d atraso` : 'Em dia'}
                            size="small"
                            color={payment.delayDays > 0 ? 'error' : 'success'}
                            variant="outlined"
                            sx={{ fontWeight: 800 }}
                          />
                        </Stack>
                      </Stack>
                    ))}
                    {detailsPayments.length === 0 ? (
                      <Typography color="text.secondary" sx={{ py: 1.5 }}>
                        Nenhum histórico de pagamento encontrado.
                      </Typography>
                    ) : null}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(planChangeSubscription)} onClose={() => setPlanChangeSubscription(null)} fullWidth maxWidth="md">
        <DialogTitle sx={{ pr: 7 }}>
          <Box>
            <Typography variant="h4" component="span">
              Alterar plano
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {planChangeSubscription?.driverName} · plano atual: {planChangeSubscription?.plan}
            </Typography>
          </Box>

          <IconButton
            aria-label="Fechar alteração de plano"
            onClick={() => setPlanChangeSubscription(null)}
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            {availablePlans.map((item) => {
              const isCurrentPlan = item.plan === planChangeSubscription?.plan

              return (
                <Card
                  key={item.plan}
                  variant="outlined"
                  sx={{
                    flex: 1,
                    borderColor: isCurrentPlan ? planPalette[item.plan] : 'divider',
                    bgcolor: isCurrentPlan ? `${planPalette[item.plan]}0F` : 'background.paper',
                  }}
                >
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="center">
                        <Box>
                          <Typography variant="h5">{item.plan}</Typography>
                          <Typography color="text.secondary" variant="body2">
                            {item.helper}
                          </Typography>
                        </Box>
                        {isCurrentPlan ? <Chip label="Atual" size="small" color="primary" sx={{ fontWeight: 800 }} /> : null}
                      </Stack>

                      <Box>
                        <Typography variant="h4" fontWeight={900}>
                          {currencyFormatter.format(item.value)}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          por mês
                        </Typography>
                      </Box>

                      <Stack spacing={1}>
                        {item.improvements.map((improvement) => (
                          <Stack key={improvement} direction="row" spacing={1} alignItems="flex-start">
                            <CheckCircleOutlineIcon
                              fontSize="small"
                              sx={{ color: planPalette[item.plan], mt: 0.15, flexShrink: 0 }}
                            />
                            <Typography variant="body2">{improvement}</Typography>
                          </Stack>
                        ))}
                      </Stack>

                      <ButtonBase
                        disabled={isCurrentPlan}
                        onClick={() => setPlanChangeSubscription(null)}
                        sx={{
                          mt: 1,
                          borderRadius: 1,
                          py: 1,
                          px: 1.5,
                          bgcolor: isCurrentPlan ? 'action.disabledBackground' : planPalette[item.plan],
                          color: isCurrentPlan ? 'text.disabled' : 'common.white',
                          fontWeight: 900,
                          textAlign: 'center',
                          width: '100%',
                        }}
                      >
                        {isCurrentPlan ? 'Plano atual' : 'Selecionar plano'}
                      </ButtonBase>
                    </Stack>
                  </CardContent>
                </Card>
              )
            })}
          </Stack>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
