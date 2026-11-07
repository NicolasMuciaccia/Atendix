import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Icon } from './icon';
import { IconName } from './icon-names';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const ICON_SIZE: Record<ButtonSize, number> = { sm: 14, md: 15, lg: 17 };

/**
 * Design system Button on a native element. While `loading`, it shows a spinner and stays
 * disabled, so an async action cannot be fired twice.
 */
@Component({
  selector: 'button[atxButton], a[atxButton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: {
    '[class]': 'classes()',
    '[attr.disabled]': 'disabled() || loading() ? "" : null',
    '[attr.aria-busy]': 'loading() || null',
  },
  template: `
    @if (loading()) {
      <atx-icon name="loader" class="atx-spin" [size]="iconSize()" [strokeWidth]="2" />
    } @else if (iconLeft(); as icon) {
      <atx-icon [name]="icon" [size]="iconSize()" [strokeWidth]="2" />
    }
    <ng-content />
    @if (iconRight(); as icon) {
      <atx-icon [name]="icon" [size]="iconSize()" [strokeWidth]="2" />
    }
  `,
  styleUrl: './button.scss',
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly iconLeft = input<IconName | null>(null);
  readonly iconRight = input<IconName | null>(null);
  readonly fullWidth = input(false);
  readonly loading = input(false);
  readonly disabled = input(false);

  protected readonly iconSize = computed(() => ICON_SIZE[this.size()]);
  protected readonly classes = computed(() =>
    `atx-button atx-button--${this.variant()} atx-button--${this.size()}${this.fullWidth() ? ' atx-button--full' : ''}`);
}
