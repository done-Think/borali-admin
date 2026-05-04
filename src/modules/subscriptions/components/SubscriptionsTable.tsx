import { useState, type MouseEvent } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
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
  Basico: '#22D3EE',
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

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedSubscription, setSelectedSubscription] = useState<DriverSubscription | null>(null)
  const menuOpen = Boolean(anchorEl)

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
      <CardContent sx={{ p: 2.25 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h4">Assinaturas</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.25 }}>
              Lista operacional de planos ativos, trials e pagamentos atrasados.
            </Typography>
          </Box>
          <Chip label={`${subscriptions.length} registros`} color="primary" variant="outlined" sx={{ fontWeight: 800 }} />
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 860 }}>
            <TableHead>
              <TableRow>
                <TableCell>Motorista</TableCell>
                <TableCell>Plano</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Prox. cobranca</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell align="right" sx={{ width: 88 }}>
                  Acoes
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptions.map((subscription) => (
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
                    <Tooltip title="Acoes">
                      <IconButton
                        size="small"
                        aria-label={`Acoes de assinatura de ${subscription.driverName}`}
                        onClick={(event) => handleOpenMenu(event, subscription)}
                      >
                        <MoreHorizIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
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
    </Card>
  )
}
