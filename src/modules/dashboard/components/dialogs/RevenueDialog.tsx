import { useState, type MouseEvent } from 'react'
import { Box, Card, CardContent, Dialog, DialogContent, DialogTitle, Stack, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { revenueComparisons } from '../../data/mockDashboardData'
import type { RevenuePeriod } from '../../types'
import { currencyFormatter } from '../../utils/formatters'

export function RevenueDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useTheme()
  const [period, setPeriod] = useState<RevenuePeriod>('day')
  const comparison = revenueComparisons[period]
  const currentTotal = comparison.data.reduce((total, item) => total + item.atual, 0)
  const previousTotal = comparison.data.reduce((total, item) => total + item.anterior, 0)
  const variation = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0

  function handlePeriodChange(_: MouseEvent<HTMLElement>, value: RevenuePeriod | null) {
    if (value) {
      setPeriod(value)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4">Receita do dia</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Comparativo de receita por periodo.
            </Typography>
          </Box>
          <ToggleButtonGroup exclusive size="small" value={period} onChange={handlePeriodChange} aria-label="Periodo de comparacao">
            <ToggleButton value="day">Hoje vs ontem</ToggleButton>
            <ToggleButton value="week">Semana</ToggleButton>
            <ToggleButton value="month">Mes</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
            <RevenueMetric label={comparison.currentLabel} value={currencyFormatter.format(currentTotal)} color="secondary.main" />
            <RevenueMetric label={comparison.previousLabel} value={currencyFormatter.format(previousTotal)} color="text.secondary" />
            <RevenueMetric label="Variacao" value={`${variation >= 0 ? '+' : ''}${variation.toFixed(1)}%`} color={variation >= 0 ? 'success.main' : 'error.main'} />
          </Box>
          <Card variant="outlined">
            <CardContent>
              <Typography fontWeight={800}>{comparison.label}</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.25, mb: 2 }}>
                Valores acumulados em {comparison.data.length} pontos do periodo.
              </Typography>
              <Box sx={{ height: 360 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparison.data} margin={{ top: 12, right: 16, bottom: 0, left: 4 }}>
                    <CartesianGrid stroke={theme.palette.divider} vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => currencyFormatter.format(Number(value)).replace(',00', '')} />
                    <Tooltip
                      cursor={{ fill: 'rgba(10, 190, 233, 0.08)' }}
                      formatter={(value, name) => [currencyFormatter.format(Number(value)), name === 'atual' ? comparison.currentLabel : comparison.previousLabel]}
                      contentStyle={{ borderRadius: 8, border: `1px solid ${theme.palette.divider}`, boxShadow: theme.shadows[6] }}
                    />
                    <Legend />
                    <Bar dataKey="anterior" name={comparison.previousLabel} fill={alpha(theme.palette.text.secondary, 0.45)} radius={[6, 6, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="atual" name={comparison.currentLabel} fill={theme.palette.secondary.main} radius={[6, 6, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

function RevenueMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      <Typography color="text.secondary" fontWeight={700}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ color, mt: 0.75 }}>
        {value}
      </Typography>
    </Box>
  )
}
