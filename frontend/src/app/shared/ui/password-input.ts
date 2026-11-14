import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, signal } from '@angular/core';
import { IconButton } from './icon-button';

/**
 * Wraps a password input with a button that shows or hides what was typed:
 * `<atx-password-input><input type="password" ... /></atx-password-input>`.
 */
@Component({
  selector: 'atx-password-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButton],
  template: `
    <ng-content />
    <button atxIconButton type="button" class="reveal" [icon]="visible() ? 'eye-slash' : 'eye'"
            [label]="visible() ? 'Ocultar senha' : 'Mostrar senha'" [attr.aria-pressed]="visible()"
            (click)="visible.set(!visible())"></button>
  `,
  styles: `
    :host { position: relative; display: block; }
    :host ::ng-deep input { padding-right: 48px; }
    .reveal { position: absolute; top: 50%; right: 4px; transform: translateY(-50%); }
  `,
})
export class PasswordInput {
  protected readonly visible = signal(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    effect(() => {
      const input = this.host.nativeElement.querySelector('input');
      input?.setAttribute('type', this.visible() ? 'text' : 'password');
    });
  }
}
