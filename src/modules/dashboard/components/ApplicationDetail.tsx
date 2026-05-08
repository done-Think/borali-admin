import { Box, Typography } from '@mui/material'

export function ApplicationDetail({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 1.5 }}>
      <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 0.5, fontWeight: 800 }}>{value}</Typography>
    </Box>
  )
}
