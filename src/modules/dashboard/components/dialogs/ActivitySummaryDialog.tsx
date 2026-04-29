import { Box, Chip, Dialog, DialogContent, DialogTitle, Stack, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { activityStyles } from '../../data/mockDashboardData'
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
  const theme = useTheme()

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
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          {activities.map((activity) => {
            const style = activityStyles[activity.type]
            const selected = selectedActivityId === activity.id

            return (
              <Box
                key={activity.id}
                sx={{
                  minHeight: 158,
                  border: '1px solid',
                  borderColor: selected ? style.color : 'divider',
                  borderRadius: 2,
                  bgcolor: selected ? alpha(style.color, theme.palette.mode === 'dark' ? 0.16 : 0.1) : 'background.paper',
                  p: 2,
                  boxShadow: selected ? `0 16px 34px ${alpha(style.color, 0.18)}` : 'none',
                }}
              >
                <Stack spacing={1.5} sx={{ height: '100%' }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        color: style.color,
                        bgcolor: `${style.color}22`,
                        flex: '0 0 auto',
                      }}
                    >
                      {style.icon}
                    </Box>
                    <Chip label={activity.timestamp} size="small" sx={{ fontWeight: 800 }} />
                  </Stack>

                  <Box>
                    <Typography sx={{ fontSize: 15, fontWeight: 900, color: 'text.primary' }}>{activity.title}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.55 }}>
                      {activity.description}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 'auto', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography sx={{ color: style.color, fontSize: 12, fontWeight: 900 }}>
                      {selected ? 'Indicador selecionado' : 'Atualizacao operacional'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )
          })}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
