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
  CircularProgress,
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
import { useLocation } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  approveDriver,
  fetchPendingDrivers,
  rejectDriver,
  reviewDocument,
} from '../services'
import type { ApprovalDocument, ApprovalDriver, ApprovalHistoryItem, PendingDriver } from '../types'

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

const categoryLabel: Record<string, string> = {
  ECONOMY: 'Econômico',
  COMFORT: 'Conforto',
  EXECUTIVE: 'Executivo',
}

function formatDate(iso?: string | null) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

function formatDocType(type: string): ApprovalDocument['type'] {
  if (type === 'CNH') return 'CNH'
  if (type === 'CRLV') return 'CRLV'
  if (type === 'VEHICLE_PHOTO') return 'Foto do veiculo'
  if (type === 'FACE_CHECK') return 'Selfie'
  return 'CNH'
}

/** Map a PendingDriver from the API to the ApprovalDriver shape used by the UI */
function mapPendingDriver(pending: PendingDriver): ApprovalDriver {
  const u = pending.user
  const v = pending.vehicles?.[0]

  const name = u?.name ?? 'Motorista'
  const initials = name.split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('')

  const city = u?.city && u?.state ? `${u.city}, ${u.state}` : (u?.city ?? '—')
  const address = u?.street && u?.number ? `${u.street}, ${u.number}` : (u?.street ?? '—')

  const faceStatus = u?.faceCheckStatus
  const faceCheckUiStatus: ApprovalDriver['faceCheck']['status'] =
    faceStatus === 'VERIFIED' ? 'Aprovado' : faceStatus === 'REJECTED' ? 'Reprovado' : 'Revisar'

  return {
    id: pending.userId,
    driverId: pending.id,
    name,
    initials,
    email: u?.email ?? '—',
    cpf: u?.cpf ?? '—',
    birthDate: '—',
    category: v ? (categoryLabel[v.category] ?? v.category) : '—',
    city,
    address,
    neighborhood: u?.neighborhood ?? '—',
    zipCode: u?.zipCode ?? '—',
    phone: u?.phone ?? '—',
    cnhCategory: pending.cnhCategory ?? '—',
    cnhExpiresAt: pending.cnhExpiry ? new Intl.DateTimeFormat('pt-BR').format(new Date(pending.cnhExpiry)) : '—',
    vehicle: v ? `${v.brand} ${v.model}` : '—',
    vehicleYear: v ? String(v.year) : '—',
    vehicleColor: v?.color ?? '—',
    plate: v?.plate ?? '—',
    bankName: '—',
    bankAgency: '—',
    bankAccount: '—',
    emergencyContact: '—',
    emergencyPhone: '—',
    referralSource: '—',
    requestedAt: formatDate(pending.createdAt),
    status: 'PENDING',
    documents: (pending.documents ?? []).map((doc) => ({
      id: doc.id,
      type: formatDocType(doc.type),
      name: doc.type,
      format: 'Imagem' as const,
      url: doc.url,
      status: doc.status,
    })),
    faceCheck: { score: 0, status: faceCheckUiStatus },
  }
}

