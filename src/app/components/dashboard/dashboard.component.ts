import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FileService } from '../../services/file.service';
import { FolderService } from '../../services/folder.service';
import { HealthService } from '../../services/health.service';
import { formatBytes } from '../../core/format-bytes';
import { StorageInfo } from '../../core/models';
import { StorageService } from '../../services/storage.service';
import { APP_ROUTES } from '../../core/app-routes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly routes = APP_ROUTES;
  private readonly fileService = inject(FileService);
  private readonly folderService = inject(FolderService);
  private readonly healthService = inject(HealthService);
  private readonly storageService = inject(StorageService);
  readonly counts = signal<{ files: number; folders: number } | null>(null);
  readonly storage = signal<StorageInfo | null>(null);
  readonly storageLoading = signal(true);
  readonly serviceStatus = signal<'checking' | 'online' | 'offline'>('checking');
  readonly formatBytes = formatBytes;

  constructor() {
    forkJoin([this.fileService.list('.'), this.folderService.list('.')]).subscribe({
      next: ([files, folders]) => this.counts.set({ files: files.length, folders: folders.length }),
      error: () => this.counts.set(null),
    });
    this.healthService.check().subscribe({
      next: (response) => this.serviceStatus.set(response.status === 'UP' ? 'online' : 'offline'),
      error: () => this.serviceStatus.set('offline'),
    });
    this.storageService.getUsage().subscribe({
      next: (usage) => {
        this.storage.set(usage);
        this.storageLoading.set(false);
      },
      error: () => this.storageLoading.set(false),
    });
  }
}
