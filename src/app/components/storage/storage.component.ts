import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HealthService } from '../../services/health.service';
import { StorageInfo } from '../../core/models';
import { formatBytes } from '../../core/format-bytes';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-storage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorageComponent {
  private readonly health = inject(HealthService);
  private readonly storageService = inject(StorageService);
  readonly status = signal<'checking' | 'online' | 'offline'>('checking');
  readonly usage = signal<StorageInfo | null>(null);
  readonly loading = signal(true);
  readonly formatBytes = formatBytes;
  constructor() {
    this.health.check().subscribe({
      next: (response) => this.status.set(response.status === 'UP' ? 'online' : 'offline'),
      error: () => this.status.set('offline'),
    });
    this.storageService.getUsage().subscribe({
      next: (usage) => {
        this.usage.set(usage);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
