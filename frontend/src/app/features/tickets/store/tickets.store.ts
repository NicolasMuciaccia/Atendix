import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Page, errorMessageOf } from '../../../core/api/api';
import { CreateTicketRequest, Ticket, TicketFilter, TicketStatus } from '../data/ticket.models';
import { TicketService } from '../data/ticket.service';

const NO_FILTER: TicketFilter = { date: null, sectorId: null, page: 0 };

/** State of the tickets workspace; provided by the page, so it lives as long as the screen. */
@Injectable()
export class TicketsStore {
  private readonly ticketService = inject(TicketService);

  private readonly _page = signal<Page<Ticket> | null>(null);
  private readonly _filter = signal<TicketFilter>(NO_FILTER);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _selectedId = signal<string | null>(null);
  // A ticket opened by link may not be on the current page of the list
  private readonly _detached = signal<Ticket | null>(null);
  private readonly _selectionError = signal<string | null>(null);

  readonly filter = this._filter.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedId = this._selectedId.asReadonly();
  readonly selectionError = this._selectionError.asReadonly();

  readonly loaded = computed(() => this._page() !== null);
  readonly tickets = computed(() => this._page()?.content ?? []);
  readonly totalElements = computed(() => this._page()?.totalElements ?? 0);
  readonly currentPage = computed(() => this._page()?.page ?? 0);
  readonly totalPages = computed(() => this._page()?.totalPages ?? 0);
  readonly hasFilters = computed(() => this._filter().date !== null || this._filter().sectorId !== null);
  readonly selected = computed(() => {
    const selectedId = this._selectedId();
    const listed = this.tickets().find(ticket => ticket.id === selectedId);
    const detached = this._detached();
    return listed ?? (detached?.id === selectedId ? detached : null);
  });

  /** Loads the current page; a selected ticket outside it (opened by link) is fetched on its own. */
  async load(): Promise<void> {
    await this.loadPage(true);
  }

  /** A search shows only its result: a selected ticket left out of it is not fetched separately. */
  async applyFilter(date: string | null, sectorId: string | null): Promise<void> {
    this._filter.set({ date: date || null, sectorId: sectorId || null, page: 0 });
    this._detached.set(null);
    await this.loadPage(false);
  }

  async clearFilter(): Promise<void> {
    this._filter.set(NO_FILTER);
    this._detached.set(null);
    await this.loadPage(false);
  }

  async goToPage(page: number): Promise<void> {
    this._filter.update(filter => ({ ...filter, page }));
    await this.load();
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
  }

  private async loadPage(fetchMissingSelection: boolean): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      this._page.set(await firstValueFrom(this.ticketService.list(this._filter())));
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
