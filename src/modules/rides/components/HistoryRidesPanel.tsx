import { useEffect, useState } from 'react'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import RouteIcon from '@mui/icons-material/Route'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import TaxiAlertIcon from '@mui/icons-material/TaxiAlert'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { alpha } from '@mui/material/styles'
import L from 'leaflet'
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { currencyFormatter } from '@modules/dashboard/utils/formatters'
import { getMapTileLayer } from '@modules/dashboard/utils/mapConfig'
import { useActivePaletteMode } from '@modules/dashboard/utils/useActivePaletteMode'
import { useNavigate } from 'react-router'
import { alertColor } from '../data/ridesData'
import { fetchRideChatHistory } from '../services'
import type { HistoryRide, HistoryStatusFilter } from '../types'
import { formatDateTime } from '../utils/rides'

const rideTableCellSx = {
  px: 1,
  fontSize: 12,
  fontWeight: 700,
  overflowWrap: 'anywhere',
  verticalAlign: 'middle',
}

type HistoryDetailModal = 'passenger' | 'driver' | 'ride' | 'occurrences' | 'chat' | null

type HistoryRidesPanelProps = {
  rides: HistoryRide[]
  startDate: string
  endDate: string
  status: HistoryStatusFilter
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onStatusChange: (value: HistoryStatusFilter) => void
}

