import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import type { SubscriptionKpiCard } from '../types'

type SubscriptionKpiCardsProps = {
  cards: SubscriptionKpiCard[]
}

export function SubscriptionKpiCards({ cards }: SubscriptionKpiCardsProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(5, minmax(0, 1fr))',
        },
      }}
    >
      {cards.map((card) => (
        <Card key={card.id} variant="outlined" sx={{ height: '100%' }}>
          <CardContent sx={{ height: '100%' }}>
            <Stack spacing={1.75} sx={{ height: '100%' }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    flex: '0 0 auto',
                    color: card.color,
                    bgcolor: `${card.color}1F`,
                    '& svg': { fontSize: 24 },
                  }}
                >
                  {card.icon}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography color="text.secondary" fontWeight={700}>
                    {card.title}
                  </Typography>
                  <Typography variant="h3" sx={{ mt: 0.5, lineHeight: 1.1 }}>
                    {card.value}
                  </Typography>
                </Box>
              </Stack>

              <Typography color="text.secondary" sx={{ mt: 'auto' }}>
                {card.helper}
              </Typography>

              {card.details ? (
                <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                  {card.details.map((detail) => (
                    <Chip
                      key={detail.label}
                      label={`${detail.label}: ${detail.value}`}
                      size="small"
                      color={detail.color ?? 'default'}
                      variant="outlined"
                      sx={{ fontWeight: 800 }}
                    />
                  ))}
                </Stack>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
