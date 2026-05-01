import { useEffect, useMemo, useState } from 'react'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import {
  Avatar,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { supportTickets, type SupportTicket } from '@shared/mocks/supportTickets'
import { useSearchParams } from 'react-router'

type SupportFilter = 'all' | 'drivers' | 'passengers'
type SupportSubFilter = 'pending' | 'resolved'

const supportFilters: Array<{ value: SupportFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'drivers', label: 'Motoristas' },
  { value: 'passengers', label: 'Passageiros' },
]

const supportSubFilters: Array<{ value: SupportSubFilter; label: string }> = [
  { value: 'pending', label: 'Pendente' },
  { value: 'resolved', label: 'Resolvido' },
]

const numberFormatter = new Intl.NumberFormat('pt-BR')

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function hasUnorderedCharacters(source: string, query: string) {
  const sourceCharacters = [...normalizeSearch(source)]
  return [...normalizeSearch(query)].every((character) => {
    if (character.trim() === '') {
      return true
    }

    const index = sourceCharacters.indexOf(character)
    if (index === -1) {
      return false
    }

    sourceCharacters.splice(index, 1)
    return true
  })
}

function getSearchText(ticket: SupportTicket) {
  return [
    ticket.user.name,
    ticket.user.cpf,
    ticket.user.phone,
    ticket.user.email,
    ticket.protocol,
    ticket.occurrence.rideId,
  ].join(' ')
}

function matchesTicketSearch(ticket: SupportTicket, query: string) {
  const normalizedQuery = normalizeSearch(query).trim()
  const searchableText = getSearchText(ticket)
  const normalizedText = normalizeSearch(searchableText)

  return !normalizedQuery || normalizedText.includes(normalizedQuery) || hasUnorderedCharacters(searchableText, normalizedQuery)
}

