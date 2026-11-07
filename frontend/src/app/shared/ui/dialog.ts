import { ChangeDetectionStrategy, Component, ElementRef, effect, input, output, viewChild } from '@angular/core';
import { IconButton } from './icon-button';

let nextDialogId = 0;

/**
 * Modal on the native <dialog>: focus trap, Esc to close and the backdrop come from the browser.
 * Actions go in an element with the `dialogActions` attribute.
 */
@Component({
  selector: 'atx-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButton],
  template: `
    <dialog #dialog [attr.aria-labelledby]="titleId" (close)="closed.emit()">
      <header class="header">
        <div class="heading">
          <h2 class="title" [id]="titleId">{{ title() }}</h2>
          @if (description()) {
            <p class="description">{{ description() }}</p>
          }
        </div>
        <button atxIconButton icon="x" label="Fechar" size="sm" type="button" (click)="closed.emit()"></button>
      </header>
      <div class="body"><ng-content /></div>
      <footer class="actions"><ng-content select="[dialogActions]" /></footer>
    </dialog>
  `,
  styles: `
    dialog {
      width: min(calc(100vw - 32px), var(--dialog-width, 480px)); max-height: calc(100dvh - 32px);
      padding: 0; border: 1px solid var(--border-subtle); border-radius: var(--radius-xl);
      background: var(--surface-card); color: var(--text-body); box-shadow: var(--shadow-xl);
    }
    dialog::backdrop { background: var(--scrim); }
    dialog[open] { animation: enter var(--duration-slow) var(--ease-out); }
    .header { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-5) var(--space-5) 0; }
    .heading { flex: 1; min-width: 0; }
    /* centers the 26px close button on the first line of the title */
    .header > button { margin-top: -2px; margin-right: -4px; }
    .title { font: var(--type-page-title); letter-spacing: var(--tracking-heading); color: var(--text-strong); }
    .description { margin-top: var(--space-1); font-size: var(--text-base); color: var(--text-muted); }
    .body { padding: var(--space-4) var(--space-5); }
    .actions { display: flex; justify-content: flex-end; gap: var(--space-2); padding: 0 var(--space-5) var(--space-5); }
    .actions:empty { display: none; }
    @keyframes enter { from { opacity: 0; transform: translateY(6px) scale(.99); } }
  `,
})
export class Dialog {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly description = input<string | null>(null);
  readonly closed = output<void>();

  protected readonly titleId = `atx-dialog-title-${nextDialogId++}`;
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    // Opening a modal <dialog> is an imperative browser API, so it is driven by an effect
    effect(() => {
      const element = this.dialog().nativeElement;
      if (this.open() && !element.open) {
        element.showModal();
      } else if (!this.open() && element.open) {
        element.close();
      }
    });
  }
}
