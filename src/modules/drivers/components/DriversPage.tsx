import { useEffect, useMemo, useState } from 'react'
import BlockIcon from '@mui/icons-material/Block'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { Avatar, Box, Button, Card, CardContent, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Pagination, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography, useTheme } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useLocation } from 'react-router'
import { dashboardQueryKeys } from '@modules/dashboard/queries'
import { driversQueryKeys, useGetAllDriversAccess } from '../queries'
import { suspendAdminDriver } from '../services'
import { drivers } from '../data/mockDrivers'
import type { Driver, DriverCategoryFilter, DriverDetails, DriverEditForm, DriverFilter, DriversLocationState, DriverSortKey, DriverStatus, SortDirection } from '../types'
import { categoryPalette, statusPalette, subscriptionPalette } from '../utils/driverPalettes'
import { currencyFormatter, filters, getDriverSortValue, getInitials, normalizeSearch, numberFormatter } from '../utils/drivers'
import { DriverBadge, DriverDetailsDialog, DriverEditDialog, SortableHeader } from './DriverManagementComponents'

const emptyDriverDetails: Record<string, Partial<DriverDetails>> = {}

type SuspendDriverVariables = {
  driverId: string
  previousDriver: Driver
}

export default function DriversPage() {
  const theme = useTheme()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  const locationState = location.state as DriversLocationState | null
  const [driverOverrides, setDriverOverrides] = useState<Record<string, Driver>>({})
  const [driverDetailsOverrides, setDriverDetailsOverrides] = useState<Record<string, Partial<DriverDetails>>>({})
  const [search, setSearch] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<DriverFilter>('all')
  const [selectedCategory, setSelectedCategory] = useState<DriverCategoryFilter>('all')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<DriverSortKey | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [driverDetailsTab, setDriverDetailsTab] = useState(0)
  const rowsPerPage = 5
  const queryClient = useQueryClient()

  const driversQuery = useGetAllDriversAccess()
  const driverQueryRows = driversQuery.data?.rows ?? drivers
  const driverQueryDetails = driversQuery.data?.details ?? emptyDriverDetails
  const driverRows = useMemo(
    () => driverQueryRows.map((driver) => driverOverrides[driver.id] ?? driver),
    [driverOverrides, driverQueryRows],
  )
  const driverDetailsById = useMemo(() => {
    const details = { ...driverQueryDetails }
    Object.entries(driverDetailsOverrides).forEach(([driverId, override]) => {
      details[driverId] = { ...details[driverId], ...override }
    })
    return details
  }, [driverDetailsOverrides, driverQueryDetails])

  const suspendDriverMutation = useMutation({
    mutationFn: ({ driverId }: SuspendDriverVariables) => suspendAdminDriver(driverId),
    onSuccess: (_, variables) => {
      enqueueSnackbar(`${variables.previousDriver.name} bloqueado com sucesso.`, { variant: 'success' })
      void queryClient.invalidateQueries({ queryKey: driversQueryKeys.access })
      void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.access })
    },
    onError: (error: unknown, variables) => {
      console.warn('Nao foi possivel suspender motorista na API.', error)
      setDriverOverrides((currentOverrides) => ({
        ...currentOverrides,
        [variables.driverId]: variables.previousDriver,
      }))
      setSelectedDriver((currentDriver) =>
        currentDriver?.id === variables.driverId ? variables.previousDriver : currentDriver,
      )
      enqueueSnackbar(`Nao foi possivel bloquear ${variables.previousDriver.name}. Tente novamente.`, { variant: 'error' })
    },
  })

  useEffect(() => {
    const initialSearch = new URLSearchParams(location.search).get('search')

    if (initialSearch) {
      setSearch(initialSearch)
      setPage(1)
    }
  }, [location.search])

  useEffect(() => {
    if (!locationState?.selectedDriverId && !locationState?.selectedDriverName) {
      return
    }

    const targetDriver = driverRows.find((driver) => {
      return driver.id === locationState.selectedDriverId || driver.name === locationState.selectedDriverName
    })

    if (targetDriver) {
      setSelectedDriver(targetDriver)
      setDriverDetailsTab(locationState.selectedDriverTab ?? 0)
    }
  }, [driverRows, locationState?.selectedDriverId, locationState?.selectedDriverName, locationState?.selectedDriverTab])

  const filteredDrivers = useMemo(() => {
    const normalizedSearch = normalizeSearch(search).trim()

    const matchingDrivers = driverRows.filter((driver) => {
      const matchesSearch =
        !normalizedSearch ||
        normalizeSearch(`${driver.name} ${driver.phone} ${driver.id}`).includes(normalizedSearch)

      if (!matchesSearch) {
        return false
      }

      if (selectedCategory !== 'all' && driver.category !== selectedCategory) {
        return false
      }

      if (selectedFilter === 'online') {
        return driver.status === 'Online'
      }

      if (selectedFilter === 'approved') {
        return driver.status === 'Online' || driver.status === 'Offline'
      }

      if (selectedFilter === 'pending') {
        return driver.status === 'Pendente'
      }

      if (selectedFilter === 'blocked') {
        return driver.status === 'Bloqueado'
      }

      return true
    })

    if (!sortKey) {
      return matchingDrivers
    }

    return [...matchingDrivers].sort((firstDriver, secondDriver) => {
      const firstValue = getDriverSortValue(firstDriver, sortKey)
      const secondValue = getDriverSortValue(secondDriver, sortKey)
      const comparison = firstValue > secondValue ? 1 : firstValue < secondValue ? -1 : 0

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [driverRows, search, selectedCategory, selectedFilter, sortDirection, sortKey])

  const visibleDrivers = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    return filteredDrivers.slice(start, start + rowsPerPage)
  }, [filteredDrivers, page])

  function handleFilterChange(_: React.MouseEvent<HTMLElement>, value: DriverFilter | null) {
    if (value) {
      setSelectedFilter(value)
      setPage(1)
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleSort(key: DriverSortKey) {
    if (sortKey === key) {
      setSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection(key === 'rides' || key === 'rating' || key === 'monthlyEarnings' ? 'desc' : 'asc')
    }

    setPage(1)
  }

  function openDriverDetails(driver: Driver) {
    setSelectedDriver(driver)
    setDriverDetailsTab(0)
  }

  function handleSaveDriver(form: DriverEditForm) {
    const updatedDriver: Driver = {
      id: form.id,
      name: form.name,
      initials: getInitials(form.name),
      phone: form.phone,
      category: form.category,
      status: form.status,
      rides: form.rides,
      rating: form.rating,
      subscription: form.subscription,
      monthlyEarnings: form.monthlyEarnings,
    }

    setDriverOverrides((currentOverrides) => ({ ...currentOverrides, [updatedDriver.id]: updatedDriver }))
    setDriverDetailsOverrides((currentOverrides) => ({
      ...currentOverrides,
      [updatedDriver.id]: {
        ...currentOverrides[updatedDriver.id],
        photoLabel: `Foto do motorista ${updatedDriver.name}`,
        cpf: form.cpf,
        email: form.email,
        city: form.city,
        vehicle: form.vehicle,
        plate: form.plate,
        joinedAt: form.joinedAt,
        lastOnline: form.lastOnline,
      },
    }))
    setSelectedDriver((currentDriver) => (currentDriver?.id === updatedDriver.id ? updatedDriver : currentDriver))
    setEditingDriver(null)
  }

  function handleToggleBlocked(driver: Driver) {
    const updatedStatus: DriverStatus = driver.status === 'Bloqueado' ? 'Offline' : 'Bloqueado'

    setDriverOverrides((currentOverrides) => ({
      ...currentOverrides,
      [driver.id]: {
        ...driver,
        status: updatedStatus,
      },
    }))

    setSelectedDriver((currentDriver) =>
      currentDriver?.id === driver.id
        ? {
            ...currentDriver,
            status: updatedStatus,
          }
          : currentDriver,
    )

    if (updatedStatus === 'Bloqueado') {
      suspendDriverMutation.mutate({ driverId: driver.id, previousDriver: driver })
      return
    }

    enqueueSnackbar(`${driver.name} desbloqueado localmente.`, { variant: 'success' })
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h3" component="h1">
            Motoristas
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Gerencie cadastros, status, categorias e desempenho dos motoristas.
          </Typography>
        </Box>

      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', lg: 'center' }}
              justifyContent="space-between"
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: { xs: '100%', lg: 'auto' } }}>
                <TextField
                  value={search}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  placeholder="Buscar por nome, telefone..."
                  size="small"
                  sx={{ minWidth: { sm: 280, lg: 320 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl size="small" sx={{ minWidth: { sm: 180 } }}>
                  <InputLabel id="driver-category-filter-label">Categoria</InputLabel>
                  <Select
                    labelId="driver-category-filter-label"
                    label="Categoria"
                    value={selectedCategory}
                    onChange={(event) => {
                      setSelectedCategory(event.target.value as DriverCategoryFilter)
                      setPage(1)
                    }}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="Conforto">Conforto</MenuItem>
                    <MenuItem value="Econômico">Econômico</MenuItem>
                    <MenuItem value="Executivo">Executivo</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <ToggleButtonGroup
                exclusive
                size="small"
                value={selectedFilter}
                onChange={handleFilterChange}
                aria-label="Filtro de motoristas"
                sx={{
                  flexWrap: 'wrap',
                  gap: 1,
                  '& .MuiToggleButtonGroup-grouped': {
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    px: 1.5,
                    '&.Mui-selected': {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.dark,
                      backgroundColor: 'rgba(45, 212, 160, 0.14)',
                    },
                  },
                }}
              >
                {filters.map((filter) => (
                  <ToggleButton key={filter.value} value={filter.value} aria-label={filter.label}>
                    {filter.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>

            <TableContainer>
              <Table sx={{ minWidth: 980 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Motorista</TableCell>
                    <SortableHeader
                      active={sortKey === 'category'}
                      direction={sortDirection}
                      label="Categoria"
                      onClick={() => handleSort('category')}
                    />
                    <SortableHeader
                      active={sortKey === 'status'}
                      direction={sortDirection}
                      label="Status"
                      onClick={() => handleSort('status')}
                    />
                    <SortableHeader
                      active={sortKey === 'rides'}
                      direction={sortDirection}
                      label="Corridas"
                      onClick={() => handleSort('rides')}
                    />
                    <SortableHeader
                      active={sortKey === 'rating'}
                      direction={sortDirection}
                      label="Avaliação"
                      onClick={() => handleSort('rating')}
                    />
                    <SortableHeader
                      active={sortKey === 'subscription'}
                      direction={sortDirection}
                      label="Assinatura"
                      onClick={() => handleSort('subscription')}
                    />
                    <SortableHeader
                      active={sortKey === 'monthlyEarnings'}
                      direction={sortDirection}
                      label="Ganhos mês"
                      onClick={() => handleSort('monthlyEarnings')}
                    />
                    <TableCell align="right" sx={{ width: 96 }}>
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleDrivers.map((driver) => (
                    <TableRow key={driver.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: 'rgba(10, 190, 233, 0.12)',
                              color: theme.palette.secondary.main,
                              fontWeight: 700,
                            }}
                          >
                            {driver.initials}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Button
                              variant="text"
                              onClick={() => openDriverDetails(driver)}
                              sx={{
                                minWidth: 0,
                                p: 0,
                                justifyContent: 'flex-start',
                                color: 'text.primary',
                                fontWeight: 700,
                                textAlign: 'left',
                                textTransform: 'none',
                                '&:hover': {
                                  color: theme.palette.primary.main,
                                  backgroundColor: 'transparent',
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              <Typography component="span" fontWeight={700} noWrap>
                                {driver.name}
                              </Typography>
                            </Button>
                            <Typography color="text.secondary" variant="body2" noWrap>
                              {driver.phone}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <DriverBadge label={driver.category} palette={categoryPalette[driver.category]} />
                      </TableCell>
                      <TableCell>
                        <DriverBadge label={driver.status} palette={statusPalette[driver.status]} />
                      </TableCell>
                      <TableCell>{numberFormatter.format(driver.rides)}</TableCell>
                      <TableCell>{driver.rating.toFixed(1)}</TableCell>
                      <TableCell>
                        <DriverBadge label={driver.subscription} palette={subscriptionPalette[driver.subscription]} />
                      </TableCell>
                      <TableCell>{currencyFormatter.format(driver.monthlyEarnings)}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="Editar">
                            <IconButton size="small" aria-label={`Editar ${driver.name}`} onClick={() => setEditingDriver(driver)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={driver.status === 'Bloqueado' ? 'Desbloquear' : 'Bloquear'}>
                            <IconButton
                              size="small"
                              aria-label={`${driver.status === 'Bloqueado' ? 'Desbloquear' : 'Bloquear'} ${driver.name}`}
                              onClick={() => handleToggleBlocked(driver)}
                            >
                              {driver.status === 'Bloqueado' ? (
                                <LockOpenOutlinedIcon fontSize="small" />
                              ) : (
                                <BlockIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
            >
              <Typography color="text.secondary">
                Exibindo {visibleDrivers.length} de {filteredDrivers.length} motoristas
              </Typography>
              <Pagination
                count={Math.max(1, Math.ceil(filteredDrivers.length / rowsPerPage))}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <DriverDetailsDialog
        driver={selectedDriver}
        detailsOverride={selectedDriver ? driverDetailsById[selectedDriver.id] : undefined}
        tab={driverDetailsTab}
        onTabChange={setDriverDetailsTab}
        onClose={() => setSelectedDriver(null)}
      />
      <DriverEditDialog
        driver={editingDriver}
        detailsOverride={editingDriver ? driverDetailsById[editingDriver.id] : undefined}
        onClose={() => setEditingDriver(null)}
        onSave={handleSaveDriver}
      />
    </Stack>
  )
}
