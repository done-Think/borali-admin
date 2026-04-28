import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import BlockIcon from '@mui/icons-material/Block'
import CloseIcon from '@mui/icons-material/Close'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined'
import SearchIcon from '@mui/icons-material/Search'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { useNavigate } from 'react-router'
import { supportTickets } from '@shared/mocks/supportTickets'

type PassengerFilter = 'all' | 'active' | 'pending' | 'blocked'
type PassengerStatus = 'Ativo' | 'Inativo' | 'Pendente' | 'Bloqueado'
type PassengerTier = 'Regular' | 'Prata' | 'Ouro' | 'VIP'
type PassengerTierFilter = 'all' | PassengerTier
type PassengerPayment = 'Cartao' | 'Pix' | 'Carteira' | 'Dinheiro'
type PassengerSortKey = 'tier' | 'status' | 'rides' | 'rating' | 'payment' | 'monthlySpend'
type SortDirection = 'asc' | 'desc'

type Passenger = {
  id: string
  name: string
  initials: string
  phone: string
  tier: PassengerTier
  status: PassengerStatus
  rides: number
  rating: number
  payments: PassengerPayment[]
  monthlySpend: number
}

type PassengerDetails = {
  photoLabel: string
  cpf: string
  email: string
  city: string
  joinedAt: string
  lastRide: string
  preferredRegion: string
  rideHistory: Array<{
    id: string
    date: string
    from: string
    to: string
    value: number
    status: string
  }>
  complaints: Array<{
    id: string
    date: string
    title: string
    status: string
  }>
  monthlyAverage: {
    rides: number
    spend: number
    rating: number
    cancellationRate: number
  }
}

type PassengerRide = PassengerDetails['rideHistory'][number]

type PassengerEditForm = Passenger & {
  cpf: string
  email: string
  city: string
  joinedAt: string
  lastRide: string
  preferredRegion: string
}

const passengers: Passenger[] = [
  {
    id: 'PAS-2001',
    name: 'Mariana Costa',
    initials: 'MC',
    phone: '(11) 98422-1930',
    tier: 'Ouro',
    status: 'Ativo',
    rides: 186,
    rating: 4.7,
    payments: ['Cartao', 'Pix', 'Carteira'],
    monthlySpend: 1280,
  },
  {
    id: 'PAS-2002',
    name: 'Lucas Pereira',
    initials: 'LP',
    phone: '(31) 98877-2041',
    tier: 'Regular',
    status: 'Ativo',
    rides: 58,
    rating: 4.4,
    payments: ['Pix', 'Cartao'],
    monthlySpend: 420,
  },
  {
    id: 'PAS-2003',
    name: 'Camila Rocha',
    initials: 'CR',
    phone: '(21) 99714-8022',
    tier: 'VIP',
    status: 'Ativo',
    rides: 312,
    rating: 4.9,
    payments: ['Carteira', 'Cartao', 'Pix'],
    monthlySpend: 2310,
  },
  {
    id: 'PAS-2004',
    name: 'Eduardo Lima',
    initials: 'EL',
    phone: '(41) 99120-7764',
    tier: 'Prata',
    status: 'Inativo',
    rides: 91,
    rating: 4.2,
    payments: ['Cartao', 'Dinheiro'],
    monthlySpend: 180,
  },
  {
    id: 'PAS-2005',
    name: 'Bianca Martins',
    initials: 'BM',
    phone: '(51) 99630-2281',
    tier: 'Regular',
    status: 'Pendente',
    rides: 4,
    rating: 5,
    payments: ['Pix'],
    monthlySpend: 96,
  },
  {
    id: 'PAS-2006',
    name: 'Rafael Teixeira',
    initials: 'RT',
    phone: '(85) 98922-1105',
    tier: 'Prata',
    status: 'Bloqueado',
    rides: 77,
    rating: 3.6,
    payments: ['Dinheiro', 'Pix'],
    monthlySpend: 0,
  },
  {
    id: 'PAS-2007',
    name: 'Aline Ferreira',
    initials: 'AF',
    phone: '(62) 98704-7740',
    tier: 'VIP',
    status: 'Ativo',
    rides: 278,
    rating: 4.8,
    payments: ['Carteira', 'Cartao'],
    monthlySpend: 1940,
  },
  {
    id: 'PAS-2008',
    name: 'Joao Henrique',
    initials: 'JH',
    phone: '(19) 99210-3408',
    tier: 'Regular',
    status: 'Inativo',
    rides: 32,
    rating: 4.1,
    payments: ['Pix', 'Dinheiro'],
    monthlySpend: 70,
  },
]

