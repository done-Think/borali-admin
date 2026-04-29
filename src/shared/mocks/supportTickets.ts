export type SupportTicket = {
  protocol: string
  status: string
  priority: string
  user: {
    name: string
    initials: string
    type: 'Motorista' | 'Passageira' | 'Passageiro'
    role: 'driver' | 'passenger'
    driverId?: string
    cpf: string
    email: string
    phone: string
    city: string
    ratingAverage: number
    ridesCount: number
    customerSince: string
    activeUntil: string
  }
  occurrence: {
    title: string
    createdAt: string
    rideId: string
    category: string
    description: string
    attachments?: Array<{
      name: string
      type: string
    }>
  }
}

export const supportTickets: SupportTicket[] = [
  {
    protocol: 'SUP-2026-0428-018',
    status: 'Em análise',
    priority: 'Alta',
    user: {
      name: 'Mariana Costa',
      initials: 'MC',
      type: 'Passageira',
      role: 'passenger',
      cpf: '***.482.***-09',
      email: 'mariana.costa@email.com',
      phone: '(11) 98422-1930',
      city: 'São Paulo, SP',
      ratingAverage: 4.7,
      ridesCount: 186,
      customerSince: '12/03/2024',
      activeUntil: '28/04/2026',
    },
    occurrence: {
      title: 'Cobrança divergente após cancelamento',
      createdAt: '28/04/2026 às 09:42',
      rideId: 'BRL-83921',
      category: 'Pagamento',
      description:
        'A usuária relata que cancelou a corrida antes da chegada do motorista, mas recebeu uma cobrança integral no cartão. Ela solicita revisão do valor e estorno caso a cobrança tenha sido feita incorretamente.',
      attachments: [
        { name: 'comprovante-cobranca.png', type: 'Imagem' },
        { name: 'extrato-cartao.jpg', type: 'Foto' },
      ],
    },
  },
  {
    protocol: 'REC-1201',
    status: 'Resolvido',
    priority: 'Baixa',
    user: {
      name: 'Renato Almeida',
      initials: 'RA',
      type: 'Motorista',
      role: 'driver',
      driverId: 'DRV-1001',
      cpf: '***.118.***-44',
      email: 'renato.almeida@email.com',
      phone: '(21) 99218-4402',
      city: 'Rio de Janeiro, RJ',
      ratingAverage: 4.9,
      ridesCount: 742,
      customerSince: '03/08/2023',
      activeUntil: '28/04/2026',
    },
    occurrence: {
      title: 'Atraso na chegada ao embarque',
      createdAt: '14/03/2026 às 08:32',
      rideId: 'BRL-81204',
      category: 'Atendimento',
      description:
        'Passageiro relatou atraso na chegada ao ponto de embarque. A equipe conferiu o histórico da corrida, orientou o motorista e encerrou a ocorrência como resolvida.',
      attachments: [{ name: 'historico-rota.jpg', type: 'Foto' }],
    },
  },
  {
    protocol: 'SUP-2026-0428-031',
    status: 'Resolvido',
    priority: 'Baixa',
    user: {
      name: 'Lucas Pereira',
      initials: 'LP',
      type: 'Passageiro',
      role: 'passenger',
      cpf: '***.730.***-21',
      email: 'lucas.pereira@email.com',
      phone: '(31) 98877-2041',
      city: 'Belo Horizonte, MG',
      ratingAverage: 4.4,
      ridesCount: 58,
      customerSince: '19/01/2025',
      activeUntil: '27/04/2026',
    },
    occurrence: {
      title: 'Item esquecido no veículo',
      createdAt: '27/04/2026 às 18:04',
      rideId: 'BRL-83774',
      category: 'Achados e perdidos',
      description:
        'O passageiro relatou ter esquecido uma mochila pequena no banco traseiro. A equipe confirmou contato com o motorista e registrou a devolução do item.',
    },
  },
  {
    protocol: 'SUP-2026-0427-014',
    status: 'Resolvido',
    priority: 'Média',
    user: {
      name: 'Patrícia Nogueira',
      initials: 'PN',
      type: 'Motorista',
      role: 'driver',
      driverId: 'DRV-1002',
      cpf: '***.591.***-67',
      email: 'patricia.nogueira@email.com',
      phone: '(41) 99731-6508',
      city: 'Curitiba, PR',
      ratingAverage: 4.8,
      ridesCount: 519,
      customerSince: '06/06/2024',
      activeUntil: '27/04/2026',
    },
    occurrence: {
      title: 'Atualização de documento aprovada',
      createdAt: '27/04/2026 às 10:21',
      rideId: 'BRL-83640',
      category: 'Cadastro',
      description:
        'A motorista solicitou revisão do documento do veículo após erro de leitura automática. O suporte validou o arquivo enviado e concluiu a atualização cadastral.',
    },
  },
]
