import { Box, Stack, Typography } from '@mui/material'

export function MapLegend({ color, label }: { color: string; label: string }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: color }} />
      <Typography color="text.secondary" fontWeight={700} sx={{ fontSize: 12 }}>
        {label}
      </Typography>
    </Stack>
  )
}
