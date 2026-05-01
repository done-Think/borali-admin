import { useEffect, useMemo, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import BlockIcon from '@mui/icons-material/Block'
import CloseIcon from '@mui/icons-material/Close'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined'
import SearchIcon from '@mui/icons-material/Search'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableSortLabel,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { supportTickets } from '@shared/mocks/supportTickets'
import { useLocation, useNavigate } from 'react-router'

type DriverFilter = 'all' | 'online' | 'approved' | 'pending' | 'blocked'
type DriverCategory = 'Conforto' | 'Econômico' | 'Executivo'
type DriverCategoryFilter = 'all' | DriverCategory
type DriverStatus = 'Online' | 'Offline' | 'Pendente' | 'Bloqueado'
type DriverSubscription = 'Pro' | 'Básico' | 'Premium' | 'Trial'
type DriverSortKey = 'category' | 'status' | 'rides' | 'rating' | 'subscription' | 'monthlyEarnings'
type SortDirection = 'asc' | 'desc'

type DriversLocationState = {
  openNewDriverDialog?: boolean
  expandedRequestId?: string
  selectedDriverId?: string
  selectedDriverName?: string
  selectedDriverTab?: number
}

type Driver = {
  id: string
  name: string
  initials: string
  phone: string
  category: DriverCategory
  status: DriverStatus
  rides: number
  rating: number
  subscription: DriverSubscription
  monthlyEarnings: number
}

type DriverDetails = {
  photoLabel: string
  cpf: string
  email: string
  city: string
  vehicle: string
  plate: string
  joinedAt: string
  lastOnline: string
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
    earnings: number
    rating: number
    cancellationRate: number
  }
}

type DriverRide = DriverDetails['rideHistory'][number]

type DriverEditForm = Driver & {
  cpf: string
  email: string
  city: string
  vehicle: string
  plate: string
  joinedAt: string
  lastOnline: string
}

type DriverRequest = DriverEditForm & {
  requestId: string
  requestedAt: string
  attachments: Array<{
    name: string
    type: string
  }>
}

const drivers: Driver[] = [
  {
    id: 'DRV-1001',
    name: 'Renato Almeida',
    initials: 'RA',
    phone: '(21) 99218-4402',
    category: 'Conforto',
    status: 'Online',
    rides: 742,
    rating: 4.9,
    subscription: 'Pro',
    monthlyEarnings: 8420,
  },
  {
    id: 'DRV-1002',
    name: 'Patrícia Nogueira',
    initials: 'PN',
    phone: '(41) 99731-6508',
    category: 'Econômico',
    status: 'Online',
    rides: 519,
    rating: 4.8,
    subscription: 'Premium',
    monthlyEarnings: 6920,
  },
  {
    id: 'DRV-1003',
    name: 'Bruno Martins',
    initials: 'BM',
    phone: '(11) 98140-2208',
    category: 'Executivo',
    status: 'Offline',
    rides: 386,
    rating: 4.6,
    subscription: 'Básico',
    monthlyEarnings: 5140,
  },
  {
    id: 'DRV-1004',
    name: 'Carla Teixeira',
    initials: 'CT',
    phone: '(31) 98418-5530',
    category: 'Conforto',
    status: 'Pendente',
    rides: 24,
    rating: 4.2,
    subscription: 'Trial',
    monthlyEarnings: 760,
  },
  {
    id: 'DRV-1005',
    name: 'Diego Ramos',
    initials: 'DR',
    phone: '(51) 99172-3019',
    category: 'Econômico',
    status: 'Bloqueado',
    rides: 211,
    rating: 3.8,
    subscription: 'Básico',
    monthlyEarnings: 0,
  },
  {
    id: 'DRV-1006',
    name: 'Fernanda Lima',
    initials: 'FL',
    phone: '(85) 99810-1247',
    category: 'Executivo',
    status: 'Online',
    rides: 904,
    rating: 4.95,
    subscription: 'Premium',
    monthlyEarnings: 11890,
  },
  {
    id: 'DRV-1007',
    name: 'Gustavo Moreira',
    initials: 'GM',
    phone: '(62) 98845-9012',
    category: 'Conforto',
    status: 'Offline',
    rides: 332,
    rating: 4.5,
    subscription: 'Pro',
    monthlyEarnings: 4290,
  },
  {
    id: 'DRV-1008',
    name: 'Helena Duarte',
    initials: 'HD',
    phone: '(19) 99341-8821',
    category: 'Econômico',
    status: 'Pendente',
    rides: 12,
    rating: 4.1,
    subscription: 'Trial',
    monthlyEarnings: 340,
  },
  {
    id: 'DRV-1009',
    name: 'Igor Santana',
    initials: 'IS',
    phone: '(71) 98720-4410',
    category: 'Executivo',
    status: 'Online',
    rides: 621,
    rating: 4.7,
    subscription: 'Pro',
    monthlyEarnings: 9030,
  },
  {
    id: 'DRV-1010',
    name: 'Juliana Freitas',
    initials: 'JF',
    phone: '(48) 99670-1123',
    category: 'Conforto',
    status: 'Offline',
    rides: 288,
    rating: 4.3,
    subscription: 'Básico',
    monthlyEarnings: 3810,
  },
  {
    id: 'DRV-4211',
    name: 'Rafael Souza',
    initials: 'RS',
    phone: '(11) 98421-4402',
    category: 'Conforto',
    status: 'Online',
    rides: 684,
    rating: 4.9,
    subscription: 'Pro',
    monthlyEarnings: 8120,
  },
  {
    id: 'DRV-4210',
    name: 'Bianca Costa',
    initials: 'BC',
    phone: '(11) 98420-4402',
    category: 'Conforto',
    status: 'Online',
    rides: 438,
    rating: 4.8,
    subscription: 'Premium',
    monthlyEarnings: 6760,
  },
  {
    id: 'DRV-4209',
    name: 'Luis Prado',
    initials: 'LP',
    phone: '(11) 98409-4402',
    category: 'Executivo',
    status: 'Offline',
    rides: 512,
    rating: 4.7,
    subscription: 'Pro',
    monthlyEarnings: 7340,
  },
  {
    id: 'DRV-4208',
    name: 'Clara Alves',
    initials: 'CA',
    phone: '(11) 98408-4402',
    category: 'Conforto',
    status: 'Online',
    rides: 361,
    rating: 4.85,
    subscription: 'Premium',
    monthlyEarnings: 5890,
  },
  {
    id: 'DRV-4207',
    name: 'Andre Mota',
    initials: 'AM',
    phone: '(11) 98407-4402',
    category: 'Executivo',
    status: 'Online',
    rides: 729,
    rating: 4.75,
    subscription: 'Pro',
    monthlyEarnings: 9270,
  },
]

