import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', redirectTo: 'users', pathMatch: 'full'
  },
  {
    path: 'users', loadComponent: () => import('./pages/users/users').then(c => c.Users)
  },
  {
    path: 'form-user/:id', loadComponent: () => import('./pages/update-users/update-users').then(c => c.UpdateUsers)
  },
  {
    path: '**', redirectTo: 'users', pathMatch: 'full'
  }
];
