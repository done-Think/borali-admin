import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Box, Chip, Dialog, DialogContent, DialogTitle, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { alertRides } from '../../data/mockDashboardData'
import { currencyFormatter } from '../../utils/formatters'

export function AlertRidesDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4">Corridas em alerta</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Alertas acionados durante corridas em andamento.
            </Typography>
          </Box>
          <Chip label={`${alertRides.length} alertas ativos`} color="error" variant="outlined" sx={{ fontWeight: 800 }} />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <TableContainer>
          <Table size="small" sx={{ minWidth: 960 }}>
            <TableHead>
              <TableRow>
                {['#', 'Alerta', 'Quem se sentiu ameacado', 'Motorista', 'Passageiro', 'Partida', 'Destino', 'Valor'].map((header) => (
                  <TableCell key={header} sx={{ color: 'text.secondary', fontWeight: 800 }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {alertRides.map((ride) => (
                <TableRow key={ride.id} hover>
                  <TableCell sx={{ fontWeight: 800 }}>{ride.id}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 34, height: 34, borderRadius: '50%', display: 'grid', placeItems: 'center', color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.14)', flex: '0 0 auto' }}>
                        <WarningAmberIcon fontSize="small" />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 13 }}>{ride.alertedBy}</Typography>
                        <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                          {ride.alertTime}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 900 }}>{ride.threatenedPerson}</Typography>
                    <Typography color="error.main" sx={{ fontSize: 12, fontWeight: 700 }}>
                      {ride.alertReason}
                    </Typography>
                  </TableCell>
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
  )
}
