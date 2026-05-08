import type { ReactElement } from 'react'
import { Box, Card, CardContent, Stack, Typography } from '@mui/material'

export type AnalyticsMetric = {
  title: string
  value: string
  helper: string
  icon: ReactElement
  color: string
}

type AnalyticsMetricCardsProps = {
  metrics: AnalyticsMetric[]
}

export function AnalyticsMetricCards({ metrics }: AnalyticsMetricCardsProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
      }}
    >
      {metrics.map((metric) => (
        <Card key={metric.title} variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  display: 'grid',
                  placeItems: 'center',
                  color: metric.color,
                  backgroundColor: 'rgba(10, 190, 233, 0.08)',
                }}
              >
                {metric.icon}
              </Box>
              <Box>
                <Typography color="text.secondary" fontWeight={600}>
                  {metric.title}
                </Typography>
                <Typography variant="h3" sx={{ mt: 0.75 }}>
                  {metric.value}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                  {metric.helper}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