export default function ApprovalsPage() {
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const locationState = location.state as { selectedApprovalDriverId?: string; selectedApprovalDriverName?: string } | null
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistoryItem[]>([])
  const [selectedHistory, setSelectedHistory] = useState<ApprovalHistoryItem | null>(null)

  const { data: rawPendingDrivers = [], isLoading } = useQuery({
    queryKey: ['approvals', 'pending'],
    queryFn: fetchPendingDrivers,
    refetchInterval: 30_000,
  })

  const pendingDrivers: ApprovalDriver[] = rawPendingDrivers.map(mapPendingDriver)

  const approveMutation = useMutation({
    mutationFn: (driverId: string) => approveDriver(driverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals', 'pending'] })
    },
    onError: () => {
      enqueueSnackbar('Erro ao aprovar motorista', { variant: 'error' })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectDriver(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals', 'pending'] })
    },
    onError: () => {
      enqueueSnackbar('Erro ao reprovar motorista', { variant: 'error' })
    },
  })

  function getDecisionTimestamp() {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date())
  }

  function handleDecision(driver: ApprovalDriver, decision: 'Aprovado' | 'Rejeitado', reason?: string) {
    const driverId = driver.driverId

    if (decision === 'Aprovado') {
      approveMutation.mutate(driverId, {
        onSuccess: () => {
          setApprovalHistory((current) => [
            {
              id: `hist-${driver.id}-${Date.now()}`,
              driverName: driver.name,
              decision,
              decidedAt: getDecisionTimestamp(),
              reviewer: 'Admin',
              driver,
            },
            ...current,
          ])
          enqueueSnackbar(`${driver.name} aprovado com sucesso.`, { variant: 'success', autoHideDuration: 2000 })
        },
      })
    } else {
      rejectMutation.mutate({ id: driverId, reason: reason ?? '' }, {
        onSuccess: () => {
          setApprovalHistory((current) => [
            {
              id: `hist-${driver.id}-${Date.now()}`,
              driverName: driver.name,
              decision,
              decidedAt: getDecisionTimestamp(),
              reviewer: 'Admin',
              driver,
              reason,
            },
            ...current,
          ])
          enqueueSnackbar(`${driver.name} rejeitado e removido da fila.`, { variant: 'warning', autoHideDuration: 2000 })
        },
      })
    }
  }

  function handleReviewHistory(item: ApprovalHistoryItem, decision: 'Aprovado' | 'Rejeitado', reason?: string) {
    const reviewedItem: ApprovalHistoryItem = {
      ...item,
      decision,
      decidedAt: getDecisionTimestamp(),
      reviewer: 'Admin',
      reason: decision === 'Rejeitado' ? reason : undefined,
    }

    setApprovalHistory((current) => current.map((historyItem) => (historyItem.id === item.id ? reviewedItem : historyItem)))
    setSelectedHistory(reviewedItem)
    enqueueSnackbar(
      decision === 'Aprovado'
        ? `${item.driverName} marcado como aprovado.`
        : `${item.driverName} marcado como rejeitado.`,
      { variant: decision === 'Aprovado' ? 'success' : 'warning', autoHideDuration: 2000 },
    )
  }

  function handleRestoreToApprovals(item: ApprovalHistoryItem) {
    setApprovalHistory((current) => current.filter((historyItem) => historyItem.id !== item.id))
    setSelectedHistory(null)
    enqueueSnackbar(`${item.driverName} voltou para a fila de aprovações.`, { variant: 'info', autoHideDuration: 2000 })
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

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : pendingDrivers.length === 0 ? (
        <Card variant="outlined">
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <AssignmentTurnedInIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5, display: 'block', mx: 'auto' }} />
            <Typography fontWeight={800}>Nenhuma aprovação pendente</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Novos cadastros de motoristas aparecerão aqui para revisão.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={1.5}>
          {pendingDrivers.map((driver) => (
            <ApprovalDriverCard
              key={driver.driverId}
              driver={driver}
              initialExpanded={
                driver.driverId === locationState?.selectedApprovalDriverId ||
                driver.name === locationState?.selectedApprovalDriverName
              }
              onDecision={handleDecision}
            />
          ))}
        </Stack>
      )}

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
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedHistory(item)}
                    sx={{ fontWeight: 900, textTransform: 'none' }}
                  >
                    Ver
                  </Button>
                  <Chip
                    label={item.decision}
                    color={item.decision === 'Aprovado' ? 'success' : 'error'}
                    size="small"
                    sx={{ fontWeight: 800 }}
                  />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {selectedHistory ? (
        <FullRegistrationDialog
          driver={selectedHistory.driver}
          open
          decision={selectedHistory.decision}
          decidedAt={selectedHistory.decidedAt}
          reviewer={selectedHistory.reviewer}
          reason={selectedHistory.reason}
          onReviewDecision={(decision, reason) => handleReviewHistory(selectedHistory, decision, reason)}
          onRestoreToApprovals={() => handleRestoreToApprovals(selectedHistory)}
          onClose={() => setSelectedHistory(null)}
        />
      ) : null}
    </Stack>
  )
}

