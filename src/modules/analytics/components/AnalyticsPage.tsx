import { useMemo, useState } from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { useColorScheme, useTheme } from '@mui/material/styles'

type TimeRange = 'today' | '7d' | '30d' | '3m' | '12m'

type ActivityPoint = {
  label: string
  usersEntering: number
  activeNow: number
}

type RidePoint = {
  label: string
  ridesAverage: number
}

type RevenuePoint = {
  label: string
  revenue: number
  current?: boolean
}

type DemandLevel = 'low' | 'medium' | 'high'

type DemandRegion = {
  name: string
  demand: DemandLevel
  rides: number
  x: number
  y: number
}

type ChurnPoint = {
  label: string
  churn: number
  peak?: boolean
}

type RatingDistribution = {
  stars: number
  percentage: number
}

type RideCategory = {
  name: string
  usage: number
  rides: number
  averageTicket: number
  color: string
}

type AnalyticsSnapshot = {
  activity: ActivityPoint[]
  ridesAverage: RidePoint[]
  ridesCompleted: number
  cancellationRate: number
  activeDrivers: number
  totalDrivers: number
  passengerRating: number
  driverRating: number
}

const revenueByMonth: RevenuePoint[] = [
  { label: 'Nov', revenue: 84200 },
  { label: 'Dez', revenue: 91800 },
  { label: 'Jan', revenue: 97600 },
  { label: 'Fev', revenue: 104400 },
  { label: 'Mar', revenue: 118900 },
  { label: 'Abr', revenue: 127300, current: true },
]

const demandRegions: DemandRegion[] = [
  { name: 'Centro', demand: 'high', rides: 184, x: 52, y: 48 },
  { name: 'Zona Norte', demand: 'medium', rides: 96, x: 47, y: 24 },
  { name: 'Zona Sul', demand: 'high', rides: 152, x: 58, y: 74 },
  { name: 'Zona Leste', demand: 'medium', rides: 108, x: 74, y: 45 },
  { name: 'Zona Oeste', demand: 'low', rides: 54, x: 27, y: 52 },
  { name: 'Aeroporto', demand: 'high', rides: 139, x: 78, y: 70 },
  { name: 'Universidades', demand: 'low', rides: 43, x: 35, y: 77 },
]

const demandMeta: Record<DemandLevel, { label: string; color: string; background: string }> = {
  high: {
    label: 'Alta demanda',
    color: '#EF4444',
    background: 'rgba(239, 68, 68, 0.18)',
  },
  medium: {
    label: 'Média demanda',
    color: '#F59E0B',
    background: 'rgba(245, 158, 11, 0.18)',
  },
  low: {
    label: 'Baixa demanda',
    color: '#22C55E',
    background: 'rgba(34, 197, 94, 0.16)',
  },
}

const churnByMonth: ChurnPoint[] = [
  { label: 'Nov', churn: 3.8 },
  { label: 'Dez', churn: 4.4 },
  { label: 'Jan', churn: 5.2 },
  { label: 'Fev', churn: 7.8, peak: true },
  { label: 'Mar', churn: 4.9 },
  { label: 'Abr', churn: 3.6 },
]

const ratingDistribution: RatingDistribution[] = [
  { stars: 5, percentage: 62 },
  { stars: 4, percentage: 24 },
  { stars: 3, percentage: 9 },
  { stars: 2, percentage: 3 },
  { stars: 1, percentage: 2 },
]

const rideCategories: RideCategory[] = [
  {
    name: 'Econômico',
    usage: 54,
    rides: 3128,
    averageTicket: 24,
    color: '#0ABEE9',
  },
  {
    name: 'Conforto',
    usage: 31,
    rides: 1794,
    averageTicket: 38,
    color: '#2DD4A0',
  },
  {
    name: 'Executivo',
    usage: 15,
    rides: 864,
    averageTicket: 62,
    color: '#6366F1',
  },
]

const timeRanges: Array<{ value: TimeRange; label: string }> = [
  { value: 'today', label: 'Hoje' },
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '3m', label: '3 meses' },
  { value: '12m', label: '12 meses' },
]

const chartShortcuts = [
  { label: 'Atividade', href: '#analytics-activity' },
  { label: 'Corridas', href: '#analytics-rides-average' },
  { label: 'Receitas', href: '#analytics-revenue' },
  { label: 'Mapa de calor', href: '#analytics-heatmap' },
  { label: 'Churn', href: '#analytics-churn' },
  { label: 'Estrelas', href: '#analytics-ratings' },
  { label: 'Categorias', href: '#analytics-categories' },
]