export default function SupportPage() {
  const theme = useTheme()
  const [searchParams] = useSearchParams()
  const highlightedTicketProtocol = searchParams.get('ticket')
  const [tickets, setTickets] = useState(supportTickets)
  const [previousStatuses, setPreviousStatuses] = useState<Record<string, string>>({})
  const [selectedFilter, setSelectedFilter] = useState<SupportFilter>('all')
  const [selectedSubFilter, setSelectedSubFilter] = useState<SupportSubFilter>('pending')
  const [resolvedSearchInput, setResolvedSearchInput] = useState('')
  const [selectedUserTicket, setSelectedUserTicket] = useState<SupportTicket | null>(null)
  const [userDialogTab, setUserDialogTab] = useState(0)

  const scopedTickets = useMemo(() => {
    if (selectedFilter === 'drivers') {
      return tickets.filter((ticket) => ticket.user.role === 'driver')
    }

    if (selectedFilter === 'passengers') {
      return tickets.filter((ticket) => ticket.user.role === 'passenger')
    }

    return tickets
  }, [selectedFilter, tickets])

  const resolvedTickets = useMemo(
    () => scopedTickets.filter((ticket) => ticket.status === 'Resolvido'),
    [scopedTickets],
  )

  useEffect(() => {
    if (!highlightedTicketProtocol) {
      return
    }

    const ticket = tickets.find((item) => item.protocol === highlightedTicketProtocol)
    if (!ticket) {
      return
    }

    if (ticket.user.role === 'driver') {
      setSelectedFilter('drivers')
    } else if (ticket.user.role === 'passenger') {
      setSelectedFilter('passengers')
    }

    if (ticket.status === 'Resolvido') {
      setSelectedSubFilter('resolved')
      setResolvedSearchInput(ticket.protocol)
    } else {
      setSelectedSubFilter('pending')
    }
  }, [highlightedTicketProtocol, tickets])

  const filteredTickets = useMemo(() => {
    if (selectedFilter !== 'all' && selectedSubFilter === 'resolved') {
      return resolvedTickets.filter((ticket) => matchesTicketSearch(ticket, resolvedSearchInput))
    }

    if (selectedFilter !== 'all' && selectedSubFilter === 'pending') {
      return scopedTickets.filter((ticket) => ticket.status !== 'Resolvido')
    }

    return scopedTickets
  }, [resolvedSearchInput, resolvedTickets, scopedTickets, selectedFilter, selectedSubFilter])

  function handleFilterChange(_: React.MouseEvent<HTMLElement>, value: SupportFilter | null) {
    if (value) {
      setSelectedFilter(value)
      setSelectedSubFilter('pending')
      setResolvedSearchInput('')
    }
  }

  function handleSubFilterChange(_: React.MouseEvent<HTMLElement>, value: SupportSubFilter | null) {
    if (value) {
      setSelectedSubFilter(value)
      setResolvedSearchInput('')
    }
  }

  function handleToggleTicketStatus(ticket: SupportTicket) {
    if (ticket.status === 'Resolvido') {
      const restoredStatus = previousStatuses[ticket.protocol] ?? 'Em análise'

      setTickets((currentTickets) =>
        currentTickets.map((currentTicket) =>
          currentTicket.protocol === ticket.protocol
            ? {
                ...currentTicket,
                status: restoredStatus,
              }
            : currentTicket,
        ),
      )
      return
    }

    setPreviousStatuses((currentStatuses) => ({
      ...currentStatuses,
      [ticket.protocol]: ticket.status,
    }))
    setTickets((currentTickets) =>
      currentTickets.map((currentTicket) =>
        currentTicket.protocol === ticket.protocol
          ? {
              ...currentTicket,
              status: 'Resolvido',
            }
          : currentTicket,
      ),
    )
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h3" component="h1">
            Suporte
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Visualize cadastros, histórico e ocorrências enviadas pelos usuários.
          </Typography>
        </Box>

        <ToggleButtonGroup
          exclusive
          size="small"
          value={selectedFilter}
          onChange={handleFilterChange}
          aria-label="Filtro de suporte"
          sx={{
            flexWrap: 'wrap',
            gap: 1,
            '& .MuiToggleButtonGroup-grouped': {
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              px: 1.75,
              '&.Mui-selected': {
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.dark,
                backgroundColor: 'rgba(45, 212, 160, 0.14)',
              },
            },
          }}
        >
          {supportFilters.map((filter) => (
            <ToggleButton key={filter.value} value={filter.value} aria-label={filter.label}>
              {filter.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      {selectedFilter !== 'all' && (
        <ToggleButtonGroup
          exclusive
          size="small"
          value={selectedSubFilter}
          onChange={handleSubFilterChange}
          aria-label="Subfiltro de suporte"
          sx={{
            flexWrap: 'wrap',
            gap: 1,
            '& .MuiToggleButtonGroup-grouped': {
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              px: 1.75,
              '&.Mui-selected': {
                borderColor: theme.palette.secondary.main,
                color: theme.palette.secondary.dark,
                backgroundColor: 'rgba(10, 190, 233, 0.12)',
              },
            },
          }}
        >
          {supportSubFilters.map((filter) => (
            <ToggleButton key={filter.value} value={filter.value} aria-label={filter.label}>
              {filter.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}

      {selectedFilter !== 'all' && selectedSubFilter === 'resolved' && (
        <Autocomplete
          clearOnBlur={false}
          inputValue={resolvedSearchInput}
          options={resolvedTickets}
          filterOptions={(options, state) =>
            options.filter((option) => matchesTicketSearch(option, state.inputValue))
          }
          getOptionLabel={(ticket) => `${ticket.user.name} - ${ticket.user.cpf} - ${ticket.user.phone}`}
          onInputChange={(_, value) => setResolvedSearchInput(value)}
          onChange={(_, ticket) => setResolvedSearchInput(ticket ? ticket.user.name : '')}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Buscar cadastro resolvido"
              placeholder="Digite nome, CPF, telefone, protocolo ou corrida"
            />
          )}
          renderOption={(props, ticket) => (
            <Box component="li" {...props} key={ticket.protocol}>
              <Stack spacing={0.25}>
                <Typography fontWeight={700}>{ticket.user.name}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {ticket.user.cpf} | {ticket.user.phone} | {ticket.protocol}
                </Typography>
              </Stack>
            </Box>
          )}
        />
      )}

      <Stack spacing={2}>
        {filteredTickets.map((ticket) => (
          <SupportTicketCard
            key={ticket.protocol}
            ticket={ticket}
            compact={selectedFilter !== 'all' && selectedSubFilter === 'resolved'}
            highlighted={ticket.protocol === highlightedTicketProtocol}
            onToggleStatus={handleToggleTicketStatus}
            onOpenUser={(userTicket) => {
              setSelectedUserTicket(userTicket)
              setUserDialogTab(0)
            }}
          />
        ))}
      </Stack>

      <SupportUserDialog
        ticket={selectedUserTicket}
        tickets={tickets}
        tab={userDialogTab}
        onTabChange={setUserDialogTab}
        onClose={() => setSelectedUserTicket(null)}
      />
    </Stack>
  )
}

function SupportTicketCard({
  ticket,
  highlighted = false,
  onToggleStatus,
  onOpenUser,
}: {
  ticket: SupportTicket
  compact?: boolean
  highlighted?: boolean
  onToggleStatus: (ticket: SupportTicket) => void
  onOpenUser: (ticket: SupportTicket) => void
}) {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(highlighted)
  const statusLabel = ticket.status === 'Resolvido' ? 'Aprovado' : ticket.status

  useEffect(() => {
    if (highlighted) {
      setExpanded(true)
    }
  }, [highlighted, ticket.protocol])

  useEffect(() => {
    if (!highlighted) {
      return
    }

    window.requestAnimationFrame(() => {
      document.getElementById(`support-ticket-${ticket.protocol}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    })
  }, [highlighted, ticket.protocol])

  return (
    <Card
      id={`support-ticket-${ticket.protocol}`}
      variant="outlined"
      sx={{
        borderColor: highlighted ? theme.palette.primary.main : undefined,
        boxShadow: highlighted ? `0 0 0 3px rgba(45, 212, 160, 0.18)` : undefined,
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack
          role="button"
          tabIndex={0}
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.25}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
          onClick={() => setExpanded((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              setExpanded((current) => !current)
            }
          }}
          sx={{
            minHeight: 44,
            cursor: 'pointer',
            '&:focus-visible': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: 3,
              borderRadius: 1,
            },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gap: 1,
              gridTemplateColumns: { xs: '1fr', sm: '1.4fr 1fr 1fr' },
              alignItems: 'center',
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography noWrap sx={{ fontWeight: 900 }}>
              {ticket.user.name}
            </Typography>
            <Typography noWrap color="text.secondary" sx={{ fontSize: 13, fontWeight: 800 }}>
              CPF {ticket.user.cpf}
            </Typography>
            <Typography noWrap color="text.secondary" sx={{ fontSize: 13, fontWeight: 800 }}>
              {ticket.protocol}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
            <Chip
              clickable
              label={statusLabel}
              color={ticket.status === 'Resolvido' ? 'success' : 'warning'}
              onClick={(event) => {
                event.stopPropagation()
                onToggleStatus(ticket)
              }}
              sx={{ fontWeight: 700 }}
            />
            <Chip
              label={`Prioridade ${ticket.priority}`}
              color={ticket.priority === 'Alta' ? 'error' : 'warning'}
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
            <IconButton
              size="small"
              aria-label={expanded ? 'Recolher ticket' : 'Expandir ticket'}
              onClick={(event) => {
                event.stopPropagation()
                setExpanded((current) => !current)
              }}
            >
              <ExpandMoreIcon
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: theme.transitions.create('transform'),
                }}
              />
            </IconButton>
          </Stack>
        </Stack>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ pt: 2.5 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={3}
              alignItems={{ xs: 'stretch', md: 'flex-start' }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: ticket.user.role === 'driver' ? 'rgba(45, 212, 160, 0.14)' : 'rgba(10, 190, 233, 0.12)',
                    color: ticket.user.role === 'driver' ? theme.palette.primary.main : theme.palette.secondary.main,
                    fontWeight: 700,
                  }}
                >
                  {ticket.user.initials}
                </Avatar>

                <Box>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center">
                    <Button
                      variant="text"
                      onClick={() => onOpenUser(ticket)}
                      sx={{
                        p: 0,
                        minWidth: 0,
                        color: 'text.primary',
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          color: 'primary.main',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      <Typography variant="h4">{ticket.user.name}</Typography>
                    </Button>
                    <Chip label={ticket.user.type} color="primary" variant="outlined" size="small" />
                  </Stack>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Protocolo {ticket.protocol}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(4, minmax(0, 1fr))',
                },
                mt: 3,
              }}
            >
              <InfoItem icon={<PersonOutlineIcon />} label="CPF" value={ticket.user.cpf} />
              <InfoItem icon={<PhoneOutlinedIcon />} label="Telefone" value={ticket.user.phone} />
              <InfoItem icon={<EmailOutlinedIcon />} label="E-mail" value={ticket.user.email} />
              <InfoItem icon={<CalendarMonthOutlinedIcon />} label="Cidade" value={ticket.user.city} />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, minmax(0, 1fr))',
                },
                mt: 2,
              }}
            >
              <MetricCard
                icon={<StarBorderRoundedIcon />}
                title="Média de classificação"
                value={ticket.user.ratingAverage.toFixed(1)}
                helper="Avaliação geral do usuário"
                color={theme.palette.warning.main}
              />
              <MetricCard
                icon={<DirectionsCarIcon />}
                title="Corridas realizadas"
                value={numberFormatter.format(ticket.user.ridesCount)}
                helper="Total no histórico da conta"
                color={theme.palette.secondary.main}
              />
              <MetricCard
                icon={<CalendarMonthOutlinedIcon />}
                title="Período como usuário"
                value={`${ticket.user.customerSince} - ${ticket.user.activeUntil}`}
                helper="De quando até quando usou o app"
                color={theme.palette.primary.main}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                p: 2,
                backgroundColor: 'background.default',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      color: theme.palette.primary.main,
                      backgroundColor: 'rgba(45, 212, 160, 0.14)',
                    }}
                  >
                    <SupportAgentIcon />
                  </Box>
                  <Box>
                    <Typography variant="h4">{ticket.occurrence.title}</Typography>
                    <Typography color="text.secondary">Aberta em {ticket.occurrence.createdAt}</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Chip label={ticket.occurrence.category} color="secondary" variant="outlined" />
                  <Chip label={`Corrida ${ticket.occurrence.rideId}`} variant="outlined" />
                </Stack>
              </Stack>

              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {ticket.occurrence.description}
              </Typography>

              {ticket.occurrence.attachments && ticket.occurrence.attachments.length > 0 && (
                <Box sx={{ mt: 2.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <ImageOutlinedIcon fontSize="small" color="primary" />
                    <Typography fontWeight={700}>Imagens anexadas pelo usuário</Typography>
                    <Chip label={ticket.occurrence.attachments.length} size="small" color="primary" variant="outlined" />
                  </Stack>

                  <Box
                    sx={{
                      display: 'grid',
                      gap: 1.5,
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, minmax(0, 1fr))',
                        md: 'repeat(3, minmax(0, 1fr))',
                      },
                    }}
                  >
                    {ticket.occurrence.attachments.map((attachment) => (
                      <Box
                        key={attachment.name}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '72px 1fr',
                          gap: 1.5,
                          alignItems: 'center',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          p: 1,
                          backgroundColor: 'background.paper',
                        }}
                      >
                        <Box
                          sx={{
                            width: 72,
                            height: 56,
                            borderRadius: 1.5,
                            display: 'grid',
                            placeItems: 'center',
                            color: theme.palette.secondary.main,
                            background:
                              'linear-gradient(135deg, rgba(10, 190, 233, 0.18), rgba(45, 212, 160, 0.16))',
                          }}
                        >
                          <ImageOutlinedIcon />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography fontWeight={700} noWrap>
                            {attachment.name}
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            {attachment.type} anexada
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box sx={{ color: 'text.secondary', display: 'grid', placeItems: 'center' }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography color="text.secondary">{label}</Typography>
        <Typography fontWeight={700} noWrap>
          {value}
        </Typography>
      </Box>
    </Stack>
  )
}

function SupportUserDialog({
  ticket,
  tickets,
  tab,
  onTabChange,
  onClose,
}: {
  ticket: SupportTicket | null
  tickets: SupportTicket[]
  tab: number
  onTabChange: (value: number) => void
  onClose: () => void
}) {
  const theme = useTheme()
  const [selectedRide, setSelectedRide] = useState<ReturnType<typeof buildUserRideHistory>[number] | null>(null)

  if (!ticket) {
    return null
  }

  const relatedTickets = tickets.filter(
    (item) =>
      item.user.email === ticket.user.email ||
      item.user.phone === ticket.user.phone ||
      item.user.cpf === ticket.user.cpf,
  )

  const rideHistory = buildUserRideHistory(ticket, relatedTickets)

  return (
    <Dialog open={Boolean(ticket)} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: ticket.user.role === 'driver' ? 'rgba(45, 212, 160, 0.14)' : 'rgba(10, 190, 233, 0.12)',
                color: ticket.user.role === 'driver' ? theme.palette.primary.main : theme.palette.secondary.main,
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              {ticket.user.initials}
            </Avatar>
            <Box>
              <Typography variant="h4">{ticket.user.name}</Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                <Chip label={ticket.user.type} color="primary" variant="outlined" />
                <Chip label={`${relatedTickets.length} ocorrência(s)`} variant="outlined" />
              </Stack>
            </Box>
          </Stack>

          <IconButton aria-label="Fechar cadastro do usuário" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Tabs value={tab} onChange={(_, value) => onTabChange(value)} variant="scrollable" scrollButtons="auto" sx={{ mb: 3 }}>
          <Tab label="Cadastro" />
          <Tab label="Histórico" />
          <Tab label="Ocorrências" />
        </Tabs>

        {tab === 0 && (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            }}
          >
            <DetailBox label="Nome completo" value={ticket.user.name} />
            <DetailBox label="Tipo de usuário" value={ticket.user.type} />
            <DetailBox label="CPF" value={ticket.user.cpf} />
            <DetailBox label="Telefone" value={ticket.user.phone} />
            <DetailBox label="E-mail" value={ticket.user.email} />
            <DetailBox label="Cidade" value={ticket.user.city} />
            <DetailBox label="Média de classificação" value={ticket.user.ratingAverage.toFixed(1)} />
            <DetailBox label="Corridas realizadas" value={numberFormatter.format(ticket.user.ridesCount)} />
            <DetailBox label="Período como usuário" value={`${ticket.user.customerSince} - ${ticket.user.activeUntil}`} />
          </Box>
        )}

        {tab === 1 && (
          <Stack spacing={1.5}>
            {rideHistory.map((ride) => (
              <Box
                key={`${ride.id}-${ride.date}`}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedRide(ride)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedRide(ride)
                  }
                }}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 2,
                  cursor: 'pointer',
                  transition: theme.transitions.create(['border-color', 'background-color']),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: 'rgba(45, 212, 160, 0.08)',
                  },
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography fontWeight={700}>
                      {ride.from} → {ride.to}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Corrida {ride.id} | {ride.date} | {ride.value}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Chip label={ride.status} color="success" variant="outlined" />
                    {ride.occurrence && (
                      <Chip
                        label={`Ocorrência: ${ride.occurrence.title}`}
                        color={ride.occurrence.status === 'Resolvido' ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Stack>
                {ride.occurrence && (
                  <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                    Esta corrida gerou a ocorrência {ride.occurrence.protocol}, registrada como {ride.occurrence.category}.
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        )}

        {tab === 2 && (
          <Stack spacing={1.5}>
            {relatedTickets.map((item) => (
              <Box key={item.protocol} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 2 }}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography fontWeight={700}>{item.occurrence.title}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {item.protocol} | Aberta em {item.occurrence.createdAt}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Chip label={item.occurrence.category} color="secondary" variant="outlined" />
                    <Chip label={item.status} color={item.status === 'Resolvido' ? 'success' : 'warning'} variant="outlined" />
                  </Stack>
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.7 }}>
                  {item.occurrence.description}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
      <RideDetailsDialog ride={selectedRide} onClose={() => setSelectedRide(null)} />
    </Dialog>
  )
}

function buildUserRideHistory(currentTicket: SupportTicket, relatedTickets: SupportTicket[]) {
  const occurrenceRides = relatedTickets.map((ticket) => ({
    id: ticket.occurrence.rideId,
    date: ticket.occurrence.createdAt.split(' às ')[0],
    from: getRideRoute(ticket.occurrence.rideId).from,
    to: getRideRoute(ticket.occurrence.rideId).to,
    value: getRideRoute(ticket.occurrence.rideId).value,
    status: 'Finalizada',
    occurrence: {
      protocol: ticket.protocol,
      title: ticket.occurrence.title,
      category: ticket.occurrence.category,
      status: ticket.status,
    },
  }))

  const regularRides = [
    {
      id: 'BRL-82910',
      date: '22/04/2026',
      from: currentTicket.user.role === 'driver' ? 'Centro' : 'Shopping Paulista',
      to: currentTicket.user.role === 'driver' ? 'Aeroporto' : 'Vila Mariana',
      value: 'R$ 42,00',
      status: 'Finalizada',
      occurrence: null,
    },
    {
      id: 'BRL-82742',
      date: '19/04/2026',
      from: currentTicket.user.role === 'driver' ? 'Barra' : 'Moema',
      to: currentTicket.user.role === 'driver' ? 'Copacabana' : 'Pinheiros',
      value: 'R$ 36,00',
      status: 'Finalizada',
      occurrence: null,
    },
  ]

  return [...occurrenceRides, ...regularRides]
}

function getRideRoute(rideId: string) {
  const routes: Record<string, { from: string; to: string; value: string }> = {
    'BRL-83921': { from: 'Jardins', to: 'Aeroporto de Congonhas', value: 'R$ 58,00' },
    'BRL-81204': { from: 'Copacabana', to: 'Santos Dumont', value: 'R$ 48,00' },
    'BRL-83774': { from: 'Savassi', to: 'Pampulha', value: 'R$ 34,00' },
    'BRL-83640': { from: 'Batel', to: 'Centro Cívico', value: 'R$ 32,00' },
  }

  return routes[rideId] ?? { from: 'Origem registrada', to: 'Destino registrado', value: 'R$ 40,00' }
}

function getRideDetails(rideId: string) {
  const details: Record<string, { duration: string; distance: string; path: string[] }> = {
    'BRL-83921': {
      duration: '34 min',
      distance: '18,4 km',
      path: ['Jardins', 'Av. 23 de Maio', 'Aeroporto de Congonhas'],
    },
    'BRL-81204': {
      duration: '28 min',
      distance: '12,8 km',
      path: ['Copacabana', 'Aterro do Flamengo', 'Santos Dumont'],
    },
    'BRL-83774': {
      duration: '31 min',
      distance: '14,2 km',
      path: ['Savassi', 'Av. Antônio Carlos', 'Pampulha'],
    },
    'BRL-83640': {
      duration: '16 min',
      distance: '6,1 km',
      path: ['Batel', 'Praça do Japão', 'Centro Cívico'],
    },
  }

  return details[rideId] ?? {
    duration: '24 min',
    distance: '9,6 km',
    path: ['Origem registrada', 'Rota principal', 'Destino registrado'],
  }
}

function RideDetailsDialog({
  ride,
  onClose,
}: {
  ride: ReturnType<typeof buildUserRideHistory>[number] | null
  onClose: () => void
}) {
  const theme = useTheme()

  if (!ride) {
    return null
  }

  const details = getRideDetails(ride.id)

  return (
    <Dialog open={Boolean(ride)} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4">Detalhes da corrida {ride.id}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Trajeto percorrido, tempo e dados principais da viagem.
            </Typography>
          </Box>
          <IconButton aria-label="Fechar detalhes da corrida" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
            }}
          >
            <DetailBox label="Tempo de corrida" value={details.duration} />
            <DetailBox label="Distância percorrida" value={details.distance} />
            <DetailBox label="Valor" value={ride.value} />
          </Box>

          <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 2 }}>
            <Typography fontWeight={700} sx={{ mb: 2 }}>
              Trajeto percorrido
            </Typography>
            <Stack spacing={1.5}>
              {details.path.map((point, index) => (
                <Stack key={`${point}-${index}`} direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#FFFFFF',
                      bgcolor:
                        index === 0
                          ? theme.palette.primary.main
                          : index === details.path.length - 1
                            ? theme.palette.secondary.main
                            : theme.palette.warning.main,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography fontWeight={index === 0 || index === details.path.length - 1 ? 700 : 500}>
                    {point}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          {ride.occurrence && (
            <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 2, backgroundColor: 'background.default' }}>
              <Typography fontWeight={700}>Ocorrência vinculada</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                {ride.occurrence.protocol} | {ride.occurrence.title} | {ride.occurrence.category}
              </Typography>
              <Chip
                label={ride.occurrence.status}
                color={ride.occurrence.status === 'Resolvido' ? 'success' : 'warning'}
                variant="outlined"
                sx={{ mt: 1.5 }}
              />
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={700} sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  )
}

function MetricCard({
  icon,
  title,
  value,
  helper,
  color,
}: {
  icon: React.ReactNode
  title: string
  value: string
  helper: string
  color: string
}) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Stack spacing={1.5}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            color,
            backgroundColor: `${color}1F`,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography color="text.secondary" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ mt: 0.5 }}>
            {value}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {helper}
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}
