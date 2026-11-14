import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PasswordInput } from './password-input';

@Component({
  imports: [PasswordInput],
  template: `<atx-password-input><input type="password" value="segredo" /></atx-password-input>`,
})
class Host {}

describe('PasswordInput', () => {
  it('should show and hide what was typed', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const input = element.querySelector('input')!;
    const reveal = element.querySelector('button')!;

    reveal.click();
    await fixture.whenStable();
    expect(input.type).toBe('text');
    expect(reveal.getAttribute('aria-label')).toBe('Ocultar senha');

    reveal.click();
    await fixture.whenStable();
    expect(input.type).toBe('password');
  });
});
