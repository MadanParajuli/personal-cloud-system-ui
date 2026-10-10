import { inject } from '@angular/core';
import { RedirectFunction, Routes } from '@angular/router';
import { APP_ROUTE_SEGMENTS, APP_ROUTES } from '../../core/app-routes';
import { anonymousGuard, authGuard } from '../../core/guards/auth.guard';
import { AuthService } from '../../services/auth.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FileManagerComponent } from '../file-manager/file-manager.component';
import { LoginComponent } from '../login/login.component';
import { ShellComponent } from '../shell/shell.component';
import { StorageComponent } from '../storage/storage.component';

const redirectCloudEntry: RedirectFunction = () =>
  inject(AuthService).isAuthenticated() ? APP_ROUTES.cloudDashboard : APP_ROUTES.cloudLogin;

export const cloudRoutes: Routes = [
  {
    path: APP_ROUTE_SEGMENTS.root,
    pathMatch: 'full',
    redirectTo: redirectCloudEntry,
  },
  {
    path: APP_ROUTE_SEGMENTS.login,
    component: LoginComponent,
    canActivate: [anonymousGuard],
  },
  {
    path: APP_ROUTE_SEGMENTS.root,
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: APP_ROUTE_SEGMENTS.dashboard, component: DashboardComponent },
      { path: APP_ROUTE_SEGMENTS.files, component: FileManagerComponent },
      { path: APP_ROUTE_SEGMENTS.storage, component: StorageComponent },
    ],
  },
];