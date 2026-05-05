import { useMemo, useState, type MouseEvent } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SearchIcon from '@mui/icons-material/Search'
import {
  Autocomplete,
  Avatar,
  Box,
  ButtonBase,
  Card,
  CardContent,
  Chip,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
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
import type { DriverSubscription, SubscriptionPlan, SubscriptionStatus } from '../types'

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

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedSubscription, setSelectedSubscription] = useState<DriverSubscription | null>(null)
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
            <MenuItem onClick={handleCloseMenu}>Ver detalhes</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Alterar plano</MenuItem>
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
    </Card>
  )
}
