import { Box, Card, CardContent, Chip, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import { driversAcceptingRides, driversAppOpenOnly } from '../../data/dashboardData'
import type { DriverAvailability } from '../../types'

export function OnlineDriversDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()

  function openDriverDetails(driverId: string) {
    navigate('/drivers', { state: { selectedDriverId: driverId, selectedDriverTab: 0 } })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4">Motoristas online</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Motoristas aceitando corrida e motoristas apenas com o app aberto.
            </Typography>
          </Box>
          <Chip label={`${driversAcceptingRides.length + driversAppOpenOnly.length} com app ativo`} color="secondary" variant="outlined" sx={{ fontWeight: 800 }} />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }, alignItems: 'start' }}>
          <DriverAvailabilitySection title="Aceitando corrida" subtitle="Motoristas online, ativos e disponiveis para receber chamadas." color="#2DD4A0" drivers={driversAcceptingRides} onSelectDriver={openDriverDetails} />
          <DriverAvailabilitySection title="App aberto, nao ativos" subtitle="Motoristas com aplicativo aberto, mas sem aceitar chamadas no momento." color="#F59E0B" drivers={driversAppOpenOnly} onSelectDriver={openDriverDetails} />
        </Box>
      </DialogContent>
    </Dialog>
  )
}

function DriverAvailabilitySection({
  title,
  subtitle,
  color,
  drivers,
  onSelectDriver,
}: {
  title: string
  subtitle: string
  color: string
  drivers: DriverAvailability[]
  onSelectDriver: (driverId: string) => void
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h4">{title}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          </Box>
          <Chip label={drivers.length} size="small" sx={{ color, borderColor: color, fontWeight: 900 }} variant="outlined" />
        </Stack>
        <Stack spacing={1.25}>
          {drivers.map((driver) => (
            <Box
              key={driver.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectDriver(driver.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectDriver(driver.id)
                }
              }}
              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 1.5, cursor: 'pointer', transition: '160ms ease', '&:hover': { borderColor: color, boxShadow: 2 } }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flex: '0 0 auto' }} />
                    <Typography sx={{ fontWeight: 900 }}>{driver.name}</Typography>
                  </Stack>
                  <Typography color="text.secondary" sx={{ mt: 0.35, fontSize: 12 }}>
                    {driver.phone} | {driver.city}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 13 }}>{driver.vehicle}</Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                    {driver.lastSeen}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}