const passengerDetailsById: Record<string, PassengerDetails> = {
  'PAS-2001': {
    photoLabel: 'Foto da passageira Mariana Costa',
    cpf: '482.319.740-09',
    email: 'mariana.costa@email.com',
    city: 'Sao Paulo, SP',
    joinedAt: '12/03/2024',
    lastRide: '28/04/2026',
    preferredRegion: 'Zona Sul',
    rideHistory: [
      { id: 'BRL-83921', date: '28/04/2026', from: 'Jardins', to: 'Aeroporto de Congonhas', value: 58, status: 'Finalizada' },
      { id: 'BRL-83815', date: '26/04/2026', from: 'Moema', to: 'Pinheiros', value: 36, status: 'Finalizada' },
      { id: 'BRL-83692', date: '24/04/2026', from: 'Vila Mariana', to: 'Paulista', value: 28, status: 'Finalizada' },
    ],
    complaints: [],
    monthlyAverage: {
      rides: 24,
      spend: 1280,
      rating: 4.7,
      cancellationRate: 3.2,
    },
  },
  'PAS-2002': {
    photoLabel: 'Foto do passageiro Lucas Pereira',
    cpf: '730.118.482-21',
    email: 'lucas.pereira@email.com',
    city: 'Belo Horizonte, MG',
    joinedAt: '19/01/2025',
    lastRide: '27/04/2026',
    preferredRegion: 'Savassi',
    rideHistory: [
      { id: 'BRL-83774', date: '27/04/2026', from: 'Savassi', to: 'Pampulha', value: 34, status: 'Finalizada' },
      { id: 'BRL-83544', date: '23/04/2026', from: 'Centro', to: 'Funcionarios', value: 22, status: 'Finalizada' },
    ],
    complaints: [],
    monthlyAverage: {
      rides: 9,
      spend: 420,
      rating: 4.4,
      cancellationRate: 4.8,
    },
  },
}

const filters: Array<{ value: PassengerFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'blocked', label: 'Bloqueados' },
]

const tierSortOrder: Record<PassengerTier, number> = {
  VIP: 1,
  Ouro: 2,
  Prata: 3,
  Regular: 4,
}

const statusSortOrder: Record<PassengerStatus, number> = {
  Ativo: 1,
  Inativo: 2,
  Pendente: 3,
  Bloqueado: 4,
}

const paymentSortOrder: Record<PassengerPayment, number> = {
  Carteira: 1,
  Cartao: 2,
  Pix: 3,
  Dinheiro: 4,
}

const paymentOptions: PassengerPayment[] = ['Cartao', 'Pix', 'Carteira', 'Dinheiro']

const tierPalette: Record<PassengerTier, BadgePalette> = {
  VIP: { color: '#7C3AED', background: 'rgba(124, 58, 237, 0.14)', border: 'rgba(124, 58, 237, 0.35)' },
  Ouro: { color: '#B45309', background: 'rgba(245, 158, 11, 0.16)', border: 'rgba(180, 83, 9, 0.35)' },
  Prata: { color: '#4B5563', background: 'rgba(107, 114, 128, 0.12)', border: 'rgba(107, 114, 128, 0.32)' },
  Regular: { color: '#047857', background: 'rgba(16, 185, 129, 0.12)', border: 'rgba(5, 150, 105, 0.32)' },
}

