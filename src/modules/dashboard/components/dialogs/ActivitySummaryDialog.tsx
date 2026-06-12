import { useEffect, useState } from 'react'
import { Box, ButtonBase, Chip, Dialog, DialogContent, DialogTitle, Stack, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { activityStyles } from '../../data/dashboardData'
import type { Activity } from '../../types'

export function ActivitySummaryDialog({
  open,
  activities,
  selectedActivityId,
  onClose,
}: {
  open: boolean
  activities: Activity[]
  selectedActivityId: string | null
  onClose: () => void
}) {
  const [currentActivityId, setCurrentActivityId] = useState<string | null>(selectedActivityId)
  const currentActivity = activities.find((activity) => activity.id === currentActivityId) ?? activities[0]
  const secondaryActivities = activities.filter((activity) => activity.id !== currentActivity?.id)

  useEffect(() => {
    if (open) {
      setCurrentActivityId(selectedActivityId)
    }
  }, [open, selectedActivityId])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="h4">Resumo do feed em tempo real</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Visao consolidada dos indicadores operacionais exibidos no feed.
            </Typography>
          </Box>
          <Chip label={`${activities.length} indicadores`} color="secondary" variant="outlined" sx={{ fontWeight: 800 }} />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        {currentActivity ? (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', lg: 'minmax(280px, 0.65fr) minmax(0, 1.35fr)' },
              alignItems: 'stretch',
            }}
          >
            <Stack spacing={1.25}>
              {secondaryActivities.map((activity) => (
                <ActivitySummaryCard key={activity.id} activity={activity} selected={false} compact onClick={() => setCurrentActivityId(activity.id)} />
              ))}
            </Stack>
            <SelectedActivityPanel activity={currentActivity} />
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function SelectedActivityPanel({ activity }: { activity: Activity }) {
  const theme = useTheme()
  const style = activityStyles[activity.type]

  return (
    <Box
      sx={{
        minHeight: { xs: 420, md: 500 },
        border: '1px solid',
        borderColor: style.color,
        borderRadius: 2,
        bgcolor: alpha(style.color, theme.palette.mode === 'dark' ? 0.16 : 0.08),
        p: { xs: 2, md: 2.5 },
        boxShadow: `0 18px 42px ${alpha(style.color, 0.16)}`,
      }}
    >
      <Stack spacing={2.25} sx={{ height: '100%' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <ActivityIcon color={style.color} icon={style.icon} size={54} />
            <Box>
              <Typography sx={{ fontSize: 22, fontWeight: 900, color: 'text.primary', lineHeight: 1.15 }}>{activity.title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {activity.description}
              </Typography>
            </Box>
          </Stack>
          <Chip label={activity.timestamp} size="small" sx={{ fontWeight: 900 }} />
        </Stack>

        <Typography color="text.secondary" sx={{ fontSize: 15, lineHeight: 1.7 }}>
          {activity.summary}
        </Typography>

        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' } }}>
          {activity.details.map((detail) => (
            <Box key={detail.label} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, bgcolor: 'background.paper', p: 1.5 }}>
              <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
                {detail.label}
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: 18, fontWeight: 900, color: style.color }}>{detail.value}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: alpha(style.color, 0.35) }}>
          <Typography sx={{ color: style.color, fontSize: 12, fontWeight: 900 }}>Indicador selecionado para analise detalhada</Typography>
        </Box>
      </Stack>
    </Box>
  )
}

function ActivitySummaryCard({
  activity,
  selected,
  compact = false,
  onClick,
}: {
  activity: Activity
  selected: boolean
  compact?: boolean
  onClick: () => void
}) {
  const theme = useTheme()
  const style = activityStyles[activity.type]

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        minHeight: compact ? 94 : 158,
        border: '1px solid',
        borderColor: selected ? style.color : 'divider',
        borderRadius: 2,
        bgcolor: selected ? alpha(style.color, theme.palette.mode === 'dark' ? 0.16 : 0.1) : 'background.paper',
        p: compact ? 1.5 : 2,
        textAlign: 'left',
        justifyContent: 'stretch',
        boxShadow: selected ? `0 16px 34px ${alpha(style.color, 0.18)}` : 'none',
        transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
        '&:hover': {
          borderColor: style.color,
          boxShadow: `0 14px 30px ${alpha(style.color, 0.14)}`,
          transform: 'translateX(-2px)',
        },
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ width: '100%' }}>
        <ActivityIcon color={style.color} icon={style.icon} size={40} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
            <Typography noWrap sx={{ fontSize: 13, fontWeight: 900, color: 'text.primary' }}>
              {activity.title}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 11, flex: '0 0 auto' }}>{activity.timestamp}</Typography>
          </Stack>
          <Typography noWrap color="text.secondary" sx={{ mt: 0.5, fontSize: 12 }}>
            {activity.description}
          </Typography>
        </Box>
      </Stack>
    </ButtonBase>
  )
}

function ActivityIcon({ color, icon, size }: { color: string; icon: React.ReactNode; size: number }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        color,
        bgcolor: `${color}22`,
        flex: '0 0 auto',
      }}
    >
      {icon}
    </Box>
  )
}
