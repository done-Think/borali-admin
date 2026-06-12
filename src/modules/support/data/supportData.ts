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

export const supportTickets: SupportTicket[] = []
