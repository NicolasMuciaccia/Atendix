import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorMessageOf } from '../../../core/api/api';
import { FIRST_ACCESS_PATH, HOME_PATH } from '../../../core/auth/auth.paths';
import { AuthStore } from '../../../core/auth/auth.store';
import { focusFirstInvalid } from '../../../shared/format/focus-first-invalid';
import { Button } from '../../../shared/ui/button';
import { Field } from '../../../shared/ui/field';
import { Icon } from '../../../shared/ui/icon';
import { IconButton } from '../../../shared/ui/icon-button';

@Component({
  selector: 'atx-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Button, Field, Icon, IconButton],
  templateUrl: './login-page.html',
  styleUrl: '../auth-layout.scss',
})
export class LoginPage {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
  });
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  protected showError(control: 'login' | 'password'): boolean {
    const field = this.form.controls[control];
    return field.invalid && field.touched;
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
      const user = await this.authStore.login(this.form.getRawValue());
      await this.router.navigateByUrl(user.mustChangePassword ? FIRST_ACCESS_PATH : HOME_PATH);
    } catch (error) {
      this.error.set(errorMessageOf(error));
      this.form.controls.password.reset();
    } finally {
      this.submitting.set(false);
    }
  }
}
