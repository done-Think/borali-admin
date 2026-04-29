import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import TimelineIcon from '@mui/icons-material/Timeline'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import type { ReactElement } from 'react'
import type {
  ActiveRide,
  Activity,
  ActivityType,
  AlertRide,
  DriverApplication,
  DriverAvailability,
  HeatZone,
  KpiCard,
  MapMarker,
  RecentRide,
  RevenueComparison,
  RevenuePeriod,
  RideStatus,
} from '../types'
import { currencyFormatter } from '../utils/formatters'

export const kpiCards: KpiCard[] = [
  { id: 'active-rides', title: 'Corridas ativas', value: '38', subtitle: '+14% entrando agora', icon: <LocalTaxiIcon />, color: '#0ABEE9' },
  { id: 'online-drivers', title: 'Motoristas online', value: '214', subtitle: '+18 novos hoje', icon: <DirectionsCarIcon />, color: '#2DD4A0' },
  { id: 'daily-revenue', title: 'Receita do dia', value: currencyFormatter.format(18420), subtitle: '+8,4% vs. ontem', icon: <MonetizationOnIcon />, color: '#F59E0B' },
  { id: 'pending-approvals', title: 'Aprovacoes pend.', value: '17', subtitle: '5 expiram em 2h', icon: <PendingActionsIcon />, color: '#8B5CF6' },
  { id: 'alert-rides', title: 'Corrida em Alerta', value: '3', subtitle: '1 alerta critico agora', icon: <WarningAmberIcon />, color: '#EF4444' },
]

export const activeRides: ActiveRide[] = [
  {
    id: 'BRL-84211',
    driver: 'Rafael Souza',
    passenger: 'Marina Lopes',
    origin: 'Av. Paulista, 1578',
    destination: 'Centro Historico',
    value: 48.9,
    path: [[-23.5617, -46.6559], [-23.5569, -46.6482], [-23.5505, -46.6333], [-23.5446, -46.6271]],
    driverPosition: [-23.5569, -46.6482],
    passengerPosition: [-23.5446, -46.6271],
  },
  {
    id: 'BRL-84212',
    driver: 'Bianca Costa',
    passenger: 'Joao Lima',
    origin: 'Moema',
    destination: 'Aeroporto de Congonhas',
    value: 36.5,
    path: [[-23.6033, -46.6658], [-23.6142, -46.6611], [-23.6265, -46.6564], [-23.6269, -46.6566]],
    driverPosition: [-23.6142, -46.6611],
    passengerPosition: [-23.6269, -46.6566],
  },
  {
    id: 'BRL-84213',
    driver: 'Luis Prado',
    passenger: 'Ana Beatriz',
    origin: 'Pinheiros',
    destination: 'Itaim Bibi',
    value: 29.8,
    path: [[-23.5662, -46.7019], [-23.5695, -46.6872], [-23.5791, -46.6731], [-23.5844, -46.6785]],
    driverPosition: [-23.5695, -46.6872],
    passengerPosition: [-23.5844, -46.6785],
  },
  {
    id: 'BRL-84214',
    driver: 'Clara Alves',
    passenger: 'Pedro Rocha',
    origin: 'Vila Madalena',
    destination: 'Se',
    value: 42.2,
    path: [[-23.5546, -46.6909], [-23.5565, -46.6702], [-23.5502, -46.6508], [-23.5504, -46.6339]],
    driverPosition: [-23.5565, -46.6702],
    passengerPosition: [-23.5504, -46.6339],
  },
  {
    id: 'BRL-84215',
    driver: 'Andre Mota',
    passenger: 'Luiza Martins',
    origin: 'Tatuape',
    destination: 'Jardins',
    value: 64.7,
    path: [[-23.5409, -46.5766], [-23.5478, -46.6042], [-23.5583, -46.6354], [-23.5677, -46.6674]],
    driverPosition: [-23.5478, -46.6042],
    passengerPosition: [-23.5677, -46.6674],
  },
]

