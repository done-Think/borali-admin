export type ApprovalDocumentType = 'CNH' | 'CRLV' | 'Foto do veiculo' | 'Selfie'

export type ApprovalDocument = {
  id: string
  type: ApprovalDocumentType
  name: string
  format: 'PDF' | 'Imagem'
  url: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export type ApprovalDriver = {
  id: string
  driverId: string
  name: string
  initials: string
  cpf: string
  email: string
  birthDate: string
  category: string
  city: string
  address: string
  neighborhood: string
  zipCode: string
  phone: string
  cnhCategory: string
  cnhExpiresAt: string
  vehicle: string
  vehicleYear: string
  vehicleColor: string
  plate: string
  bankName: string
  bankAgency: string
  bankAccount: string
  emergencyContact: string
  emergencyPhone: string
  referralSource: string
  requestedAt: string
  status: 'PENDING'
  documents: ApprovalDocument[]
  faceCheck: {
    score: number
    status: 'Aprovado' | 'Revisar' | 'Reprovado'
  }
}

export type ApprovalHistoryItem = {
  id: string
  driverName: string
  decision: 'Aprovado' | 'Rejeitado'
  decidedAt: string
  reviewer: string
  driver: ApprovalDriver
  reason?: string
}

/** Maps the shape returned by GET /admin/drivers?status=PENDING */
export type PendingDriver = {
  id: string
  userId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
  cnhNumber?: string | null
  cnhCategory?: string | null
  cnhExpiry?: string | null
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    phone?: string | null
    cpf?: string | null
    city?: string | null
    state?: string | null
    street?: string | null
    number?: string | null
    complement?: string | null
    neighborhood?: string | null
    zipCode?: string | null
    faceCheckStatus?: string | null
    faceCheckUrl?: string | null
    documentUrl?: string | null
    createdAt: string
  }
  vehicles?: Array<{
    brand: string
    model: string
    year: number
    color: string
    plate: string
    category: string
  }>
  documents: Array<{
    id: string
    type: string
    url: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    notes?: string | null
  }>
}
