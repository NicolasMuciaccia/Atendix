import { FormControl, FormGroup } from '@angular/forms';
import {
  PASSWORD_RULES,
  forbiddenPasswordValidator,
  matchingPasswordsValidator,
  passwordPolicyValidator,
} from './password-policy';

describe('password policy', () => {
  it('should accept a password that meets every rule', () => {
    expect(passwordPolicyValidator(new FormControl('Atendix#2026'))).toBeNull();
  });

  it.each(['atendix#2026', 'ATENDIX#2026', 'Atendix#atx', 'Atendix2026', 'At#20'])(
    'should reject "%s", which misses a rule',
    password => {
      expect(passwordPolicyValidator(new FormControl(password))).toEqual({ passwordPolicy: true });
    },
  );

  it('should report each rule separately for the checklist', () => {
    const met = PASSWORD_RULES.map(rule => rule.test('atendix'));

    expect(met).toEqual([false, false, true, false, false]);
  });

  it('should refuse the initial password as the new one', () => {
    expect(forbiddenPasswordValidator('mudar@123')(new FormControl('mudar@123'))).toEqual({ initialPassword: true });
  });

  it('should flag a confirmation that differs from the new password', () => {
    const group = new FormGroup({ newPassword: new FormControl('Atendix#2026'), confirmation: new FormControl('Atendix#2025') });

    expect(matchingPasswordsValidator('newPassword', 'confirmation')(group)).toEqual({ passwordMismatch: true });
  });
});
