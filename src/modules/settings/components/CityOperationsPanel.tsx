import { useEffect, useMemo, useState } from 'react'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import TuneIcon from '@mui/icons-material/Tune'
import { Box, Button, Card, CardContent, Chip, Stack, Switch, TextField, Typography } from '@mui/material'
import type { CityOperationsSettings, CitySettings } from '../types'
import { sanitizeNumber } from '../utils/settings'

type CityOperationsPanelProps = {
  city: CitySettings
  onChangeOperations: (field: keyof CityOperationsSettings, value: number | boolean) => void
}

export function CityOperationsPanel({ city, onChangeOperations }: CityOperationsPanelProps) {
  const [now, setNow] = useState(() => new Date())
  const operations = city.operations
  const automaticRiskAreasActive = useMemo(() => isRiskAreaAutomaticWindow(now), [now])
  const effectiveRiskAreasActive = operations.riskAreasAutomatic ? automaticRiskAreasActive : operations.riskAreasActive

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box sx={{ color: 'primary.main', display: 'flex' }}>
            <TuneIcon />
          </Box>
          <Box>
            <Typography variant="h4">Configurações da cidade</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Regras comerciais e disponibilidade para {city.name}, {city.state}.
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, mt: 2 }}>
          <TextField
            label="Taxa da plataforma"
            type="number"
            value={operations.serviceFeePercent}
            onChange={(event) => onChangeOperations('serviceFeePercent', sanitizeNumber(event.target.value, operations.serviceFeePercent))}
            InputProps={{ endAdornment: <Typography color="text.secondary">%</Typography> }}
            inputProps={{ min: 0, max: 100, step: 0.1 }}
            fullWidth
          />
          <OperationStatusButton checked={operations.active} onChange={(checked) => onChangeOperations('active', checked)} />
          <RiskAreasControl
            active={effectiveRiskAreasActive}
            automatic={operations.riskAreasAutomatic}
            automaticActive={automaticRiskAreasActive}
            onToggleActive={(checked) => onChangeOperations('riskAreasActive', checked)}
            onToggleAutomatic={(checked) => onChangeOperations('riskAreasAutomatic', checked)}
          />
          <OperationToggle label="Corridas programadas" helper="Passageiros podem agendar viagens futuras." checked={operations.allowScheduledRides} onChange={(checked) => onChangeOperations('allowScheduledRides', checked)} />
          <OperationToggle label="Pagamento em dinheiro" helper="Disponibiliza dinheiro como forma de pagamento." checked={operations.allowCashPayment} onChange={(checked) => onChangeOperations('allowCashPayment', checked)} />
        </Box>
      </CardContent>
    </Card>
  )
}

function OperationStatusButton({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: checked ? 'success.main' : 'error.main', borderRadius: 2, p: 1.5, bgcolor: checked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
        <Box>
          <Typography sx={{ fontWeight: 900 }}>{checked ? 'Operação ativa' : 'Fora do ar'}</Typography>
          <Typography color="text.secondary" sx={{ fontSize: 13, mt: 0.25 }}>
            {checked ? 'A cidade está recebendo novas solicitações.' : 'Novas solicitações estão bloqueadas nesta cidade.'}
          </Typography>
        </Box>
        <Button variant={checked ? 'outlined' : 'contained'} color={checked ? 'error' : 'success'} onClick={() => onChange(!checked)}>
          {checked ? 'Colocar fora do ar' : 'Ativar operação'}
        </Button>
      </Stack>
    </Box>
  )
}

function RiskAreasControl({
  active,
  automatic,
  automaticActive,
  onToggleActive,
  onToggleAutomatic,
}: {
  active: boolean
  automatic: boolean
  automaticActive: boolean
  onToggleActive: (checked: boolean) => void
  onToggleAutomatic: (checked: boolean) => void
}) {
  return (
    <Box sx={{ border: '1px solid', borderColor: active ? 'warning.main' : 'divider', borderRadius: 2, p: 1.5, bgcolor: active ? 'rgba(245, 158, 11, 0.08)' : 'background.default' }}>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ color: active ? 'warning.main' : 'text.secondary', display: 'flex' }}>
              <ShieldOutlinedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 900 }}>Áreas de risco</Typography>
              <Typography color="text.secondary" sx={{ fontSize: 13, mt: 0.25 }}>
                {automatic ? 'Automático: ativo das 22h às 05h.' : 'Controle manual liberado.'}
              </Typography>
            </Box>
          </Stack>
          <Chip label={active ? 'Ativo' : 'Offline'} color={active ? 'warning' : 'default'} variant="outlined" sx={{ fontWeight: 850 }} />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
          <Button variant={active ? 'outlined' : 'contained'} color={active ? 'warning' : 'secondary'} disabled={automatic} onClick={() => onToggleActive(!active)}>
            {active ? 'Desativar áreas' : 'Ativar áreas'}
          </Button>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'space-between', sm: 'flex-end' }}>
            <Typography color="text.secondary" sx={{ fontSize: 13, fontWeight: 800 }}>
              Modo automático
            </Typography>
            <Switch checked={automatic} onChange={(event) => onToggleAutomatic(event.target.checked)} inputProps={{ 'aria-label': 'Modo automático de áreas de risco' }} />
          </Stack>
        </Stack>

        {automatic && (
          <Typography color="text.secondary" sx={{ fontSize: 12 }}>
            Pela regra atual, agora ficaria {automaticActive ? 'ativo' : 'offline'}.
          </Typography>
        )}
      </Stack>
    </Box>
  )
}

function OperationToggle({ label, helper, checked, onChange }: { label: string; helper: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
        <Box>
          <Typography sx={{ fontWeight: 900 }}>{label}</Typography>
          <Typography color="text.secondary" sx={{ fontSize: 13, mt: 0.25 }}>
            {helper}
          </Typography>
        </Box>
        <Switch checked={checked} onChange={(event) => onChange(event.target.checked)} inputProps={{ 'aria-label': label }} />
      </Stack>
    </Box>
  )
}

function isRiskAreaAutomaticWindow(date: Date) {
  const hour = date.getHours()
  return hour >= 22 || hour < 5
}
