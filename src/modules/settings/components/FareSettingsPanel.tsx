import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { Box, Card, CardContent, Chip, Divider, Stack, Switch, TextField, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { rideCategoryDescriptions, rideCategoryLabels } from '../data/mockSettings'
import type { CategoryFareSettings, CitySettings, RideCategory } from '../types'
import { sanitizeNumber } from '../utils/settings'

type FareSettingsPanelProps = {
  city: CitySettings
  onChangeFare: (category: RideCategory, field: keyof CategoryFareSettings, value: number | boolean) => void
}

const categoryOrder: RideCategory[] = ['economic', 'comfort', 'executive']

export function FareSettingsPanel({ city, onChangeFare }: FareSettingsPanelProps) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
          <Box>
            <Typography variant="h4">Tarifas por categoria</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Edite base, km, minuto e regras mínimas por tipo de corrida em {city.name}.
            </Typography>
          </Box>
          <Chip label={`${categoryOrder.filter((category) => city.fares[category].enabled).length} categorias ativas`} color="secondary" variant="outlined" sx={{ fontWeight: 900, alignSelf: { xs: 'flex-start', md: 'center' } }} />
        </Stack>

        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }, mt: 2 }}>
          {categoryOrder.map((category) => {
            const fare = city.fares[category]
            const accentColor = category === 'economic' ? '#0ABEE9' : category === 'comfort' ? '#2DD4A0' : '#8B5CF6'

            return (
              <Box key={category} sx={{ border: '1px solid', borderColor: fare.enabled ? alpha(accentColor, 0.46) : 'divider', borderRadius: 2, p: 1.75, bgcolor: fare.enabled ? alpha(accentColor, 0.04) : 'background.default' }}>
                <Stack direction="row" spacing={1.25} alignItems="flex-start" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                    <Box sx={{ color: accentColor, display: 'flex' }}>
                      <AttachMoneyIcon fontSize="small" />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 950 }}>{rideCategoryLabels[category]}</Typography>
                      <Typography color="text.secondary" sx={{ fontSize: 12, mt: 0.25 }}>
                        {rideCategoryDescriptions[category]}
                      </Typography>
                    </Box>
                  </Stack>
                  <Switch checked={fare.enabled} onChange={(event) => onChangeFare(category, 'enabled', event.target.checked)} inputProps={{ 'aria-label': `Ativar categoria ${rideCategoryLabels[category]}` }} />
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: '1fr' } }}>
                  <FareNumberField label="Tarifa base" value={fare.baseFare} onChange={(value) => onChangeFare(category, 'baseFare', value)} />
                  <FareNumberField label="Valor por km" value={fare.pricePerKm} onChange={(value) => onChangeFare(category, 'pricePerKm', value)} />
                  <FareNumberField label="Valor por minuto" value={fare.pricePerMinute} onChange={(value) => onChangeFare(category, 'pricePerMinute', value)} />
                  <FareNumberField label="Tarifa mínima" value={fare.minimumFare} onChange={(value) => onChangeFare(category, 'minimumFare', value)} />
                  <FareNumberField label="Cancelamento" value={fare.cancellationFee} onChange={(value) => onChangeFare(category, 'cancellationFee', value)} />
                  <FareNumberField label="Multiplicador" value={fare.dynamicMultiplier} min={1} step={0.01} onChange={(value) => onChangeFare(category, 'dynamicMultiplier', value)} />
                </Box>
              </Box>
            )
          })}
        </Box>
      </CardContent>
    </Card>
  )
}

function FareNumberField({ label, value, onChange, min = 0, step = 0.1 }: { label: string; value: number; onChange: (value: number) => void; min?: number; step?: number }) {
  return (
    <TextField
      label={label}
      type="number"
      size="small"
      value={value}
      onChange={(event) => onChange(sanitizeNumber(event.target.value, value))}
      inputProps={{ min, step }}
      fullWidth
    />
  )
}
