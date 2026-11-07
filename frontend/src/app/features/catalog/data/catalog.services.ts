import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_V1 } from '../../../core/api/api';
import {
  AssetTag,
  AssetTagRequest,
  CatalogApi,
  Item,
  ItemRequest,
  Sector,
  SectorRequest,
} from './catalog.models';

/** HTTP for one catalog resource; the subclasses only say where it lives. */
abstract class CatalogResource<T, R> implements CatalogApi<T, R> {
  protected readonly http = inject(HttpClient);
  protected abstract readonly url: string;

  list(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }

  create(request: R): Observable<T> {
    return this.http.post<T>(this.url, request);
  }

  update(id: string, request: R): Observable<T> {
    return this.http.put<T>(`${this.url}/${id}`, request);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class SectorService extends CatalogResource<Sector, SectorRequest> {
  protected readonly url = `${API_V1}/sectors`;
}

@Injectable({ providedIn: 'root' })
export class AssetTagService extends CatalogResource<AssetTag, AssetTagRequest> {
  protected readonly url = `${API_V1}/asset-tags`;
}

@Injectable({ providedIn: 'root' })
export class ItemService extends CatalogResource<Item, ItemRequest> {
  protected readonly url = `${API_V1}/items`;
}
