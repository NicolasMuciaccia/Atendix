import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconName } from './icon-names';

/** Line icon from the design system sprite (public/icons.svg). Inherits the text color. */
@Component({
  selector: 'atx-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         [attr.stroke-width]="strokeWidth()" stroke-linecap="round" stroke-linejoin="round">
      <use [attr.href]="href()" />
    </svg>
  `,
  styles: `
    :host { display: inline-flex; flex-shrink: 0; }
    svg { display: block; }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(16);
  readonly strokeWidth = input(1.75);

  protected readonly href = computed(() => `icons.svg#${this.name()}`);
}
