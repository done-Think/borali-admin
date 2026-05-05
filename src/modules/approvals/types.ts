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
  category: string
  city: string
  phone: string
  vehicle: string
  plate: string
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
}
