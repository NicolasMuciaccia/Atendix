import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Button } from './button';

@Component({
  imports: [Button],
  template: `<button atxButton [loading]="loading()" (click)="clicks = clicks + 1">Salvar</button>`,
})
class Host {
  readonly loading = signal(false);
  clicks = 0;
}

describe('Button', () => {
  it('should stay disabled while loading so the action cannot run twice', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.loading.set(true);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;

    button.click();

    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(fixture.componentInstance.clicks).toBe(0);
  });
});
