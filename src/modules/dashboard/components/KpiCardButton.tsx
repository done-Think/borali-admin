import { Box, ButtonBase, Card, CardContent, Stack, Typography } from '@mui/material'
import type { KpiCard } from '../types'

export function KpiCardButton({ card, onClick }: { card: KpiCard; onClick: () => void }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        transition: '160ms ease',
        '&:hover': {
          borderColor: card.color,
          boxShadow: 3,
        },
      }}
    >
      <ButtonBase onClick={onClick} sx={{ width: '100%', height: '100%', display: 'block', textAlign: 'left', borderRadius: 'inherit' }}>
        <CardContent>
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
              <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                {card.subtitle}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </ButtonBase>
    </Card>
  )
}
