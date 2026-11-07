import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from '../../../shared/ui/button';
import { Dialog } from '../../../shared/ui/dialog';
import { Field } from '../../../shared/ui/field';
import { Icon } from '../../../shared/ui/icon';
import { IconButton } from '../../../shared/ui/icon-button';
import { EmptyState, ErrorState } from '../../../shared/ui/states';
import { Tag } from '../../../shared/ui/tag';
import { Item, ItemRequest } from '../data/catalog.models';
import { AssetTagsStore, ItemsStore, SectorsStore } from '../store/catalog-list.store';
import { CatalogPage } from './catalog-page';

const MAX_NAME = 120;
const SKELETON_ROWS = [0, 1, 2];

@Component({
  selector: 'atx-items-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ItemsStore, SectorsStore, AssetTagsStore],
  imports: [ReactiveFormsModule, RouterLink, Button, Dialog, Field, Icon, IconButton, EmptyState, ErrorState, Tag],
  templateUrl: './items-page.html',
  styleUrl: './catalog-page.scss',
  host: { style: '--catalog-columns: minmax(0, 1.6fr) minmax(0, 1fr) minmax(0, 1fr) 88px' },
})
export class ItemsPage extends CatalogPage<Item, ItemRequest> {
  protected readonly store = inject(ItemsStore);
  protected readonly sectors = inject(SectorsStore);
  protected readonly assetTags = inject(AssetTagsStore);
  protected readonly messages = { created: 'Item cadastrado.', updated: 'Item atualizado.', deleted: 'Item excluído.' };
  protected readonly maxName = MAX_NAME;
  protected readonly skeletonRows = SKELETON_ROWS;
  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(MAX_NAME)]],
    sectorId: ['', Validators.required],
    assetTagId: ['', Validators.required],
  });

  /** Free tags, plus the one the item being edited already uses. */
  protected readonly tagOptions = computed(() => {
    const editingId = this.editing()?.id;
    return this.assetTags.records().filter(tag => tag.itemId === null || tag.itemId === editingId);
  });
  protected readonly catalogReady = computed(() =>
    this.sectors.records().length > 0 && this.assetTags.records().length > 0);

  constructor() {
    super();
    void this.store.load();
    void this.sectors.load();
    void this.assetTags.load();
  }

  protected override openCreate(): void {
    this.refreshOptions();
    super.openCreate();
  }

  protected override openEdit(item: Item): void {
    this.refreshOptions();
    super.openEdit(item);
  }

  // Sectors and tags may have changed since the page opened (another tab, another admin)
  private refreshOptions(): void {
    void this.sectors.load();
    void this.assetTags.load();
  }

  protected fillForm(item: Item | null): void {
    this.form.setValue({
      name: item?.name ?? '',
      sectorId: item?.sectorId ?? '',
      assetTagId: item?.assetTagId ?? '',
    });
  }

  protected toRequest(): ItemRequest {
    const value = this.form.getRawValue();
    return { name: value.name.trim(), sectorId: value.sectorId, assetTagId: value.assetTagId };
  }
}
