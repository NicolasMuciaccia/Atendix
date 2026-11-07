export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'FINISHED';

export interface Ticket {
  id: string;
  requestDate: string;
  itemId: string;
  itemName: string;
  sectorId: string;
  sector: string;
  assetTag: string;
  problemDescription: string;
  status: TicketStatus;
  requesterId: string;
  requesterName: string;
  createdAt: string;
  updatedAt: string;
}

/** Sector and asset tag are not sent: they come from the registered item. */
export interface CreateTicketRequest {
  requestDate: string;
  itemId: string;
  problemDescription: string;
}

export interface TicketFilter {
  date: string | null;
  sectorId: string | null;
  page: number;
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  FINISHED: 'Finalizado',
};

// Mirrors the back-end rule: a ticket only moves forward
export const NEXT_STATUSES: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ['IN_PROGRESS', 'FINISHED'],
  IN_PROGRESS: ['FINISHED'],
  FINISHED: [],
};

/** Cancelling deletes the ticket, and only while nobody started handling it. */
export function isCancelable(ticket: Ticket): boolean {
  return ticket.status === 'OPEN';
}
