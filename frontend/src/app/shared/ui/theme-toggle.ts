import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ThemeStore } from '../../core/theme/theme.store';
import { IconButton, IconButtonVariant } from './icon-button';

/** Switches between light and dark; the icon shows the theme the click leads to. */
@Component({
  selector: 'atx-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButton],
  template: `
    <button atxIconButton type="button" [variant]="variant()" [icon]="isDark() ? 'sun' : 'moon'"
            [label]="isDark() ? 'Usar tema claro' : 'Usar tema escuro'" (click)="themeStore.toggle()"></button>
  `,
  styles: `:host { display: inline-flex; }`,
})
export class ThemeToggle {
  readonly variant = input<IconButtonVariant>('ghost');

  protected readonly themeStore = inject(ThemeStore);
  protected readonly isDark = computed(() => this.themeStore.theme() === 'dark');
}
