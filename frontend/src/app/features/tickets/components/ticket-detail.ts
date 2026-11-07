import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DateTimePipe, LongDatePipe } from '../../../shared/format/dates';
import { Avatar } from '../../../shared/ui/avatar';
import { Button } from '../../../shared/ui/button';
import { Icon } from '../../../shared/ui/icon';
import { IconButton } from '../../../shared/ui/icon-button';
import { DetailRow, PanelSection } from '../../../shared/ui/panel';
import { Ticket, TicketStatus } from '../data/ticket.models';
import { TicketStatusPill } from './ticket-status';

export type TicketAction = 'status' | 'cancel';

/** Everything about one ticket: the report, the details and what the current user may do with it. */
@Component({
  selector: 'atx-ticket-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Avatar, Button, Icon, IconButton, DetailRow, PanelSection, TicketStatusPill, DateTimePipe, LongDatePipe,
  ],
  templateUrl: './ticket-detail.html',
  styleUrl: './ticket-detail.scss',
})
export class TicketDetail {
  readonly ticket = input.required<Ticket>();
  readonly isAdmin = input(false);
  readonly canCancel = input(false);
  readonly busy = input<TicketAction | null>(null);

  readonly statusChange = output<TicketStatus>();
  readonly cancelRequest = output<void>();
  readonly back = output<void>();
}
