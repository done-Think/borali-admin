import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import { Avatar, Box, Button, Card, CardContent, Chip, Divider, Stack, Typography, useTheme } from '@mui/material'
import type { TrialExpiration } from '../types'

type ExpiringTrialsPanelProps = {
  trials: TrialExpiration[]
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

const planColors = {
  Basico: '#22D3EE',
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

export function ExpiringTrialsPanel({ trials }: ExpiringTrialsPanelProps) {
  const theme = useTheme()

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
            <Typography variant="h4">Trials expirando (7 dias)</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.25 }}>
              Motoristas que precisam de acompanhamento antes da conversao.
            </Typography>
          </Box>

          <Chip
            icon={<AccessTimeOutlinedIcon />}
            label={`${trials.length} em atencao`}
            color="warning"
            variant="outlined"
            sx={{ fontWeight: 800 }}
          />
        </Stack>

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
                      {trial.city} - {currencyFormatter.format(trial.monthlyValue)}/mes
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
    </Card>
  )
}
