import { Box, Card, CardContent, Chip, Stack, Typography, useTheme } from '@mui/material'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ridesPerHour } from '../data/mockDashboardData'

const peakRides = Math.max(...ridesPerHour.map((item) => item.rides))

export function RidesPerHourChart() {
  const theme = useTheme()

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4">Corridas / hora - Ultimas 24h</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.25 }}>
              Volume por faixa horaria com destaque para o pico.
            </Typography>
          </Box>
          <Chip label="pico 18h" size="small" color="secondary" variant="outlined" sx={{ fontWeight: 800 }} />
        </Stack>

        <Box sx={{ height: 320 }}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={ridesPerHour} margin={{ top: 12, right: 8, bottom: 0, left: -24 }}>
              <CartesianGrid stroke={theme.palette.divider} vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(10, 190, 233, 0.08)' }}
                contentStyle={{ borderRadius: 8, border: `1px solid ${theme.palette.divider}`, boxShadow: theme.shadows[6] }}
              />
              <Bar dataKey="rides" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                {ridesPerHour.map((entry) => (
                  <Cell key={entry.hour} fill={entry.rides === peakRides ? '#22D3EE' : '#2563EB'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}
