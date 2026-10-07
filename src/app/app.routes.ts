import { Routes } from '@angular/router';
import { anonymousGuard, authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FileManagerComponent } from './components/file-manager/file-manager.component';
import { LoginComponent } from './components/login/login.component';
import { ShellComponent } from './components/shell/shell.component';
import { StorageComponent } from './components/storage/storage.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [anonymousGuard] },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'files', component: FileManagerComponent },
      { path: 'storage', component: StorageComponent },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
