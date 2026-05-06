export type ApprovalDocumentType = 'CNH' | 'CRLV' | 'Foto do veiculo' | 'Selfie'

export type ApprovalDocument = {
  id: string
  type: ApprovalDocumentType
  name: string
  format: 'PDF' | 'Imagem'
}

export type ApprovalDriver = {
  id: string
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
  reason?: string
}
