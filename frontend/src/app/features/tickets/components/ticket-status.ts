import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Tag, TagTone } from '../../../shared/ui/tag';
import { STATUS_LABELS, TicketStatus } from '../data/ticket.models';

// Colors required by the assignment: green = open, yellow = in progress, red = finished.
// They replace the design system's own mapping (where red means "open").
export const STATUS_TONES: Record<TicketStatus, TagTone> = {
  OPEN: 'positive',
  IN_PROGRESS: 'attention',
  FINISHED: 'danger',
};

@Component({
  selector: 'atx-ticket-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Tag],
  template: `<atx-tag [tone]="tone()" [dot]="true">{{ label() }}</atx-tag>`,
  styles: `:host { display: inline-flex; }`,
})
export class TicketStatusPill {
  readonly status = input.required<TicketStatus>();

  protected readonly tone = computed(() => STATUS_TONES[this.status()]);
  protected readonly label = computed(() => STATUS_LABELS[this.status()]);
}
