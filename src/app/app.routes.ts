import { Routes } from '@angular/router';
import { anonymousGuard, authGuard, cloudEntryGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FileManagerComponent } from './components/file-manager/file-manager.component';
import { LoginComponent } from './components/login/login.component';
import { CloudEntryComponent } from './components/portfolio/cloud-entry/cloud-entry.component';
import { PortfolioExperienceComponent } from './components/portfolio/experience/portfolio-experience.component';
import { PortfolioHomeComponent } from './components/portfolio/home/portfolio-home.component';
import { PortfolioProjectsComponent } from './components/portfolio/projects/portfolio-projects.component';
import { PortfolioPublicationsComponent } from './components/portfolio/publications/portfolio-publications.component';
import { PortfolioShellComponent } from './components/portfolio/shell/portfolio-shell.component';
import { ShellComponent } from './components/shell/shell.component';
import { StorageComponent } from './components/storage/storage.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: '',
    component: PortfolioShellComponent,
    children: [
      { path: 'home', component: PortfolioHomeComponent },
      { path: 'experience', component: PortfolioExperienceComponent },
      { path: 'projects', component: PortfolioProjectsComponent },
      { path: 'publications', component: PortfolioPublicationsComponent },
    ],
  },
  {
    path: 'cloud',
    children: [
      { path: '', pathMatch: 'full', component: CloudEntryComponent, canActivate: [cloudEntryGuard] },
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
          { path: '**', redirectTo: 'dashboard' },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