const analyticsByRange: Record<TimeRange, AnalyticsSnapshot> = {
  today: {
    activity: [
      { label: '06h', usersEntering: 28, activeNow: 18 },
      { label: '09h', usersEntering: 64, activeNow: 43 },
      { label: '12h', usersEntering: 92, activeNow: 67 },
      { label: '15h', usersEntering: 81, activeNow: 58 },
      { label: '18h', usersEntering: 138, activeNow: 102 },
      { label: '21h', usersEntering: 116, activeNow: 84 },
    ],
    ridesAverage: [
      { label: '06h', ridesAverage: 11 },
      { label: '09h', ridesAverage: 24 },
      { label: '12h', ridesAverage: 36 },
      { label: '15h', ridesAverage: 31 },
      { label: '18h', ridesAverage: 52 },
      { label: '21h', ridesAverage: 44 },
    ],
    ridesCompleted: 284,
    cancellationRate: 6.8,
    activeDrivers: 96,
    totalDrivers: 154,
    passengerRating: 4.82,
    driverRating: 4.76,
  },
  '7d': {
    activity: [
      { label: 'Seg', usersEntering: 412, activeNow: 184 },
      { label: 'Ter', usersEntering: 438, activeNow: 201 },
      { label: 'Qua', usersEntering: 491, activeNow: 226 },
      { label: 'Qui', usersEntering: 466, activeNow: 219 },
      { label: 'Sex', usersEntering: 583, activeNow: 278 },
      { label: 'Sab', usersEntering: 628, activeNow: 294 },
      { label: 'Dom', usersEntering: 552, activeNow: 251 },
    ],
    ridesAverage: [
      { label: 'Seg', ridesAverage: 144 },
      { label: 'Ter', ridesAverage: 152 },
      { label: 'Qua', ridesAverage: 169 },
      { label: 'Qui', ridesAverage: 161 },
      { label: 'Sex', ridesAverage: 204 },
      { label: 'Sab', ridesAverage: 227 },
      { label: 'Dom', ridesAverage: 188 },
    ],
    ridesCompleted: 1245,
    cancellationRate: 5.9,
    activeDrivers: 132,
    totalDrivers: 176,
    passengerRating: 4.84,
    driverRating: 4.79,
  },
  '30d': {
    activity: [
      { label: 'Sem 1', usersEntering: 1860, activeNow: 612 },
      { label: 'Sem 2', usersEntering: 2048, activeNow: 684 },
      { label: 'Sem 3', usersEntering: 2196, activeNow: 731 },
      { label: 'Sem 4', usersEntering: 2384, activeNow: 803 },
      { label: 'Atual', usersEntering: 2462, activeNow: 842 },
    ],
    ridesAverage: [
      { label: 'Sem 1', ridesAverage: 156 },
      { label: 'Sem 2', ridesAverage: 171 },
      { label: 'Sem 3', ridesAverage: 183 },
      { label: 'Sem 4', ridesAverage: 198 },
      { label: 'Atual', ridesAverage: 207 },
    ],
    ridesCompleted: 5860,
    cancellationRate: 5.4,
    activeDrivers: 148,
    totalDrivers: 191,
    passengerRating: 4.86,
    driverRating: 4.81,
  },
  '3m': {
    activity: [
      { label: 'Jan', usersEntering: 6740, activeNow: 1820 },
      { label: 'Fev', usersEntering: 7218, activeNow: 2016 },
      { label: 'Mar', usersEntering: 7894, activeNow: 2241 },
      { label: 'Abr', usersEntering: 8426, activeNow: 2468 },
    ],
    ridesAverage: [
      { label: 'Jan', ridesAverage: 168 },
      { label: 'Fev', ridesAverage: 181 },
      { label: 'Mar', ridesAverage: 197 },
      { label: 'Abr', ridesAverage: 214 },
    ],
    ridesCompleted: 17420,
    cancellationRate: 5.1,
    activeDrivers: 173,
    totalDrivers: 214,
    passengerRating: 4.87,
    driverRating: 4.83,
  },
  '12m': {
    activity: [
      { label: 'Mai', usersEntering: 13200, activeNow: 3420 },
      { label: 'Jul', usersEntering: 15180, activeNow: 4018 },
      { label: 'Set', usersEntering: 17860, activeNow: 4682 },
      { label: 'Nov', usersEntering: 20340, activeNow: 5310 },
      { label: 'Jan', usersEntering: 22480, activeNow: 6024 },
      { label: 'Mar', usersEntering: 24920, activeNow: 6881 },
      { label: 'Abr', usersEntering: 26340, activeNow: 7215 },
    ],
    ridesAverage: [
      { label: 'Mai', ridesAverage: 124 },
      { label: 'Jul', ridesAverage: 139 },
      { label: 'Set', ridesAverage: 158 },
      { label: 'Nov', ridesAverage: 174 },
      { label: 'Jan', ridesAverage: 191 },
      { label: 'Mar', ridesAverage: 218 },
      { label: 'Abr', ridesAverage: 232 },
    ],
    ridesCompleted: 68240,
    cancellationRate: 4.8,
    activeDrivers: 206,
    totalDrivers: 246,
    passengerRating: 4.88,
    driverRating: 4.84,
  },
}

