import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateTimePipe } from '../../../shared/format/dates';
import { Button } from '../../../shared/ui/button';
import { Dialog } from '../../../shared/ui/dialog';
import { Field } from '../../../shared/ui/field';
import { Icon } from '../../../shared/ui/icon';
import { IconButton } from '../../../shared/ui/icon-button';
import { EmptyState, ErrorState } from '../../../shared/ui/states';
import { Tag } from '../../../shared/ui/tag';
import { AssetTag, AssetTagRequest } from '../data/catalog.models';
import { AssetTagsStore } from '../store/catalog-list.store';
import { CatalogPage } from './catalog-page';

const MAX_CODE = 40;
const SKELETON_ROWS = [0, 1, 2];

@Component({
  selector: 'atx-asset-tags-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AssetTagsStore],
  imports: [ReactiveFormsModule, Button, Dialog, Field, Icon, IconButton, EmptyState, ErrorState, Tag, DateTimePipe],
  templateUrl: './asset-tags-page.html',
  styleUrl: './catalog-page.scss',
  host: { style: '--catalog-columns: minmax(0, 1fr) minmax(0, 1.4fr) 180px 88px' },
})
export class AssetTagsPage extends CatalogPage<AssetTag, AssetTagRequest> {
  protected readonly store = inject(AssetTagsStore);
  protected readonly messages = {
    created: 'Etiqueta cadastrada.',
    updated: 'Etiqueta atualizada.',
    deleted: 'Etiqueta excluída.',
  };
  protected readonly maxCode = MAX_CODE;
  protected readonly skeletonRows = SKELETON_ROWS;
  protected readonly form = inject(FormBuilder).nonNullable.group({
    code: ['', [Validators.required, Validators.maxLength(MAX_CODE)]],
  });

  constructor() {
    super();
    void this.store.load();
  }

  protected fillForm(assetTag: AssetTag | null): void {
    this.form.setValue({ code: assetTag?.code ?? '' });
  }

  protected toRequest(): AssetTagRequest {
    return { code: this.form.getRawValue().code.trim() };
  }
}
