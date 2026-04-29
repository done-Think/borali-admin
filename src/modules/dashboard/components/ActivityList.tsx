import { Box, Stack, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { activityStyles } from '../data/mockDashboardData'
import type { Activity } from '../types'

export function ActivityList({ items, compact = false }: { items: Activity[]; compact?: boolean }) {
  const theme = useTheme()

  return (
    <Stack
      spacing={1.25}
      sx={{
        bgcolor: alpha(theme.palette.secondary.main, 0.06),
        borderRadius: 2,
        p: compact ? 1 : 1.25,
        '[data-toolpad-color-scheme="dark"] &': {
          bgcolor: alpha(theme.palette.common.black, 0.22),
        },
      }}
    >
      {items.map((item) => {
        const style = activityStyles[item.type]

        return (
          <Stack
            key={item.id}
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{
              minHeight: compact ? 56 : 66,
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              px: 1.25,
              py: 1,
              '[data-toolpad-color-scheme="dark"] &': {
                bgcolor: alpha(theme.palette.background.default, 0.5),
              },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                flex: '0 0 auto',
                color: style.color,
                bgcolor: `${style.color}22`,
              }}
            >
              {style.icon}
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
                <Typography sx={{ color: 'text.primary', fontSize: 13, fontWeight: 800, lineHeight: 1.25 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 11, flex: '0 0 auto', pt: 0.15 }}>{item.timestamp}</Typography>
              </Stack>
              <Typography
                noWrap
                sx={{
                  color: 'secondary.dark',
                  fontSize: 12,
                  mt: 0.35,
                  '[data-toolpad-color-scheme="dark"] &': {
                    color: 'secondary.light',
                  },
                }}
              >
                {item.description}
              </Typography>
            </Box>
          </Stack>
        )
      })}
    </Stack>
  )
}
