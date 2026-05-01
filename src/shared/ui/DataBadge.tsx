import { Chip } from '@mui/material'

export type BadgePalette = {
  color: string
  background: string
  border: string
}

export function DataBadge({ label, palette }: { label: string; palette: BadgePalette }) {
  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      sx={{
        color: palette.color,
        borderColor: palette.border,
        backgroundColor: palette.background,
        fontWeight: 700,
      }}
    />
  )
}
