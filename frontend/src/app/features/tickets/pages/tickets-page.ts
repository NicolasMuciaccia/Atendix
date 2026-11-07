import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { errorMessageOf, fieldErrorsOf } from '../../../core/api/api';
import { AuthStore } from '../../../core/auth/auth.store';
import { Button } from '../../../shared/ui/button';
import { Dialog } from '../../../shared/ui/dialog';
import { IconButton } from '../../../shared/ui/icon-button';
import { EmptyState, ErrorState } from '../../../shared/ui/states';
import { ToastService } from '../../../shared/ui/toast';
import { TicketAction, TicketDetail } from '../components/ticket-detail';
import { TicketFormDialog } from '../components/ticket-form-dialog';
import { TicketRow } from '../components/ticket-row';
import { ItemsStore, SectorsStore } from '../../catalog/store/catalog-list.store';
import { CreateTicketRequest, TicketStatus, isCancelable } from '../data/ticket.models';
import { TicketsStore } from '../store/tickets.store';

const SKELETON_ROWS = [0, 1, 2, 3, 4, 5];
const NEW_TICKET_FLAG = '1';

@Component({
  selector: 'atx-tickets-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TicketsStore, ItemsStore, SectorsStore],
  host: { '[class.has-selection]': '!!chamado()' },
  imports: [
    ReactiveFormsModule, RouterLink, Button, Dialog, IconButton, EmptyState, ErrorState,
    TicketDetail, TicketFormDialog, TicketRow,
  ],
  templateUrl: './tickets-page.html',
  styleUrl: './tickets-page.scss',
})
export class TicketsPage {
  /** Query param with the selected ticket, so a ticket can be linked and survives a reload. */
  readonly chamado = input<string | undefined>();
  /** Query param set by the "new ticket" buttons, including the mobile bottom navigation. */
  readonly novo = input<string | undefined>();

  protected readonly store = inject(TicketsStore);
  protected readonly items = inject(ItemsStore);
  protected readonly sectors = inject(SectorsStore);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly isAdmin = this.authStore.isAdmin;
  protected readonly skeletonRows = SKELETON_ROWS;
  protected readonly filterForm = inject(FormBuilder).nonNullable.group({ date: '', sectorId: '' });

  protected readonly creating = signal(false);
  protected readonly createError = signal<string | null>(null);
  protected readonly createFieldErrors = signal<Record<string, string>>({});
  protected readonly busy = signal<TicketAction | null>(null);
  protected readonly confirming = signal<'cancel' | 'finish' | null>(null);

  protected readonly newTicketOpen = computed(() => this.novo() === NEW_TICKET_FLAG);
  protected readonly selected = this.store.selected;
  protected readonly canCancelSelected = computed(() => {
    const ticket = this.selected();
    return !!ticket && isCancelable(ticket);
  });
  protected readonly pageLabel = computed(() => `Página ${this.store.currentPage() + 1} de ${this.store.totalPages()}`);

  constructor() {
    void this.store.load();
    if (this.isAdmin()) {
      void this.sectors.load();
    }

    // The selection lives in the URL; the store fetches a ticket that is not on the current page
    effect(() => {
      const ticketId = this.chamado() ?? null;
      untracked(() => void this.store.select(ticketId));
    });

    // The catalog is read each time the form opens, so it reflects the latest registrations
    effect(() => {
      if (this.newTicketOpen()) {
        untracked(() => void this.items.load());
      }
    });
  }

  protected openNewTicket(): void {
    void this.router.navigate([], { queryParams: { novo: NEW_TICKET_FLAG }, queryParamsHandling: 'merge' });
  }

  protected closeNewTicket(): void {
    this.createError.set(null);
    this.createFieldErrors.set({});
    void this.router.navigate([], { queryParams: { novo: null }, queryParamsHandling: 'merge' });
  }

  protected async createTicket(request: CreateTicketRequest): Promise<void> {
    this.creating.set(true);
    this.createError.set(null);
    this.createFieldErrors.set({});
    try {
      const ticket = await this.store.open(request);
      this.toast.show('Chamado aberto.');
      await this.router.navigate([], { queryParams: { chamado: ticket.id, novo: null } });
    } catch (error) {
      this.createError.set(errorMessageOf(error));
      this.createFieldErrors.set(fieldErrorsOf(error));
    } finally {
      this.creating.set(false);
    }
  }

  protected applyFilter(): void {
    const { date, sectorId } = this.filterForm.getRawValue();
    void this.store.applyFilter(date, sectorId);
  }

  protected clearFilter(): void {
    this.filterForm.reset();
    void this.store.clearFilter();
  }

  protected backToList(): void {
    void this.router.navigate([], { queryParams: { chamado: null }, queryParamsHandling: 'merge' });
  }

  protected requestStatusChange(status: TicketStatus): void {
    // Finishing cannot be undone, so it asks first; starting the handling does not
    if (status === 'FINISHED') {
      this.confirming.set('finish');
      return;
    }
    void this.changeStatus(status);
  }

  protected async confirmFinish(): Promise<void> {
    this.confirming.set(null);
    await this.changeStatus('FINISHED');
  }

  protected async confirmCancel(): Promise<void> {
    const ticket = this.selected();
    this.confirming.set(null);
    if (!ticket) {
      return;
    }

    this.busy.set('cancel');
    try {
      await this.store.cancel(ticket.id);
      this.toast.show('Chamado cancelado e excluído.');
      this.backToList();
    } catch (error) {
      this.toast.show(errorMessageOf(error), 'danger');
    } finally {
      this.busy.set(null);
    }
  }

  private async changeStatus(status: TicketStatus): Promise<void> {
    const ticket = this.selected();
    if (!ticket) {
      return;
    }

    this.busy.set('status');
    try {
      await this.store.changeStatus(ticket.id, status);
      this.toast.show(status === 'FINISHED' ? 'Chamado finalizado.' : 'Atendimento iniciado.');
    } catch (error) {
      this.toast.show(errorMessageOf(error), 'danger');
    } finally {
      this.busy.set(null);
    }
  }
}
