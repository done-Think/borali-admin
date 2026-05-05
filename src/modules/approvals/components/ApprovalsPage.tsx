import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import HistoryIcon from '@mui/icons-material/History'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
import { pendingApprovalDrivers, recentApprovalHistory } from '../data/mockApprovals'

export default function ApprovalsPage() {
  const theme = useTheme()

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
          label={`${pendingApprovalDrivers.length} pendentes`}
          color="error"
          variant="outlined"
          sx={{ fontWeight: 900 }}
        />
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Box>
              <Typography variant="h4">Fila de aprovação</Typography>
              <Typography color="text.secondary" variant="body2">
                Motoristas com status PENDING aguardando revisão.
              </Typography>
            </Box>
          </Stack>

          <TableContainer>
            <Table sx={{ minWidth: 820 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Motorista</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Documentos</TableCell>
                  <TableCell>Face check</TableCell>
                  <TableCell>Solicitado em</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingApprovalDrivers.map((driver) => (
                  <TableRow key={driver.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: 'rgba(239, 68, 68, 0.12)',
                            color: theme.palette.error.main,
                            fontWeight: 900,
                          }}
                        >
                          {driver.initials}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography fontWeight={900}>{driver.name}</Typography>
                          <Typography color="text.secondary" variant="body2">
                            {driver.id} · {driver.city}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{driver.category}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                        {driver.documents.map((document) => (
                          <Chip key={document.id} label={document.type} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${driver.faceCheck.status} · ${driver.faceCheck.score.toFixed(1)}%`}
                        color={driver.faceCheck.status === 'Aprovado' ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 800 }}
                      />
                    </TableCell>
                    <TableCell>{driver.requestedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

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

          <Stack spacing={1} divider={<Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} />}>
            {recentApprovalHistory.map((item) => (
              <Stack key={item.id} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" sx={{ py: 1 }}>
                <Box>
                  <Typography fontWeight={900}>{item.driverName}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {item.decidedAt} · {item.reviewer}
                  </Typography>
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