export const alertRides: AlertRide[] = [
  { id: 'BRL-84216', driver: 'Helena Duarte', passenger: 'Roberto Maia', origin: 'Rua Augusta, 900', destination: 'Barra Funda', value: 52.4, alertedBy: 'Passageiro', threatenedPerson: 'Roberto Maia', alertReason: 'Passageiro relatou desvio de rota e comportamento agressivo', alertTime: 'agora' },
  { id: 'BRL-84217', driver: 'Igor Santana', passenger: 'Patricia Nogueira', origin: 'Vila Olimpia', destination: 'Liberdade', value: 44.8, alertedBy: 'Motorista', threatenedPerson: 'Igor Santana', alertReason: 'Motorista acionou alerta por ameaca verbal durante a corrida', alertTime: 'ha 4 min' },
  { id: 'BRL-84218', driver: 'Diego Ramos', passenger: 'Fernanda Lima', origin: 'Santana', destination: 'Pinheiros', value: 71.2, alertedBy: 'Passageiro', threatenedPerson: 'Fernanda Lima', alertReason: 'Passageira se sentiu ameacada no embarque', alertTime: 'ha 9 min' },
]

export const driversAcceptingRides: DriverAvailability[] = [
  { id: 'DRV-1001', name: 'Renato Almeida', phone: '(21) 99218-4402', city: 'Rio de Janeiro, RJ', vehicle: 'Toyota Corolla 2022', lastSeen: 'aceitando agora' },
  { id: 'DRV-1002', name: 'Patricia Nogueira', phone: '(41) 99731-6508', city: 'Curitiba, PR', vehicle: 'Honda City 2021', lastSeen: 'aceitando ha 2 min' },
  { id: 'DRV-1006', name: 'Fernanda Lima', phone: '(85) 99810-1247', city: 'Sao Paulo, SP', vehicle: 'Jeep Compass 2022', lastSeen: 'aceitando ha 4 min' },
  { id: 'DRV-1009', name: 'Igor Santana', phone: '(71) 98720-4410', city: 'Sao Paulo, SP', vehicle: 'Toyota Corolla 2021', lastSeen: 'aceitando ha 6 min' },
]

export const driversAppOpenOnly: DriverAvailability[] = [
  { id: 'DRV-1003', name: 'Bruno Martins', phone: '(11) 98140-2208', city: 'Sao Paulo, SP', vehicle: 'Veiculo cadastrado', lastSeen: 'app aberto ha 3 min' },
  { id: 'DRV-1007', name: 'Gustavo Moreira', phone: '(62) 98845-9012', city: 'Sao Paulo, SP', vehicle: 'Veiculo cadastrado', lastSeen: 'app aberto ha 8 min' },
  { id: 'DRV-1010', name: 'Juliana Freitas', phone: '(48) 99670-1123', city: 'Sao Paulo, SP', vehicle: 'Veiculo cadastrado', lastSeen: 'app aberto ha 11 min' },
]

export const driverApplications: DriverApplication[] = [
  { id: 'REQ-2026-0428-01', name: 'Samuel Andrade', cpf: '840.217.390-12', phone: '(11) 98244-1188', email: 'samuel.andrade@email.com', city: 'Sao Paulo, SP', vehicle: 'Hyundai HB20 2023', plate: 'SMA-2D18', category: 'Conforto', requestedAt: 'Hoje as 10:12', expiresIn: 'expira em 2h' },
  { id: 'REQ-2026-0428-02', name: 'Taina Ribeiro', cpf: '219.684.730-55', phone: '(21) 99830-7741', email: 'taina.ribeiro@email.com', city: 'Rio de Janeiro, RJ', vehicle: 'Jeep Compass 2022', plate: 'TRB-9A42', category: 'Executivo', requestedAt: 'Hoje as 11:03', expiresIn: 'expira em 4h' },
  { id: 'REQ-2026-0428-03', name: 'Carla Teixeira', cpf: '501.738.920-44', phone: '(31) 98418-5530', email: 'carla.teixeira@email.com', city: 'Belo Horizonte, MG', vehicle: 'Toyota Corolla 2021', plate: 'CTE-7H21', category: 'Economico', requestedAt: 'Ontem as 18:40', expiresIn: 'expira em 8h' },
]

