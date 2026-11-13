import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Page } from '../../../core/api/api';
import { Ticket } from '../data/ticket.models';
import { TicketsStore } from './tickets.store';

const TICKET: Ticket = {
  id: 't-1', requestDate: '2026-11-05', itemId: 'i-1', itemName: 'Impressora HP LaserJet',
  sectorId: 's-1', sector: 'Financeiro', assetTag: 'PAT-004512',
  problemDescription: 'Não puxa o papel da bandeja 2.', status: 'OPEN',
  requesterId: 'u-1', requesterName: 'Usuário Comum',
  startedByName: null, startedAt: null, finishedByName: null, finishedAt: null,
  createdAt: '2026-11-05T13:02:00Z', updatedAt: '2026-11-05T13:02:00Z',
};

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

  it('should expose the loaded tickets', async () => {
    const load = store.load();
    backend.expectOne(request => request.url === '/api/v1/tickets').flush(pageOf(TICKET));
    await load;

    expect(store.tickets()).toEqual([TICKET]);
    expect(store.loading()).toBe(false);
  });

  it('should keep the message of a failed load for the error state', async () => {
    const load = store.load();
    backend.expectOne(request => request.url === '/api/v1/tickets').flush(
      { message: 'Apenas administradores podem buscar chamados por data ou setor' },
      { status: 403, statusText: 'Forbidden' });
    await load;

    expect(store.error()).toBe('Apenas administradores podem buscar chamados por data ou setor');
  });

  it('should send only the filters that were filled in', async () => {
    const filter = store.applyFilter('', 's-1');
    const request = backend.expectOne(req => req.url === '/api/v1/tickets');
    request.flush(pageOf());
    await filter;

    expect(request.request.params.get('sectorId')).toBe('s-1');
    expect(request.request.params.has('date')).toBe(false);
    expect(store.hasFilters()).toBe(true);
  });

  it('should not fetch a selected ticket that a search left out', async () => {
    const load = store.load();
    backend.expectOne(request => request.url === '/api/v1/tickets').flush(pageOf(TICKET));
    await load;
    await store.select(TICKET.id);

    const filter = store.applyFilter('2026-01-01', null);
    backend.expectOne(request => request.url === '/api/v1/tickets').flush(pageOf());
    await filter;

    backend.expectNone(`/api/v1/tickets/${TICKET.id}`);
    expect(store.selected()).toBeNull();
  });

  it('should replace the ticket in place when its status changes', async () => {
    const load = store.load();
    backend.expectOne(request => request.url === '/api/v1/tickets').flush(pageOf(TICKET));
    await load;

    const change = store.changeStatus(TICKET.id, 'IN_PROGRESS');
    backend.expectOne('/api/v1/tickets/t-1/status').flush({ ...TICKET, status: 'IN_PROGRESS' });
    await change;

    expect(store.tickets()[0].status).toBe('IN_PROGRESS');
  });
});
