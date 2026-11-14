import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Page } from '../../../core/api/api';
import { NO_SEARCH, Ticket, TicketStatusCounts } from '../data/ticket.models';
import { TicketsStore } from './tickets.store';

const TICKET: Ticket = {
  id: 't-1', requestDate: '2026-11-05', itemId: 'i-1', itemName: 'Impressora HP LaserJet',
  sectorId: 's-1', sector: 'Financeiro', assetTag: 'PAT-004512',
  problemDescription: 'Não puxa o papel da bandeja 2.', status: 'OPEN',
  requesterId: 'u-1', requesterName: 'Usuário Comum',
  startedByName: null, startedAt: null, finishedByName: null, finishedAt: null,
  createdAt: '2026-11-05T13:02:00Z', updatedAt: '2026-11-05T13:02:00Z',
};

const COUNTS: TicketStatusCounts = { open: 1, inProgress: 0, finished: 0, total: 1 };
const COUNTS_URL = '/api/v1/tickets/status-counts';

function pageOf(...tickets: Ticket[]): Page<Ticket> {
  return { content: tickets, page: 0, size: 20, totalElements: tickets.length, totalPages: 1 };
}

describe('TicketsStore', () => {
  let store: TicketsStore;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TicketsStore, provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(TicketsStore);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  async function loaded(...tickets: Ticket[]): Promise<void> {
    const load = store.load();
    backend.expectOne(request => request.url === '/api/v1/tickets').flush(pageOf(...tickets));
    backend.expectOne(request => request.url === COUNTS_URL).flush(COUNTS);
    await load;
  }

  it('should expose the loaded tickets and the counts per status', async () => {
    await loaded(TICKET);

    expect(store.tickets()).toEqual([TICKET]);
    expect(store.counts()).toEqual(COUNTS);
    expect(store.hasFilters()).toBe(false);
    expect(store.loading()).toBe(false);
  });

  it('should keep the message of a failed load for the error state', async () => {
    const load = store.load();
    backend.expectOne(request => request.url === '/api/v1/tickets').flush(
      { message: 'Apenas administradores podem buscar chamados por data ou setor' },
      { status: 403, statusText: 'Forbidden' });
    backend.expectOne(request => request.url === COUNTS_URL).flush(COUNTS);
    await load;

    expect(store.error()).toBe('Apenas administradores podem buscar chamados por data ou setor');
  });

  it('should send only the filters that were filled in', async () => {
    const search = store.search({ ...NO_SEARCH, sectorId: 's-1', status: 'OPEN' });
    const request = backend.expectOne(req => req.url === '/api/v1/tickets');
    const counts = backend.expectOne(req => req.url === COUNTS_URL);
    request.flush(pageOf());
    counts.flush(COUNTS);
    await search;

    expect(request.request.params.get('sectorId')).toBe('s-1');
    expect(request.request.params.get('status')).toBe('OPEN');
    expect(request.request.params.has('date')).toBe(false);
    // The counts are per status, so the status filter itself is not sent
    expect(counts.request.params.has('status')).toBe(false);
    expect(store.hasFilters()).toBe(true);
  });

  it('should not fetch a selected ticket that a search left out', async () => {
    await loaded(TICKET);
    await store.select(TICKET.id);

    const filter = store.search({ ...NO_SEARCH, date: '2026-01-01' });
    backend.expectOne(request => request.url === '/api/v1/tickets').flush(pageOf());
    backend.expectOne(request => request.url === COUNTS_URL).flush(COUNTS);
    await filter;

    backend.expectNone(`/api/v1/tickets/${TICKET.id}`);
    expect(store.selected()).toBeNull();
  });

  it('should replace the ticket in place and recount when its status changes', async () => {
    await loaded(TICKET);

    const change = store.changeStatus(TICKET.id, 'IN_PROGRESS');
    backend.expectOne('/api/v1/tickets/t-1/status').flush({ ...TICKET, status: 'IN_PROGRESS' });
    await Promise.resolve();
    backend.expectOne(request => request.url === COUNTS_URL).flush({ ...COUNTS, open: 0, inProgress: 1 });
    await change;

    expect(store.tickets()[0].status).toBe('IN_PROGRESS');
    expect(store.counts()?.inProgress).toBe(1);
  });
});
