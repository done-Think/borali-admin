import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import BlockIcon from '@mui/icons-material/Block'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { Alert, Avatar, Box, Button, Card, CardContent, FormControl, IconButton, InputAdornment, InputLabel, LinearProgress, MenuItem, Pagination, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography, useTheme } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useLocation } from 'react-router'
import { useGetAllPassengersAccess } from '../queries'
import { passengers } from '../data/mockPassengers'
import type { Passenger, PassengerDetails, PassengerEditForm, PassengerFilter, PassengersLocationState, PassengerSortKey, PassengerTierFilter, SortDirection } from '../types'
import { currencyFormatter, filters, getInitials, getPassengerDetails, getPassengerSortValue, numberFormatter, normalizeSearch, statusPalette, tierPalette } from '../utils/passengers'
import { PassengerBadge, PassengerDetailsDialog, PassengerEditDialog, PaymentBadges, SortableHeader } from './PassengerManagementComponents'

const emptyPassengerDetails: Record<string, Partial<PassengerDetails>> = {}

export default function PassengersPage() {
  const theme = useTheme()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  const [passengerOverrides, setPassengerOverrides] = useState<Record<string, Passenger>>({})
  const [passengerDetailsOverrides, setPassengerDetailsOverrides] = useState<Record<string, Partial<PassengerDetails>>>({})
  const [search, setSearch] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<PassengerFilter>('all')
  const [selectedTier, setSelectedTier] = useState<PassengerTierFilter>('all')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<PassengerSortKey | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null)
  const [editingPassenger, setEditingPassenger] = useState<Passenger | null>(null)
  const [passengerDetailsTab, setPassengerDetailsTab] = useState(0)
  const rowsPerPage = 5
  const locationState = location.state as PassengersLocationState | null

  const passengersQuery = useGetAllPassengersAccess()
  const passengerQueryRows = passengersQuery.data?.rows ?? passengers
  const passengerQueryDetails = passengersQuery.data?.details ?? emptyPassengerDetails
  const passengerRows = useMemo(
    () => passengerQueryRows.map((passenger) => passengerOverrides[passenger.id] ?? passenger),
    [passengerOverrides, passengerQueryRows],
  )
  const passengerDetailsById = useMemo(() => {
    const details = { ...passengerQueryDetails }
    Object.entries(passengerDetailsOverrides).forEach(([passengerId, override]) => {
      details[passengerId] = { ...details[passengerId], ...override }
    })
    return details
  }, [passengerDetailsOverrides, passengerQueryDetails])

  useEffect(() => {
    const initialSearch = new URLSearchParams(location.search).get('search')

    if (initialSearch) {
      setSearch(initialSearch)
      setPage(1)
    }
  }, [location.search])

  useEffect(() => {
    if (!locationState?.selectedPassengerId && !locationState?.selectedPassengerName) {
      return
    }

    const targetPassenger = passengerRows.find((passenger) => {
      return passenger.id === locationState.selectedPassengerId || passenger.name === locationState.selectedPassengerName
    })

    if (targetPassenger) {
      setSelectedPassenger(targetPassenger)
      setPassengerDetailsTab(locationState.selectedPassengerTab ?? 0)
    }
  }, [locationState?.selectedPassengerId, locationState?.selectedPassengerName, locationState?.selectedPassengerTab, passengerRows])

  const filteredPassengers = useMemo(() => {
    const normalizedSearch = normalizeSearch(search).trim()

    const matchingPassengers = passengerRows.filter((passenger) => {
      const details = getPassengerDetails(passenger, passengerDetailsById[passenger.id])
      const matchesSearch =
        !normalizedSearch ||
        normalizeSearch(
          `${passenger.name} ${passenger.phone} ${passenger.id} ${details.cpf} ${details.email} ${passenger.payments.join(' ')}`,
        ).includes(normalizedSearch)

      if (!matchesSearch) {
        return false
      }

      if (selectedTier !== 'all' && passenger.tier !== selectedTier) {
        return false
      }

      if (selectedFilter === 'active') {
        return passenger.status === 'Ativo'
      }

      if (selectedFilter === 'pending') {
        return passenger.status === 'Pendente'
      }

      if (selectedFilter === 'blocked') {
        return passenger.status === 'Bloqueado'
      }

      return true
    })

    if (!sortKey) {
      return matchingPassengers
    }

    return [...matchingPassengers].sort((firstPassenger, secondPassenger) => {
      const firstValue = getPassengerSortValue(firstPassenger, sortKey)
      const secondValue = getPassengerSortValue(secondPassenger, sortKey)
      const comparison = firstValue > secondValue ? 1 : firstValue < secondValue ? -1 : 0

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [passengerDetailsById, passengerRows, search, selectedFilter, selectedTier, sortDirection, sortKey])

  const visiblePassengers = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    return filteredPassengers.slice(start, start + rowsPerPage)
  }, [filteredPassengers, page])

  function handleFilterChange(_: MouseEvent<HTMLElement>, value: PassengerFilter | null) {
    if (value) {
      setSelectedFilter(value)
      setPage(1)
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleSort(key: PassengerSortKey) {
    if (sortKey === key) {
      setSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection(key === 'rides' || key === 'rating' || key === 'monthlySpend' ? 'desc' : 'asc')
    }

    setPage(1)
  }

  function openPassengerDetails(passenger: Passenger) {
    setSelectedPassenger(passenger)
    setPassengerDetailsTab(0)
  }

  function handleToggleBlocked(passenger: Passenger) {
    enqueueSnackbar(
      passenger.status === 'Bloqueado'
        ? 'Desbloqueio de passageiro ainda precisa de endpoint na API.'
        : 'Bloqueio de passageiro ainda precisa de endpoint na API.',
      { variant: 'info' },
    )
  }

  function handleSavePassenger(form: PassengerEditForm) {
    const updatedPassenger: Passenger = {
      id: form.id,
      name: form.name,
      initials: getInitials(form.name),
      phone: form.phone,
      tier: form.tier,
      status: form.status,
      rides: form.rides,
      rating: form.rating,
      payments: form.payments,
      monthlySpend: form.monthlySpend,
    }

    setPassengerOverrides((currentOverrides) => ({ ...currentOverrides, [updatedPassenger.id]: updatedPassenger }))
    setPassengerDetailsOverrides((currentOverrides) => ({
      ...currentOverrides,
      [updatedPassenger.id]: {
        ...currentOverrides[updatedPassenger.id],
        photoLabel: `Foto do passageiro ${updatedPassenger.name}`,
        cpf: form.cpf,
        email: form.email,
        city: form.city,
        joinedAt: form.joinedAt,
        lastRide: form.lastRide,
        preferredRegion: form.preferredRegion,
      },
    }))
    setSelectedPassenger((currentPassenger) =>
      currentPassenger?.id === updatedPassenger.id ? updatedPassenger : currentPassenger,
    )
    setEditingPassenger(null)
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
            Passageiros
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Gerencie cadastros, status, consumo e historico de corridas dos passageiros.
          </Typography>
        </Box>
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2.5}>
            {passengersQuery.isFetching && <LinearProgress />}
            {passengersQuery.isError && (
              <Alert severity="error">
                Nao foi possivel atualizar a lista de passageiros. Verifique a conexao com a API.
              </Alert>
            )}

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
                  placeholder="Buscar por nome, telefone, CPF..."
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

                <FormControl size="small" sx={{ minWidth: { sm: 170 } }}>
                  <InputLabel id="passenger-tier-filter-label">Categoria</InputLabel>
                  <Select
                    labelId="passenger-tier-filter-label"
                    label="Categoria"
                    value={selectedTier}
                    onChange={(event) => {
                      setSelectedTier(event.target.value as PassengerTierFilter)
                      setPage(1)
                    }}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="VIP">VIP</MenuItem>
                    <MenuItem value="Ouro">Ouro</MenuItem>
                    <MenuItem value="Prata">Prata</MenuItem>
                    <MenuItem value="Regular">Regular</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <ToggleButtonGroup
                exclusive
                size="small"
                value={selectedFilter}
                onChange={handleFilterChange}
                aria-label="Filtro de passageiros"
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
                    <TableCell>Passageiro</TableCell>
                    <SortableHeader active={sortKey === 'tier'} direction={sortDirection} label="Categoria" onClick={() => handleSort('tier')} />
                    <SortableHeader active={sortKey === 'status'} direction={sortDirection} label="Status" onClick={() => handleSort('status')} />
                    <SortableHeader active={sortKey === 'rides'} direction={sortDirection} label="Corridas" onClick={() => handleSort('rides')} />
                    <SortableHeader active={sortKey === 'rating'} direction={sortDirection} label="Avaliação" onClick={() => handleSort('rating')} />
                    <SortableHeader active={sortKey === 'payment'} direction={sortDirection} label="Pagamento" onClick={() => handleSort('payment')} />
                    <SortableHeader
                      active={sortKey === 'monthlySpend'}
                      direction={sortDirection}
                      label="Gasto mês"
                      onClick={() => handleSort('monthlySpend')}
                    />
                    <TableCell align="right" sx={{ width: 96 }}>
                      Acoes
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visiblePassengers.map((passenger) => (
                    <TableRow key={passenger.id} hover>
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
                            {passenger.initials}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Button
                              variant="text"
                              onClick={() => openPassengerDetails(passenger)}
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
                                {passenger.name}
                              </Typography>
                            </Button>
                            <Typography color="text.secondary" variant="body2" noWrap>
                              {passenger.phone}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <PassengerBadge label={passenger.tier} palette={tierPalette[passenger.tier]} />
                      </TableCell>
                      <TableCell>
                        <PassengerBadge label={passenger.status} palette={statusPalette[passenger.status]} />
                      </TableCell>
                      <TableCell>{numberFormatter.format(passenger.rides)}</TableCell>
                      <TableCell>{passenger.rating.toFixed(1)}</TableCell>
                      <TableCell>
                        <PaymentBadges payments={passenger.payments} />
                      </TableCell>
                      <TableCell>{currencyFormatter.format(passenger.monthlySpend)}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="Editar">
                            <IconButton size="small" aria-label={`Editar ${passenger.name}`} onClick={() => setEditingPassenger(passenger)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={passenger.status === 'Bloqueado' ? 'Desbloquear' : 'Bloquear'}>
                            <IconButton
                              size="small"
                              aria-label={`${passenger.status === 'Bloqueado' ? 'Desbloquear' : 'Bloquear'} ${passenger.name}`}
                              onClick={() => handleToggleBlocked(passenger)}
                            >
                              {passenger.status === 'Bloqueado' ? (
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
                Exibindo {visiblePassengers.length} de {filteredPassengers.length} passageiros
              </Typography>
              <Pagination
                count={Math.max(1, Math.ceil(filteredPassengers.length / rowsPerPage))}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <PassengerDetailsDialog
        passenger={selectedPassenger}
        detailsOverride={selectedPassenger ? passengerDetailsById[selectedPassenger.id] : undefined}
        tab={passengerDetailsTab}
        onTabChange={setPassengerDetailsTab}
        onClose={() => setSelectedPassenger(null)}
      />

      <PassengerEditDialog
        passenger={editingPassenger}
        detailsOverride={editingPassenger ? passengerDetailsById[editingPassenger.id] : undefined}
        onClose={() => setEditingPassenger(null)}
        onSave={handleSavePassenger}
      />
    </Stack>
  )
}
