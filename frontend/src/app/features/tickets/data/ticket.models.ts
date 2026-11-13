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
  /** Who started and who finished the handling; null until the ticket reaches that step. */
  startedByName: string | null;
  startedAt: string | null;
  finishedByName: string | null;
  finishedAt: string | null;
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

/** Cancelling deletes the ticket, and only while nobody started handling it. */
export function isCancelable(ticket: Ticket): boolean {
  return ticket.status === 'OPEN';
}