function ApprovalDriverCard({
  driver,
  initialExpanded = false,
  onDecision,
}: {
  driver: ApprovalDriver
  initialExpanded?: boolean
  onDecision: (driver: ApprovalDriver, decision: 'Aprovado' | 'Rejeitado', reason?: string) => void
}) {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(initialExpanded)
  const [selectedDocument, setSelectedDocument] = useState<ApprovalDocument | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [rejectionMode, setRejectionMode] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const faceCheckColor = getFaceCheckColor(driver.faceCheck.status)

  useEffect(() => {
    if (initialExpanded) {
      setExpanded(true)
    }
  }, [initialExpanded])

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
        aria-controls={`approval-driver-${driver.driverId}`}
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
                  {driver.driverId} · {driver.city} · {driver.phone}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              {driver.category ? <Chip label={driver.category} size="small" variant="outlined" sx={{ fontWeight: 800 }} /> : null}
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
        <CardContent id={`approval-driver-${driver.driverId}`} sx={{ pt: 0, px: 1.75, pb: 1.75, '&:last-child': { pb: 1.75 } }}>
          <Divider sx={{ mb: 1.75 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.1fr 1fr 0.9fr' }, gap: 1.5 }}>
            <Card variant="outlined">
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Typography variant="h5">Cadastro</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setProfileOpen(true)}
                    sx={{ fontWeight: 900, textTransform: 'none' }}
                  >
                    Ver mais
                  </Button>
                </Stack>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.25, mt: 1.25 }}>
                  <DetailItem label="Categoria" value={driver.category || '—'} />
                  <DetailItem label="Solicitado" value={driver.requestedAt || '—'} />
                  <DetailItem label="Veículo" value={driver.vehicle || '—'} />
                  <DetailItem label="Placa" value={driver.plate || '—'} />
                  <DetailItem label="Cidade" value={driver.city || '—'} />
                  <DetailItem label="Telefone" value={driver.phone || '—'} />
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
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Chip label={document.format} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                        {document.status !== 'PENDING' ? (
                          <Chip
                            label={document.status === 'APPROVED' ? 'Aprovado' : 'Reprovado'}
                            color={document.status === 'APPROVED' ? 'success' : 'error'}
                            size="small"
                            sx={{ fontWeight: 800 }}
                          />
                        ) : null}
                      </Stack>
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
      <FullRegistrationDialog
        driver={driver}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
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

