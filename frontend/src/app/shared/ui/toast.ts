import { ChangeDetectionStrategy, Component, Injectable, inject, signal } from '@angular/core';
import { Icon } from './icon';
import { IconButton } from './icon-button';

export type ToastTone = 'positive' | 'danger';

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

const TOAST_DURATION_MS = 4000;

/** Short confirmation of an action that already happened ("Chamado aberto"). */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  private nextId = 0;

  readonly toasts = this._toasts.asReadonly();

  show(message: string, tone: ToastTone = 'positive'): void {
    const toast = { id: this.nextId++, message, tone };
    this._toasts.update(toasts => [...toasts, toast]);
    setTimeout(() => this.dismiss(toast.id), TOAST_DURATION_MS);
  }

  dismiss(id: number): void {
    this._toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }
}

@Component({
  selector: 'atx-toast-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, IconButton],
  host: { 'aria-live': 'polite', role: 'status' },
  template: `
    @for (toast of toastService.toasts(); track toast.id) {
      <div class="toast" [class.toast--danger]="toast.tone === 'danger'">
        <atx-icon [name]="toast.tone === 'danger' ? 'circle-alert' : 'circle-check'" [size]="16" />
        <span class="message">{{ toast.message }}</span>
        <button atxIconButton variant="inverse" size="sm" icon="x" label="Dispensar" type="button"
                (click)="toastService.dismiss(toast.id)"></button>
      </div>
    }
  `,
  styles: `
    :host { position: fixed; z-index: var(--z-toast); right: var(--space-4); bottom: var(--space-4);
            display: flex; flex-direction: column; gap: var(--space-2); max-width: calc(100vw - 32px); }
    .toast { display: flex; align-items: center; gap: var(--space-2-5); min-height: 44px; padding: 0 var(--space-2) 0 var(--space-3);
             border-radius: var(--radius-lg); background: var(--surface-inverse); color: var(--text-inverse);
             box-shadow: var(--shadow-lg); font-size: var(--text-base); animation: enter var(--duration-slow) var(--ease-out); }
    .toast atx-icon { color: var(--green-500); }
    .toast--danger atx-icon:first-child { color: var(--red-500); }
    .message { flex: 1; }
    @keyframes enter { from { opacity: 0; transform: translateY(8px); } }
    @media (max-width: 959px) { :host { right: var(--space-4); left: var(--space-4); bottom: calc(var(--bottom-nav-height) + var(--space-3)); } }
  `,
})
export class ToastHost {
  protected readonly toastService = inject(ToastService);
}
