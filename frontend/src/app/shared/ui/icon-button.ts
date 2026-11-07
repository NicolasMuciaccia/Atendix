import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Icon } from './icon';
import { IconName } from './icon-names';

export type IconButtonVariant = 'ghost' | 'outline' | 'inverse';

const BOX: Record<'sm' | 'md' | 'lg', { box: number; icon: number }> = {
  sm: { box: 26, icon: 14 },
  md: { box: 32, icon: 16 },
  lg: { box: 40, icon: 20 },
};

/** Icon-only button; `label` is mandatory because it is the only accessible name. */
@Component({
  selector: 'button[atxIconButton], a[atxIconButton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: {
    '[class]': '"atx-icon-button atx-icon-button--" + variant()',
    '[attr.aria-label]': 'label()',
    '[attr.title]': 'label()',
    '[style.width.px]': 'box().box',
    '[style.height.px]': 'box().box',
  },
  template: `<atx-icon [name]="icon()" [size]="box().icon" />`,
  styles: `
    :host {
      display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
      padding: 0; border: 1px solid transparent; border-radius: var(--radius-md);
      background: transparent; color: var(--ink-600); cursor: pointer;
      transition: background var(--duration-fast) var(--ease-standard);
    }
    :host(:hover) { background: var(--surface-hover); color: var(--ink-800); text-decoration: none; }
    :host(:active) { transform: scale(0.96); }
    :host([disabled]) { opacity: .45; cursor: not-allowed; }
    :host(.atx-icon-button--outline) { background: var(--white); border-color: var(--border-default); box-shadow: var(--shadow-xs); color: var(--ink-700); }
    :host(.atx-icon-button--outline:hover) { background: var(--surface-hover); }
    :host(.atx-icon-button--inverse) { color: var(--nav-text-muted); }
    :host(.atx-icon-button--inverse:hover) { background: var(--nav-item-hover); color: var(--white); }
  `,
})
export class IconButton {
  readonly icon = input.required<IconName>();
  readonly label = input.required<string>();
  readonly variant = input<IconButtonVariant>('ghost');
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  protected readonly box = computed(() => BOX[this.size()]);
}
