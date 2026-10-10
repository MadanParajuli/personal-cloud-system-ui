import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HealthService } from '../../services/health.service';
import { NavigationService } from '../../core/navigation.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  readonly navigation = inject(NavigationService);
  readonly dashboardHref = this.navigation.cloudDashboardUrl();
  readonly filesHref = this.navigation.cloudFilesUrl();
  readonly storageHref = this.navigation.cloudStorageUrl();
  private readonly auth = inject(AuthService);
  private readonly health = inject(HealthService);
  readonly username = this.auth.username;
  readonly navOpen = signal(false);
  readonly backendStatus = signal<'checking' | 'online' | 'offline'>('checking');

  constructor() {
    this.health.check().subscribe({
      next: (response) => this.backendStatus.set(response.status === 'UP' ? 'online' : 'offline'),
      error: () => this.backendStatus.set('offline'),
    });
  }

  closeNavigation(): void {
    this.navOpen.set(false);
  }

  get dashboardActive(): boolean {
    return this.navigation.isActive(this.dashboardHref);
  }

  get filesActive(): boolean {
    return this.navigation.isActive(this.filesHref);
  }

  get storageActive(): boolean {
    return this.navigation.isActive(this.storageHref);
  }

  openDashboard(event: Event): void {
    if (this.navigation.shouldUseNativeNavigation(event)) return;
    event.preventDefault();
    this.closeNavigation();
    this.navigation.goToCloudDashboard();
  }

  openFiles(event: Event): void {
    if (this.navigation.shouldUseNativeNavigation(event)) return;
    event.preventDefault();
    this.closeNavigation();
    this.navigation.goToCloudFiles();
  }

  openStorage(event: Event): void {
    if (this.navigation.shouldUseNativeNavigation(event)) return;
    event.preventDefault();
    this.closeNavigation();
    this.navigation.goToCloudStorage();
  }

  logout(): void {
    this.auth.logout().subscribe();
  }
}
