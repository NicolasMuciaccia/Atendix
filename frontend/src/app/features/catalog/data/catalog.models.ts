import { Observable } from 'rxjs';

export interface Sector {
  id: string;
  name: string;
  createdAt: string;
}

export interface AssetTag {
  id: string;
  code: string;
  /** Item identified by the tag; null while the tag is free. */
  itemId: string | null;
  itemName: string | null;
  createdAt: string;
}

export interface Item {
  id: string;
  name: string;
  sectorId: string;
  sectorName: string;
  assetTagId: string;
  assetTagCode: string;
  createdAt: string;
}

export interface SectorRequest {
  name: string;
}

export interface AssetTagRequest {
  code: string;
}

export interface ItemRequest {
  name: string;
  sectorId: string;
  assetTagId: string;
}

/** The same four operations exist for sectors, asset tags and items. */
export interface CatalogApi<T, R> {
  list(): Observable<T[]>;
  create(request: R): Observable<T>;
  update(id: string, request: R): Observable<T>;
  remove(id: string): Observable<void>;
}
