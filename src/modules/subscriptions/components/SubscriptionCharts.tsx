import { Box, Card, CardContent, Chip, Stack, Typography, useTheme } from '@mui/material'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyMrrPoint, PlanDistributionPoint } from '../types'

type SubscriptionChartsProps = {
  mrrGrowth: MonthlyMrrPoint[]
  planDistribution: PlanDistributionPoint[]
}

const compactCurrencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
  notation: 'compact',
})

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('pt-BR')

export function SubscriptionCharts({ mrrGrowth, planDistribution }: SubscriptionChartsProps) {
  const theme = useTheme()
  const totalPlans = planDistribution.reduce((sum, item) => sum + item.total, 0)

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)' },
        alignItems: 'stretch',
      }}
    >
      <Card variant="outlined">
        <CardContent sx={{ p: 2.25 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h4">Crescimento do MRR - Ultimos 6 meses</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.25 }}>
                Receita recorrente mensal consolidada.
              </Typography>
            </Box>
            <Chip label="MRR" color="primary" variant="outlined" sx={{ fontWeight: 800 }} />
          </Stack>

          <Box sx={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mrrGrowth} margin={{ top: 12, right: 12, bottom: 0, left: -12 }}>
                <CartesianGrid stroke={theme.palette.divider} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => compactCurrencyFormatter.format(Number(value))}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(45, 212, 160, 0.08)' }}
                  formatter={(value) => [currencyFormatter.format(Number(value)), 'MRR']}
                  contentStyle={{ borderRadius: 8, border: `1px solid ${theme.palette.divider}`, boxShadow: theme.shadows[6] }}
                />
                <Bar dataKey="mrr" radius={[8, 8, 0, 0]} fill={theme.palette.primary.main} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent sx={{ p: 2.25 }}>
          <Stack spacing={0.25} sx={{ mb: 2 }}>
            <Typography variant="h4">Distribuicao de planos</Typography>
            <Typography color="text.secondary">Base ativa por categoria.</Typography>
          </Stack>

          <Box sx={{ height: 260, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(value, name) => [numberFormatter.format(Number(value)), name]}
                  contentStyle={{ borderRadius: 8, border: `1px solid ${theme.palette.divider}`, boxShadow: theme.shadows[6] }}
                />
                <Pie
                  data={planDistribution}
                  dataKey="total"
                  nameKey="plan"
                  innerRadius="62%"
                  outerRadius="86%"
                  paddingAngle={3}
                  stroke={theme.palette.background.paper}
                  strokeWidth={3}
                  isAnimationActive={false}
                >
                  {planDistribution.map((item) => (
                    <Cell key={item.plan} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3">{numberFormatter.format(totalPlans)}</Typography>
                <Typography color="text.secondary" variant="body2">
                  ativas
                </Typography>
              </Box>
            </Box>
          </Box>

          <Stack spacing={1.25} sx={{ mt: 1 }}>
            {planDistribution.map((item) => {
              const percent = totalPlans ? (item.total / totalPlans) * 100 : 0

              return (
                <Stack key={item.plan} direction="row" spacing={1.25} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color, flex: '0 0 auto' }} />
                    <Typography fontWeight={700}>{item.plan}</Typography>
                  </Stack>
                  <Typography color="text.secondary">
                    {numberFormatter.format(item.total)} - {percent.toFixed(1).replace('.', ',')}%
                  </Typography>
                </Stack>
              )
            })}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
