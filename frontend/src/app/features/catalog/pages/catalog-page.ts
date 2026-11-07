import { ElementRef, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { errorMessageOf, fieldErrorsOf } from '../../../core/api/api';
import { focusFirstInvalid } from '../../../shared/format/focus-first-invalid';
import { ToastService } from '../../../shared/ui/toast';
import { CatalogListStore } from '../store/catalog-list.store';

export interface CatalogMessages {
  created: string;
  updated: string;
  deleted: string;
}

/**
 * What the sectors, asset tags and items pages share: list loading, the create/edit dialog and the
 * delete confirmation. Each page only says how its form maps to a request.
 */
export abstract class CatalogPage<T extends { id: string }, R> {
  protected abstract readonly store: CatalogListStore<T, R>;
  protected abstract readonly form: FormGroup;
  protected abstract readonly messages: CatalogMessages;

  private readonly toast = inject(ToastService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly formOpen = signal(false);
  protected readonly editing = signal<T | null>(null);
  protected readonly saving = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly fieldErrors = signal<Record<string, string>>({});
  protected readonly deleteTarget = signal<T | null>(null);
  protected readonly deletingId = signal<string | null>(null);

  /** Copies the record into the form, or clears it for a new one. */
  protected abstract fillForm(record: T | null): void;

  protected abstract toRequest(): R;

  protected openCreate(): void {
    this.openForm(null);
  }

  protected openEdit(record: T): void {
    this.openForm(record);
  }

  protected closeForm(): void {
    this.formOpen.set(false);
  }

  protected async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      focusFirstInvalid(this.host.nativeElement);
      return;
    }

    const editing = this.editing();
    this.saving.set(true);
    this.formError.set(null);
    this.fieldErrors.set({});
    try {
      if (editing) {
        await this.store.update(editing.id, this.toRequest());
      } else {
        await this.store.create(this.toRequest());
      }
      this.formOpen.set(false);
      this.toast.show(editing ? this.messages.updated : this.messages.created);
    } catch (error) {
      this.formError.set(errorMessageOf(error));
      this.fieldErrors.set(fieldErrorsOf(error));
    } finally {
      this.saving.set(false);
    }
  }

  protected async confirmDelete(): Promise<void> {
    const record = this.deleteTarget();
    this.deleteTarget.set(null);
    if (!record) {
      return;
    }

    this.deletingId.set(record.id);
    try {
      await this.store.remove(record.id);
      this.toast.show(this.messages.deleted);
    } catch (error) {
      this.toast.show(errorMessageOf(error), 'danger');
    } finally {
      this.deletingId.set(null);
    }
  }

  /** Field message: client validation first, then what the server rejected. */
  protected errorOf(field: string, required: string): string | null {
    const control = this.form.get(field);
    if (control?.touched && control.hasError('required')) {
      return required;
    }
    if (control?.touched && control.hasError('maxlength')) {
      return `Use no máximo ${control.getError('maxlength').requiredLength} caracteres`;
    }
    return this.fieldErrors()[field] ?? null;
  }

  private openForm(record: T | null): void {
    this.editing.set(record);
    this.formError.set(null);
    this.fieldErrors.set({});
    this.form.reset();
    this.fillForm(record);
    this.formOpen.set(true);
  }
}
