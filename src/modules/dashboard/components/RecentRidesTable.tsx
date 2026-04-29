import { Card, CardContent, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { recentRides, statusStyles } from '../data/mockDashboardData'
import type { RideStatus } from '../types'
import { currencyFormatter } from '../utils/formatters'

const rideTableCellSx = {
  px: 1,
  fontSize: 12,
  fontWeight: 700,
  overflowWrap: 'anywhere',
  verticalAlign: 'middle',
}

export function RecentRidesTable() {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.25 }}>
        <Typography variant="h4">Ultimas corridas</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.25, mb: 2 }}>
          Corridas mais recentes registradas pela operacao.
        </Typography>

        <TableContainer>
          <Table size="small" sx={{ width: '100%', tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                {[
                  { label: '#', width: '13%' },
                  { label: 'Passageiro', width: '16%' },
                  { label: 'Motorista', width: '16%' },
                  { label: 'Rota', width: '21%' },
                  { label: 'Valor', width: '13%' },
                  { label: 'Status', width: '21%' },
                ].map((header) => (
                  <TableCell key={header.label} sx={{ width: header.width, color: 'text.secondary', fontWeight: 800, px: 1 }}>
                    {header.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {recentRides.map((ride) => (
                <TableRow key={ride.id} hover>
                  <TableCell sx={rideTableCellSx}>{ride.id}</TableCell>
                  <TableCell sx={rideTableCellSx}>{ride.passenger}</TableCell>
                  <TableCell sx={rideTableCellSx}>{ride.driver}</TableCell>
                  <TableCell sx={rideTableCellSx}>{ride.route}</TableCell>
                  <TableCell sx={{ ...rideTableCellSx, fontWeight: 800 }}>{currencyFormatter.format(ride.value)}</TableCell>
                  <TableCell sx={{ ...rideTableCellSx, pr: 0 }}>
                    <RideStatusBadge status={ride.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
