import type { PaletteMode } from '@mui/material'
import { useTheme } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'

export function useActivePaletteMode(): PaletteMode {
  const theme = useTheme()
  const { mode, systemMode } = useColorScheme()

  if (mode === 'system') {
    return systemMode ?? theme.palette.mode
  }

  return mode ?? theme.palette.mode
}
