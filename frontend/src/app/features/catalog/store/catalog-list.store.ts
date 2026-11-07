import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { errorMessageOf } from '../../../core/api/api';
import { AssetTag, AssetTagRequest, CatalogApi, Item, ItemRequest, Sector, SectorRequest } from '../data/catalog.models';
import { AssetTagService, ItemService, SectorService } from '../data/catalog.services';

/**
 * List state of one catalog page. Create, update and remove reload the list, because a change in
 * one record can change others (an item taking a tag makes the tag busy).
 */
export abstract class CatalogListStore<T, R> {
  protected abstract readonly api: CatalogApi<T, R>;

  private readonly _records = signal<T[]>([]);
  private readonly _loaded = signal(false);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly records = this._records.asReadonly();
  readonly loaded = this._loaded.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  async load(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      this._records.set(await firstValueFrom(this.api.list()));
      this._loaded.set(true);
    } catch (error) {
      this._error.set(errorMessageOf(error));
    } finally {
      this._loading.set(false);
    }
  }

  /** Errors propagate so the form or the confirmation can show them. */
  async create(request: R): Promise<T> {
    const created = await firstValueFrom(this.api.create(request));
    await this.load();
    return created;
  }

  async update(id: string, request: R): Promise<T> {
    const updated = await firstValueFrom(this.api.update(id, request));
    await this.load();
    return updated;
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.api.remove(id));
    await this.load();
  }
}

@Injectable()
export class SectorsStore extends CatalogListStore<Sector, SectorRequest> {
  protected readonly api = inject(SectorService);
}

@Injectable()
export class AssetTagsStore extends CatalogListStore<AssetTag, AssetTagRequest> {
  protected readonly api = inject(AssetTagService);
}

@Injectable()
export class ItemsStore extends CatalogListStore<Item, ItemRequest> {
  protected readonly api = inject(ItemService);
}
