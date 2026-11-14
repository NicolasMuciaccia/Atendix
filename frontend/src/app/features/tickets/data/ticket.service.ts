import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_V1, Page, queryParams } from '../../../core/api/api';
import { CreateTicketRequest, Ticket, TicketFilter, TicketSearch, TicketStatus, TicketStatusCounts } from './ticket.models';

const TICKETS_URL = `${API_V1}/tickets`;
export const TICKETS_PAGE_SIZE = 20;

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);

  list(filter: TicketFilter): Observable<Page<Ticket>> {
    const params = queryParams({
      date: filter.date,
      sectorId: filter.sectorId,
      assetTagId: filter.assetTagId,
      status: filter.status,
      page: filter.page,
      size: TICKETS_PAGE_SIZE,
    });
    return this.http.get<Page<Ticket>>(TICKETS_URL, { params });
  }

  /** The status of the search is left out: the counts are what the status chips show. */
  countByStatus(search: TicketSearch): Observable<TicketStatusCounts> {
    const params = queryParams({ date: search.date, sectorId: search.sectorId, assetTagId: search.assetTagId });
    return this.http.get<TicketStatusCounts>(`${TICKETS_URL}/status-counts`, { params });
  }

  get(ticketId: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${TICKETS_URL}/${ticketId}`);
  }

  open(request: CreateTicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(TICKETS_URL, request);
  }

  cancel(ticketId: string): Observable<void> {
    return this.http.delete<void>(`${TICKETS_URL}/${ticketId}`);
  }

  changeStatus(ticketId: string, status: TicketStatus): Observable<Ticket> {
    return this.http.patch<Ticket>(`${TICKETS_URL}/${ticketId}/status`, { status });
  }
}