const driverRequests: DriverRequest[] = [
  {
    requestId: 'REQ-2026-0428-01',
    id: 'DRV-1011',
    name: 'Samuel Andrade',
    initials: 'SA',
    phone: '(11) 98244-1188',
    category: 'Conforto',
    status: 'Pendente',
    rides: 0,
    rating: 0,
    subscription: 'Trial',
    monthlyEarnings: 0,
    cpf: '840.217.390-12',
    email: 'samuel.andrade@email.com',
    city: 'São Paulo, SP',
    vehicle: 'Hyundai HB20 2023',
    plate: 'SMA-2D18',
    joinedAt: '28/04/2026',
    lastOnline: 'Ainda não aprovado',
    requestedAt: '28/04/2026 às 10:12',
    attachments: [
      { name: 'cnh-samuel.png', type: 'CNH' },
      { name: 'documento-veiculo.pdf', type: 'Documento' },
      { name: 'selfie-cadastro.jpg', type: 'Foto' },
    ],
  },
  {
    requestId: 'REQ-2026-0428-02',
    id: 'DRV-1012',
    name: 'Tainá Ribeiro',
    initials: 'TR',
    phone: '(21) 99830-7741',
    category: 'Executivo',
    status: 'Pendente',
    rides: 0,
    rating: 0,
    subscription: 'Trial',
    monthlyEarnings: 0,
    cpf: '219.684.730-55',
    email: 'taina.ribeiro@email.com',
    city: 'Rio de Janeiro, RJ',
    vehicle: 'Jeep Compass 2022',
    plate: 'TRB-9A42',
    joinedAt: '28/04/2026',
    lastOnline: 'Ainda não aprovado',
    requestedAt: '28/04/2026 às 11:03',
    attachments: [
      { name: 'cnh-taina.jpg', type: 'CNH' },
      { name: 'comprovante-residencia.png', type: 'Comprovante' },
    ],
  },
  {
    requestId: 'REQ-2026-0428-03',
    id: 'DRV-1013',
    name: 'Carla Teixeira',
    initials: 'CT',
    phone: '(31) 98418-5530',
    category: 'Econômico',
    status: 'Pendente',
    rides: 0,
    rating: 0,
    subscription: 'Trial',
    monthlyEarnings: 0,
    cpf: '501.738.920-44',
    email: 'carla.teixeira@email.com',
    city: 'Belo Horizonte, MG',
    vehicle: 'Toyota Corolla 2021',
    plate: 'CTE-7H21',
    joinedAt: '29/04/2026',
    lastOnline: 'Ainda não aprovado',
    requestedAt: 'Ontem às 18:40',
    attachments: [
      { name: 'cnh-carla.pdf', type: 'CNH' },
      { name: 'crlv-corolla.pdf', type: 'Documento' },
      { name: 'selfie-carla.jpg', type: 'Foto' },
    ],
  },
]