const statusPalette: Record<PassengerStatus, BadgePalette> = {
  Ativo: { color: '#047857', background: 'rgba(16, 185, 129, 0.12)', border: 'rgba(5, 150, 105, 0.32)' },
  Inativo: { color: '#6B7280', background: 'rgba(107, 114, 128, 0.12)', border: 'rgba(107, 114, 128, 0.32)' },
  Pendente: { color: '#B45309', background: 'rgba(245, 158, 11, 0.16)', border: 'rgba(180, 83, 9, 0.35)' },
  Bloqueado: { color: '#B91C1C', background: 'rgba(239, 68, 68, 0.12)', border: 'rgba(220, 38, 38, 0.32)' },
}

const paymentPalette: Record<PassengerPayment, BadgePalette> = {
  Cartao: { color: '#2563EB', background: 'rgba(37, 99, 235, 0.12)', border: 'rgba(37, 99, 235, 0.32)' },
  Pix: { color: '#0F766E', background: 'rgba(20, 184, 166, 0.12)', border: 'rgba(15, 118, 110, 0.32)' },
  Carteira: { color: '#7C3AED', background: 'rgba(124, 58, 237, 0.14)', border: 'rgba(124, 58, 237, 0.35)' },
  Dinheiro: { color: '#4B5563', background: 'rgba(107, 114, 128, 0.12)', border: 'rgba(107, 114, 128, 0.32)' },
}

