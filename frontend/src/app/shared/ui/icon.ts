import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconName } from './icon-names';

/** PrimeIcons glyph. Inherits the text color; decorative, so screen readers skip it. */
@Component({
  selector: 'atx-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', '[style.font-size.px]': 'size()' },
  template: `<i [class]="iconClass()"></i>`,
  styles: `
    :host { display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; line-height: 1; }
    i { font-size: inherit; line-height: 1; }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(16);

  protected readonly iconClass = computed(() => `pi pi-${this.name()}`);
}