export const revenueComparisons: Record<RevenuePeriod, RevenueComparison> = {
  day: {
    label: 'Hoje vs ontem',
    currentLabel: 'Hoje',
    previousLabel: 'Ontem',
    data: [
      { label: '00h', atual: 420, anterior: 380 },
      { label: '04h', atual: 610, anterior: 520 },
      { label: '08h', atual: 2480, anterior: 2210 },
      { label: '12h', atual: 3890, anterior: 3420 },
      { label: '16h', atual: 5220, anterior: 4660 },
      { label: '20h', atual: 5800, anterior: 5010 },
    ],
  },
  week: {
    label: 'Semana vs semana atras',
    currentLabel: 'Esta semana',
    previousLabel: 'Semana anterior',
    data: [
      { label: 'Seg', atual: 12800, anterior: 11300 },
      { label: 'Ter', atual: 14200, anterior: 13050 },
      { label: 'Qua', atual: 18420, anterior: 16980 },
      { label: 'Qui', atual: 17600, anterior: 15840 },
      { label: 'Sex', atual: 21300, anterior: 19620 },
      { label: 'Sab', atual: 23800, anterior: 21550 },
      { label: 'Dom', atual: 20100, anterior: 18430 },
    ],
  },
  month: {
    label: 'Mes vs mes atras',
    currentLabel: 'Mes atual',
    previousLabel: 'Mes anterior',
    data: [
      { label: 'Sem 1', atual: 84200, anterior: 79100 },
      { label: 'Sem 2', atual: 92600, anterior: 86100 },
      { label: 'Sem 3', atual: 101400, anterior: 94400 },
      { label: 'Sem 4', atual: 110800, anterior: 103200 },
    ],
  },
}

export const rideLine: [number, number][] = [[-23.5617, -46.6559], [-23.5569, -46.6482], [-23.5505, -46.6333], [-23.5446, -46.6271]]
export const secondRideLine: [number, number][] = [[-23.5731, -46.6413], [-23.5662, -46.6352], [-23.5586, -46.628]]

export const mapMarkers: MapMarker[] = [
  { id: 'driver-1', type: 'driver', label: 'Rafael Souza - motorista', position: [-23.5617, -46.6559] },
  { id: 'driver-2', type: 'driver', label: 'Bianca Costa - motorista', position: [-23.5731, -46.6413] },
  { id: 'driver-3', type: 'driver', label: 'Luis Prado - motorista', position: [-23.5484, -46.6388] },
  { id: 'passenger-1', type: 'passenger', label: 'Marina Lopes - passageira', position: [-23.5446, -46.6271] },
  { id: 'passenger-2', type: 'passenger', label: 'Joao Lima - passageiro', position: [-23.5586, -46.628] },
  { id: 'passenger-3', type: 'passenger', label: 'Ana Beatriz - passageira', position: [-23.5569, -46.6482] },
]

export const heatZones: HeatZone[] = [
  { id: 'heat-paulista', label: 'Av. Paulista', position: [-23.5614, -46.6562], calls: 42, intensity: 0.95 },
  { id: 'heat-pinheiros', label: 'Pinheiros', position: [-23.5662, -46.7019], calls: 34, intensity: 0.78 },
  { id: 'heat-moema', label: 'Moema', position: [-23.6033, -46.6658], calls: 29, intensity: 0.68 },
  { id: 'heat-centro', label: 'Centro', position: [-23.5505, -46.6333], calls: 37, intensity: 0.86 },
  { id: 'heat-vila-olimpia', label: 'Vila Olimpia', position: [-23.594, -46.6847], calls: 24, intensity: 0.58 },
]

