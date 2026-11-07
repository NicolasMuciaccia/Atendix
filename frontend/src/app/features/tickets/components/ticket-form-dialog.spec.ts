import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Item } from '../../catalog/data/catalog.models';
import { CreateTicketRequest } from '../data/ticket.models';
import { TicketFormDialog } from './ticket-form-dialog';

const PRINTER: Item = {
  id: 'i-printer', name: 'Impressora HP LaserJet', sectorId: 's-finance', sectorName: 'Financeiro',
  assetTagId: 't-1', assetTagCode: 'PAT-004512', createdAt: '2026-11-05T13:02:00Z',
};
const MONITOR: Item = {
  id: 'i-monitor', name: 'Monitor Dell 24', sectorId: 's-hr', sectorName: 'Recursos Humanos',
  assetTagId: 't-2', assetTagCode: 'PAT-001122', createdAt: '2026-11-05T13:02:00Z',
};

describe('TicketFormDialog', () => {
  let fixture: ComponentFixture<TicketFormDialog>;
  let element: HTMLElement;

  beforeEach(async () => {
    HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) { this.open = true; };
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(TicketFormDialog);
    fixture.componentRef.setInput('items', [PRINTER, MONITOR]);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  function select(id: string, value: string): void {
    const control = element.querySelector<HTMLSelectElement>(`#${id}`)!;
    control.value = value;
    control.dispatchEvent(new Event('change'));
  }

  function selectedValue(id: string): string {
    return element.querySelector<HTMLSelectElement>(`#${id}`)!.value;
  }

  it('should fill the item and the sector when the tag is chosen', async () => {
    select('ticket-tag', MONITOR.id);
    await fixture.whenStable();

    expect(selectedValue('ticket-item')).toBe(MONITOR.id);
    expect(selectedValue('ticket-sector')).toBe(MONITOR.sectorId);
    expect(element.querySelector('.summary')?.textContent).toContain('PAT-001122');
  });

  it('should only offer the items of the chosen sector', async () => {
    select('ticket-sector', PRINTER.sectorId);
    await fixture.whenStable();

    const itemOptions = [...element.querySelectorAll<HTMLOptionElement>('#ticket-item option')]
      .map(option => option.value)
      .filter(Boolean);
    expect(itemOptions).toEqual([PRINTER.id]);
  });

  it('should clear the item when a sector that does not hold it is chosen', async () => {
    select('ticket-tag', PRINTER.id);
    await fixture.whenStable();
    select('ticket-sector', MONITOR.sectorId);
    await fixture.whenStable();

    expect(selectedValue('ticket-item')).toBe('');
  });

  it('should send only the date, the item and the description', async () => {
    const sent: CreateTicketRequest[] = [];
    fixture.componentInstance.submitted.subscribe(request => sent.push(request));
    select('ticket-tag', PRINTER.id);
    const description = element.querySelector<HTMLTextAreaElement>('#ticket-description')!;
    description.value = '  Não puxa o papel.  ';
    description.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    element.querySelector<HTMLFormElement>('#ticket-form')!.dispatchEvent(new Event('submit'));

    expect(sent).toHaveLength(1);
    expect(sent[0]).toEqual({ requestDate: expect.any(String), itemId: PRINTER.id, problemDescription: 'Não puxa o papel.' });
  });
});