function FullRegistrationDialog({
  driver,
  open,
  decision,
  decidedAt,
  reviewer,
  reason,
  onReviewDecision,
  onRestoreToApprovals,
  onClose,
}: {
  driver: ApprovalDriver
  open: boolean
  decision?: ApprovalHistoryItem['decision']
  decidedAt?: string
  reviewer?: string
  reason?: string
  onReviewDecision?: (decision: ApprovalHistoryItem['decision'], reason?: string) => void
  onRestoreToApprovals?: () => void
  onClose: () => void
}) {
  const [reviewMode, setReviewMode] = useState(false)
  const [reviewReason, setReviewReason] = useState(reason ?? '')

  useEffect(() => {
    setReviewReason(reason ?? '')
    setReviewMode(false)
  }, [driver.id, reason])

  function submitReview(decisionValue: ApprovalHistoryItem['decision']) {
    if (decisionValue === 'Rejeitado' && !reviewReason.trim()) {
      return
    }

    onReviewDecision?.(decisionValue, decisionValue === 'Rejeitado' ? reviewReason.trim() : undefined)
    setReviewMode(false)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ pr: 7 }}>
        <Box>
          <Typography variant="h4" component="span">
            Cadastro completo
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {driver.name} · {driver.driverId}
          </Typography>
        </Box>

        <IconButton aria-label="Fechar cadastro completo" onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={1.5}>
          {decision ? (
            <Card variant="outlined">
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
                  <Box>
                    <Typography variant="h5">Decisao registrada</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {decidedAt} · {reviewer}
                    </Typography>
                    {reason ? (
                      <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                        Motivo: {reason}
                      </Typography>
                    ) : null}
                  </Box>
                  <Chip
                    label={decision}
                    color={decision === 'Aprovado' ? 'success' : 'error'}
                    sx={{ fontWeight: 900 }}
                  />
                </Stack>
              </CardContent>
            </Card>
          ) : null}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5 }}>
            <RegistrationSection
              title="Dados pessoais"
              items={[
                { label: 'Nome completo', value: driver.name },
                { label: 'CPF', value: driver.cpf || '—' },
                { label: 'Nascimento', value: driver.birthDate || '—' },
                { label: 'E-mail', value: driver.email },
                { label: 'Telefone', value: driver.phone || '—' },
                { label: 'Origem', value: driver.referralSource || '—' },
              ]}
            />
            <RegistrationSection
              title="Endereco"
              items={[
                { label: 'Cidade', value: driver.city || '—' },
                { label: 'Bairro', value: driver.neighborhood || '—' },
                { label: 'Endereco', value: driver.address || '—' },
                { label: 'CEP', value: driver.zipCode || '—' },
              ]}
            />
            <RegistrationSection
              title="CNH"
              items={[
                { label: 'Categoria CNH', value: driver.cnhCategory || '—' },
                { label: 'Validade', value: driver.cnhExpiresAt || '—' },
                { label: 'Status face check', value: driver.faceCheck.status },
                { label: 'Score face check', value: `${driver.faceCheck.score.toFixed(1)}%` },
              ]}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5 }}>
            <RegistrationSection
              title="Veiculo"
              items={[
                { label: 'Modelo', value: driver.vehicle || '—' },
                { label: 'Ano', value: driver.vehicleYear || '—' },
                { label: 'Cor', value: driver.vehicleColor || '—' },
                { label: 'Placa', value: driver.plate || '—' },
                { label: 'Categoria', value: driver.category || '—' },
              ]}
            />
            <RegistrationSection
              title="Dados bancarios"
              items={[
                { label: 'Banco', value: driver.bankName || '—' },
                { label: 'Agencia', value: driver.bankAgency || '—' },
                { label: 'Conta', value: driver.bankAccount || '—' },
              ]}
            />
            <RegistrationSection
              title="Emergencia"
              items={[
                { label: 'Contato', value: driver.emergencyContact || '—' },
                { label: 'Telefone', value: driver.emergencyPhone || '—' },
                { label: 'Solicitado em', value: driver.requestedAt || '—' },
              ]}
            />
          </Box>

          {decision && onReviewDecision ? (
            <Card variant="outlined">
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1.5}
                  alignItems={{ xs: 'stretch', md: 'center' }}
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="h5">Rever decisão</Typography>
                    <Typography color="text.secondary" variant="body2">
                      Altere o resultado registrado ou devolva o cadastro para a fila de aprovações.
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} justifyContent={{ xs: 'stretch', md: 'flex-end' }} flexWrap="wrap" useFlexGap>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => submitReview('Aprovado')}
                      sx={{ fontWeight: 900, textTransform: 'none' }}
                    >
                      Aprovar
                    </Button>
                    <Button
                      variant={reviewMode ? 'contained' : 'outlined'}
                      color="error"
                      onClick={() => setReviewMode((current) => !current)}
                      sx={{ fontWeight: 900, textTransform: 'none' }}
                    >
                      Rejeitar
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={onRestoreToApprovals}
                      sx={{ fontWeight: 900, textTransform: 'none' }}
                    >
                      Voltar para aprovações
                    </Button>
                  </Stack>
                </Stack>

                {reviewMode ? (
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', md: 'flex-start' }} sx={{ mt: 1.5 }}>
                    <TextField
                      value={reviewReason}
                      onChange={(event) => setReviewReason(event.target.value)}
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
                      disabled={!reviewReason.trim()}
                      onClick={() => submitReview('Rejeitado')}
                      sx={{ fontWeight: 900, textTransform: 'none', minWidth: 150 }}
                    >
                      Confirmar
                    </Button>
                  </Stack>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

function RegistrationSection({
  title,
  items,
}: {
  title: string
  items: Array<{ label: string; value: string }>
}) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="h5" sx={{ mb: 1.25 }}>
          {title}
        </Typography>
        <Stack spacing={1}>
          {items.map((item) => (
            <DetailItem key={`${title}-${item.label}`} label={item.label} value={item.value} />
          ))}
        </Stack>
      </CardContent>
    </Card>
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
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const [rejectionNotesMode, setRejectionNotesMode] = useState(false)
  const [rejectionNotes, setRejectionNotes] = useState('')

  const reviewDocMutation = useMutation({
    mutationFn: ({ docId, status, notes }: { docId: string; status: 'APPROVED' | 'REJECTED'; notes?: string }) =>
      reviewDocument(docId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals', 'pending'] })
    },
    onError: () => {
      enqueueSnackbar('Erro ao revisar documento', { variant: 'error' })
    },
  })

  // Reset notes state when the dialog opens a new document
  useEffect(() => {
    setRejectionNotesMode(false)
    setRejectionNotes('')
  }, [document?.id])

  function handleApproveDocument() {
    if (!document) return
    reviewDocMutation.mutate(
      { docId: document.id, status: 'APPROVED' },
      {
        onSuccess: () => {
          enqueueSnackbar(`Documento "${document.type}" aprovado.`, { variant: 'success', autoHideDuration: 2000 })
          onClose()
        },
      },
    )
  }

  function handleRejectDocument() {
    if (!document) return
    reviewDocMutation.mutate(
      { docId: document.id, status: 'REJECTED', notes: rejectionNotes.trim() || undefined },
      {
        onSuccess: () => {
          enqueueSnackbar(`Documento "${document.type}" reprovado.`, { variant: 'warning', autoHideDuration: 2000 })
          onClose()
        },
      },
    )
  }

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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                p: 1,
              }}
            >
              {document.format === 'PDF' ? (
                document.url ? (
                  <Stack spacing={1.5} alignItems="center" sx={{ px: 3, textAlign: 'center' }}>
                    <DescriptionOutlinedIcon sx={{ fontSize: 72, color: theme.palette.error.main }} />
                    <Typography variant="h4">{document.name}</Typography>
                    <Button
                      variant="outlined"
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ fontWeight: 900, textTransform: 'none' }}
                    >
                      Abrir PDF
                    </Button>
                  </Stack>
                ) : (
                  <Stack spacing={1.5} alignItems="center" sx={{ px: 3, textAlign: 'center' }}>
                    <DescriptionOutlinedIcon sx={{ fontSize: 72, color: theme.palette.error.main }} />
                    <Typography variant="h4">{document.name}</Typography>
                    <Typography color="text.secondary">URL do documento não disponível.</Typography>
                  </Stack>
                )
              ) : document.url ? (
                <img
                  src={document.url}
                  alt={document.name}
                  style={{ width: '100%', maxHeight: 480, objectFit: 'contain', borderRadius: 8 }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
              ) : (
                <Stack spacing={1.25} alignItems="center" sx={{ textAlign: 'center', px: 3 }}>
                  <ImageOutlinedIcon sx={{ fontSize: 72, color: theme.palette.secondary.main }} />
                  <Typography variant="h4">{document.name}</Typography>
                  <Typography color="text.secondary">URL da imagem não disponível.</Typography>
                </Stack>
              )}
              {/* Fallback shown via onError above — hidden by default */}
              {document.format !== 'PDF' && document.url ? (
                <Stack
                  spacing={1.25}
                  alignItems="center"
                  sx={{ textAlign: 'center', px: 3, display: 'none' }}
                >
                  <ImageOutlinedIcon sx={{ fontSize: 72, color: theme.palette.secondary.main }} />
                  <Typography variant="h4">{document.name}</Typography>
                  <Typography color="text.secondary">Imagem indisponível.</Typography>
                </Stack>
              ) : null}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5 }}>
              <DetailItem label="Motorista" value={driver.name} />
              <DetailItem label="Arquivo" value={document.name} />
              <DetailItem label="Formato" value={document.format} />
            </Box>

            {/* T016 — individual document review buttons */}
            <Card variant="outlined">
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="h5">Revisão do documento</Typography>
                    <Typography color="text.secondary" variant="body2">
                      Aprove ou reprove este documento individualmente.
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} justifyContent={{ xs: 'stretch', sm: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="success"
                      disabled={reviewDocMutation.isPending}
                      onClick={handleApproveDocument}
                      sx={{ fontWeight: 900, textTransform: 'none' }}
                    >
                      Aprovar documento
                    </Button>
                    <Button
                      variant={rejectionNotesMode ? 'contained' : 'outlined'}
                      color="error"
                      disabled={reviewDocMutation.isPending}
                      onClick={() => setRejectionNotesMode((current) => !current)}
                      sx={{ fontWeight: 900, textTransform: 'none' }}
                    >
                      Reprovar documento
                    </Button>
                  </Stack>
                </Stack>

                {rejectionNotesMode ? (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', sm: 'flex-start' }} sx={{ mt: 1.5 }}>
                    <TextField
                      value={rejectionNotes}
                      onChange={(event) => setRejectionNotes(event.target.value)}
                      label="Observações (opcional)"
                      placeholder="Ex.: documento ilegível, foto cortada, data vencida"
                      size="small"
                      multiline
                      minRows={2}
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      color="error"
                      disabled={reviewDocMutation.isPending}
                      onClick={handleRejectDocument}
                      sx={{ fontWeight: 900, textTransform: 'none', minWidth: 150 }}
                    >
                      Confirmar
                    </Button>
                  </Stack>
                ) : null}
              </CardContent>
            </Card>
          </Stack>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
