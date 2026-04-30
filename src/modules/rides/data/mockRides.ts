import { activeRides as dashboardActiveRides, recentRides } from '@modules/dashboard/data/mockDashboardData'
import type { ActiveRideStatus, ActiveRideView, HistoryRide, ScheduledRide } from '../types'

export const alertColor = '#EF4444'

export const statusConfig: Record<ActiveRideStatus, { color: string; label: string }> = {
  'A caminho': { color: '#2563EB', label: 'A caminho' },
  'Em corrida': { color: '#0ABEE9', label: 'Em corrida' },
  Chegando: { color: '#F59E0B', label: 'Chegando' },
  'Aguardando embarque': { color: '#8B5CF6', label: 'Aguardando embarque' },
}

export const scheduledStatusConfig: Record<ScheduledRide['status'], { color: string; label: string }> = {
  Programada: { color: '#0ABEE9', label: 'Programada' },
  Confirmada: { color: '#2DD4A0', label: 'Confirmada' },
  Pendente: { color: '#F59E0B', label: 'Pendente' },
}

export const initialActiveRides: ActiveRideView[] = [
  ...dashboardActiveRides.map<ActiveRideView>((ride, index) => ({
    ...ride,
    status: (['Em corrida', 'A caminho', 'Chegando', 'Aguardando embarque', 'Em corrida'] as ActiveRideStatus[])[index] ?? 'Em corrida',
    startedAt: new Date(Date.now() - (index + 8) * 60_000).toISOString(),
    alert:
      index === 2
        ? {
            activatedBy: 'Passageiro',
            reason: 'Passageiro acionou alerta durante a corrida',
          }
        : undefined,
  })),
  {
    id: 'BRL-84219',
    driver: 'Marcos Vidal',
    passenger: 'Sofia Campos',
    origin: 'Bela Vista',
    destination: 'Hospital Sirio-Libanes',
    value: 26.9,
    path: [[-23.5585, -46.6462], [-23.5568, -46.6502], [-23.555, -46.6538], [-23.5572, -46.6567]],
    driverPosition: [-23.5568, -46.6502],
    passengerPosition: [-23.5572, -46.6567],
    status: 'A caminho',
    startedAt: new Date(Date.now() - 12 * 60_000).toISOString(),
  },
  {
    id: 'BRL-84220',
    driver: 'Nicolas Reis',
    passenger: 'Helena Duarte',
    origin: 'Republica',
    destination: 'Barra Funda',
    value: 39.6,
    path: [[-23.5443, -46.6427], [-23.5358, -46.6502], [-23.5288, -46.6617], [-23.5256, -46.6671]],
    driverPosition: [-23.5358, -46.6502],
    passengerPosition: [-23.5256, -46.6671],
    status: 'Em corrida',
    startedAt: new Date(Date.now() - 17 * 60_000).toISOString(),
    alert: {
      activatedBy: 'Motorista',
      reason: 'Motorista acionou alerta por comportamento agressivo',
    },
  },
  {
    id: 'BRL-84221',
    driver: 'Priscila Nunes',
    passenger: 'Eduardo Pires',
    origin: 'Paraiso',
    destination: 'Aclimacao',
    value: 22.4,
    path: [[-23.5745, -46.6409], [-23.5766, -46.6348], [-23.5722, -46.6296], [-23.5681, -46.6264]],
    driverPosition: [-23.5766, -46.6348],
    passengerPosition: [-23.5681, -46.6264],
    status: 'Chegando',
    startedAt: new Date(Date.now() - 6 * 60_000).toISOString(),
  },
]

export const historyRides: HistoryRide[] = recentRides.map((ride, index) => ({
  ...ride,
  status: 'Concluida',
  completedAt: new Date(Date.now() - index * 86_400_000 - (index + 1) * 18 * 60_000).toISOString(),
  alert:
    index === 2
      ? {
          activatedBy: 'Passageiro',
          reason: 'Passageiro relatou desvio de rota antes da finalizacao',
          resolvedAt: 'Resolvido pela central em 7 min',
        }
      : index === 4
        ? {
            activatedBy: 'Motorista',
            reason: 'Motorista reportou comportamento agressivo no desembarque',
            resolvedAt: 'Ocorrencia encaminhada para revisao',
          }
        : undefined,
  occurrences:
    index === 2
      ? [
          {
            id: 'OCC-84209-1',
            title: 'Desvio de rota reportado',
            description: 'Passageiro acionou alerta e anexou captura do trajeto sugerido.',
            createdAt: 'ha 14 min',
            attachments: [
              { name: 'trajeto-sugerido.png', type: 'imagem' },
              { name: 'audio-atendimento.mp3', type: 'audio' },
            ],
          },
        ]
      : index === 4
        ? [
            {
              id: 'OCC-84207-1',
              title: 'Discussao no desembarque',
              description: 'Motorista registrou ocorrencia apos desacordo sobre ponto de parada.',
              createdAt: 'ha 31 min',
              attachments: [{ name: 'relato-motorista.pdf', type: 'documento' }],
            },
          ]
        : [],
  payment: {
    status: index === 2 ? 'Em analise' : 'Aprovado',
    method: index % 2 === 0 ? 'Cartao' : 'Pix',
    transactionId: `PAY-${ride.id.slice(-5)}`,
  },
  feedback:
    index === 0
      ? [{ author: 'Passageiro', type: 'Elogio', message: 'Motorista educado e chegada rapida.' }]
      : index === 1
        ? [{ author: 'Motorista', type: 'Comentario', message: 'Passageiro estava no ponto correto.' }]
        : [],
}))

export const initialScheduledRides: ScheduledRide[] = [
  {
    id: 'BRL-84231',
    passenger: {
      name: 'Camila Torres',
      phone: '(11) 98211-4402',
      document: '284.917.630-10',
      rating: 4.9,
      ridesCount: 86,
    },
    origin: 'Rua Oscar Freire, 620',
    destination: 'Shopping Iguatemi',
    estimatedValue: 31.4,
    scheduledFor: new Date(Date.now() + 2 * 60 * 60_000).toISOString(),
    requestedAt: new Date(Date.now() - 22 * 60_000).toISOString(),
    status: 'Confirmada',
    category: 'Conforto',
    notes: 'Passageira solicitou motorista com porta-malas livre.',
  },
  {
    id: 'BRL-84232',
    passenger: {
      name: 'Mateus Ferreira',
      phone: '(11) 97730-6508',
      document: '519.204.870-22',
      rating: 4.7,
      ridesCount: 34,
    },
    origin: 'Metro Vila Mariana',
    destination: 'Av. Brigadeiro Faria Lima',
    estimatedValue: 44.9,
    scheduledFor: new Date(Date.now() + 5 * 60 * 60_000).toISOString(),
    requestedAt: new Date(Date.now() - 48 * 60_000).toISOString(),
    status: 'Programada',
    category: 'Economico',
  },
  {
    id: 'BRL-84233',
    passenger: {
      name: 'Renata Assis',
      phone: '(11) 99810-1247',
      document: '073.481.920-55',
      rating: 5,
      ridesCount: 121,
    },
    origin: 'Barra Funda',
    destination: 'Vila Olimpia',
    estimatedValue: 58.2,
    scheduledFor: new Date(Date.now() + 28 * 60 * 60_000).toISOString(),
    requestedAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
    status: 'Pendente',
    category: 'Executivo',
    notes: 'Viagem para compromisso corporativo.',
  },
]
