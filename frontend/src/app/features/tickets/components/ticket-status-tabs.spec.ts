import { TestBed } from '@angular/core/testing';
import { TicketStatus } from '../data/ticket.models';
import { TicketStatusTabs } from './ticket-status-tabs';

describe('TicketStatusTabs', () => {
  it('should show the count of each status and ask for the one clicked', async () => {
    const fixture = TestBed.createComponent(TicketStatusTabs);
    fixture.componentRef.setInput('selected', 'OPEN');
    fixture.componentRef.setInput('counts', { open: 3, inProgress: 2, finished: 1, total: 6 });
    await fixture.whenStable();
    const requested: (TicketStatus | null)[] = [];
    fixture.componentInstance.selectedChange.subscribe(status => requested.push(status));
    const tabs = [...(fixture.nativeElement as HTMLElement).querySelectorAll('button')];

    expect(tabs.map(tab => tab.textContent?.replace(/\s+/g, ' ').trim()))
      .toEqual(['Todos 6', 'Aberto 3', 'Em andamento 2', 'Finalizado 1']);
    expect(tabs[1].getAttribute('aria-pressed')).toBe('true');

    tabs[3].click();
    tabs[0].click();
    expect(requested).toEqual(['FINISHED', null]);
  });
});
