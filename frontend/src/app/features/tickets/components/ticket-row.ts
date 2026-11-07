import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RelativeDatePipe } from '../../../shared/format/dates';
import { Avatar } from '../../../shared/ui/avatar';
import { Tag } from '../../../shared/ui/tag';
import { STATUS_LABELS, Ticket } from '../data/ticket.models';
import { TicketStatusPill } from './ticket-status';

/** One ticket in the list (design system TicketRow), rendered on the link that opens it. */
@Component({
  selector: 'a[atxTicketRow]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Tag, TicketStatusPill, RelativeDatePipe],
  host: {
    class: 'ticket-row',
    '[class.selected]': 'selected()',
    '[attr.aria-current]': 'selected() ? "true" : null',
    '[attr.aria-label]': 'accessibleName()',
  },
  template: `
    <atx-avatar [name]="ticket().requesterName" />
    <span class="body">
      <span class="top">
        <span class="name">{{ ticket().requesterName }}</span>
        <time class="date" [attr.datetime]="ticket().requestDate">{{ ticket().requestDate | relativeDate }}</time>
      </span>
      <span class="subject">{{ ticket().itemName }}</span>
      <span class="preview">{{ ticket().problemDescription }}</span>
      <span class="tags">
        <atx-ticket-status [status]="ticket().status" />
        <atx-tag>{{ ticket().sector }}</atx-tag>
      </span>
    </span>
  `,
  styleUrl: './ticket-row.scss',
})
export class TicketRow {
  readonly ticket = input.required<Ticket>();
  readonly selected = input(false);

  protected readonly accessibleName = computed(() => {
    const ticket = this.ticket();
    return `${ticket.itemName}, ${STATUS_LABELS[ticket.status]}, setor ${ticket.sector}, aberto por ${ticket.requesterName}`;
  });
}
