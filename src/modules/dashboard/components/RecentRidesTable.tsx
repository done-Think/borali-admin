import { useState } from 'react'
import { Box, Card, CardContent, Chip, Dialog, DialogContent, DialogTitle, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { recentRides, statusStyles } from '../data/dashboardData'
import type { RecentRide, RideStatus } from '../types'
import { currencyFormatter } from '../utils/formatters'
import { ApplicationDetail } from './ApplicationDetail'
import { RideRouteMap } from './RideRouteMap'

const rideTableCellSx = {
  px: 1,
  fontSize: 12,
  fontWeight: 700,
  overflowWrap: 'anywhere',
  verticalAlign: 'middle',
}

export function RecentRidesTable() {
  const [selectedRide, setSelectedRide] = useState<RecentRide | null>(null)

  return (
    <>
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
                {recentRides.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary" variant="body2">Nenhuma corrida recente.</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {recentRides.map((ride) => (
                  <TableRow
                    key={ride.id}
                    hover
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedRide(ride)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedRide(ride)
                      }
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
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
      <RecentRideDialog ride={selectedRide} onClose={() => setSelectedRide(null)} />
    </>
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

function RecentRideDialog({ ride, onClose }: { ride: RecentRide | null; onClose: () => void }) {
  if (!ride) {
    return null
  }

  return (
    <Dialog open={Boolean(ride)} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="h4">Resumo da corrida {ride.id}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {ride.passenger} com {ride.driver}, rota {ride.route}.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <RideStatusBadge status={ride.status} />
            <Chip label={currencyFormatter.format(ride.value)} color="secondary" variant="outlined" sx={{ fontWeight: 800 }} />
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' } }}>
            <ApplicationDetail label="Passageiro" value={ride.passenger} />
            <ApplicationDetail label="Motorista" value={ride.driver} />
            <ApplicationDetail label="Duração" value={ride.duration} />
            <ApplicationDetail label="Solicitada" value={ride.requestedAt} />
          </Box>

          <RideRouteMap
            path={ride.path}
            driverPosition={ride.driverPosition}
            passengerPosition={ride.passengerPosition}
            driverLabel={`Motorista ${ride.driver}`}
            passengerLabel={`Passageiro ${ride.passenger}`}
            height={{ xs: 340, md: 470 }}
          />

          <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
            <ApplicationDetail label="Partida" value={ride.origin} />
            <ApplicationDetail label="Destino" value={ride.destination} />
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
