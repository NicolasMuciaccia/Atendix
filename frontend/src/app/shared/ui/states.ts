import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from './button';
import { Icon } from './icon';
import { IconName } from './icon-names';

/** Empty area: what would be here, and the action that fills it (projected content). */
@Component({
  selector: 'atx-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <span class="tile"><atx-icon [name]="icon()" [size]="20" /></span>
    <p class="title">{{ title() }}</p>
    @if (description()) {
      <p class="description">{{ description() }}</p>
    }
    <div class="actions"><ng-content /></div>
  `,
  styleUrl: './states.scss',
})
export class EmptyState {
  readonly icon = input<IconName>('inbox');
  readonly title = input.required<string>();
  readonly description = input<string | null>(null);
}

/** Failed load: the message from the back-end and a retry. */
@Component({
  selector: 'atx-error-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Button],
  host: { role: 'alert' },
  template: `
    <span class="tile tile--danger"><atx-icon name="circle-alert" [size]="20" /></span>
    <p class="title">{{ title() }}</p>
    <p class="description">{{ message() }}</p>
    <div class="actions">
      <button atxButton variant="secondary" size="sm" iconLeft="refresh-cw" type="button" (click)="retry.emit()">
        Tentar de novo
      </button>
    </div>
  `,
  styleUrl: './states.scss',
})
export class ErrorState {
  readonly title = input('Não foi possível carregar');
  readonly message = input.required<string>();
  readonly retry = output<void>();
}
