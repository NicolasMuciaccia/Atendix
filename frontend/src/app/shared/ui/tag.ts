import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icon } from './icon';
import { IconName } from './icon-names';

export type TagTone = 'neutral' | 'blue' | 'violet' | 'positive' | 'attention' | 'danger';

/**
 * Small label for categories and states (design system Tag + StatusPill). The text always
 * carries the meaning; the color only helps scanning.
 */
@Component({
  selector: 'atx-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { '[class]': '"atx-tag atx-tag--" + tone()' },
  template: `
    @if (dot()) {
      <span class="dot"></span>
    }
    @if (icon(); as iconName) {
      <atx-icon [name]="iconName" [size]="11" [strokeWidth]="2" />
    }
    <ng-content />
  `,
  styles: `
    :host {
      --tag-bg: var(--tag-neutral-bg); --tag-fg: var(--tag-neutral-text); --tag-dot: var(--ink-400);
      display: inline-flex; align-items: center; gap: 5px; height: 20px; padding: 0 7px;
      border-radius: var(--radius-xs); background: var(--tag-bg); color: var(--tag-fg);
      font-size: var(--text-xs); font-weight: var(--weight-medium); line-height: 1; white-space: nowrap;
    }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--tag-dot); flex-shrink: 0; }
    :host(.atx-tag--blue) { --tag-bg: var(--tag-blue-bg); --tag-fg: var(--tag-blue-text); --tag-dot: var(--info); }
    :host(.atx-tag--violet) { --tag-bg: var(--tag-violet-bg); --tag-fg: var(--tag-violet-text); --tag-dot: var(--violet-500); }
    :host(.atx-tag--positive) { --tag-bg: var(--positive-bg); --tag-fg: var(--positive-text); --tag-dot: var(--positive); }
    :host(.atx-tag--attention) { --tag-bg: var(--attention-bg); --tag-fg: var(--attention-text); --tag-dot: var(--attention); }
    :host(.atx-tag--danger) { --tag-bg: var(--danger-bg); --tag-fg: var(--danger-text); --tag-dot: var(--danger); }
  `,
})
export class Tag {
  readonly tone = input<TagTone>('neutral');
  readonly dot = input(false);
  readonly icon = input<IconName | null>(null);
}
