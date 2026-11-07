import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ticket, TicketStatus } from '../data/ticket.models';
import { TicketDetail } from './ticket-detail';
import { STATUS_TONES } from './ticket-status';

const TICKET: Ticket = {
  id: 't-1', requestDate: '2026-11-05', itemId: 'i-1', itemName: 'Impressora HP LaserJet',
  sectorId: 's-1', sector: 'Financeiro', assetTag: 'PAT-004512',
  problemDescription: 'Não puxa o papel da bandeja 2.', status: 'OPEN',
  requesterId: 'u-1', requesterName: 'Usuário Comum',
  createdAt: '2026-11-05T13:02:00Z', updatedAt: '2026-11-05T13:02:00Z',
};

describe('TicketDetail', () => {
  let fixture: ComponentFixture<TicketDetail>;

  async function render(status: TicketStatus, isAdmin: boolean, canCancel = false): Promise<HTMLElement> {
    fixture = TestBed.createComponent(TicketDetail);
    fixture.componentRef.setInput('ticket', { ...TICKET, status });
    fixture.componentRef.setInput('isAdmin', isAdmin);
    fixture.componentRef.setInput('canCancel', canCancel);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  function buttonTexts(element: HTMLElement): string[] {
    return [...element.querySelectorAll('button')].map(button => button.textContent?.trim() ?? '');
  }

  it('should use the colors required by the assignment for each status', () => {
    expect(STATUS_TONES).toEqual({ OPEN: 'positive', IN_PROGRESS: 'attention', FINISHED: 'danger' });
  });

  it('should offer to start or finish an open ticket to the administrator', async () => {
    const element = await render('OPEN', true);

    expect(buttonTexts(element)).toEqual(expect.arrayContaining(['Iniciar atendimento', 'Finalizar']));
  });

  it('should not show the handling actions to a common user', async () => {
    const element = await render('OPEN', false, true);

    expect(element.querySelector('.handling')).toBeNull();
    expect(buttonTexts(element)).toContain('Cancelar chamado');
  });

  it('should explain why a ticket in progress can no longer be cancelled', async () => {
    const element = await render('IN_PROGRESS', false);

    expect(buttonTexts(element)).not.toContain('Cancelar chamado');
    expect(element.textContent).toContain('não pode mais ser cancelado');
  });

  it('should ask the page to finish the ticket', async () => {
    const element = await render('IN_PROGRESS', true);
    const requested: TicketStatus[] = [];
    fixture.componentInstance.statusChange.subscribe(status => requested.push(status));

    [...element.querySelectorAll('button')].find(button => button.textContent?.includes('Finalizar chamado'))!.click();

    expect(requested).toEqual(['FINISHED']);
  });
});
