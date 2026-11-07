import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Titled block of a side panel, separated from the next one by a hairline (PanelSection). */
@Component({
  selector: 'atx-panel-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (title()) {
      <h3 class="title">{{ title() }}</h3>
    }
    <ng-content />
  `,
  styles: `
    :host { display: block; padding: 18px 0; border-bottom: 1px solid var(--border-subtle); }
    :host(:last-child) { border-bottom: 0; }
    .title { margin-bottom: var(--space-3); font-size: var(--text-base); font-weight: var(--weight-semibold);
             color: var(--text-strong); letter-spacing: -0.005em; }
  `,
})
export class PanelSection {
  readonly title = input<string | null>(null);
}

/** Label/value line inside a panel section (DetailRow). */
@Component({
  selector: 'atx-detail-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="label">{{ label() }}</span>
    <span class="value"><ng-content /></span>
  `,
  styles: `
    :host { display: flex; align-items: center; gap: var(--space-2); min-height: 30px; font-size: var(--text-sm); }
    .label { width: 104px; flex-shrink: 0; color: var(--text-muted); }
    .value { flex: 1; min-width: 0; display: flex; align-items: center; gap: var(--space-1-5);
             color: var(--ink-800); overflow-wrap: anywhere; }
  `,
})
export class DetailRow {
  readonly label = input.required<string>();
}
