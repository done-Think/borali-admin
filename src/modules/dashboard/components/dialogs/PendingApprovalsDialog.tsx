import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, ButtonBase, Card, CardContent, Chip, Collapse, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import { driverApplications } from '../../data/dashboardData'
import { ApplicationDetail } from '../ApplicationDetail'

export function PendingApprovalsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const navigate = useNavigate()

  function openDriverRequest(application: (typeof driverApplications)[number]) {
    navigate('/approvals', { state: { selectedApprovalDriverId: application.id, selectedApprovalDriverName: application.name } })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4">Aprovacoes pendentes</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Novos possiveis motoristas aguardando analise cadastral.
            </Typography>
          </Box>
          <Chip label={`${driverApplications.length} cadastros`} color="secondary" variant="outlined" sx={{ fontWeight: 800 }} />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1.5}>
          {driverApplications.map((application) => {
            const expanded = expandedId === application.id
            return (
              <Card key={application.id} variant="outlined">
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
                    <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr 1fr' }, flex: 1, minWidth: 0 }}>
                      <CompactApplicationField label="Nome" value={application.name} />
                      <CompactApplicationField label="CPF" value={application.cpf} />
                      <CompactApplicationField label="Telefone" value={application.phone} />
                    </Box>
                    <ButtonBase onClick={() => setExpandedId(expanded ? null : application.id)} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, px: 1.5, py: 1, fontWeight: 800, color: 'text.primary', minWidth: 118 }}>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <span>{expanded ? 'Recolher' : 'Expandir'}</span>
                        <ExpandMoreIcon fontSize="small" sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 160ms ease' }} />
                      </Stack>
                    </ButtonBase>
                  </Stack>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' } }}>
                      <ApplicationDetail label="E-mail" value={application.email} />
                      <ApplicationDetail label="Cidade" value={application.city} />
                      <ApplicationDetail label="Veiculo" value={application.vehicle} />
                      <ApplicationDetail label="Placa" value={application.plate} />
                      <ApplicationDetail label="Categoria" value={application.category} />
                      <ApplicationDetail label="Solicitado em" value={application.requestedAt} />
                      <ApplicationDetail label="Prazo" value={application.expiresIn} />
                      <ApplicationDetail label="Protocolo" value={application.id} />
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gridColumn: { xs: 'auto', md: 'span 4' } }}>
                        <ButtonBase onClick={() => openDriverRequest(application)} sx={{ border: '1px solid', borderColor: 'secondary.main', borderRadius: 1.5, color: 'secondary.main', px: 2, py: 1, fontWeight: 800 }}>
                          Ver cadastro completo em Aprovações
                        </ButtonBase>
                      </Box>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            )
          })}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

function CompactApplicationField({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="baseline" sx={{ minWidth: 0 }}>
      <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 800, flex: '0 0 auto' }}>
        {label}
      </Typography>
      <Typography noWrap sx={{ fontWeight: 800, minWidth: 0 }}>
        {value}
      </Typography>
    </Stack>
  )
}
