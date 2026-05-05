import type { ApprovalDriver, ApprovalHistoryItem } from '../types'

export const pendingApprovalDrivers: ApprovalDriver[] = [
  {
    id: 'DRV-5101',
    name: 'Samuel Andrade',
    initials: 'SA',
    category: 'Conforto',
    city: 'Sao Paulo, SP',
    phone: '(11) 98244-1188',
    requestedAt: '05/05/2026 09:18',
    status: 'PENDING',
    faceCheck: { score: 91.4, status: 'Aprovado' },
    documents: [
      { id: 'doc-5101-cnh', type: 'CNH', name: 'cnh-samuel.pdf', format: 'PDF' },
      { id: 'doc-5101-crlv', type: 'CRLV', name: 'crlv-hb20.pdf', format: 'PDF' },
      { id: 'doc-5101-selfie', type: 'Selfie', name: 'selfie-cadastro.jpg', format: 'Imagem' },
    ],
  },
  {
    id: 'DRV-5102',
    name: 'Taina Ribeiro',
    initials: 'TR',
    category: 'Executivo',
    city: 'Rio de Janeiro, RJ',
    phone: '(21) 99830-7741',
    requestedAt: '05/05/2026 10:07',
    status: 'PENDING',
    faceCheck: { score: 84.8, status: 'Revisar' },
    documents: [
      { id: 'doc-5102-cnh', type: 'CNH', name: 'cnh-taina.jpg', format: 'Imagem' },
      { id: 'doc-5102-crlv', type: 'CRLV', name: 'crlv-compass.pdf', format: 'PDF' },
      { id: 'doc-5102-car', type: 'Foto do veiculo', name: 'compass-frente.jpg', format: 'Imagem' },
    ],
  },
  {
    id: 'DRV-5103',
    name: 'Marcelo Vieira',
    initials: 'MV',
    category: 'Economico',
    city: 'Campinas, SP',
    phone: '(19) 98121-4018',
    requestedAt: '05/05/2026 11:42',
    status: 'PENDING',
    faceCheck: { score: 76.2, status: 'Revisar' },
    documents: [
      { id: 'doc-5103-cnh', type: 'CNH', name: 'cnh-marcelo.pdf', format: 'PDF' },
      { id: 'doc-5103-crlv', type: 'CRLV', name: 'crlv-onix.pdf', format: 'PDF' },
      { id: 'doc-5103-selfie', type: 'Selfie', name: 'selfie-marcelo.png', format: 'Imagem' },
    ],
  },
]

export const recentApprovalHistory: ApprovalHistoryItem[] = [
  {
    id: 'hist-5098',
    driverName: 'Paula Rocha',
    decision: 'Aprovado',
    decidedAt: '05/05/2026 08:31',
    reviewer: 'Admin',
  },
  {
    id: 'hist-5097',
    driverName: 'Nicolas Freitas',
    decision: 'Rejeitado',
    decidedAt: '04/05/2026 17:22',
    reviewer: 'Admin',
  },
]
