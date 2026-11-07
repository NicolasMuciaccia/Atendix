import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateTimePipe } from '../../../shared/format/dates';
import { Button } from '../../../shared/ui/button';
import { Dialog } from '../../../shared/ui/dialog';
import { Field } from '../../../shared/ui/field';
import { Icon } from '../../../shared/ui/icon';
import { IconButton } from '../../../shared/ui/icon-button';
import { EmptyState, ErrorState } from '../../../shared/ui/states';
import { Sector, SectorRequest } from '../data/catalog.models';
import { SectorsStore } from '../store/catalog-list.store';
import { CatalogPage } from './catalog-page';

const MAX_NAME = 80;
const SKELETON_ROWS = [0, 1, 2];

@Component({
  selector: 'atx-sectors-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SectorsStore],
  imports: [ReactiveFormsModule, Button, Dialog, Field, Icon, IconButton, EmptyState, ErrorState, DateTimePipe],
  templateUrl: './sectors-page.html',
  styleUrl: './catalog-page.scss',
  host: { style: '--catalog-columns: minmax(0, 2fr) 180px 88px' },
})
export class SectorsPage extends CatalogPage<Sector, SectorRequest> {
  protected readonly store = inject(SectorsStore);
  protected readonly messages = { created: 'Setor cadastrado.', updated: 'Setor atualizado.', deleted: 'Setor excluído.' };
  protected readonly maxName = MAX_NAME;
  protected readonly skeletonRows = SKELETON_ROWS;
  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(MAX_NAME)]],
  });

  constructor() {
    super();
    void this.store.load();
  }

  protected fillForm(sector: Sector | null): void {
    this.form.setValue({ name: sector?.name ?? '' });
  }

  protected toRequest(): SectorRequest {
    return { name: this.form.getRawValue().name.trim() };
  }
}
