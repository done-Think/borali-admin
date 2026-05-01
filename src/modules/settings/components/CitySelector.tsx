import LocationCityIcon from '@mui/icons-material/LocationCity'
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import type { CitySettings } from '../types'

type CitySelectorProps = {
  cities: CitySettings[]
  selectedCityId: string
  onSelectCity: (cityId: string) => void
}

export function CitySelector({ cities, selectedCityId, onSelectCity }: CitySelectorProps) {
  const theme = useTheme()

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="h4">Cidades</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
          Escolha a praça para editar tarifas e regras operacionais.
        </Typography>

        <Stack spacing={1} sx={{ mt: 2 }}>
          {cities.map((city) => {
            const selected = city.id === selectedCityId

            return (
              <Box
                key={city.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectCity(city.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onSelectCity(city.id)
                  }
                }}
                sx={{
                  border: '1px solid',
                  borderColor: selected ? theme.palette.secondary.main : 'divider',
                  borderRadius: 1.5,
                  p: 1.5,
                  cursor: 'pointer',
                  bgcolor: selected ? alpha(theme.palette.secondary.main, 0.1) : 'background.default',
                  transition: theme.transitions.create(['border-color', 'background-color']),
                  '&:hover': {
                    borderColor: theme.palette.secondary.main,
                    bgcolor: alpha(theme.palette.secondary.main, 0.08),
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${theme.palette.secondary.main}`,
                    outlineOffset: 2,
                  },
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box sx={{ color: selected ? 'secondary.main' : 'text.secondary', display: 'flex' }}>
                    <LocationCityIcon fontSize="small" />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography noWrap sx={{ fontWeight: 900 }}>
                      {city.name}, {city.state}
                    </Typography>
                    <Typography noWrap color="text.secondary" sx={{ fontSize: 12, fontWeight: 700 }}>
                      Atualizado em {city.updatedAt}
                    </Typography>
                  </Box>
                  <Chip size="small" label={city.operations.active ? 'Ativa' : 'Pausada'} color={city.operations.active ? 'success' : 'default'} variant="outlined" sx={{ fontWeight: 800 }} />
                </Stack>
              </Box>
            )
          })}
        </Stack>
      </CardContent>
    </Card>
  )
}
