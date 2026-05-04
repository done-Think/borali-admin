import { Box, ButtonBase, Stack, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { activityStyles } from '../data/mockDashboardData'
import type { Activity } from '../types'

type ActivityListProps = {
  items: Activity[]
  compact?: boolean
  onItemClick?: (item: Activity) => void
}

export function ActivityList({ items, compact = false, onItemClick }: ActivityListProps) {
  const theme = useTheme()

  return (
    <Stack
      spacing={1.25}
      sx={{
        borderRadius: 2,
        p: compact ? 1 : 1.25,
      }}
    >
      {items.map((item) => {
        const style = activityStyles[item.type]
        const clickable = Boolean(onItemClick)

        return (
          <ButtonBase
            key={item.id}
            onClick={clickable ? () => onItemClick?.(item) : undefined}
            sx={{
              width: '100%',
              minHeight: compact ? 56 : 66,
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              px: 1.25,
              py: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              textAlign: 'left',
              cursor: clickable ? 'pointer' : 'default',
              transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
              '&:hover': clickable
                ? {
                    borderColor: style.color,
                    boxShadow: `0 12px 28px ${alpha(style.color, 0.14)}`,
                    transform: 'translateY(-1px)',
                  }
                : undefined,
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
          </ButtonBase>
        )
      })}
    </Stack>
  )
}
