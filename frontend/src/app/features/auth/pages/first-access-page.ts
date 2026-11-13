import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorMessageOf } from '../../../core/api/api';
import { INITIAL_PASSWORD } from '../../../core/auth/auth.models';
import { HOME_PATH } from '../../../core/auth/auth.paths';
import { AuthStore } from '../../../core/auth/auth.store';
import { focusFirstInvalid } from '../../../shared/format/focus-first-invalid';
import { Button } from '../../../shared/ui/button';
import { Field } from '../../../shared/ui/field';
import { Icon } from '../../../shared/ui/icon';
import {
  PASSWORD_RULES,
  forbiddenPasswordValidator,
  matchingPasswordsValidator,
  passwordPolicyValidator,
} from '../password-policy';

@Component({
  selector: 'atx-first-access-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Button, Field, Icon],
  templateUrl: './first-access-page.html',
  styleUrls: ['../auth-layout.scss', './first-access-page.scss'],
})
export class FirstAccessPage {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly user = this.authStore.user;
  protected readonly form = inject(FormBuilder).nonNullable.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, passwordPolicyValidator, forbiddenPasswordValidator(INITIAL_PASSWORD)]],
      confirmation: ['', Validators.required],
    },
    { validators: matchingPasswordsValidator('newPassword', 'confirmation') },
  );
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  private readonly newPassword = toSignal(this.form.controls.newPassword.valueChanges, { initialValue: '' });
  protected readonly rules = computed(() =>
    PASSWORD_RULES.map(rule => ({ label: rule.label, met: rule.test(this.newPassword()) })));

  protected currentPasswordError(): string | null {
    const control = this.form.controls.currentPassword;
    return control.touched && control.invalid ? 'Informe a senha atual' : null;
  }

  protected newPasswordError(): string | null {
    const control = this.form.controls.newPassword;
    if (!control.touched) {
      return null;
    }
    if (control.hasError('required')) {
      return 'Crie uma nova senha';
    }
    if (control.hasError('initialPassword')) {
      return 'A nova senha não pode ser a senha inicial';
    }
    return control.hasError('passwordPolicy') ? 'A senha ainda não atende a todos os requisitos' : null;
  }

  protected confirmationError(): string | null {
    const control = this.form.controls.confirmation;
    if (!control.touched) {
      return null;
    }
    if (control.hasError('required')) {
      return 'Repita a nova senha';
    }
    return this.form.hasError('passwordMismatch') ? 'As senhas não são iguais' : null;
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      focusFirstInvalid(this.host.nativeElement);
      return;
    }

    this.submitting.set(true);
    this.error.set(null);
    try {
      const { currentPassword, newPassword } = this.form.getRawValue();
      await this.authStore.changePassword({ currentPassword, newPassword });
      await this.router.navigateByUrl(HOME_PATH);
    } catch (error) {
      this.error.set(errorMessageOf(error));
    } finally {
      this.submitting.set(false);
    }
  }

  protected logout(): void {
    void this.authStore.logout();
  }
}
