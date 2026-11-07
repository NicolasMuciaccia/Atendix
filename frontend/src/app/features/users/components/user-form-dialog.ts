import { ChangeDetectionStrategy, Component, ElementRef, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ROLE_LABELS, Role } from '../../../core/auth/auth.models';
import { focusFirstInvalid } from '../../../shared/format/focus-first-invalid';
import { Button } from '../../../shared/ui/button';
import { Dialog } from '../../../shared/ui/dialog';
import { Field } from '../../../shared/ui/field';
import { Icon } from '../../../shared/ui/icon';
import { CreateUserRequest } from '../data/user.service';

const MAX_NAME = 120;
// Same rule as the back-end CreateUserRequest
const LOGIN_PATTERN = /^[A-Za-z0-9._-]{3,40}$/;

@Component({
  selector: 'atx-user-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Button, Dialog, Field, Icon],
  template: `
    <atx-dialog [open]="true" title="Novo usuário"
                description="A conta nasce com a senha inicial, que o usuário troca no primeiro acesso."
                (closed)="closed.emit()">
      <form id="user-form" class="form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
        @if (serverError()) {
          <p class="banner" role="alert"><atx-icon name="circle-alert" [size]="15" /> {{ serverError() }}</p>
        }
        <atx-field label="Nome" for="user-name" [error]="errorOf('name')">
          <input id="user-name" class="atx-control" formControlName="name" [maxlength]="maxName" autocomplete="off"
                 aria-describedby="user-name-message" [attr.aria-invalid]="!!errorOf('name')" />
        </atx-field>
        <atx-field label="Login" for="user-login" hint="Letras, números, ponto, hífen ou sublinhado. Gravado em minúsculas."
                   [error]="errorOf('login')">
          <input id="user-login" class="atx-control" formControlName="login" autocomplete="off" autocapitalize="none"
                 spellcheck="false" aria-describedby="user-login-message" [attr.aria-invalid]="!!errorOf('login')" />
        </atx-field>
        <atx-field label="Perfil" for="user-role">
          <select id="user-role" class="atx-control" formControlName="role">
            @for (role of roles; track role) {
              <option [value]="role">{{ roleLabels[role] }}</option>
            }
          </select>
        </atx-field>
      </form>
      <div dialogActions>
        <button atxButton variant="secondary" type="button" (click)="closed.emit()">Cancelar</button>
        <button atxButton type="submit" form="user-form" iconLeft="user-plus" [loading]="saving()">Cadastrar</button>
      </div>
    </atx-dialog>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: var(--space-4); }
    .banner { display: flex; gap: var(--space-2); padding: var(--space-2-5) var(--space-3); border-radius: var(--radius-md);
              background: var(--danger-bg); color: var(--danger-text); font-size: var(--text-sm); }
  `,
})
export class UserFormDialog {
  readonly saving = input(false);
  readonly serverError = input<string | null>(null);
  readonly serverFieldErrors = input<Record<string, string>>({});
  readonly submitted = output<CreateUserRequest>();
  readonly closed = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly maxName = MAX_NAME;
  protected readonly roles: Role[] = ['COMMON', 'ADMIN'];
  protected readonly roleLabels = ROLE_LABELS;
  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(MAX_NAME)]],
    login: ['', [Validators.required, Validators.pattern(LOGIN_PATTERN)]],
    role: ['COMMON' as Role, Validators.required],
  });

  protected errorOf(field: 'name' | 'login'): string | null {
    const control = this.form.controls[field];
    if (control.touched && control.hasError('required')) {
      return field === 'name' ? 'Informe o nome' : 'Informe o login';
    }
    if (control.touched && control.hasError('pattern')) {
      return 'Use de 3 a 40 caracteres: letras, números, ponto, hífen ou sublinhado';
    }
    return this.serverFieldErrors()[field] ?? null;
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      focusFirstInvalid(this.host.nativeElement);
      return;
    }
    const value = this.form.getRawValue();
    this.submitted.emit({ name: value.name.trim(), login: value.login.trim(), role: value.role });
  }
}
