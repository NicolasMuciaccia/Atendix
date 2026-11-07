import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface PasswordRule {
  label: string;
  test: (password: string) => boolean;
}

const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

// Same policy the back-end enforces in ChangePasswordRequest
export const PASSWORD_RULES: PasswordRule[] = [
  { label: `De ${MIN_LENGTH} a ${MAX_LENGTH} caracteres`, test: p => p.length >= MIN_LENGTH && p.length <= MAX_LENGTH },
  { label: 'Uma letra maiúscula', test: p => /[A-Z]/.test(p) },
  { label: 'Uma letra minúscula', test: p => /[a-z]/.test(p) },
  { label: 'Um número', test: p => /\d/.test(p) },
  { label: 'Um caractere especial', test: p => /[^A-Za-z0-9]/.test(p) },
];

export const passwordPolicyValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = String(control.value ?? '');
  return PASSWORD_RULES.every(rule => rule.test(password)) ? null : { passwordPolicy: true };
};

export function forbiddenPasswordValidator(forbidden: string): ValidatorFn {
  return control => (control.value === forbidden ? { initialPassword: true } : null);
}

/** Group validator: the confirmation must repeat the new password. */
export function matchingPasswordsValidator(passwordKey: string, confirmationKey: string): ValidatorFn {
  return group => {
    const password = group.get(passwordKey)?.value;
    const confirmation = group.get(confirmationKey)?.value;
    return confirmation && password !== confirmation ? { passwordMismatch: true } : null;
  };
}
