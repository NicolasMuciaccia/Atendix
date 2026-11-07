import { Routes } from '@angular/router';
import { adminGuard, firstAccessGuard, guestGuard, workspaceGuard } from './core/auth/auth.guards';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar · Atendix',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/pages/login-page').then(m => m.LoginPage),
  },
  {
    path: 'primeiro-acesso',
    title: 'Crie sua senha · Atendix',
    canActivate: [firstAccessGuard],
    loadComponent: () => import('./features/auth/pages/first-access-page').then(m => m.FirstAccessPage),
  },
  {
    path: '',
    canActivate: [workspaceGuard],
    loadComponent: () => import('./layout/shell').then(m => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'chamados' },
      {
        path: 'chamados',
        title: 'Chamados · Atendix',
        loadComponent: () => import('./features/tickets/pages/tickets-page').then(m => m.TicketsPage),
      },
      {
        path: 'cadastros',
        canActivate: [adminGuard],
        loadChildren: () => import('./features/catalog/catalog.routes').then(m => m.CATALOG_ROUTES),
      },
      {
        path: 'usuarios',
        title: 'Usuários · Atendix',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/users/pages/users-page').then(m => m.UsersPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
