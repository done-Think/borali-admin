import { useEffect, useState } from 'react'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural'
import HistoryIcon from '@mui/icons-material/History'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useSnackbar } from 'notistack'
import { pendingApprovalDrivers, recentApprovalHistory } from '../data/mockApprovals'
import type { ApprovalDocument, ApprovalDriver } from '../types'

function getFaceCheckColor(status: ApprovalDriver['faceCheck']['status']) {
  if (status === 'Aprovado') {
    return 'success' as const
  }

  if (status === 'Reprovado') {
    return 'error' as const
  }

  return 'warning' as const
}

function getDocumentIcon(document: ApprovalDocument) {
  return document.format === 'PDF' ? <DescriptionOutlinedIcon /> : <ImageOutlinedIcon />
}

export default function ApprovalsPage() {
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()
  const [pendingDrivers, setPendingDrivers] = useState(pendingApprovalDrivers)
  const [approvalHistory, setApprovalHistory] = useState(recentApprovalHistory)

  function handleDecision(driver: ApprovalDriver, decision: 'Aprovado' | 'Rejeitado', reason?: string) {
    setPendingDrivers((current) => current.filter((item) => item.id !== driver.id))
    setApprovalHistory((current) => [
      {
        id: `hist-${driver.id}-${Date.now()}`,
        driverName: driver.name,
        decision,
        decidedAt: new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
        reviewer: 'Admin',
        reason,
      },
      ...current,
    ])
    enqueueSnackbar(
      decision === 'Aprovado'
        ? `${driver.name} aprovado com sucesso.`
        : `${driver.name} rejeitado e removido da fila.`,
      { variant: decision === 'Aprovado' ? 'success' : 'warning', autoHideDuration: 2000 },
    )
  }

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('approvals:pending-count', { detail: pendingDrivers.length }))
  }, [pendingDrivers.length])

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
        <Box>
          <Typography variant="h3" component="h1">
            Aprovações
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Fila de motoristas aguardando validação cadastral e documental.
          </Typography>
        </Box>
        <Chip
          icon={<AssignmentTurnedInIcon />}
          label={`${pendingDrivers.length} pendentes`}
          color="error"
          variant="outlined"
          sx={{ fontWeight: 900 }}
        />
      </Stack>

      <Stack spacing={1.5}>
        {pendingDrivers.map((driver) => (
          <ApprovalDriverCard key={driver.id} driver={driver} onDecision={handleDecision} />
        ))}
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <HistoryIcon color="action" />
            <Box>
              <Typography variant="h4">Histórico recente</Typography>
              <Typography color="text.secondary" variant="body2">
                Últimas decisões da fila de aprovação.
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={1} divider={<Divider flexItem />}>
            {approvalHistory.map((item) => (
              <Stack key={item.id} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" sx={{ py: 1 }}>
                <Box>
                  <Typography fontWeight={900}>{item.driverName}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {item.decidedAt} · {item.reviewer}
                  </Typography>
                  {item.reason ? (
                    <Typography color="text.secondary" variant="body2" sx={{ mt: 0.25 }}>
                      Motivo: {item.reason}
                    </Typography>
                  ) : null}
                </Box>
                <Chip
                  label={item.decision}
                  color={item.decision === 'Aprovado' ? 'success' : 'error'}
                  size="small"
                  sx={{ fontWeight: 800 }}
                />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

function ApprovalDriverCard({
  driver,
  onDecision,
}: {
  driver: ApprovalDriver
  onDecision: (driver: ApprovalDriver, decision: 'Aprovado' | 'Rejeitado', reason?: string) => void
}) {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<ApprovalDocument | null>(null)
  const [rejectionMode, setRejectionMode] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const faceCheckColor = getFaceCheckColor(driver.faceCheck.status)

  function submitRejection() {
    if (!rejectionReason.trim()) {
      return
    }

    onDecision(driver, 'Rejeitado', rejectionReason.trim())
  }

  return (
    <Card variant="outlined">
      <ButtonBase
        onClick={() => setExpanded((current) => !current)}
        sx={{ width: '100%', display: 'block', textAlign: 'left', borderRadius: 'inherit' }}
        aria-expanded={expanded}
        aria-controls={`approval-driver-${driver.id}`}
      >
        <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
              <Avatar
                sx={{
                  width: 46,
                  height: 46,
                  bgcolor: 'rgba(239, 68, 68, 0.12)',
                  color: theme.palette.error.main,
                  fontWeight: 900,
                }}
              >
                {driver.initials}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={900} noWrap>
                  {driver.name}
                </Typography>
                <Typography color="text.secondary" variant="body2" noWrap>
                  {driver.id} · {driver.city} · {driver.phone}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip label={driver.category} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
              <Chip label={`${driver.documents.length} documentos`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 800 }} />
              <Chip
                label={`${driver.faceCheck.status} · ${driver.faceCheck.score.toFixed(1)}%`}
                color={faceCheckColor}
                size="small"
                sx={{ fontWeight: 800 }}
              />
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  display: 'grid',
                  placeItems: 'center',
                  color: 'text.secondary',
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: theme.transitions.create('transform', { duration: theme.transitions.duration.shortest }),
                }}
              >
                <ExpandMoreIcon fontSize="small" />
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </ButtonBase>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent id={`approval-driver-${driver.id}`} sx={{ pt: 0, px: 1.75, pb: 1.75, '&:last-child': { pb: 1.75 } }}>
          <Divider sx={{ mb: 1.75 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.1fr 1fr 0.9fr' }, gap: 1.5 }}>
            <Card variant="outlined">
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="h5">Cadastro</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.25, mt: 1.25 }}>
                  <DetailItem label="Categoria" value={driver.category} />
                  <DetailItem label="Solicitado" value={driver.requestedAt} />
                  <DetailItem label="Veículo" value={driver.vehicle} />
                  <DetailItem label="Placa" value={driver.plate} />
                  <DetailItem label="Cidade" value={driver.city} />
                  <DetailItem label="Telefone" value={driver.phone} />
                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="h5">Documentos</Typography>
                <Stack divider={<Divider flexItem />} sx={{ mt: 1 }}>
                  {driver.documents.map((document) => (
                    <ButtonBase
                      key={document.id}
                      onClick={() => setSelectedDocument(document)}
                      sx={{
                        display: 'block',
                        width: '100%',
                        borderRadius: 1,
                        textAlign: 'left',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                    <Stack direction="row" spacing={1.25} alignItems="center" justifyContent="space-between" sx={{ py: 1, px: 0.75 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                        <Box sx={{ color: 'text.secondary', display: 'grid', placeItems: 'center', '& svg': { fontSize: 20 } }}>
                          {getDocumentIcon(document)}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography fontWeight={800} noWrap>
                            {document.type}
                          </Typography>
                          <Typography color="text.secondary" variant="body2" noWrap>
                            {document.name}
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip label={document.format} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                    </Stack>
                    </ButtonBase>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FaceRetouchingNaturalIcon color={faceCheckColor} />
                  <Box>
                    <Typography variant="h5">Face check</Typography>
                    <Typography color="text.secondary" variant="body2">
                      Selfie vs. documento
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between" spacing={1}>
                    <Typography color="text.secondary" variant="body2">
                      Score CompreFace
                    </Typography>
                    <Typography fontWeight={900}>{driver.faceCheck.score.toFixed(1)}%</Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={driver.faceCheck.score}
                    color={faceCheckColor}
                    sx={{ mt: 1, height: 8, borderRadius: 999 }}
                  />
                  <Chip label={driver.faceCheck.status} color={faceCheckColor} sx={{ mt: 1.5, fontWeight: 800 }} />
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Card variant="outlined" sx={{ mt: 1.5 }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={1.5}
                alignItems={{ xs: 'stretch', md: 'center' }}
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h5">Decisão do cadastro</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Aprove o motorista ou informe o motivo da rejeição.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} justifyContent={{ xs: 'stretch', md: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => onDecision(driver, 'Aprovado')}
                    sx={{ fontWeight: 900, textTransform: 'none' }}
                  >
                    Aprovar
                  </Button>
                  <Button
                    variant={rejectionMode ? 'contained' : 'outlined'}
                    color="error"
                    onClick={() => setRejectionMode((current) => !current)}
                    sx={{ fontWeight: 900, textTransform: 'none' }}
                  >
                    Rejeitar
                  </Button>
                </Stack>
              </Stack>

              {rejectionMode ? (
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', md: 'flex-start' }} sx={{ mt: 1.5 }}>
                  <TextField
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                    label="Motivo da rejeição"
                    placeholder="Ex.: documento ilegível, divergência facial, CRLV vencido"
                    size="small"
                    multiline
                    minRows={2}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="error"
                    disabled={!rejectionReason.trim()}
                    onClick={submitRejection}
                    sx={{ fontWeight: 900, textTransform: 'none', minWidth: 150 }}
                  >
                    Confirmar
                  </Button>
                </Stack>
              ) : null}
            </CardContent>
          </Card>
        </CardContent>
      </Collapse>

      <DocumentPreviewDialog
        driver={driver}
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </Card>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography color="text.secondary" variant="caption">
        {label}
      </Typography>
      <Typography fontWeight={800} variant="body2" noWrap>
        {value}
      </Typography>
    </Box>
  )
}

function DocumentPreviewDialog({
  driver,
  document,
  onClose,
}: {
  driver: ApprovalDriver
  document: ApprovalDocument | null
  onClose: () => void
}) {
  const theme = useTheme()

  return (
    <Dialog open={Boolean(document)} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 7 }}>
        <Box>
          <Typography variant="h4" component="span">
            {document?.type ?? 'Documento'}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {driver.name} · {document?.name}
          </Typography>
        </Box>

        <IconButton aria-label="Fechar visualizador" onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {document ? (
          <Stack spacing={2}>
            <Box
              sx={{
                minHeight: { xs: 320, md: 460 },
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                bgcolor: 'background.default',
                display: 'grid',
                placeItems: 'center',
                overflow: 'hidden',
              }}
            >
              {document.format === 'PDF' ? (
                <Stack spacing={1.5} alignItems="center" sx={{ px: 3, textAlign: 'center' }}>
                  <DescriptionOutlinedIcon sx={{ fontSize: 72, color: theme.palette.error.main }} />
                  <Typography variant="h4">{document.name}</Typography>
                  <Typography color="text.secondary">
                    Prévia de PDF mockada. Na integração real, este painel recebe o arquivo assinado da API.
                  </Typography>
                </Stack>
              ) : (
                <Box
                  sx={{
                    width: 'min(100%, 560px)',
                    aspectRatio: '4 / 3',
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    background:
                      'linear-gradient(135deg, rgba(10, 190, 233, 0.16), rgba(45, 212, 160, 0.14))',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Stack spacing={1.25} alignItems="center" sx={{ textAlign: 'center', px: 3 }}>
                    <ImageOutlinedIcon sx={{ fontSize: 72, color: theme.palette.secondary.main }} />
                    <Typography variant="h4">{document.name}</Typography>
                    <Typography color="text.secondary">
                      Prévia de imagem mockada para revisão documental.
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5 }}>
              <DetailItem label="Motorista" value={driver.name} />
              <DetailItem label="Arquivo" value={document.name} />
              <DetailItem label="Formato" value={document.format} />
            </Box>
          </Stack>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