const driverDetailsById: Record<string, DriverDetails> = {
  'DRV-1001': {
    photoLabel: 'Foto do motorista Renato Almeida',
    cpf: '118.482.319-44',
    email: 'renato.almeida@email.com',
    city: 'Rio de Janeiro, RJ',
    vehicle: 'Toyota Corolla 2022',
    plate: 'RTA-4B21',
    joinedAt: '03/08/2023',
    lastOnline: 'Hoje às 14:18',
    rideHistory: [
      { id: 'BRL-84007', date: '28/04/2026', from: 'Copacabana', to: 'Santos Dumont', value: 48, status: 'Finalizada' },
      { id: 'BRL-83980', date: '27/04/2026', from: 'Barra da Tijuca', to: 'Centro', value: 72, status: 'Finalizada' },
      { id: 'BRL-83892', date: '26/04/2026', from: 'Ipanema', to: 'Botafogo', value: 36, status: 'Finalizada' },
    ],
    complaints: [],
    monthlyAverage: {
      rides: 148,
      earnings: 8420,
      rating: 4.9,
      cancellationRate: 2.8,
    },
  },
  'DRV-1002': {
    photoLabel: 'Foto da motorista Patrícia Nogueira',
    cpf: '591.240.318-67',
    email: 'patricia.nogueira@email.com',
    city: 'Curitiba, PR',
    vehicle: 'Honda City 2021',
    plate: 'PNR-8C44',
    joinedAt: '06/06/2024',
    lastOnline: 'Hoje às 13:40',
    rideHistory: [
      { id: 'BRL-83640', date: '27/04/2026', from: 'Batel', to: 'Centro Cívico', value: 32, status: 'Finalizada' },
      { id: 'BRL-83598', date: '26/04/2026', from: 'Água Verde', to: 'Aeroporto Afonso Pena', value: 66, status: 'Finalizada' },
    ],
    complaints: [],
    monthlyAverage: {
      rides: 104,
      earnings: 6920,
      rating: 4.8,
      cancellationRate: 1.9,
    },
  },
  'DRV-4211': {
    photoLabel: 'Foto do motorista Rafael Souza',
    cpf: '118.421.100-11',
    email: 'rafael.souza@email.com',
    city: 'Sao Paulo, SP',
    vehicle: 'Toyota Corolla 2022',
    plate: 'BRL-11A',
    joinedAt: '14/02/2024',
    lastOnline: 'Agora',
    rideHistory: [
      { id: 'BRL-84211', date: '01/05/2026', from: 'Av. Paulista, 1578', to: 'Centro Historico', value: 48.9, status: 'Finalizada' },
      { id: 'BRL-84172', date: '30/04/2026', from: 'Jardins', to: 'Vila Mariana', value: 34, status: 'Finalizada' },
    ],
    complaints: [],
    monthlyAverage: { rides: 137, earnings: 8120, rating: 4.9, cancellationRate: 2.2 },
  },
  'DRV-4210': {
    photoLabel: 'Foto da motorista Bianca Costa',
    cpf: '118.421.000-10',
    email: 'bianca.costa@email.com',
    city: 'Sao Paulo, SP',
    vehicle: 'Honda City 2021',
    plate: 'BRL-10A',
    joinedAt: '03/09/2024',
    lastOnline: 'Hoje as 15:10',
    rideHistory: [
      { id: 'BRL-84210', date: '01/05/2026', from: 'Moema', to: 'Aeroporto de Congonhas', value: 36.5, status: 'Finalizada' },
      { id: 'BRL-84163', date: '30/04/2026', from: 'Ibirapuera', to: 'Brooklin', value: 29, status: 'Finalizada' },
    ],
    complaints: [],
    monthlyAverage: { rides: 88, earnings: 6760, rating: 4.8, cancellationRate: 2.6 },
  },
  'DRV-4209': {
    photoLabel: 'Foto do motorista Luis Prado',
    cpf: '118.420.900-09',
    email: 'luis.prado@email.com',
    city: 'Sao Paulo, SP',
    vehicle: 'Toyota Corolla 2022',
    plate: 'BRL-09A',
    joinedAt: '21/05/2024',
    lastOnline: 'Hoje as 13:52',
    rideHistory: [
      { id: 'BRL-84209', date: '01/05/2026', from: 'Pinheiros', to: 'Itaim Bibi', value: 29.8, status: 'Finalizada com alerta' },
      { id: 'BRL-84158', date: '29/04/2026', from: 'Lapa', to: 'Perdizes', value: 31, status: 'Finalizada' },
    ],
    complaints: [{ id: 'OCC-84209-1', date: '01/05/2026', title: 'Desvio de rota reportado', status: 'Em analise' }],
    monthlyAverage: { rides: 102, earnings: 7340, rating: 4.7, cancellationRate: 3.4 },
  },
  'DRV-4208': {
    photoLabel: 'Foto da motorista Clara Alves',
    cpf: '118.420.800-08',
    email: 'clara.alves@email.com',
    city: 'Sao Paulo, SP',
    vehicle: 'Honda City 2021',
    plate: 'BRL-08A',
    joinedAt: '10/11/2024',
    lastOnline: 'Agora',
    rideHistory: [
      { id: 'BRL-84208', date: '01/05/2026', from: 'Vila Madalena', to: 'Se', value: 42.2, status: 'Finalizada' },
      { id: 'BRL-84149', date: '29/04/2026', from: 'Sumare', to: 'Paulista', value: 25, status: 'Finalizada' },
    ],
    complaints: [],
    monthlyAverage: { rides: 72, earnings: 5890, rating: 4.85, cancellationRate: 2.1 },
  },
  'DRV-4207': {
    photoLabel: 'Foto do motorista Andre Mota',
    cpf: '118.420.700-07',
    email: 'andre.mota@email.com',
    city: 'Sao Paulo, SP',
    vehicle: 'Toyota Corolla 2022',
    plate: 'BRL-07A',
    joinedAt: '08/01/2024',
    lastOnline: 'Hoje as 14:44',
    rideHistory: [
      { id: 'BRL-84207', date: '01/05/2026', from: 'Tatuape', to: 'Jardins', value: 64.7, status: 'Finalizada com ocorrencia' },
      { id: 'BRL-84131', date: '28/04/2026', from: 'Mooca', to: 'Vila Olimpia', value: 52, status: 'Finalizada' },
    ],
    complaints: [{ id: 'OCC-84207-1', date: '01/05/2026', title: 'Discussao no desembarque', status: 'Encaminhada' }],
    monthlyAverage: { rides: 146, earnings: 9270, rating: 4.75, cancellationRate: 3.8 },
  },
}