export const ridesPerHour = [
  { hour: '00h', rides: 18 },
  { hour: '01h', rides: 14 },
  { hour: '02h', rides: 10 },
  { hour: '03h', rides: 8 },
  { hour: '04h', rides: 12 },
  { hour: '05h', rides: 22 },
  { hour: '06h', rides: 41 },
  { hour: '07h', rides: 68 },
  { hour: '08h', rides: 92 },
  { hour: '09h', rides: 76 },
  { hour: '10h', rides: 64 },
  { hour: '11h', rides: 72 },
  { hour: '12h', rides: 88 },
  { hour: '13h', rides: 83 },
  { hour: '14h', rides: 79 },
  { hour: '15h', rides: 84 },
  { hour: '16h', rides: 96 },
  { hour: '17h', rides: 118 },
  { hour: '18h', rides: 132 },
  { hour: '19h', rides: 124 },
  { hour: '20h', rides: 101 },
  { hour: '21h', rides: 89 },
  { hour: '22h', rides: 57 },
  { hour: '23h', rides: 34 },
]

export const activities: Activity[] = [
  { id: 'act-1', type: 'ride', title: 'Corridas ativas no momento', description: '38 corridas em andamento na operacao', timestamp: 'agora' },
  { id: 'act-2', type: 'payment', title: 'Valor Medio Arrecadado', description: 'Ticket medio atual de R$ 42,80', timestamp: 'ha 3 min' },
  { id: 'act-3', type: 'driver', title: 'Motoristas online', description: '214 motoristas disponiveis na plataforma', timestamp: 'ha 7 min' },
  { id: 'act-4', type: 'alert', title: 'Cancelamento medio', description: 'Media operacional em 4,2% nas ultimas horas', timestamp: 'ha 12 min' },
  { id: 'act-5', type: 'done', title: 'Corridas concluida', description: '126 corridas finalizadas hoje', timestamp: 'ha 18 min' },
]

export const recentRides: RecentRide[] = [
  { id: 'BRL-84211', passenger: 'Marina Lopes', driver: 'Rafael Souza', route: 'Paulista -> Centro', value: 48.9, status: 'Em andamento' },
  { id: 'BRL-84210', passenger: 'Joao Lima', driver: 'Bianca Costa', route: 'Moema -> Congonhas', value: 36.5, status: 'Concluida' },
  { id: 'BRL-84209', passenger: 'Ana Beatriz', driver: 'Luis Prado', route: 'Pinheiros -> Itaim', value: 29.8, status: 'Cancelada' },
  { id: 'BRL-84208', passenger: 'Pedro Rocha', driver: 'Clara Alves', route: 'Vila Madalena -> Se', value: 42.2, status: 'Concluida' },
  { id: 'BRL-84207', passenger: 'Luiza Martins', driver: 'Andre Mota', route: 'Tatuape -> Jardins', value: 64.7, status: 'Em andamento' },
]

export const activityStyles: Record<ActivityType, { icon: ReactElement; color: string }> = {
  ride: { icon: <TimelineIcon fontSize="small" />, color: '#0ABEE9' },
  payment: { icon: <MonetizationOnIcon fontSize="small" />, color: '#F59E0B' },
  driver: { icon: <DirectionsCarIcon fontSize="small" />, color: '#2DD4A0' },
  alert: { icon: <ReportProblemIcon fontSize="small" />, color: '#EF4444' },
  done: { icon: <CheckCircleIcon fontSize="small" />, color: '#0ABEE9' },
}

export const statusStyles: Record<RideStatus, { label: string; color: string; background: string; border: string }> = {
  Concluida: { label: 'Concluida', color: '#15803D', background: '#DCFCE7', border: '#86EFAC' },
  Cancelada: { label: 'Cancelada', color: '#B91C1C', background: '#FEE2E2', border: '#FCA5A5' },
  'Em andamento': { label: 'Em andamento', color: '#B45309', background: '#FEF3C7', border: '#FCD34D' },
}
