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

/** Status and tag are open to every profile; date and sector only to administrators. */
export interface TicketSearch {
  date: string | null;
  sectorId: string | null;
  assetTagId: string | null;
  status: TicketStatus | null;
}

export interface TicketFilter extends TicketSearch {
  page: number;
}

export const NO_SEARCH: TicketSearch = { date: null, sectorId: null, assetTagId: null, status: null };

export function hasSearch(search: TicketSearch): boolean {
  return search.date !== null || search.sectorId !== null || search.assetTagId !== null || search.status !== null;
}

export interface TicketStatusCounts {
  open: number;
  inProgress: number;
  finished: number;
  total: number;
}

export const TICKET_STATUSES: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'FINISHED'];

export function isTicketStatus(value: string | null | undefined): value is TicketStatus {
  return TICKET_STATUSES.includes(value as TicketStatus);
}

export function countOf(counts: TicketStatusCounts, status: TicketStatus): number {
  const byStatus: Record<TicketStatus, number> = {
    OPEN: counts.open,
    IN_PROGRESS: counts.inProgress,
    FINISHED: counts.finished,
  };
  return byStatus[status];
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
