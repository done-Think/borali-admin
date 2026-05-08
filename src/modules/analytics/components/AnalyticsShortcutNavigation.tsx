import { Box, Button, Stack } from '@mui/material'
import type { Theme } from '@mui/material/styles'

type AnalyticsShortcut = {
  label: string
  href: string
}

type AnalyticsShortcutNavigationProps = {
  shortcuts: AnalyticsShortcut[]
  isDarkMode: boolean
  theme: Theme
}

export function AnalyticsShortcutNavigation({ shortcuts, isDarkMode, theme }: AnalyticsShortcutNavigationProps) {
  return (
    <Box
      component="nav"
      aria-label="Atalhos dos gráficos"
      sx={{
        position: 'sticky',
        top: 8,
        zIndex: 10,
        mx: -0.5,
        px: 0.5,
        py: 0.75,
        borderRadius: 2,
        backgroundColor: isDarkMode ? '#005299' : 'rgba(249, 250, 251, 0.88)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.18)' : theme.palette.divider}`,
      }}
    >
      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
        {shortcuts.map((shortcut) => (
          <Button
            key={shortcut.href}
            component="a"
            href={shortcut.href}
            size="small"
            variant="text"
            sx={{
              minHeight: 28,
              px: 1.25,
              py: 0.25,
              color: isDarkMode ? '#FFFFFF' : theme.palette.text.primary,
              fontSize: 12,
              whiteSpace: 'nowrap',
              '&:hover': {
                color: isDarkMode ? '#FFFFFF' : 'primary.dark',
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.14)' : 'rgba(45, 212, 160, 0.12)',
              },
            }}
          >
            {shortcut.label}
          </Button>
        ))}
      </Stack>
    </Box>
  )
}
