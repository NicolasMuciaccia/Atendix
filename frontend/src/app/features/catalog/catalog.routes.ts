import { Routes } from '@angular/router';
import { CatalogLayout } from './catalog-layout';

export const CATALOG_ROUTES: Routes = [
  {
    path: '',
    component: CatalogLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'setores' },
      {
        path: 'setores',
        title: 'Setores · Atendix',
        loadComponent: () => import('./pages/sectors-page').then(m => m.SectorsPage),
      },
      {
        path: 'etiquetas',
        title: 'Etiquetas · Atendix',
        loadComponent: () => import('./pages/asset-tags-page').then(m => m.AssetTagsPage),
      },
      {
        path: 'itens',
        title: 'Itens · Atendix',
        loadComponent: () => import('./pages/items-page').then(m => m.ItemsPage),
      },
    ],
  },
];
