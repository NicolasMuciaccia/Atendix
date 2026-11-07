import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Label, hint and error around a native control with the `atx-control` class.
 * The control gets `[attr.aria-describedby]` pointing to `{{ for }}-message`.
 */
@Component({
  selector: 'atx-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="label" [attr.for]="for()">
      {{ label() }}
      @if (optional()) {
        <span class="optional">(opcional)</span>
      }
    </label>
    <ng-content />
    @if (error()) {
      <span class="message message--error" [id]="for() + '-message'" role="alert">{{ error() }}</span>
    } @else if (hint()) {
      <span class="message" [id]="for() + '-message'">{{ hint() }}</span>
    }
  `,
  styles: `
    :host { display: flex; flex-direction: column; gap: var(--space-1-5); min-width: 0; }
    .label { font-size: var(--text-sm); font-weight: var(--weight-medium); color: var(--ink-700); }
    .optional { font-weight: var(--weight-regular); color: var(--text-subtle); }
    .message { font-size: var(--text-xs); color: var(--text-muted); }
    .message--error { color: var(--danger-text); }
  `,
})
export class Field {
  readonly label = input.required<string>();
  readonly for = input.required<string>();
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly optional = input(false);
}