const numberFormatter = new Intl.NumberFormat('pt-BR')

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
})

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

function formatChartValue(value: unknown) {
  return typeof value === 'number' ? numberFormatter.format(value) : String(value ?? '')
}

function formatCurrencyValue(value: unknown) {
  return typeof value === 'number' ? currencyFormatter.format(value) : String(value ?? '')
}

export default function AnalyticsPage() {
  const theme = useTheme()
  const { mode, systemMode } = useColorScheme()
  const colorMode = mode === 'system' ? systemMode : mode
  const isDarkMode = colorMode === 'dark'
  const [selectedRange, setSelectedRange] = useState<TimeRange>('today')
  const snapshot = analyticsByRange[selectedRange]

  const activeDriverPercent = useMemo(
    () => (snapshot.activeDrivers / snapshot.totalDrivers) * 100,
    [snapshot.activeDrivers, snapshot.totalDrivers],
  )

  const metricCards = [
    {
      title: 'Corridas realizadas',
      value: numberFormatter.format(snapshot.ridesCompleted),
      helper: 'Total no período selecionado',
      icon: <DirectionsCarIcon />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Taxa de cancelamento',
      value: `${percentFormatter.format(snapshot.cancellationRate)}%`,
      helper: 'Média de cancelamentos',
      icon: <CancelOutlinedIcon />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Motoristas ativos',
      value: numberFormatter.format(snapshot.activeDrivers),
      helper: `${percentFormatter.format(activeDriverPercent)}% de ${numberFormatter.format(
        snapshot.totalDrivers,
      )} inscritos`,
      icon: <PeopleAltOutlinedIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Avaliação média',
      value: `${snapshot.passengerRating.toFixed(2)} / ${snapshot.driverRating.toFixed(2)}`,
      helper: 'Passageiros / motoristas',
      icon: <StarBorderRoundedIcon />,
      color: theme.palette.success.main,
    },
  ]

  function handleRangeChange(_: React.MouseEvent<HTMLElement>, value: TimeRange | null) {
    if (value) {
      setSelectedRange(value)
    }
  }

  const shortcutNavigation = (
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
        {chartShortcuts.map((shortcut) => (
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

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h1">
        Analytics
      </Typography>

      {shortcutNavigation}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography color="text.secondary">
            Acompanhe atividade, corridas e qualidade operacional do app.
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
            <Chip label="Receitas dos últimos 6 meses" color="primary" variant="outlined" />
            <Chip label="Mapa de calor de demanda" color="success" variant="outlined" />
          </Stack>
        </Box>

        <ToggleButtonGroup
          exclusive
          size="small"
          value={selectedRange}
          onChange={handleRangeChange}
          aria-label="Filtro de tempo"
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
          {timeRanges.map((range) => (
            <ToggleButton key={range.value} value={range.value} aria-label={range.label}>
              {range.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      <Card id="analytics-activity" variant="outlined" sx={{ scrollMarginTop: 96 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h4">Atividade do app</Typography>
              <Typography color="text.secondary">Usuários entrando e ativos no momento</Typography>
            </Box>
            <Chip
              icon={<AccessTimeIcon />}
              label={timeRanges.find((range) => range.value === selectedRange)?.label}
              color="primary"
              variant="outlined"
            />
          </Stack>

          <Box sx={{ width: '100%', height: 340 }}>
            <ResponsiveContainer>
              <AreaChart data={snapshot.activity} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="usersEntering" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="activeNow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => numberFormatter.format(value)} />
                <Tooltip formatter={formatChartValue} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="usersEntering"
                  name="Usuários entrando"
                  stroke={theme.palette.secondary.main}
                  strokeWidth={3}
                  fill="url(#usersEntering)"
                />
                <Area
                  type="monotone"
                  dataKey="activeNow"
                  name="Ativos no momento"
                  stroke={theme.palette.primary.main}
                  strokeWidth={3}
                  fill="url(#activeNow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
        }}
      >
        {metricCards.map((metric) => (
          <Card key={metric.title} variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    color: metric.color,
                    backgroundColor: 'rgba(10, 190, 233, 0.08)',
                  }}
                >
                  {metric.icon}
                </Box>
                <Box>
                  <Typography color="text.secondary" fontWeight={600}>
                    {metric.title}
                  </Typography>
                  <Typography variant="h3" sx={{ mt: 0.75 }}>
                    {metric.value}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                    {metric.helper}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card id="analytics-rides-average" variant="outlined" sx={{ scrollMarginTop: 96 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h4">Média de corridas por dia</Typography>
              <Typography color="text.secondary">Linha de tendência operacional no período</Typography>
            </Box>
            <Chip icon={<TrendingUpIcon />} label="Tendência em alta" color="success" variant="outlined" />
          </Stack>

          <Box sx={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={snapshot.ridesAverage} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value: unknown) =>
                    typeof value === 'number' ? `${numberFormatter.format(value)} corridas` : String(value ?? '')
                  }
                />
                <Line
                  type="monotone"
                  dataKey="ridesAverage"
                  name="Média por dia"
                  stroke={theme.palette.success.main}
                  strokeWidth={4}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      <Card id="analytics-revenue" variant="outlined" sx={{ scrollMarginTop: 96 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h4">Receitas</Typography>
              <Typography color="text.secondary">Valor mês a mês dos últimos 6 meses</Typography>
            </Box>
            <Chip label="Mês atual em destaque" color="primary" variant="outlined" />
          </Stack>

          <Box sx={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={revenueByMonth} margin={{ top: 10, right: 16, left: -4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => currencyFormatter.format(value).replace(/\s/g, '')}
                />
                <Tooltip formatter={formatCurrencyValue} />
                <Bar dataKey="revenue" name="Receita" radius={[8, 8, 0, 0]}>
                  {revenueByMonth.map((month) => (
                    <Cell
                      key={month.label}
                      fill={month.current ? theme.palette.primary.main : theme.palette.secondary.main}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      <Card id="analytics-heatmap" variant="outlined" sx={{ scrollMarginTop: 96 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={3}
            alignItems={{ xs: 'stretch', lg: 'center' }}
            justifyContent="space-between"
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h4">Mapa de calor de demanda</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                Regiões com maior concentração de chamadas no app
              </Typography>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {(['high', 'medium', 'low'] as DemandLevel[]).map((level) => (
                  <Chip
                    key={level}
                    label={demandMeta[level].label}
                    sx={{
                      borderColor: demandMeta[level].color,
                      color: demandMeta[level].color,
                      backgroundColor: demandMeta[level].background,
                    }}
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>

            <Box
              aria-label="Mapa de calor por região"
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 720,
                minHeight: { xs: 360, sm: 420 },
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: 'background.default',
                backgroundImage: `
                  linear-gradient(${theme.palette.divider} 1px, transparent 1px),
                  linear-gradient(90deg, ${theme.palette.divider} 1px, transparent 1px)
                `,
                backgroundSize: '48px 48px',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: '9% 12%',
                  borderRadius: '44% 56% 48% 52% / 42% 44% 56% 58%',
                  border: `2px solid ${theme.palette.divider}`,
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.84), rgba(10,190,233,0.08)), radial-gradient(circle at 54% 48%, rgba(239,68,68,0.16), transparent 26%), radial-gradient(circle at 74% 45%, rgba(245,158,11,0.15), transparent 18%), radial-gradient(circle at 28% 54%, rgba(34,197,94,0.14), transparent 18%)',
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  left: '17%',
                  right: '15%',
                  top: '50%',
                  height: 2,
                  backgroundColor: theme.palette.divider,
                  transform: 'rotate(-8deg)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  left: '48%',
                  top: '15%',
                  bottom: '14%',
                  width: 2,
                  backgroundColor: theme.palette.divider,
                  transform: 'rotate(7deg)',
                }}
              />

              {demandRegions.map((region) => {
                const meta = demandMeta[region.demand]

                return (
                  <Box
                    key={region.name}
                    sx={{
                      position: 'absolute',
                      left: `${region.x}%`,
                      top: `${region.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: region.demand === 'high' ? 118 : 102,
                      minHeight: region.demand === 'high' ? 118 : 102,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      textAlign: 'center',
                      color: meta.color,
                      border: `2px solid ${meta.color}`,
                      backgroundColor: meta.background,
                      boxShadow: `0 0 0 12px ${meta.background}`,
                      p: 1.5,
                    }}
                  >
                    <Typography fontWeight={700} sx={{ lineHeight: 1.1 }}>
                      {region.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      {numberFormatter.format(region.rides)} chamadas
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card id="analytics-churn" variant="outlined" sx={{ scrollMarginTop: 96 }}>
        <CardContent>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h4">Churn mensal</Typography>
              <Typography color="text.secondary">Percentual de usuários que deixaram de usar o app</Typography>
            </Box>
            <Chip label="Pico em vermelho" color="error" variant="outlined" />
          </Stack>

          <Box sx={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={churnByMonth} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  formatter={(value: unknown) =>
                    typeof value === 'number' ? `${percentFormatter.format(value)}%` : String(value ?? '')
                  }
                />
                <Line
                  type="monotone"
                  dataKey="churn"
                  name="Churn"
                  stroke={theme.palette.error.main}
                  strokeWidth={3}
                  dot={(props) => {
                    const payload = props.payload as ChurnPoint
                    const fill = payload.peak ? theme.palette.error.main : '#FFFFFF'

                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={payload.peak ? 7 : 5}
                        fill={fill}
                        stroke={theme.palette.error.main}
                        strokeWidth={3}
                      />
                    )
                  }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      <Card id="analytics-ratings" variant="outlined" sx={{ scrollMarginTop: 96 }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4">Distribuição por estrela</Typography>
            <Typography color="text.secondary">Percentual das avaliações de 1 a 5 estrelas</Typography>
          </Box>

          <Stack spacing={2}>
            {ratingDistribution.map((rating) => (
              <Stack
                key={rating.stars}
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems={{ xs: 'stretch', sm: 'center' }}
              >
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ width: { xs: '100%', sm: 96 } }}>
                  <Typography fontWeight={700}>{rating.stars}</Typography>
                  <StarBorderRoundedIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />
                </Stack>

                <Box
                  sx={{
                    flex: 1,
                    height: 16,
                    borderRadius: 999,
                    backgroundColor: 'background.default',
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box
                    sx={{
                      width: `${rating.percentage}%`,
                      height: '100%',
                      borderRadius: 999,
                      backgroundColor: rating.stars >= 4 ? theme.palette.primary.main : theme.palette.warning.main,
                    }}
                  />
                </Box>

                <Typography fontWeight={700} sx={{ width: { xs: '100%', sm: 64 }, textAlign: { sm: 'right' } }}>
                  {rating.percentage}%
                </Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Box
        id="analytics-categories"
        sx={{
          scrollMarginTop: 96,
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        {rideCategories.map((category) => (
          <Card key={category.name} variant="outlined">
            <CardContent>
              <Stack spacing={2.5}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="h4">{category.name}</Typography>
                    <Typography color="text.secondary">Categoria mais usada</Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      color: category.color,
                      backgroundColor: `${category.color}1F`,
                    }}
                  >
                    <DirectionsCarIcon />
                  </Box>
                </Stack>

                <Box>
                  <Typography variant="h3">{category.usage}%</Typography>
                  <Box
                    sx={{
                      mt: 1.5,
                      height: 10,
                      borderRadius: 999,
                      overflow: 'hidden',
                      backgroundColor: 'background.default',
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: `${category.usage}%`,
                        height: '100%',
                        borderRadius: 999,
                        backgroundColor: category.color,
                      }}
                    />
                  </Box>
                </Box>

                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary">Corridas</Typography>
                    <Typography fontWeight={700}>{numberFormatter.format(category.rides)}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography color="text.secondary">Ticket médio</Typography>
                    <Typography fontWeight={700}>{currencyFormatter.format(category.averageTicket)}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  )
}
