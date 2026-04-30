import { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
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
import { alpha } from '@mui/material/styles'
import { currencyFormatter } from '@modules/dashboard/utils/formatters'
import { alertColor } from '../data/mockRides'
import type { HistoryRide, HistoryStatusFilter } from '../types'
import { formatDateTime } from '../utils/rides'

const rideTableCellSx = {
  px: 1,
  fontSize: 12,
  fontWeight: 700,
  overflowWrap: 'anywhere',
  verticalAlign: 'middle',
}

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
  return (
    <Box sx={{ p: 2, bgcolor: 'background.default' }}>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
        <DetailBlock
          title="Corrida concluida"
          items={[
            { label: 'Origem', value: ride.origin },
            { label: 'Destino', value: ride.destination },
            { label: 'Duracao', value: ride.duration },
            { label: 'Finalizada', value: formatDateTime(ride.completedAt) },
          ]}
        />
        <DetailBlock
          title="Pagamento"
          items={[
            { label: 'Status', value: ride.payment.status },
            { label: 'Metodo', value: ride.payment.method },
            { label: 'Transacao', value: ride.payment.transactionId },
            { label: 'Valor', value: currencyFormatter.format(ride.value) },
          ]}
        />
        <Box sx={{ border: '1px solid', borderColor: ride.alert ? alpha(alertColor, 0.44) : 'divider', borderRadius: 2, p: 1.5, bgcolor: ride.alert ? alpha(alertColor, 0.04) : 'background.paper' }}>
          <Typography sx={{ fontWeight: 900 }}>Ocorrencias e anexos</Typography>
          <Stack spacing={1.25} sx={{ mt: 1 }}>
            {ride.occurrences.length === 0 && (
              <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                Nenhuma ocorrencia registrada.
              </Typography>
            )}
            {ride.occurrences.map((occurrence) => (
              <Box key={occurrence.id}>
                <Typography sx={{ fontWeight: 850, fontSize: 13 }}>{occurrence.title}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: 12, mt: 0.25 }}>
                  {occurrence.description}
                </Typography>
                <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mt: 0.75 }}>
                  {occurrence.attachments.length === 0 ? (
                    <Chip size="small" label="sem anexos" />
                  ) : (
                    occurrence.attachments.map((attachment) => <Chip key={attachment.name} size="small" label={`${attachment.type}: ${attachment.name}`} />)
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
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
    </Box>
  )
}

function DetailBlock({ title, items }: { title: string; items: Array<{ label: string; value: string }> }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5, bgcolor: 'background.paper' }}>
      <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
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
