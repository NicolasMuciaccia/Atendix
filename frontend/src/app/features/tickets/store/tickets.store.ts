import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Page, errorMessageOf } from '../../../core/api/api';
import {
  CreateTicketRequest, NO_SEARCH, Ticket, TicketFilter, TicketSearch, TicketStatus, TicketStatusCounts, hasSearch,
} from '../data/ticket.models';
import { TicketService } from '../data/ticket.service';

const FIRST_PAGE = 0;
const NO_FILTER: TicketFilter = { ...NO_SEARCH, page: FIRST_PAGE };

/** State of the tickets workspace; provided by the page, so it lives as long as the screen. */
@Injectable()
export class TicketsStore {
  private readonly ticketService = inject(TicketService);

  private readonly _page = signal<Page<Ticket> | null>(null);
  private readonly _counts = signal<TicketStatusCounts | null>(null);
  private readonly _filter = signal<TicketFilter>(NO_FILTER);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _selectedId = signal<string | null>(null);
  // A ticket opened by link may not be on the current page of the list
  private readonly _detached = signal<Ticket | null>(null);
  private readonly _selectionError = signal<string | null>(null);

  readonly filter = this._filter.asReadonly();
  /** Tickets in each status for the current search, whatever status it filters by. */
  readonly counts = this._counts.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedId = this._selectedId.asReadonly();
  readonly selectionError = this._selectionError.asReadonly();

  readonly loaded = computed(() => this._page() !== null);
  readonly tickets = computed(() => this._page()?.content ?? []);
  readonly totalElements = computed(() => this._page()?.totalElements ?? 0);
  readonly currentPage = computed(() => this._page()?.page ?? 0);
  readonly totalPages = computed(() => this._page()?.totalPages ?? 0);
  readonly hasFilters = computed(() => hasSearch(this._filter()));
  readonly selected = computed(() => {
    const selectedId = this._selectedId();
    const listed = this.tickets().find(ticket => ticket.id === selectedId);
    const detached = this._detached();
    return listed ?? (detached?.id === selectedId ? detached : null);
  });

  /** Reloads the current page and the counts; a selected ticket outside the page is fetched on its own. */
  async load(): Promise<void> {
    await this.loadPage(!this.hasFilters(), true);
  }

  /**
   * Runs a search from its first page. A search shows only its result: a selected ticket left out
   * of it is not fetched separately. Without any filter, a ticket opened by link still is.
   */
  async search(search: TicketSearch): Promise<void> {
    this._filter.set({ ...search, page: FIRST_PAGE });
    this._detached.set(null);
    await this.loadPage(!hasSearch(search), true);
  }

  async goToPage(page: number): Promise<void> {
    this._filter.update(filter => ({ ...filter, page }));
    await this.loadPage(!this.hasFilters(), false);
  }

  async select(ticketId: string | null): Promise<void> {
    this._selectedId.set(ticketId);
    this._selectionError.set(null);
    if (this.loaded()) {
      await this.fetchSelectedIfMissing();
    }
  }

  /** Errors propagate so the form can show them next to the fields. */
  async open(request: CreateTicketRequest): Promise<Ticket> {
    const ticket = await firstValueFrom(this.ticketService.open(request));
    this._filter.set(NO_FILTER);
    await this.load();
    return ticket;
  }

  async cancel(ticketId: string): Promise<void> {
    await firstValueFrom(this.ticketService.cancel(ticketId));
    await this.load();
  }

  async changeStatus(ticketId: string, status: TicketStatus): Promise<void> {
    const updated = await firstValueFrom(this.ticketService.changeStatus(ticketId, status));
    this._page.update(page => page && {
      ...page,
      content: page.content.map(ticket => (ticket.id === updated.id ? updated : ticket)),
    });
    if (this._detached()?.id === updated.id) {
      this._detached.set(updated);
    }
    this._counts.set(await firstValueFrom(this.ticketService.countByStatus(this._filter())));
  }

  private async loadPage(fetchMissingSelection: boolean, withCounts: boolean): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const [page, counts] = await Promise.all([
        firstValueFrom(this.ticketService.list(this._filter())),
        withCounts ? firstValueFrom(this.ticketService.countByStatus(this._filter())) : Promise.resolve(this._counts()),
      ]);
      this._page.set(page);
      this._counts.set(counts);
      if (fetchMissingSelection) {
        await this.fetchSelectedIfMissing();
      }
    } catch (error) {
      this._error.set(errorMessageOf(error));
    } finally {
      this._loading.set(false);
    }
  }

  private async fetchSelectedIfMissing(): Promise<void> {
    const selectedId = this._selectedId();
    if (!selectedId || this.selected()) {
      return;
    }

    try {
      this._detached.set(await firstValueFrom(this.ticketService.get(selectedId)));
    } catch (error) {
      this._selectionError.set(errorMessageOf(error));
    }
  }
}