const filters: Array<{ value: DriverFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'online', label: 'Online (31)' },
  { value: 'approved', label: 'Aprovados' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'blocked', label: 'Bloqueados' },
]

const categorySortOrder: Record<DriverCategory, number> = {
  Executivo: 1,
  Conforto: 2,
  Econômico: 3,
}

const statusSortOrder: Record<DriverStatus, number> = {
  Online: 1,
  Offline: 2,
  Pendente: 3,
  Bloqueado: 4,
}

const subscriptionSortOrder: Record<DriverSubscription, number> = {
  Premium: 1,
  Pro: 2,
  Básico: 3,
  Trial: 4,
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

function getDriverSortValue(driver: Driver, key: DriverSortKey) {
  if (key === 'category') {
    return categorySortOrder[driver.category]
  }

  if (key === 'status') {
    return statusSortOrder[driver.status]
  }

  if (key === 'subscription') {
    return subscriptionSortOrder[driver.subscription]
  }

  return driver[key]
}

function getDriverComplaints(driver: Driver, fallbackComplaints: DriverDetails['complaints'] = []) {
  const linkedComplaints = supportTickets
    .filter(
      (ticket) =>
        ticket.user.role === 'driver' &&
        (ticket.user.driverId === driver.id || ticket.user.phone === driver.phone || ticket.user.email === getDriverDetailsBase(driver).email),
    )
    .map((ticket) => ({
      id: ticket.protocol,
      date: ticket.occurrence.createdAt.split(' às ')[0],
      title: ticket.occurrence.title,
      status: ticket.status,
    }))

  return linkedComplaints.length > 0 ? linkedComplaints : fallbackComplaints
}

function getDriverDetailsBase(driver: Driver): DriverDetails {
  return (
    driverDetailsById[driver.id] ?? {
      photoLabel: `Foto do motorista ${driver.name}`,
      cpf: '000.000.000-00',
      email: `${normalizeSearch(driver.name).replace(/\s+/g, '.')}@email.com`,
      city: 'São Paulo, SP',
      vehicle: 'Veículo cadastrado',
      plate: 'BRL-0000',
      joinedAt: '10/01/2025',
      lastOnline: driver.status === 'Online' ? 'Agora' : 'Sem atividade recente',
      rideHistory: [
        { id: 'BRL-83010', date: '25/04/2026', from: 'Centro', to: 'Zona Sul', value: 42, status: 'Finalizada' },
        { id: 'BRL-82977', date: '24/04/2026', from: 'Aeroporto', to: 'Hotel', value: 58, status: 'Finalizada' },
      ],
      complaints:
        driver.status === 'Bloqueado'
          ? [{ id: 'REC-1180', date: '18/04/2026', title: 'Conduta em análise pelo suporte', status: 'Aberta' }]
          : [],
      monthlyAverage: {
        rides: Math.max(12, Math.round(driver.rides / 5)),
        earnings: driver.monthlyEarnings,
        rating: driver.rating,
        cancellationRate: driver.status === 'Bloqueado' ? 9.4 : 3.1,
      },
    }
  )
}

function getDriverDetails(driver: Driver, override?: Partial<DriverDetails>): DriverDetails {
  const details = getDriverDetailsBase(driver)
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
    complaints: getDriverComplaints(driver, mergedDetails.complaints),
  }
}

