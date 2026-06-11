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
import { Circle, CircleMarker, MapContainer, TileLayer, Tooltip as MapTooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { useColorScheme, useTheme } from '@mui/material/styles'
import { getMapTileLayer } from '@modules/dashboard/utils/mapConfig'
import { analyticsByRange, chartShortcuts, churnByMonth, demandMeta, demandRegions, ratingDistribution, revenueByMonth, rideCategories, timeRanges } from '../services'
import type { ChurnPoint, DemandLevel, DemandRegion, TimeRange } from '../types'
import { currencyFormatter, formatChartValue, formatCurrencyValue, numberFormatter, percentFormatter } from '../utils/formatters'
import { AnalyticsMetricCards } from './AnalyticsMetricCards'
import { AnalyticsShortcutNavigation } from './AnalyticsShortcutNavigation'

export default function AnalyticsPage() {
  const theme = useTheme()
  const { mode, systemMode } = useColorScheme()
  const colorMode = mode === 'system' ? systemMode : mode
  const isDarkMode = colorMode === 'dark'
  const activeMapMode = isDarkMode ? 'dark' : 'light'
  const tileLayer = getMapTileLayer(activeMapMode)
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

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h1">
        Analytics
      </Typography>

      <AnalyticsShortcutNavigation shortcuts={chartShortcuts} isDarkMode={isDarkMode} theme={theme} />

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
            <ResponsiveContainer width="100%" height={340}>
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

      <AnalyticsMetricCards metrics={metricCards} />

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
            <ResponsiveContainer width="100%" height={320}>
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
            <ResponsiveContainer width="100%" height={320}>
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
                height: { xs: 360, sm: 420 },
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: 'background.default',
              }}
            >
              <MapContainer
                center={[-22.4256, -45.4528]}
                zoom={11}
                scrollWheelZoom={false}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer key={activeMapMode} attribution={tileLayer.attribution} url={tileLayer.url} />
                {demandRegions.map((region) => {
                  const meta = demandMeta[region.demand]

                  return (
                    <Circle
                      key={region.name}
                      center={region.position}
                      radius={getDemandRadius(region)}
                      pathOptions={{
                        color: meta.color,
                        weight: region.demand === 'high' ? 2 : 1,
                        fillColor: meta.color,
                        fillOpacity: getDemandOpacity(region.demand, isDarkMode),
                      }}
                    >
                      <MapTooltip direction="top" offset={[0, -8]} opacity={0.96}>
                        <Box>
                          <Typography fontWeight={700}>{region.name}</Typography>
                          <Typography variant="body2">{numberFormatter.format(region.rides)} chamadas</Typography>
                          <Typography variant="caption">{meta.label}</Typography>
                        </Box>
                      </MapTooltip>
                    </Circle>
                  )
                })}
                {demandRegions.map((region) => {
                  const meta = demandMeta[region.demand]

                  return (
                    <CircleMarker
                      key={`${region.name}-marker`}
                      center={region.position}
                      radius={6}
                      pathOptions={{
                        color: '#FFFFFF',
                        weight: 2,
                        fillColor: meta.color,
                        fillOpacity: 0.95,
                      }}
                    >
                      <MapTooltip direction="top" offset={[0, -8]} opacity={0.96}>
                        {region.name}
                      </MapTooltip>
                    </CircleMarker>
                  )
                })}
              </MapContainer>
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
            <ResponsiveContainer width="100%" height={320}>
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

function getDemandRadius(region: DemandRegion) {
  const baseRadius = region.demand === 'high' ? 1450 : region.demand === 'medium' ? 1150 : 900
  return baseRadius + region.rides * 8
}

function getDemandOpacity(demand: DemandLevel, isDarkMode: boolean) {
  const baseOpacity = demand === 'high' ? 0.3 : demand === 'medium' ? 0.24 : 0.2
  return isDarkMode ? baseOpacity + 0.1 : baseOpacity
}
