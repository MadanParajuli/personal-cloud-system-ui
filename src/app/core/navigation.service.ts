import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { APP_ROUTE_SEGMENTS } from './app-routes';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);
  private readonly activeUrl = signal(this.router.url);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.activeUrl.set(this.router.url));
  }

  goHome(): void {
    this.go(this.homeUrl());
  }

  goToExperience(): void {
    this.go(this.experienceUrl());
  }

  goToProjects(): void {
    this.go(this.projectsUrl());
  }

  goToPublications(): void {
    this.go(this.publicationsUrl());
  }

  goToCloud(): void {
    this.go(this.cloudUrl());
  }

  goToCloudLogin(): void {
    this.go(this.cloudLoginUrl());
  }

  goToCloudDashboard(): void {
    this.go(this.cloudDashboardUrl());
  }

  goToCloudFiles(): void {
    this.go(this.cloudFilesUrl());
  }

  goToCloudStorage(): void {
    this.go(this.cloudStorageUrl());
  }

  homeUrl(): string {
    return `/${APP_ROUTE_SEGMENTS.home}`;
  }

  experienceUrl(): string {
    return `/${APP_ROUTE_SEGMENTS.experience}`;
  }

  projectsUrl(): string {
    return `/${APP_ROUTE_SEGMENTS.projects}`;
  }

  publicationsUrl(): string {
    return `/${APP_ROUTE_SEGMENTS.publications}`;
  }

  cloudUrl(): string {
    return `/${APP_ROUTE_SEGMENTS.cloud}`;
  }

  cloudLoginUrl(): string {
    return `${this.cloudUrl()}/${APP_ROUTE_SEGMENTS.login}`;
  }

  cloudDashboardUrl(): string {
    return `${this.cloudUrl()}/${APP_ROUTE_SEGMENTS.dashboard}`;
  }

  cloudFilesUrl(): string {
    return `${this.cloudUrl()}/${APP_ROUTE_SEGMENTS.files}`;
  }

  cloudStorageUrl(): string {
    return `${this.cloudUrl()}/${APP_ROUTE_SEGMENTS.storage}`;
  }

  isActive(url: string): boolean {
    this.activeUrl();
    return this.router.isActive(url, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  shouldUseNativeNavigation(event: Event): boolean {
    const click = event as MouseEvent;
    return click.button !== 0 || click.metaKey || click.ctrlKey || click.shiftKey || click.altKey;
  }

  private go(path: string): void {
    void this.router.navigateByUrl(path).catch(() => undefined);
  }
}