function getDriverRideDetails(ride: DriverRide) {
  const details: Record<string, { duration: string; distance: string; path: string[] }> = {
    'BRL-84007': {
      duration: '32 min',
      distance: '13,2 km',
      path: ['Copacabana', 'Aterro do Flamengo', 'Santos Dumont'],
    },
    'BRL-83980': {
      duration: '46 min',
      distance: '24,8 km',
      path: ['Barra da Tijuca', 'Linha Amarela', 'Centro'],
    },
    'BRL-83892': {
      duration: '18 min',
      distance: '7,4 km',
      path: ['Ipanema', 'Lagoa', 'Botafogo'],
    },
    'BRL-83640': {
      duration: '16 min',
      distance: '6,1 km',
      path: ['Batel', 'Praca do Japao', 'Centro Civico'],
    },
    'BRL-83598': {
      duration: '38 min',
      distance: '18,9 km',
      path: ['Agua Verde', 'BR-277', 'Aeroporto Afonso Pena'],
    },
    'BRL-83010': {
      duration: '24 min',
      distance: '9,6 km',
      path: ['Centro', 'Corredor principal', 'Zona Sul'],
    },
    'BRL-82977': {
      duration: '29 min',
      distance: '12,1 km',
      path: ['Aeroporto', 'Via expressa', 'Hotel'],
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

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export default function DriversPage() {
  const theme = useTheme()
  const location = useLocation()
  const locationState = location.state as DriversLocationState | null
  const [driverRows, setDriverRows] = useState(drivers)
  const [driverDetailsOverrides, setDriverDetailsOverrides] = useState<Record<string, Partial<DriverDetails>>>({})
  const [search, setSearch] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<DriverFilter>('all')
  const [selectedCategory, setSelectedCategory] = useState<DriverCategoryFilter>('all')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<DriverSortKey | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [showNewDriverDialog, setShowNewDriverDialog] = useState(false)
  const [manualDriverDraft, setManualDriverDraft] = useState<DriverRequest | null>(null)
  const [pendingDriverRequests, setPendingDriverRequests] = useState(driverRequests)
  const [driverDetailsTab, setDriverDetailsTab] = useState(0)
  const rowsPerPage = 5

  useEffect(() => {
    if (locationState?.openNewDriverDialog) {
      setShowNewDriverDialog(true)
    }
  }, [locationState?.openNewDriverDialog])

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

    setDriverRows((currentRows) =>
      currentRows.map((driver) => (driver.id === updatedDriver.id ? updatedDriver : driver)),
    )
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

    setDriverRows((currentRows) =>
      currentRows.map((currentDriver) =>
        currentDriver.id === driver.id
          ? {
              ...currentDriver,
              status: updatedStatus,
            }
          : currentDriver,
      ),
    )

    setSelectedDriver((currentDriver) =>
      currentDriver?.id === driver.id
        ? {
            ...currentDriver,
            status: updatedStatus,
          }
        : currentDriver,
    )
  }

  function createManualDriverDraft() {
    const nextId = `DRV-${String(1011 + driverRows.length + pendingDriverRequests.length).padStart(4, '0')}`

    setManualDriverDraft({
      requestId: `MANUAL-${Date.now()}`,
      id: nextId,
      name: '',
      initials: '',
      phone: '',
      category: 'Econômico',
      status: 'Offline',
      rides: 0,
      rating: 0,
      subscription: 'Trial',
      monthlyEarnings: 0,
      cpf: '',
      email: '',
      city: '',
      vehicle: '',
      plate: '',
      joinedAt: '28/04/2026',
      lastOnline: 'Cadastro manual',
      requestedAt: 'Cadastro manual',
      attachments: [],
    })
  }

  function addDriverFromForm(form: DriverEditForm) {
    const newDriver: Driver = {
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

    setDriverRows((currentRows) => [newDriver, ...currentRows])
    setDriverDetailsOverrides((currentOverrides) => ({
      ...currentOverrides,
      [newDriver.id]: {
        photoLabel: `Foto do motorista ${newDriver.name}`,
        cpf: form.cpf,
        email: form.email,
        city: form.city,
        vehicle: form.vehicle,
        plate: form.plate,
        joinedAt: form.joinedAt,
        lastOnline: form.lastOnline,
      },
    }))
    setManualDriverDraft(null)
    setShowNewDriverDialog(false)
    setSelectedFilter('all')
    setPage(1)
  }

  function approveDriverRequest(request: DriverRequest) {
    addDriverFromForm({
      ...request,
      status: 'Offline',
      rating: 5,
    })
    setPendingDriverRequests((currentRequests) =>
      currentRequests.filter((currentRequest) => currentRequest.requestId !== request.requestId),
    )
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

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowNewDriverDialog(true)}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            minHeight: 42,
            px: 2,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          Novo motorista
        </Button>
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
                count={5}
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
        detailsOverride={selectedDriver ? driverDetailsOverrides[selectedDriver.id] : undefined}
        tab={driverDetailsTab}
        onTabChange={setDriverDetailsTab}
        onClose={() => setSelectedDriver(null)}
      />
      <DriverEditDialog
        driver={editingDriver}
        detailsOverride={editingDriver ? driverDetailsOverrides[editingDriver.id] : undefined}
        onClose={() => setEditingDriver(null)}
        onSave={handleSaveDriver}
      />
      <NewDriverDialog
        open={showNewDriverDialog}
        requests={pendingDriverRequests}
        initialExpandedRequestId={locationState?.expandedRequestId}
        onClose={() => setShowNewDriverDialog(false)}
        onCreateManual={createManualDriverDraft}
        onApprove={approveDriverRequest}
      />
      <DriverEditDialog
        driver={manualDriverDraft}
        mode="create"
        onClose={() => setManualDriverDraft(null)}
        onSave={addDriverFromForm}
      />
    </Stack>
  )
}

type BadgePalette = {
  color: string
  background: string
  border: string
}

const categoryPalette: Record<DriverCategory, BadgePalette> = {
  Conforto: {
    color: '#0ABEE9',
    background: 'rgba(10, 190, 233, 0.12)',
    border: 'rgba(10, 190, 233, 0.36)',
  },
  Econômico: {
    color: '#22C55E',
    background: 'rgba(34, 197, 94, 0.12)',
    border: 'rgba(34, 197, 94, 0.36)',
  },
  Executivo: {
    color: '#F59E0B',
    background: 'rgba(245, 158, 11, 0.14)',
    border: 'rgba(245, 158, 11, 0.38)',
  },
}

const statusPalette: Record<DriverStatus, BadgePalette> = {
  Online: {
    color: '#22C55E',
    background: 'rgba(34, 197, 94, 0.12)',
    border: 'rgba(34, 197, 94, 0.36)',
  },
  Offline: {
    color: '#6B7280',
    background: 'rgba(107, 114, 128, 0.12)',
    border: 'rgba(107, 114, 128, 0.32)',
  },
  Pendente: {
    color: '#F59E0B',
    background: 'rgba(245, 158, 11, 0.14)',
    border: 'rgba(245, 158, 11, 0.38)',
  },
  Bloqueado: {
    color: '#EF4444',
    background: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.36)',
  },
}

const subscriptionPalette: Record<DriverSubscription, BadgePalette> = {
  Pro: {
    color: '#8B5CF6',
    background: 'rgba(139, 92, 246, 0.12)',
    border: 'rgba(139, 92, 246, 0.36)',
  },
  Básico: {
    color: '#0ABEE9',
    background: 'rgba(10, 190, 233, 0.12)',
    border: 'rgba(10, 190, 233, 0.36)',
  },
  Premium: {
    color: '#D97706',
    background: 'rgba(245, 158, 11, 0.16)',
    border: 'rgba(217, 119, 6, 0.38)',
  },
  Trial: {
    color: '#6B7280',
    background: 'rgba(107, 114, 128, 0.12)',
    border: 'rgba(107, 114, 128, 0.32)',
  },
}

function DriverDetailsDialog({
  driver,
  detailsOverride,
  tab,
  onTabChange,
  onClose,
}: {
  driver: Driver | null
  detailsOverride?: Partial<DriverDetails>
  tab: number
  onTabChange: (value: number) => void
  onClose: () => void
}) {
  const theme = useTheme()
  const navigate = useNavigate()
  const [selectedRide, setSelectedRide] = useState<DriverRide | null>(null)

  if (!driver) {
    return null
  }

  const details = getDriverDetails(driver, detailsOverride)

  return (
    <Dialog open={Boolean(driver)} onClose={onClose} fullWidth maxWidth="lg">
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
              {driver.initials}
            </Avatar>
            <Box>
              <Typography variant="h4">{driver.name}</Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                <DriverBadge label={driver.category} palette={categoryPalette[driver.category]} />
                <DriverBadge label={driver.status} palette={statusPalette[driver.status]} />
                <DriverBadge label={driver.subscription} palette={subscriptionPalette[driver.subscription]} />
              </Stack>
            </Box>
          </Stack>

          <IconButton aria-label="Fechar detalhes do motorista" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Tabs value={tab} onChange={(_, value) => onTabChange(value)} variant="scrollable" scrollButtons="auto" sx={{ mb: 3 }}>
          <Tab label="Cadastro" />
          <Tab label="Histórico de corridas" />
          <Tab label="Reclamações" />
          <Tab label="Média mensal" />
        </Tabs>

        {tab === 0 && (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            }}
          >
            <DriverInfo label="Nome completo" value={driver.name} />
            <DriverInfo label="CPF" value={details.cpf} />
            <DriverInfo label="Telefone" value={driver.phone} />
            <DriverInfo label="E-mail" value={details.email} />
            <DriverInfo label="Cidade" value={details.city} />
            <DriverInfo label="Data de cadastro" value={details.joinedAt} />
            <DriverInfo label="Veículo" value={details.vehicle} />
            <DriverInfo label="Placa" value={details.plate} />
            <DriverInfo label="Último online" value={details.lastOnline} />
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
                      <Typography fontWeight={700}>{ride.from} → {ride.to}</Typography>
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
              <Box
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                }}
              >
                <Typography fontWeight={700}>Sem reclamações registradas</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Este motorista não possui reclamações no histórico mockado.
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
                    <Chip label={complaint.status} color={complaint.status === 'Aberta' ? 'warning' : 'success'} variant="outlined" />
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
            <DriverMetric title="Corridas/mês" value={numberFormatter.format(details.monthlyAverage.rides)} />
            <DriverMetric title="Ganhos/mês" value={currencyFormatter.format(details.monthlyAverage.earnings)} />
            <DriverMetric title="Avaliação média" value={details.monthlyAverage.rating.toFixed(1)} />
            <DriverMetric title="Cancelamentos" value={`${details.monthlyAverage.cancellationRate.toFixed(1)}%`} />
          </Box>
        )}
      </DialogContent>
      <DriverRideDetailsDialog ride={selectedRide} onClose={() => setSelectedRide(null)} />
    </Dialog>
  )
}

