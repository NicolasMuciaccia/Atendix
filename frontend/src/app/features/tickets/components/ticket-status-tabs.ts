import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { STATUS_LABELS, TICKET_STATUSES, TicketStatus, TicketStatusCounts, countOf } from '../data/ticket.models';
import { STATUS_TONES } from './ticket-status';

/** Status filter of the ticket list, with how many tickets each status has in the current search. */
@Component({
  selector: 'atx-ticket-status-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'group', 'aria-label': 'Filtrar por status' },
  template: `
    <button type="button" class="tab" [class.active]="!selected()" [attr.aria-pressed]="!selected()"
            (click)="selectedChange.emit(null)">
      Todos
      @if (counts(); as all) {
        <span class="count">{{ all.total }}</span>
      }
    </button>
    @for (status of statuses; track status) {
      <button type="button" class="tab" [attr.data-tone]="tones[status]"
              [class.active]="selected() === status" [attr.aria-pressed]="selected() === status"
              (click)="selectedChange.emit(status)">
        <span class="dot" aria-hidden="true"></span>
        {{ labels[status] }}
        @if (counts(); as all) {
          <span class="count">{{ countOf(all, status) }}</span>
        }
      </button>
    }
  `,
  styles: `
    :host { display: flex; gap: var(--space-1); overflow-x: auto; scrollbar-width: none; }
    .tab {
      display: inline-flex; flex-shrink: 0; align-items: center; gap: var(--space-2);
      min-height: 36px; padding: 0 var(--space-3); border: 1px solid transparent; border-radius: var(--radius-full);
      background: transparent; color: var(--text-muted); font: var(--type-body-strong); cursor: pointer;
      transition: background-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard);
    }
    .tab:hover { background: var(--surface-hover); color: var(--text-strong); }
    .tab:focus-visible { outline: none; box-shadow: var(--focus-ring); }
    .tab.active { border-color: var(--border-default); background: var(--surface-selected); color: var(--text-strong); }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    [data-tone='positive'] .dot { background: var(--positive); }
    [data-tone='attention'] .dot { background: var(--attention); }
    [data-tone='danger'] .dot { background: var(--danger); }
    .count {
      min-width: 24px; padding: 2px 8px; border-radius: var(--radius-full); background: var(--surface-sunken);
      color: var(--text-body); font: var(--type-label); font-variant-numeric: tabular-nums; text-align: center;
    }
    @media (pointer: coarse) { .tab { min-height: var(--touch-min); } }
    /* Narrow phones: a 2x2 grid keeps every status and its count in view, without sideways scrolling */
    /* (the status color moves from the dot to the count, so the longest label fits on one line) */
    @media (max-width: 559px) {
      :host { display: grid; grid-template-columns: 1fr 1fr; }
      .tab { justify-content: space-between; padding: 0 var(--space-2) 0 var(--space-3); white-space: nowrap; }
      .dot { display: none; }
      [data-tone='positive'] .count { background: var(--positive-bg); color: var(--positive-text); }
      [data-tone='attention'] .count { background: var(--attention-bg); color: var(--attention-text); }
      [data-tone='danger'] .count { background: var(--danger-bg); color: var(--danger-text); }
    }
  `,
})
export class TicketStatusTabs {
  readonly selected = input<TicketStatus | null>(null);
  readonly counts = input<TicketStatusCounts | null>(null);
  readonly selectedChange = output<TicketStatus | null>();

  protected readonly statuses = TICKET_STATUSES;
  protected readonly labels = STATUS_LABELS;
  protected readonly tones = STATUS_TONES;
  protected readonly countOf = countOf;
}
