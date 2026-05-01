import { useMemo, useState } from 'react'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { initialCitySettings } from '../data/mockSettings'
import type { CategoryFareSettings, CityOperationsSettings, DriverSearchSettings, RideCategory } from '../types'
import { updateCategoryFare, updateCitySettings, updateDriverSearchField } from '../utils/settings'
import { CityOperationsPanel } from './CityOperationsPanel'
import { CitySelector } from './CitySelector'
import { DriverSearchSettingsPanel } from './DriverSearchSettingsPanel'
import { FareSettingsPanel } from './FareSettingsPanel'

export default function SettingsPage() {
  const { enqueueSnackbar } = useSnackbar()
  const [cities, setCities] = useState(initialCitySettings)
  const [savedCities, setSavedCities] = useState(initialCitySettings)
  const [selectedCityId, setSelectedCityId] = useState(initialCitySettings[0]?.id ?? '')

  const selectedCity = useMemo(
    () => cities.find((city) => city.id === selectedCityId) ?? cities[0],
    [cities, selectedCityId],
  )
  const hasChanges = useMemo(() => JSON.stringify(cities) !== JSON.stringify(savedCities), [cities, savedCities])

  function handleFareChange(category: RideCategory, field: keyof CategoryFareSettings, value: number | boolean) {
    if (!selectedCity) return

    setCities((currentCities) =>
      updateCitySettings(currentCities, selectedCity.id, (city) => updateCategoryFare(city, category, field, value)),
    )
  }

  function handleDriverSearchChange(field: keyof DriverSearchSettings, value: number) {
    if (!selectedCity) return

    setCities((currentCities) =>
      updateCitySettings(currentCities, selectedCity.id, (city) => updateDriverSearchField(city, field, value)),
    )
  }

  function handleOperationsChange(field: keyof CityOperationsSettings, value: number | boolean) {
    if (!selectedCity) return

    setCities((currentCities) =>
      updateCitySettings(currentCities, selectedCity.id, (city) => ({
        ...city,
        operations: {
          ...city.operations,
          [field]: value,
        },
      })),
    )
  }

  function handleSave() {
    setSavedCities(cities)
    enqueueSnackbar('Configurações salvas com sucesso.', { variant: 'success' })
  }

  function handleReset() {
    setCities(savedCities)
    enqueueSnackbar('Alterações descartadas.', { variant: 'info' })
  }

  if (!selectedCity) {
    return null
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
        <Box>
          <Typography variant="h3">Configurações</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Ajuste tarifas, busca de motoristas e regras comerciais por cidade.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
          <Chip label={hasChanges ? 'Alterações pendentes' : 'Tudo salvo'} color={hasChanges ? 'warning' : 'success'} variant="outlined" sx={{ fontWeight: 900 }} />
          <Button variant="outlined" startIcon={<RestartAltIcon />} disabled={!hasChanges} onClick={handleReset}>
            Restaurar
          </Button>
          <Button variant="contained" startIcon={<SaveIcon />} disabled={!hasChanges} onClick={handleSave}>
            Salvar
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '300px minmax(0, 1fr)' }, alignItems: 'start' }}>
        <CitySelector cities={cities} selectedCityId={selectedCity.id} onSelectCity={setSelectedCityId} />

        <Stack spacing={2}>
          <Card variant="outlined">
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
                <Box>
                  <Typography variant="h4">
                    {selectedCity.name}, {selectedCity.state}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Última atualização: {selectedCity.updatedAt}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Chip label={selectedCity.operations.active ? 'Operação ativa' : 'Operação pausada'} color={selectedCity.operations.active ? 'success' : 'default'} sx={{ fontWeight: 850 }} />
                  <Chip label={`${selectedCity.operations.serviceFeePercent}% taxa`} color="secondary" variant="outlined" sx={{ fontWeight: 850 }} />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <FareSettingsPanel city={selectedCity} onChangeFare={handleFareChange} />
          <DriverSearchSettingsPanel city={selectedCity} onChangeSearch={handleDriverSearchChange} />
          <CityOperationsPanel city={selectedCity} onChangeOperations={handleOperationsChange} />
        </Stack>
      </Box>
    </Box>
  )
}