export function HistoryRidesPanel({
  rides,
  startDate,
  endDate,
  status,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
}: HistoryRidesPanelProps) {
  const [expandedRideId, setExpandedRideId] = useState<string | null>(null)

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'flex-start' }} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4">Historico de corridas concluidas</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.25 }}>
              Consulte corridas finalizadas, pagamentos, ocorrencias, anexos e comentarios.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ minWidth: { md: 520 } }}>
            <TextField label="Data inicial" type="date" size="small" value={startDate} onChange={(event) => onStartDateChange(event.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
            <TextField label="Data final" type="date" size="small" value={endDate} onChange={(event) => onEndDateChange(event.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
            <TextField select label="Ocorrencias" size="small" value={status} onChange={(event) => onStatusChange(event.target.value as HistoryStatusFilter)} fullWidth>
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="with-alert">Com alerta</MenuItem>
              <MenuItem value="without-alert">Sem alerta</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        <TableContainer>
          <Table size="small" sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow>
                {[
                  { label: '', width: '4%' },
                  { label: '#', width: '12%' },
                  { label: 'Passageiro', width: '14%' },
                  { label: 'Motorista', width: '14%' },
                  { label: 'Rota', width: '20%' },
                  { label: 'Valor', width: '11%' },
                  { label: 'Pagamento', width: '12%' },
                  { label: 'Data', width: '13%' },
                  { label: 'Ocorrencias', width: '12%' },
                ].map((header) => (
                  <TableCell key={header.label} sx={{ width: header.width, color: 'text.secondary', fontWeight: 800, px: 1 }}>
                    {header.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rides.map((ride) => (
                <HistoryRideRow
                  key={ride.id}
                  ride={ride}
                  expanded={expandedRideId === ride.id}
                  onToggle={() => setExpandedRideId((current) => (current === ride.id ? null : ride.id))}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {rides.length === 0 && (
          <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 3, mt: 2, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 800 }}>Nenhuma corrida encontrada</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Ajuste o periodo ou o filtro de ocorrencias para ampliar a busca.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

function HistoryRideRow({ ride, expanded, onToggle }: { ride: HistoryRide; expanded: boolean; onToggle: () => void }) {
  return (
    <>
      <TableRow
        hover
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onToggle()
          }
        }}
        sx={{ cursor: 'pointer' }}
      >
        <TableCell sx={{ ...rideTableCellSx, width: 40 }}>
          <IconButton size="small" aria-label={expanded ? 'Recolher detalhes' : 'Expandir detalhes'}>
            {expanded ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
          </IconButton>
        </TableCell>
        <TableCell sx={rideTableCellSx}>{ride.id}</TableCell>
        <TableCell sx={rideTableCellSx}>{ride.passenger}</TableCell>
        <TableCell sx={rideTableCellSx}>{ride.driver}</TableCell>
        <TableCell sx={rideTableCellSx}>{ride.route}</TableCell>
        <TableCell sx={{ ...rideTableCellSx, fontWeight: 800 }}>{currencyFormatter.format(ride.value)}</TableCell>
        <TableCell sx={rideTableCellSx}>
          <PaymentBadge status={ride.payment.status} />
        </TableCell>
        <TableCell sx={rideTableCellSx}>{formatDateTime(ride.completedAt)}</TableCell>
        <TableCell sx={{ ...rideTableCellSx, pr: 0 }}>
          <OccurrenceBadge ride={ride} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={9} sx={{ p: 0, borderBottom: expanded ? '1px solid' : 0, borderColor: 'divider' }}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <HistoryRideDetails ride={ride} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

function HistoryRideDetails({ ride }: { ride: HistoryRide }) {
  const [selectedDetail, setSelectedDetail] = useState<HistoryDetailModal>(null)
  const passengerProfile = buildPassengerProfile(ride)
  const driverProfile = buildDriverProfile(ride)
  const routeReview = getRouteReview(ride)

  return (
    <Box sx={{ p: 2, bgcolor: 'background.default' }}>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(5, minmax(0, 1fr))' } }}>
        <DetailActionCard
          title="Corrida concluida"
          icon={<RouteIcon fontSize="small" />}
          accentColor={routeReview.hasDeviation ? alertColor : '#0ABEE9'}
          onClick={() => setSelectedDetail('ride')}
          items={[
            { label: 'Origem', value: ride.origin },
            { label: 'Destino', value: ride.destination },
            { label: 'Duracao', value: ride.duration },
            { label: 'Finalizada', value: formatDateTime(ride.completedAt) },
          ]}
        />
        <DetailActionCard
          title="Cadastro do passageiro"
          icon={<PersonPinCircleIcon fontSize="small" />}
          accentColor="#8B5CF6"
          onClick={() => setSelectedDetail('passenger')}
          items={[
            { label: 'Nome', value: ride.passenger },
            { label: 'Cadastro', value: passengerProfile.registration },
            { label: 'Telefone', value: passengerProfile.phone },
            { label: 'Avaliacao', value: passengerProfile.rating },
          ]}
        />
        <DetailActionCard
          title="Cadastro do motorista"
          icon={<TaxiAlertIcon fontSize="small" />}
          accentColor="#2DD4A0"
          onClick={() => setSelectedDetail('driver')}
          items={[
            { label: 'Nome', value: ride.driver },
            { label: 'Cadastro', value: driverProfile.registration },
            { label: 'Veiculo', value: driverProfile.vehicle },
            { label: 'Placa', value: driverProfile.plate },
          ]}
        />
        <DetailActionCard
          title="Ocorrencias"
          icon={<SupportAgentIcon fontSize="small" />}
          accentColor={ride.alert ? alertColor : '#64748B'}
          onClick={() => setSelectedDetail('occurrences')}
          items={[
            { label: 'Status', value: ride.alert ? 'Com alerta' : 'Sem alerta' },
            { label: 'Registros', value: String(ride.occurrences.length) },
            { label: 'Pagamento', value: ride.payment.status },
            { label: 'Transacao', value: ride.payment.transactionId },
          ]}
        />
        <DetailActionCard
          title="Chat da corrida"
          icon={<ChatOutlinedIcon fontSize="small" />}
          accentColor="#F59E0B"
          onClick={() => setSelectedDetail('chat')}
          items={[
            { label: 'Acesso', value: 'Admin — todos os status' },
            { label: 'Tipo', value: 'Somente leitura' },
            { label: 'Corrida', value: ride.id },
            { label: 'Auditoria', value: 'Disponivel' },
          ]}
        />
      </Box>

      <Box sx={{ mt: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5 }}>
        <Typography sx={{ fontWeight: 900 }}>Comentarios e elogios</Typography>
        <Stack spacing={1} sx={{ mt: 1 }}>
          {ride.feedback.length === 0 && (
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Nenhum comentario ou elogio registrado nessa corrida.
            </Typography>
          )}
          {ride.feedback.map((feedback) => (
            <Box key={`${feedback.author}-${feedback.message}`} sx={{ display: 'flex', gap: 1, alignItems: 'center', minWidth: 0 }}>
              <Chip size="small" label={`${feedback.type} - ${feedback.author}`} sx={{ fontWeight: 800 }} />
              <Typography sx={{ fontSize: 13 }}>{feedback.message}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <PassengerDetailsDialog ride={ride} profile={passengerProfile} open={selectedDetail === 'passenger'} onClose={() => setSelectedDetail(null)} />
      <DriverDetailsDialog ride={ride} profile={driverProfile} open={selectedDetail === 'driver'} onClose={() => setSelectedDetail(null)} />
      <CompletedRideDialog ride={ride} routeReview={routeReview} open={selectedDetail === 'ride'} onClose={() => setSelectedDetail(null)} />
      <OccurrencesDialog ride={ride} open={selectedDetail === 'occurrences'} onClose={() => setSelectedDetail(null)} />
      <ChatHistoryDialog rideId={ride.id} open={selectedDetail === 'chat'} onClose={() => setSelectedDetail(null)} />
    </Box>
  )
}

function DetailActionCard({ title, icon, accentColor, items, onClick }: { title: string; icon: React.ReactNode; accentColor: string; items: Array<{ label: string; value: string }>; onClick: () => void }) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      sx={{
        border: '1px solid',
        borderColor: alpha(accentColor, 0.34),
        borderRadius: 2,
        p: 1.5,
        bgcolor: 'background.paper',
        cursor: 'pointer',
        transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
        '&:hover': {
          borderColor: alpha(accentColor, 0.72),
          boxShadow: `0 10px 28px ${alpha(accentColor, 0.1)}`,
          transform: 'translateY(-1px)',
        },
        '&:focus-visible': {
          outline: `2px solid ${alpha(accentColor, 0.72)}`,
          outlineOffset: 2,
        },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{ color: accentColor, display: 'flex' }}>{icon}</Box>
        <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
      </Stack>
      <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', mt: 1 }}>
        {items.map((item) => (
          <Box key={item.label} sx={{ minWidth: 0 }}>
            <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
              {item.label}
            </Typography>
            <Typography noWrap sx={{ fontSize: 13, fontWeight: 800 }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function PassengerDetailsDialog({ ride, profile, open, onClose }: { ride: HistoryRide; profile: ReturnType<typeof buildPassengerProfile>; open: boolean; onClose: () => void }) {
  const navigate = useNavigate()

  function openPassengerRegistration() {
    onClose()
    navigate({ pathname: '/passengers', search: `?search=${encodeURIComponent(ride.passenger)}` }, { state: { selectedPassengerName: ride.passenger } })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h4">Cadastro do passageiro</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {ride.passenger} - corrida {ride.id}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <ProfileGrid
          items={[
            { label: 'Nome', value: ride.passenger },
            { label: 'Cadastro', value: profile.registration },
            { label: 'Telefone', value: profile.phone },
            { label: 'Documento', value: profile.document },
            { label: 'E-mail', value: profile.email },
            { label: 'Avaliacao media', value: profile.rating },
            { label: 'Corridas realizadas', value: profile.ridesCount },
            { label: 'Forma de pagamento', value: ride.payment.method },
          ]}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" onClick={openPassengerRegistration}>
          Ir para cadastro do passageiro
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function DriverDetailsDialog({ ride, profile, open, onClose }: { ride: HistoryRide; profile: ReturnType<typeof buildDriverProfile>; open: boolean; onClose: () => void }) {
  const navigate = useNavigate()

  function openDriverRegistration() {
    onClose()
    navigate({ pathname: '/drivers', search: `?search=${encodeURIComponent(ride.driver)}` }, { state: { selectedDriverId: profile.registration, selectedDriverName: ride.driver } })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h4">Cadastro do motorista</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {ride.driver} - corrida {ride.id}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <ProfileGrid
          items={[
            { label: 'Nome', value: ride.driver },
            { label: 'Cadastro', value: profile.registration },
            { label: 'Telefone', value: profile.phone },
            { label: 'CNH', value: profile.license },
            { label: 'Veiculo', value: profile.vehicle },
            { label: 'Placa', value: profile.plate },
            { label: 'Categoria', value: profile.category },
            { label: 'Avaliacao media', value: profile.rating },
          ]}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" onClick={openDriverRegistration}>
          Ir para cadastro do motorista
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function CompletedRideDialog({ ride, routeReview, open, onClose }: { ride: HistoryRide; routeReview: ReturnType<typeof getRouteReview>; open: boolean; onClose: () => void }) {
  const activeMode = useActivePaletteMode()
  const tileLayer = getMapTileLayer(activeMode)
  const originPosition = ride.path[0] ?? ride.driverPosition
  const destinationPosition = ride.path.at(-1) ?? ride.passengerPosition
  const lineColor = routeReview.hasDeviation ? alertColor : '#0ABEE9'

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }}>
          <Box>
            <Typography variant="h4">Corrida concluida {ride.id}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {ride.origin} para {ride.destination}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip label={routeReview.hasDeviation ? 'com desvio de rota' : 'sem desvio de rota'} size="small" sx={{ bgcolor: alpha(lineColor, 0.14), color: lineColor, fontWeight: 900 }} />
            <Chip label={ride.duration} size="small" variant="outlined" sx={{ fontWeight: 850 }} />
            <Chip label={currencyFormatter.format(ride.value)} color="secondary" variant="outlined" sx={{ fontWeight: 900 }} />
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' } }}>
          <Box sx={{ height: { xs: 360, md: 520 }, overflow: 'hidden', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <MapContainer center={originPosition} zoom={13} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
              <TileLayer key={activeMode} attribution={tileLayer.attribution} url={tileLayer.url} />
              <HistoryRouteMapFocus positions={[...ride.path, originPosition, destinationPosition]} />
              {routeReview.hasDeviation && <Polyline positions={ride.path} pathOptions={{ color: alertColor, weight: 9, opacity: 0.22 }} />}
              <Polyline positions={ride.path} pathOptions={{ color: lineColor, weight: 5, opacity: 0.92 }} />
              <CircleMarker center={originPosition} radius={10} pathOptions={{ color: '#FFFFFF', weight: 3, fillColor: '#2DD4A0', fillOpacity: 0.95 }}>
                <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                  Origem: {ride.origin}
                </Tooltip>
              </CircleMarker>
              <CircleMarker center={destinationPosition} radius={10} pathOptions={{ color: '#FFFFFF', weight: 3, fillColor: lineColor, fillOpacity: 0.95 }}>
                <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                  Destino: {ride.destination}
                </Tooltip>
              </CircleMarker>
            </MapContainer>
          </Box>

          <Box sx={{ border: '1px solid', borderColor: routeReview.hasDeviation ? alpha(alertColor, 0.42) : 'divider', borderRadius: 2, p: 2, bgcolor: routeReview.hasDeviation ? alpha(alertColor, 0.04) : 'background.default' }}>
            <Typography variant="h4">Detalhes da corrida</Typography>
            <Divider sx={{ my: 1.5 }} />
            <ProfileGrid
              columns={1}
              items={[
                { label: 'Motorista', value: ride.driver },
                { label: 'Passageiro', value: ride.passenger },
                { label: 'Origem', value: ride.origin },
                { label: 'Destino', value: ride.destination },
                { label: 'Duracao', value: ride.duration },
                { label: 'Conclusao', value: formatDateTime(ride.completedAt) },
                { label: 'Pagamento', value: `${ride.payment.status} - ${ride.payment.transactionId}` },
              ]}
            />
            <Divider sx={{ my: 1.5 }} />
            <Typography sx={{ fontWeight: 900 }}>{routeReview.title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
              {routeReview.description}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

function OccurrencesDialog({ ride, open, onClose }: { ride: HistoryRide; open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h4">Ocorrencias da corrida</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {ride.id} - {ride.alert ? ride.alert.reason : 'sem alerta registrado'}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1.5}>
          {ride.alert && (
            <Box sx={{ border: '1px solid', borderColor: alpha(alertColor, 0.44), borderRadius: 2, p: 1.5, bgcolor: alpha(alertColor, 0.05) }}>
              <Typography sx={{ fontWeight: 900 }}>Alerta acionado por {ride.alert.activatedBy}</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
                {ride.alert.reason}
              </Typography>
              <Chip size="small" label={ride.alert.resolvedAt} sx={{ mt: 1, color: alertColor, bgcolor: alpha(alertColor, 0.12), fontWeight: 800 }} />
            </Box>
          )}
          {ride.occurrences.length === 0 && (
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Nenhuma ocorrencia registrada nessa corrida.
            </Typography>
          )}
          {ride.occurrences.map((occurrence) => (
            <Box key={occurrence.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
                <Typography sx={{ fontWeight: 900 }}>{occurrence.title}</Typography>
                <Chip size="small" label={occurrence.createdAt} sx={{ fontWeight: 800, alignSelf: { xs: 'flex-start', sm: 'center' } }} />
              </Stack>
              <Typography color="text.secondary" sx={{ mt: 0.75, fontSize: 13 }}>
                {occurrence.description}
              </Typography>
              <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                {occurrence.attachments.length === 0 ? (
                  <Chip size="small" label="sem anexos" />
                ) : (
                  occurrence.attachments.map((attachment) => <Chip key={attachment.name} size="small" label={`${attachment.type}: ${attachment.name}`} />)
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

function ChatHistoryDialog({ rideId, open, onClose }: { rideId: string; open: boolean; onClose: () => void }) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['rides', rideId, 'chat'],
    queryFn: () => fetchRideChatHistory(rideId),
    enabled: open,
    staleTime: 5 * 60 * 1000,
  })

  function formatMsgTime(iso: string) {
    return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h4">Chat da corrida</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {rideId} — somente leitura
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ minHeight: 200 }}>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        )}
        {isError && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">Nao foi possivel carregar o historico.</Typography>
            <Button size="small" onClick={() => refetch()} sx={{ mt: 1 }}>
              Tentar novamente
            </Button>
          </Box>
        )}
        {!isLoading && !isError && data?.messages.length === 0 && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Nenhuma mensagem trocada nesta corrida.
          </Typography>
        )}
        {!isLoading && !isError && (data?.messages ?? []).length > 0 && (
          <Stack spacing={1}>
            {data!.messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 1.5,
                  bgcolor: 'background.default',
                }}
              >
                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="flex-start">
                  <Typography sx={{ fontSize: 12, fontWeight: 800 }}>{msg.senderName}</Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 11, whiteSpace: 'nowrap' }}>
                    {formatMsgTime(msg.sentAt)}
                  </Typography>
                </Stack>
                <Typography sx={{ mt: 0.5, fontSize: 13 }}>{msg.content}</Typography>
              </Box>
            ))}
            {data && data.total > 0 && (
              <Typography color="text.secondary" sx={{ fontSize: 12, textAlign: 'center', pt: 1 }}>
                {data.total} mensagem{data.total !== 1 ? 's' : ''}
              </Typography>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  )
}

function ProfileGrid({ items, columns = 2 }: { items: Array<{ label: string; value: string }>; columns?: 1 | 2 }) {
  return (
    <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: columns === 1 ? '1fr' : 'repeat(2, minmax(0, 1fr))' } }}>
      {items.map((item) => (
        <Box key={item.label} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 1.5, minWidth: 0 }}>
          <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800 }}>
            {item.label}
          </Typography>
          <Typography noWrap sx={{ fontWeight: 850 }}>
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

function HistoryRouteMapFocus({ positions }: { positions: [number, number][] }) {
  const map = useMap()

  useEffect(() => {
    if (positions.length === 0) return
    const bounds = L.latLngBounds(positions)
    map.fitBounds(bounds, { animate: false, padding: [42, 42], maxZoom: 15 })
  }, [map, positions])

  return null
}

function buildPassengerProfile(ride: HistoryRide) {
  return {
    registration: `PSG-${ride.id.slice(-4)}`,
    phone: `(11) 9${ride.id.slice(-4)}-1188`,
    document: `${ride.id.slice(-3)}.481.920-55`,
    email: `${ride.passenger.toLocaleLowerCase('pt-BR').replaceAll(' ', '.')}@email.com`,
    rating: ride.alert?.activatedBy === 'Passageiro' ? '4.6' : '4.9',
    ridesCount: ride.alert ? '42' : '68',
  }
}

function buildDriverProfile(ride: HistoryRide) {
  return {
    registration: `DRV-${ride.id.slice(-4)}`,
    phone: `(11) 9${ride.id.slice(-4)}-4402`,
    license: `CNH-${ride.id.slice(-5)}-SP`,
    vehicle: ride.value > 45 ? 'Toyota Corolla 2022' : 'Honda City 2021',
    plate: `BRL-${ride.id.slice(-2)}A`,
    category: ride.value > 45 ? 'Conforto' : 'Economico',
    rating: ride.alert?.activatedBy === 'Motorista' ? '4.7' : '4.9',
  }
}

function getRouteReview(ride: HistoryRide) {
  const searchableText = [ride.alert?.reason, ...ride.occurrences.flatMap((occurrence) => [occurrence.title, occurrence.description])].filter(Boolean).join(' ')
  const hasDeviation = /desvio|rota/i.test(searchableText)

  if (hasDeviation) {
    return {
      hasDeviation,
      title: 'Desvio identificado',
      description: ride.alert?.reason ?? 'A corrida possui ocorrencia vinculada a divergencia de rota.',
    }
  }

  return {
    hasDeviation,
    title: 'Rota sem desvios registrados',
    description: 'Nao ha alerta, ocorrencia ou anexo indicando desvio no trajeto desta corrida.',
  }
}

function PaymentBadge({ status }: { status: HistoryRide['payment']['status'] }) {
  const palette =
    status === 'Aprovado'
      ? { color: '#15803D', background: '#DCFCE7', border: '#86EFAC' }
      : status === 'Em analise'
        ? { color: '#B45309', background: '#FEF3C7', border: '#FCD34D' }
        : { color: '#B91C1C', background: '#FEE2E2', border: '#FCA5A5' }

  return <Chip label={status} size="small" sx={{ color: palette.color, bgcolor: palette.background, border: `1px solid ${palette.border}`, fontSize: 11, fontWeight: 800 }} />
}

function OccurrenceBadge({ ride }: { ride: HistoryRide }) {
  if (ride.alert) {
    return <Chip label="com alerta" size="small" sx={{ color: alertColor, bgcolor: alpha(alertColor, 0.12), border: `1px solid ${alpha(alertColor, 0.42)}`, fontSize: 11, fontWeight: 900 }} />
  }

  return <Chip label="sem alerta" size="small" sx={{ fontSize: 11, fontWeight: 800 }} />
}
