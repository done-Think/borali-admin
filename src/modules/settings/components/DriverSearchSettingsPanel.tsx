import RadarIcon from '@mui/icons-material/Radar'
import { Box, Card, CardContent, Slider, Stack, TextField, Typography } from '@mui/material'
import type { CitySettings, DriverSearchSettings } from '../types'
import { formatDecimal, sanitizeNumber } from '../utils/settings'

type DriverSearchSettingsPanelProps = {
  city: CitySettings
  onChangeSearch: (field: keyof DriverSearchSettings, value: number) => void
}

export function DriverSearchSettingsPanel({ city, onChangeSearch }: DriverSearchSettingsPanelProps) {
  const settings = city.driverSearch

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box sx={{ color: 'secondary.main', display: 'flex' }}>
            <RadarIcon />
          </Box>
          <Box>
            <Typography variant="h4">Raio de busca de motoristas</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Defina como a plataforma expande a busca quando não encontra motoristas disponíveis.
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, mt: 2.5 }}>
          <RadiusControl
            label="Raio inicial"
            helper={`${formatDecimal(settings.initialRadiusKm)} km na primeira tentativa`}
            value={settings.initialRadiusKm}
            min={1}
            max={settings.maxRadiusKm}
            step={0.5}
            onChange={(value) => onChangeSearch('initialRadiusKm', value)}
          />
          <RadiusControl
            label="Raio máximo"
            helper={`Limite de ${formatDecimal(settings.maxRadiusKm)} km por chamada`}
            value={settings.maxRadiusKm}
            min={settings.initialRadiusKm}
            max={30}
            step={0.5}
            onChange={(value) => onChangeSearch('maxRadiusKm', value)}
          />
          <NumberSetting label="Expansão por tentativa" suffix="km" value={settings.expansionStepKm} onChange={(value) => onChangeSearch('expansionStepKm', value)} />
          <NumberSetting label="Tempo entre tentativas" suffix="s" value={settings.retryIntervalSeconds} onChange={(value) => onChangeSearch('retryIntervalSeconds', value)} />
          <NumberSetting label="Tempo máximo da solicitação" suffix="s" value={settings.requestTimeoutSeconds} onChange={(value) => onChangeSearch('requestTimeoutSeconds', value)} />
        </Box>
      </CardContent>
    </Card>
  )
}

function RadiusControl({ label, helper, value, min, max, step, onChange }: { label: string; helper: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.75 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Typography sx={{ fontWeight: 900 }}>{label}</Typography>
        <Typography color="secondary.main" sx={{ fontWeight: 950 }}>
          {formatDecimal(value)} km
        </Typography>
      </Stack>
      <Slider value={value} min={min} max={max} step={step} onChange={(_, nextValue) => onChange(Array.isArray(nextValue) ? nextValue[0] : nextValue)} sx={{ mt: 1 }} />
      <Typography color="text.secondary" sx={{ fontSize: 13 }}>
        {helper}
      </Typography>
    </Box>
  )
}

function NumberSetting({ label, suffix, value, onChange }: { label: string; suffix: string; value: number; onChange: (value: number) => void }) {
  return (
    <TextField
      label={label}
      type="number"
      value={value}
      onChange={(event) => onChange(sanitizeNumber(event.target.value, value))}
      InputProps={{ endAdornment: <Typography color="text.secondary">{suffix}</Typography> }}
      inputProps={{ min: 0, step: 1 }}
      fullWidth
    />
  )
}
