import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HealthService } from '../../services/health.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
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

  logout(): void {
    this.auth.logout().subscribe();
  }
}
