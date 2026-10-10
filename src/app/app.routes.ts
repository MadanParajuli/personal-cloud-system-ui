import { Routes } from '@angular/router';
import { APP_ROUTE_SEGMENTS } from './core/app-routes';
import { PortfolioExperienceComponent } from './components/portfolio/experience/portfolio-experience.component';
import { PortfolioHomeComponent } from './components/portfolio/home/portfolio-home.component';
import { PortfolioProjectsComponent } from './components/portfolio/projects/portfolio-projects.component';
import { PortfolioPublicationsComponent } from './components/portfolio/publications/portfolio-publications.component';
import { PortfolioShellComponent } from './components/portfolio/shell/portfolio-shell.component';

export const routes: Routes = [
  { path: APP_ROUTE_SEGMENTS.root, pathMatch: 'full', redirectTo: APP_ROUTE_SEGMENTS.home },
  {
    path: APP_ROUTE_SEGMENTS.cloud,
    loadChildren: () => import('./components/cloud/cloud.routes').then((module) => module.cloudRoutes),
  },
  {
    path: APP_ROUTE_SEGMENTS.root,
    component: PortfolioShellComponent,
    children: [
      { path: APP_ROUTE_SEGMENTS.home, component: PortfolioHomeComponent },
      { path: APP_ROUTE_SEGMENTS.experience, component: PortfolioExperienceComponent },
      { path: APP_ROUTE_SEGMENTS.projects, component: PortfolioProjectsComponent },
      { path: APP_ROUTE_SEGMENTS.publications, component: PortfolioPublicationsComponent },
    ],
  },
  { path: '**', redirectTo: APP_ROUTE_SEGMENTS.home },
];
