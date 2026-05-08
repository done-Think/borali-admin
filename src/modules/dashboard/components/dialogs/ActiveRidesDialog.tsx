import { useState } from 'react'
import { Box, Chip, Dialog, DialogContent, DialogTitle, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { activeRides } from '../../data/mockDashboardData'
import type { ActiveRide } from '../../types'
import { currencyFormatter } from '../../utils/formatters'
import { ApplicationDetail } from '../ApplicationDetail'
import { RideRouteMap } from '../RideRouteMap'

export function ActiveRidesDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selectedRide, setSelectedRide] = useState<ActiveRide | null>(null)

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h4">Corridas ativas</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Motoristas em corrida, passageiro, rota e valor atual.
              </Typography>
            </Box>
            <Chip label={`${activeRides.length} em andamento`} color="secondary" variant="outlined" sx={{ fontWeight: 800 }} />
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table size="small" sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow>
                  {['#', 'Motorista', 'Passageiro', 'Partida', 'Destino', 'Valor'].map((header) => (
                    <TableCell key={header} sx={{ color: 'text.secondary', fontWeight: 800 }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {activeRides.map((ride) => (
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
                    <TableCell sx={{ fontWeight: 800 }}>{ride.id}</TableCell>
                    <TableCell>{ride.driver}</TableCell>
                    <TableCell>{ride.passenger}</TableCell>
                    <TableCell>{ride.origin}</TableCell>
                    <TableCell>{ride.destination}</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{currencyFormatter.format(ride.value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
      <ActiveRideMapDialog ride={selectedRide} onClose={() => setSelectedRide(null)} />
    </>
  )
}

function ActiveRideMapDialog({ ride, onClose }: { ride: ActiveRide | null; onClose: () => void }) {
  if (!ride) {
    return null
  }

  return (
    <Dialog open={Boolean(ride)} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="h4">Trajeto da corrida {ride.id}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {ride.driver} levando {ride.passenger} de {ride.origin} para {ride.destination}.
            </Typography>
          </Box>
          <Chip label={currencyFormatter.format(ride.value)} color="secondary" variant="outlined" sx={{ fontWeight: 800 }} />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
            <ApplicationDetail label="Motorista" value={ride.driver} />
            <ApplicationDetail label="Passageiro" value={ride.passenger} />
            <ApplicationDetail label="Status" value="Em andamento" />
          </Box>
          <RideRouteMap
            path={ride.path}
            driverPosition={ride.driverPosition}
            passengerPosition={ride.passengerPosition}
            driverLabel={`Motorista ${ride.driver}`}
            passengerLabel={`Destino de ${ride.passenger}`}
          />
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
            <ApplicationDetail label="Partida" value={ride.origin} />
            <ApplicationDetail label="Destino" value={ride.destination} />
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