type BadgePalette = {
  color: string
  background: string
  border: string
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const numberFormatter = new Intl.NumberFormat('pt-BR')

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length <= 3) {
    return digits
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`
  }

  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function getPassengerSortValue(passenger: Passenger, key: PassengerSortKey) {
  if (key === 'tier') {
    return tierSortOrder[passenger.tier]
  }

  if (key === 'status') {
    return statusSortOrder[passenger.status]
  }

  if (key === 'payment') {
    return Math.min(...passenger.payments.map((payment) => paymentSortOrder[payment]))
  }

  return passenger[key]
}

function getPassengerDetailsBase(passenger: Passenger): PassengerDetails {
  return (
    passengerDetailsById[passenger.id] ?? {
      photoLabel: `Foto do passageiro ${passenger.name}`,
      cpf: '000.000.000-00',
      email: `${normalizeSearch(passenger.name).replace(/\s+/g, '.')}@email.com`,
      city: 'Sao Paulo, SP',
      joinedAt: '10/01/2025',
      lastRide: passenger.status === 'Ativo' ? 'Hoje' : 'Sem corrida recente',
      preferredRegion: 'Centro',
      rideHistory: [
        { id: 'BRL-83110', date: '25/04/2026', from: 'Centro', to: 'Zona Sul', value: 42, status: 'Finalizada' },
        { id: 'BRL-82984', date: '21/04/2026', from: 'Shopping', to: 'Residencia', value: 31, status: 'Finalizada' },
      ],
      complaints:
        passenger.status === 'Bloqueado'
          ? [{ id: 'SUP-1188', date: '18/04/2026', title: 'Conta bloqueada por revisao de conduta', status: 'Aberta' }]
          : [],
      monthlyAverage: {
        rides: Math.max(2, Math.round(passenger.rides / 8)),
        spend: passenger.monthlySpend,
        rating: passenger.rating,
        cancellationRate: passenger.status === 'Bloqueado' ? 12.4 : 3.8,
      },
    }
  )
}

function getPassengerComplaints(passenger: Passenger, fallbackComplaints: PassengerDetails['complaints'] = []) {
  const details = getPassengerDetailsBase(passenger)
  const linkedComplaints = supportTickets
    .filter(
      (ticket) =>
        ticket.user.role === 'passenger' &&
        (ticket.user.phone === passenger.phone || ticket.user.email === details.email || normalizeSearch(ticket.user.name) === normalizeSearch(passenger.name)),
    )
    .map((ticket) => ({
      id: ticket.protocol,
      date: ticket.occurrence.createdAt.split(' às ')[0],
      title: ticket.occurrence.title,
      status: ticket.status,
    }))

  return linkedComplaints.length > 0 ? linkedComplaints : fallbackComplaints
}

function getPassengerDetails(passenger: Passenger, override?: Partial<PassengerDetails>): PassengerDetails {
  const details = getPassengerDetailsBase(passenger)
  const mergedDetails = {
    ...details,
    ...override,
    monthlyAverage: {
      ...details.monthlyAverage,
      ...override?.monthlyAverage,
    },
  }

  return {
    ...mergedDetails,
    complaints: getPassengerComplaints(passenger, mergedDetails.complaints),
  }
}

function getPassengerRideDetails(ride: PassengerRide) {
  const details: Record<string, { duration: string; distance: string; path: string[] }> = {
    'BRL-83921': {
      duration: '34 min',
      distance: '18,4 km',
      path: ['Jardins', 'Av. 23 de Maio', 'Aeroporto de Congonhas'],
    },
    'BRL-83815': {
      duration: '22 min',
      distance: '8,7 km',
      path: ['Moema', 'Av. Santo Amaro', 'Pinheiros'],
    },
    'BRL-83692': {
      duration: '14 min',
      distance: '5,2 km',
      path: ['Vila Mariana', 'Paraiso', 'Paulista'],
    },
    'BRL-83774': {
      duration: '31 min',
      distance: '14,2 km',
      path: ['Savassi', 'Av. Antonio Carlos', 'Pampulha'],
    },
    'BRL-83544': {
      duration: '12 min',
      distance: '4,3 km',
      path: ['Centro', 'Av. Afonso Pena', 'Funcionarios'],
    },
  }

  return (
    details[ride.id] ?? {
      duration: '24 min',
      distance: '9,6 km',
      path: [ride.from, 'Rota principal registrada', ride.to],
    }
  )
}

export default function PassengersPage() {
  const theme = useTheme()
  const [passengerRows, setPassengerRows] = useState(passengers)
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

  const filteredPassengers = useMemo(() => {
    const normalizedSearch = normalizeSearch(search).trim()

    const matchingPassengers = passengerRows.filter((passenger) => {
      const details = getPassengerDetails(passenger, passengerDetailsOverrides[passenger.id])
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
  }, [passengerDetailsOverrides, passengerRows, search, selectedFilter, selectedTier, sortDirection, sortKey])

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
    const updatedStatus: PassengerStatus = passenger.status === 'Bloqueado' ? 'Inativo' : 'Bloqueado'

    setPassengerRows((currentRows) =>
      currentRows.map((currentPassenger) =>
        currentPassenger.id === passenger.id
          ? {
              ...currentPassenger,
              status: updatedStatus,
            }
          : currentPassenger,
      ),
    )

    setSelectedPassenger((currentPassenger) =>
      currentPassenger?.id === passenger.id
        ? {
            ...currentPassenger,
            status: updatedStatus,
          }
        : currentPassenger,
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

    setPassengerRows((currentRows) =>
      currentRows.map((passenger) => (passenger.id === updatedPassenger.id ? updatedPassenger : passenger)),
    )
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
                    <SortableHeader active={sortKey === 'rating'} direction={sortDirection} label="Avaliacao" onClick={() => handleSort('rating')} />
                    <SortableHeader active={sortKey === 'payment'} direction={sortDirection} label="Pagamento" onClick={() => handleSort('payment')} />
                    <SortableHeader
                      active={sortKey === 'monthlySpend'}
                      direction={sortDirection}
                      label="Gasto mes"
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
        detailsOverride={selectedPassenger ? passengerDetailsOverrides[selectedPassenger.id] : undefined}
        tab={passengerDetailsTab}
        onTabChange={setPassengerDetailsTab}
        onClose={() => setSelectedPassenger(null)}
      />

      <PassengerEditDialog
        passenger={editingPassenger}
        detailsOverride={editingPassenger ? passengerDetailsOverrides[editingPassenger.id] : undefined}
        onClose={() => setEditingPassenger(null)}
        onSave={handleSavePassenger}
      />
    </Stack>
  )
}

function PassengerDetailsDialog({
  passenger,
  detailsOverride,
  tab,
  onTabChange,
  onClose,
}: {
  passenger: Passenger | null
  detailsOverride?: Partial<PassengerDetails>
  tab: number
  onTabChange: (value: number) => void
  onClose: () => void
}) {
  const theme = useTheme()
  const navigate = useNavigate()
  const [selectedRide, setSelectedRide] = useState<PassengerRide | null>(null)

  if (!passenger) {
    return null
  }

  const details = getPassengerDetails(passenger, detailsOverride)

  return (
    <Dialog open={Boolean(passenger)} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              aria-label={details.photoLabel}
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'rgba(10, 190, 233, 0.12)',
                color: theme.palette.secondary.main,
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              {passenger.initials}
            </Avatar>
            <Box>
              <Typography variant="h4">{passenger.name}</Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                <PassengerBadge label={passenger.tier} palette={tierPalette[passenger.tier]} />
                <PassengerBadge label={passenger.status} palette={statusPalette[passenger.status]} />
                <PaymentBadges payments={passenger.payments} />
              </Stack>
            </Box>
          </Stack>

          <IconButton aria-label="Fechar detalhes do passageiro" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Tabs value={tab} onChange={(_, value) => onTabChange(value)} variant="scrollable" scrollButtons="auto" sx={{ mb: 3 }}>
          <Tab label="Cadastro" />
          <Tab label="Historico de corridas" />
          <Tab label="Reclamacoes" />
          <Tab label="Media mensal" />
        </Tabs>

        {tab === 0 && (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            }}
          >
            <PassengerInfo label="Nome completo" value={passenger.name} />
            <PassengerInfo label="CPF" value={details.cpf} />
            <PassengerInfo label="Telefone" value={passenger.phone} />
            <PassengerInfo label="E-mail" value={details.email} />
            <PassengerInfo label="Cidade" value={details.city} />
            <PassengerInfo label="Data de cadastro" value={details.joinedAt} />
            <PassengerInfo label="Ultima corrida" value={details.lastRide} />
            <PassengerInfo label="Regiao preferida" value={details.preferredRegion} />
            <PassengerPaymentInfo payments={passenger.payments} />
          </Box>
        )}

        {tab === 1 && (
          <Stack spacing={1.5}>
            {details.rideHistory.map((ride) => (
              <Box
                key={ride.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedRide(ride)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedRide(ride)
                  }
                }}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  cursor: 'pointer',
                  transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: 'rgba(45, 212, 160, 0.08)',
                    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
                  },
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'grid',
                        placeItems: 'center',
                        color: theme.palette.primary.main,
                        backgroundColor: 'rgba(45, 212, 160, 0.14)',
                      }}
                    >
                      <RouteOutlinedIcon />
                    </Box>
                    <Box>
                      <Typography fontWeight={700}>
                        {ride.from} - {ride.to}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {ride.id} | {ride.date}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={ride.status} color="success" variant="outlined" />
                    <Typography fontWeight={700}>{currencyFormatter.format(ride.value)}</Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}

        {tab === 2 && (
          <Stack spacing={1.5}>
            {details.complaints.length === 0 ? (
              <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 3, textAlign: 'center' }}>
                <Typography fontWeight={700}>Sem reclamacoes registradas</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Este passageiro nao possui reclamacoes no historico mockado.
                </Typography>
              </Box>
            ) : (
              details.complaints.map((complaint) => (
                <Box
                  key={complaint.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/support?ticket=${encodeURIComponent(complaint.id)}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`/support?ticket=${encodeURIComponent(complaint.id)}`)
                    }
                  }}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 2,
                    cursor: 'pointer',
                    transition: theme.transitions.create(['border-color', 'background-color']),
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: 'rgba(45, 212, 160, 0.08)',
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <ReportProblemOutlinedIcon color="warning" />
                      <Box>
                        <Typography fontWeight={700}>{complaint.title}</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {complaint.id} | {complaint.date}
                        </Typography>
                      </Box>
                    </Stack>
                    <Chip label={complaint.status} color={complaint.status === 'Resolvido' ? 'success' : 'warning'} variant="outlined" />
                  </Stack>
                </Box>
              ))
            )}
          </Stack>
        )}

        {tab === 3 && (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
            }}
          >
            <PassengerMetric title="Corridas/mes" value={numberFormatter.format(details.monthlyAverage.rides)} />
            <PassengerMetric title="Gasto/mes" value={currencyFormatter.format(details.monthlyAverage.spend)} />
            <PassengerMetric title="Avaliacao media" value={details.monthlyAverage.rating.toFixed(1)} />
            <PassengerMetric title="Cancelamentos" value={`${details.monthlyAverage.cancellationRate.toFixed(1)}%`} />
          </Box>
        )}
      </DialogContent>
      <PassengerRideDetailsDialog ride={selectedRide} onClose={() => setSelectedRide(null)} />
    </Dialog>
  )
}

function PassengerRideDetailsDialog({ ride, onClose }: { ride: PassengerRide | null; onClose: () => void }) {
  const theme = useTheme()

  if (!ride) {
    return null
  }

  const details = getPassengerRideDetails(ride)

  return (
    <Dialog open={Boolean(ride)} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4">Detalhes da corrida {ride.id}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Trajeto percorrido, tempo e dados principais da viagem.
            </Typography>
          </Box>
          <IconButton aria-label="Fechar detalhes da corrida" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
            }}
          >
            <PassengerInfo label="Tempo de corrida" value={details.duration} />
            <PassengerInfo label="Distancia percorrida" value={details.distance} />
            <PassengerInfo label="Valor" value={currencyFormatter.format(ride.value)} />
          </Box>

          <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 2 }}>
            <Typography fontWeight={700} sx={{ mb: 2 }}>
              Trajeto percorrido
            </Typography>
            <Stack spacing={1.5}>
              {details.path.map((point, index) => (
                <Stack key={`${point}-${index}`} direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#FFFFFF',
                      bgcolor:
                        index === 0
                          ? theme.palette.primary.main
                          : index === details.path.length - 1
                            ? theme.palette.secondary.main
                            : theme.palette.warning.main,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography fontWeight={index === 0 || index === details.path.length - 1 ? 700 : 500}>
                    {point}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

function PassengerEditDialog({
  passenger,
  detailsOverride,
  onClose,
  onSave,
}: {
  passenger: Passenger | null
  detailsOverride?: Partial<PassengerDetails>
  onClose: () => void
  onSave: (form: PassengerEditForm) => void
}) {
  const [form, setForm] = useState<PassengerEditForm | null>(null)

  useEffect(() => {
    if (!passenger) {
      setForm(null)
      return
    }

    const details = getPassengerDetails(passenger, detailsOverride)
    setForm({
      ...passenger,
      cpf: formatCpf(details.cpf),
      email: details.email,
      city: details.city,
      joinedAt: details.joinedAt,
      lastRide: details.lastRide,
      preferredRegion: details.preferredRegion,
    })
  }, [detailsOverride, passenger])

  if (!passenger || !form) {
    return null
  }

  function updateForm<Key extends keyof PassengerEditForm>(key: Key, value: PassengerEditForm[Key]) {
    setForm((currentForm) => (currentForm ? { ...currentForm, [key]: value } : currentForm))
  }

  return (
    <Dialog open={Boolean(passenger)} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4">Editar cadastro do passageiro</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Altere qualquer informacao cadastral de {passenger.name}.
            </Typography>
          </Box>
          <IconButton aria-label="Fechar edicao do passageiro" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          <TextField label="Nome completo" value={form.name} onChange={(event) => updateForm('name', event.target.value)} />
          <TextField label="Telefone" value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} />
          <TextField
            label="CPF"
            value={form.cpf}
            onChange={(event) => updateForm('cpf', formatCpf(event.target.value))}
            inputProps={{ inputMode: 'numeric', maxLength: 14 }}
          />
          <TextField label="E-mail" value={form.email} onChange={(event) => updateForm('email', event.target.value)} />
          <TextField label="Cidade" value={form.city} onChange={(event) => updateForm('city', event.target.value)} />
          <TextField label="Data de cadastro" value={form.joinedAt} onChange={(event) => updateForm('joinedAt', event.target.value)} />
          <TextField label="Ultima corrida" value={form.lastRide} onChange={(event) => updateForm('lastRide', event.target.value)} />
          <TextField label="Regiao preferida" value={form.preferredRegion} onChange={(event) => updateForm('preferredRegion', event.target.value)} />
          <TextField
            label="Corridas"
            type="number"
            value={form.rides}
            onChange={(event) => updateForm('rides', Number(event.target.value))}
          />
          <TextField
            label="Avaliacao"
            type="number"
            value={form.rating}
            onChange={(event) => updateForm('rating', Number(event.target.value))}
            inputProps={{ step: 0.1, min: 0, max: 5 }}
          />
          <TextField
            label="Gasto no mes"
            type="number"
            value={form.monthlySpend}
            onChange={(event) => updateForm('monthlySpend', Number(event.target.value))}
          />

          <FormControl>
            <InputLabel id="passenger-tier-label">Categoria</InputLabel>
            <Select
              labelId="passenger-tier-label"
              label="Categoria"
              value={form.tier}
              onChange={(event) => updateForm('tier', event.target.value as PassengerTier)}
            >
              <MenuItem value="Regular">Regular</MenuItem>
              <MenuItem value="Prata">Prata</MenuItem>
              <MenuItem value="Ouro">Ouro</MenuItem>
              <MenuItem value="VIP">VIP</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="passenger-status-label">Status</InputLabel>
            <Select
              labelId="passenger-status-label"
              label="Status"
              value={form.status}
              onChange={(event) => updateForm('status', event.target.value as PassengerStatus)}
            >
              <MenuItem value="Ativo">Ativo</MenuItem>
              <MenuItem value="Inativo">Inativo</MenuItem>
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Bloqueado">Bloqueado</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="passenger-payment-label">Pagamentos</InputLabel>
            <Select
              multiple
              labelId="passenger-payment-label"
              label="Pagamentos"
              value={form.payments}
              onChange={(event) => {
                const value = event.target.value
                updateForm('payments', typeof value === 'string' ? (value.split(',') as PassengerPayment[]) : (value as PassengerPayment[]))
              }}
              renderValue={(selected) => (selected as PassengerPayment[]).join(', ')}
            >
              {paymentOptions.map((payment) => (
                <MenuItem key={payment} value={payment}>
                  <Checkbox checked={form.payments.includes(payment)} />
                  <ListItemText primary={payment} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onSave(form)} disabled={!form.name || !form.phone || form.payments.length === 0}>
          Salvar alteracoes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function PassengerInfo({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={700} sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  )
}

function PassengerPaymentInfo({ payments }: { payments: PassengerPayment[] }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      <Typography color="text.secondary">Formas de pagamento</Typography>
      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
        <PaymentBadges payments={payments} />
      </Stack>
    </Box>
  )
}

function PassengerMetric({ title, value }: { title: string; value: string }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      <Typography color="text.secondary" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ mt: 0.75 }}>
        {value}
      </Typography>
    </Box>
  )
}

function PaymentBadges({ payments }: { payments: PassengerPayment[] }) {
  return (
    <>
      {payments.map((payment) => (
        <PassengerBadge key={payment} label={payment} palette={paymentPalette[payment]} />
      ))}
    </>
  )
}

function SortableHeader({
  active,
  direction,
  label,
  onClick,
}: {
  active: boolean
  direction: SortDirection
  label: string
  onClick: () => void
}) {
  return (
    <TableCell>
      <TableSortLabel active={active} direction={active ? direction : 'asc'} onClick={onClick}>
        {label}
      </TableSortLabel>
    </TableCell>
  )
}

function PassengerBadge({ label, palette }: { label: string; palette: BadgePalette }) {
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