function DriverRideDetailsDialog({ ride, onClose }: { ride: DriverRide | null; onClose: () => void }) {
  const theme = useTheme()

  if (!ride) {
    return null
  }

  const details = getDriverRideDetails(ride)

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
            <DriverInfo label="Tempo de corrida" value={details.duration} />
            <DriverInfo label="Distancia percorrida" value={details.distance} />
            <DriverInfo label="Valor" value={currencyFormatter.format(ride.value)} />
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

function DriverInfo({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={700} sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  )
}

function DriverEditDialog({
  driver,
  detailsOverride,
  mode = 'edit',
  onClose,
  onSave,
}: {
  driver: Driver | null
  detailsOverride?: Partial<DriverDetails>
  mode?: 'edit' | 'create'
  onClose: () => void
  onSave: (form: DriverEditForm) => void
}) {
  const [form, setForm] = useState<DriverEditForm | null>(null)

  useEffect(() => {
    if (!driver) {
      setForm(null)
      return
    }

    const details = getDriverDetails(driver, detailsOverride)
    setForm({
      ...driver,
      cpf: formatCpf(details.cpf),
      email: details.email,
      city: details.city,
      vehicle: details.vehicle,
      plate: details.plate,
      joinedAt: details.joinedAt,
      lastOnline: details.lastOnline,
    })
  }, [detailsOverride, driver])

  if (!driver || !form) {
    return null
  }

  function updateForm<Key extends keyof DriverEditForm>(key: Key, value: DriverEditForm[Key]) {
    setForm((currentForm) => (currentForm ? { ...currentForm, [key]: value } : currentForm))
  }

  return (
    <Dialog open={Boolean(driver)} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4">
              {mode === 'create' ? 'Cadastrar novo motorista' : 'Editar cadastro do motorista'}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {mode === 'create'
                ? 'Preencha os dados para criar um cadastro manual.'
                : `Altere qualquer informação cadastral de ${driver.name}.`}
            </Typography>
          </Box>
          <IconButton aria-label="Fechar edição do motorista" onClick={onClose}>
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
          <TextField label="Veículo" value={form.vehicle} onChange={(event) => updateForm('vehicle', event.target.value)} />
          <TextField label="Placa" value={form.plate} onChange={(event) => updateForm('plate', event.target.value)} />
          <TextField label="Data de cadastro" value={form.joinedAt} onChange={(event) => updateForm('joinedAt', event.target.value)} />
          <TextField label="Último online" value={form.lastOnline} onChange={(event) => updateForm('lastOnline', event.target.value)} />
          <TextField
            label="Corridas"
            type="number"
            value={form.rides}
            onChange={(event) => updateForm('rides', Number(event.target.value))}
          />
          <TextField
            label="Avaliação"
            type="number"
            value={form.rating}
            onChange={(event) => updateForm('rating', Number(event.target.value))}
            inputProps={{ step: 0.1, min: 0, max: 5 }}
          />
          <TextField
            label="Ganhos no mês"
            type="number"
            value={form.monthlyEarnings}
            onChange={(event) => updateForm('monthlyEarnings', Number(event.target.value))}
          />

          <FormControl>
            <InputLabel id="driver-category-label">Categoria</InputLabel>
            <Select
              labelId="driver-category-label"
              label="Categoria"
              value={form.category}
              onChange={(event) => updateForm('category', event.target.value as DriverCategory)}
            >
              <MenuItem value="Conforto">Conforto</MenuItem>
              <MenuItem value="Econômico">Econômico</MenuItem>
              <MenuItem value="Executivo">Executivo</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="driver-status-label">Status</InputLabel>
            <Select
              labelId="driver-status-label"
              label="Status"
              value={form.status}
              onChange={(event) => updateForm('status', event.target.value as DriverStatus)}
            >
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Bloqueado">Bloqueado</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="driver-subscription-label">Assinatura</InputLabel>
            <Select
              labelId="driver-subscription-label"
              label="Assinatura"
              value={form.subscription}
              onChange={(event) => updateForm('subscription', event.target.value as DriverSubscription)}
            >
              <MenuItem value="Pro">Pro</MenuItem>
              <MenuItem value="Básico">Básico</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
              <MenuItem value="Trial">Trial</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onSave(form)} disabled={!form.name || !form.phone}>
          {mode === 'create' ? 'Cadastrar motorista' : 'Salvar alterações'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function DriverMetric({ title, value }: { title: string; value: string }) {
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

function NewDriverDialog({
  open,
  requests,
  initialExpandedRequestId,
  onClose,
  onCreateManual,
  onApprove,
}: {
  open: boolean
  requests: DriverRequest[]
  initialExpandedRequestId?: string
  onClose: () => void
  onCreateManual: () => void
  onApprove: (request: DriverRequest) => void
}) {
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  const theme = useTheme()

  useEffect(() => {
    if (open) {
      setExpandedRequest(initialExpandedRequestId ?? null)
    }
  }, [initialExpandedRequestId, open])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4">Novo motorista</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Cadastre manualmente ou aprove pedidos recebidos pelo app.
            </Typography>
          </Box>
          <IconButton aria-label="Fechar novo motorista" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
          >
            <Box>
              <Typography fontWeight={700}>Cadastro manual</Typography>
              <Typography color="text.secondary">Crie um motorista preenchendo todos os dados do cadastro.</Typography>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateManual}>
              Cadastrar nós mesmos
            </Button>
          </Stack>

          <Divider />

          <Box>
            <Typography fontWeight={700}>Pedidos recebidos</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Cards iniciam minimizados; ao expandir, exibem cadastro completo e anexos enviados.
            </Typography>
          </Box>

          <Stack spacing={1.5}>
            {requests.length === 0 ? (
              <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 3, textAlign: 'center' }}>
                <Typography fontWeight={700}>Nenhum pedido pendente</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Todos os pedidos recebidos já foram analisados.
                </Typography>
              </Box>
            ) : (
              requests.map((request) => {
                const expanded = expandedRequest === request.requestId

                return (
                  <Card key={request.requestId} variant="outlined">
                    <CardContent>
                      <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        alignItems={{ xs: 'stretch', md: 'center' }}
                        justifyContent="space-between"
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              bgcolor: 'rgba(10, 190, 233, 0.12)',
                              color: theme.palette.secondary.main,
                              fontWeight: 700,
                            }}
                          >
                            {request.initials}
                          </Avatar>
                          <Box>
                            <Typography variant="h4">{request.name}</Typography>
                            <Typography color="text.secondary">
                              {request.cpf} | {request.phone}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="flex-end">
                          <Chip label={request.requestId} variant="outlined" />
                          <Button
                            size="small"
                            variant="outlined"
                            endIcon={
                              <ExpandMoreIcon
                                sx={{
                                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: theme.transitions.create('transform'),
                                }}
                              />
                            }
                            onClick={() => setExpandedRequest(expanded ? null : request.requestId)}
                          >
                            {expanded ? 'Recolher' : 'Expandir'}
                          </Button>
                        </Stack>
                      </Stack>

                      <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Box sx={{ mt: 3 }}>
                          <Box
                            sx={{
                              display: 'grid',
                              gap: 2,
                              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                            }}
                          >
                            <DriverInfo label="E-mail" value={request.email} />
                            <DriverInfo label="Cidade" value={request.city} />
                            <DriverInfo label="Solicitado em" value={request.requestedAt} />
                            <DriverInfo label="Categoria" value={request.category} />
                            <DriverInfo label="Veículo" value={request.vehicle} />
                            <DriverInfo label="Placa" value={request.plate} />
                          </Box>

                          <Box sx={{ mt: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                              <ImageOutlinedIcon color="primary" />
                              <Typography fontWeight={700}>Anexos enviados</Typography>
                              <Chip label={request.attachments.length} size="small" color="primary" variant="outlined" />
                            </Stack>

                            <Box
                              sx={{
                                display: 'grid',
                                gap: 1.5,
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
                              }}
                            >
                              {request.attachments.map((attachment) => (
                                <Box
                                  key={attachment.name}
                                  sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '64px 1fr',
                                    gap: 1.5,
                                    alignItems: 'center',
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 2,
                                    p: 1,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 64,
                                      height: 52,
                                      borderRadius: 1.5,
                                      display: 'grid',
                                      placeItems: 'center',
                                      color: theme.palette.secondary.main,
                                      background:
                                        'linear-gradient(135deg, rgba(10, 190, 233, 0.18), rgba(45, 212, 160, 0.16))',
                                    }}
                                  >
                                    <ImageOutlinedIcon />
                                  </Box>
                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography fontWeight={700} noWrap>
                                      {attachment.name}
                                    </Typography>
                                    <Typography color="text.secondary" variant="body2">
                                      {attachment.type} enviado
                                    </Typography>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          </Box>

                          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
                            <Button variant="outlined">Revisar depois</Button>
                            <Button variant="contained" onClick={() => onApprove(request)}>
                              Aprovar motorista
                            </Button>
                          </Stack>
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

function DriverBadge({ label, palette }: { label: string; palette: BadgePalette }) {
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
