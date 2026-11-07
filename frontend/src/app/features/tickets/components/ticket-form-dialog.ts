import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, output } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { todayIso } from '../../../shared/format/dates';
import { focusFirstInvalid } from '../../../shared/format/focus-first-invalid';
import { Button } from '../../../shared/ui/button';
import { Dialog } from '../../../shared/ui/dialog';
import { Field } from '../../../shared/ui/field';
import { Icon } from '../../../shared/ui/icon';
import { Item } from '../../catalog/data/catalog.models';
import { CreateTicketRequest } from '../data/ticket.models';

type TicketField = 'requestDate' | 'itemId' | 'problemDescription';

// Limit mirrors the back-end column (ColumnLengths.PROBLEM_DESCRIPTION)
const MAX_DESCRIPTION = 2000;
const LOCALE = 'pt-BR';

const REQUIRED_MESSAGES: Record<TicketField, string> = {
  requestDate: 'Informe a data do chamado',
  itemId: 'Selecione a etiqueta ou o item com problema',
  problemDescription: 'Descreva o problema',
};

interface SectorOption {
  id: string;
  name: string;
}

/**
 * "Novo chamado" form. Etiqueta, item and setor come from the catalog: picking the tag fills the
 * item and the sector; picking a sector narrows the items. Created when the dialog opens, so it
 * always starts clean.
 */
@Component({
  selector: 'atx-ticket-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, Button, Dialog, Field, Icon],
  templateUrl: './ticket-form-dialog.html',
  styleUrl: './ticket-form-dialog.scss',
})
export class TicketFormDialog {
  readonly items = input<Item[]>([]);
  readonly itemsLoading = input(false);
  readonly isAdmin = input(false);
  readonly saving = input(false);
  readonly serverError = input<string | null>(null);
  readonly serverFieldErrors = input<Record<string, string>>({});
  readonly submitted = output<CreateTicketRequest>();
  readonly closed = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly today = todayIso();
  protected readonly maxDescription = MAX_DESCRIPTION;
  protected readonly form = inject(FormBuilder).nonNullable.group({
    requestDate: [this.today, Validators.required],
    // Only narrows the item and tag lists; the ticket itself stores the item
    sectorId: [''],
    // The tag select picks an item too; it has its own control because a value typed in one
    // select is not pushed to another select bound to the same control
    tagItemId: [''],
    itemId: ['', Validators.required],
    problemDescription: ['', [Validators.required, Validators.maxLength(MAX_DESCRIPTION)]],
  });

  private readonly sectorFilter = toSignal(this.form.controls.sectorId.valueChanges, { initialValue: '' });
  private readonly itemIdValue = toSignal(this.form.controls.itemId.valueChanges, { initialValue: '' });

  protected readonly sectorOptions = computed<SectorOption[]>(() => {
    const sectors = new Map(this.items().map(item => [item.sectorId, item.sectorName]));
    return [...sectors]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, LOCALE));
  });
  private readonly itemsInSector = computed(() => {
    const sectorId = this.sectorFilter();
    return sectorId ? this.items().filter(item => item.sectorId === sectorId) : this.items();
  });
  protected readonly itemOptions = computed(() =>
    [...this.itemsInSector()].sort((a, b) => a.name.localeCompare(b.name, LOCALE)));
  protected readonly tagOptions = computed(() =>
    [...this.itemsInSector()].sort((a, b) => a.assetTagCode.localeCompare(b.assetTagCode, LOCALE)));
  protected readonly selectedItem = computed(() => this.items().find(item => item.id === this.itemIdValue()) ?? null);
  protected readonly catalogEmpty = computed(() => !this.itemsLoading() && this.items().length === 0);

  constructor() {
    const { sectorId, tagItemId, itemId } = this.form.controls;

    // Choosing the tag is choosing its item
    tagItemId.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      if (itemId.value !== value) {
        itemId.setValue(value);
      }
    });
    // The chosen item shows its tag and its sector
    itemId.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      if (tagItemId.value !== value) {
        tagItemId.setValue(value, { emitEvent: false });
      }
      const item = this.items().find(candidate => candidate.id === value);
      if (item && sectorId.value !== item.sectorId) {
        sectorId.setValue(item.sectorId);
      }
    });
    // A sector that does not hold the chosen item clears the choice
    sectorId.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      const item = this.selectedItem();
      if (item && value && item.sectorId !== value) {
        itemId.setValue('');
      }
    });
  }

  protected errorOf(field: TicketField): string | null {
    const control = this.form.controls[field];
    if (control.touched && control.hasError('required')) {
      return REQUIRED_MESSAGES[field];
    }
    if (control.touched && control.hasError('maxlength')) {
      return `Use no máximo ${control.getError('maxlength').requiredLength} caracteres`;
    }
    if (field === 'requestDate' && control.touched && control.value > this.today) {
      return 'A data do chamado não pode estar no futuro';
    }
    return this.serverFieldErrors()[field] ?? null;
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.form.controls.requestDate.value > this.today) {
      focusFirstInvalid(this.host.nativeElement);
      return;
    }
    const value = this.form.getRawValue();
    this.submitted.emit({
      requestDate: value.requestDate,
      itemId: value.itemId,
      problemDescription: value.problemDescription.trim(),
    });
  }
}
