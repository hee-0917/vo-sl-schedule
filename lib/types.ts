export interface Game {
  id: string
  date: string
  opponent: string
  location: string
  isAvailable: boolean
  isSpecialGame?: boolean
  preBookingDate?: string
  isPreBooking?: boolean
  notes?: string
  memo?: {
    attendees: string
    ticketCount: number
  }
}
