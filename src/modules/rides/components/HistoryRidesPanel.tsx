import { Box, Card, CardContent, Chip, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { statusStyles } from '@modules/dashboard/data/mockDashboardData'
import type { RideStatus } from '@modules/dashboard/types'
import { currencyFormatter } from '@modules/dashboard/utils/formatters'
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
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'flex-start' }} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4">Historico de corridas</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.25 }}>
              Consulte corridas registradas por periodo e status operacional.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ minWidth: { md: 520 } }}>
            <TextField label="Data inicial" type="date" size="small" value={startDate} onChange={(event) => onStartDateChange(event.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
            <TextField label="Data final" type="date" size="small" value={endDate} onChange={(event) => onEndDateChange(event.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
            <TextField select label="Status" size="small" value={status} onChange={(event) => onStatusChange(event.target.value as HistoryStatusFilter)} fullWidth>
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="Em andamento">Em andamento</MenuItem>
              <MenuItem value="Concluida">Concluida</MenuItem>
              <MenuItem value="Cancelada">Cancelada</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        <TableContainer>
          <Table size="small" sx={{ minWidth: 920 }}>
            <TableHead>
              <TableRow>
                {[
                  { label: '#', width: '12%' },
                  { label: 'Passageiro', width: '15%' },
                  { label: 'Motorista', width: '15%' },
                  { label: 'Rota', width: '20%' },
                  { label: 'Valor', width: '12%' },
                  { label: 'Duracao', width: '11%' },
                  { label: 'Data', width: '13%' },
                  { label: 'Status', width: '12%' },
                ].map((header) => (
                  <TableCell key={header.label} sx={{ width: header.width, color: 'text.secondary', fontWeight: 800, px: 1 }}>
                    {header.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rides.map((ride) => (
                <TableRow key={ride.id} hover>
                  <TableCell sx={rideTableCellSx}>{ride.id}</TableCell>
                  <TableCell sx={rideTableCellSx}>{ride.passenger}</TableCell>
                  <TableCell sx={rideTableCellSx}>{ride.driver}</TableCell>
                  <TableCell sx={rideTableCellSx}>{ride.route}</TableCell>
                  <TableCell sx={{ ...rideTableCellSx, fontWeight: 800 }}>{currencyFormatter.format(ride.value)}</TableCell>
                  <TableCell sx={rideTableCellSx}>{ride.duration}</TableCell>
                  <TableCell sx={rideTableCellSx}>{formatDateTime(ride.completedAt)}</TableCell>
                  <TableCell sx={{ ...rideTableCellSx, pr: 0 }}>
                    <RideStatusBadge status={ride.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {rides.length === 0 && (
          <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, p: 3, mt: 2, textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 800 }}>Nenhuma corrida encontrada</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Ajuste o periodo ou status para ampliar a busca.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

function RideStatusBadge({ status }: { status: RideStatus }) {
  const style = statusStyles[status]

  return (
    <Chip
      label={style.label}
      size="small"
      sx={{ color: style.color, bgcolor: style.background, border: `1px solid ${style.border}`, maxWidth: '100%', fontSize: 11, fontWeight: 800 }}
    />
  )
}
