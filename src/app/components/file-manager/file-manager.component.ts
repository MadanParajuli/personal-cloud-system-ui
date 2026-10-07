import { CommonModule } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { EMPTY, Observable, catchError, concatMap, forkJoin, from, tap } from 'rxjs';
import { userErrorMessage } from '../../core/error-message';
import { FileService } from '../../services/file.service';
import { FileItem, FolderItem } from '../../core/models';
import { FolderService } from '../../services/folder.service';

type FileLayout = 'list' | 'grid';
type ManagedItem = FileItem | FolderItem;
type DialogMode = 'create-folder' | 'rename';
interface Breadcrumb {
  label: string;
  path: string;
}
interface UploadStatus {
  id: string;
  name: string;
  progress: number;
  state: 'uploading' | 'complete' | 'error';
}

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-manager.component.html',
  styleUrl: './file-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagerComponent {
  private readonly fileService = inject(FileService);
  private readonly folderService = inject(FolderService);
  private readonly destroyRef = inject(DestroyRef);
  readonly files = signal<FileItem[]>([]);
  readonly folders = signal<FolderItem[]>([]);
  readonly path = signal('.');
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly search = signal('');
  readonly layout = signal<FileLayout>('list');
  readonly error = signal('');
  readonly notice = signal('');
  readonly dialogMode = signal<DialogMode | null>(null);
  readonly editingItem = signal<ManagedItem | null>(null);
  readonly deleteTarget = signal<ManagedItem | null>(null);
  readonly nameInput = signal('');
  readonly uploadQueue = signal<UploadStatus[]>([]);
  readonly loadingRows = [1, 2, 3, 4];
  readonly visibleFiles = computed(() => {
    const query = this.search().trim().toLowerCase();
    return query
      ? this.files().filter((file) => file.name.toLowerCase().includes(query))
      : this.files();
  });
  readonly visibleFolders = computed(() => {
    const query = this.search().trim().toLowerCase();
    return query
      ? this.folders().filter((folder) => folder.name.toLowerCase().includes(query))
      : this.folders();
  });
  readonly breadcrumbs = computed<Breadcrumb[]>(() => {
    const segments = this.path() === '.' ? [] : this.path().split('/').filter(Boolean);
    return [
      { label: 'My files', path: '.' },
      ...segments.map((label, index) => ({ label, path: segments.slice(0, index + 1).join('/') })),
    ];
  });

  constructor() {
    this.load(this.path());
  }

  load(path: string): void {
    this.loading.set(true);
    this.error.set('');
    this.path.set(path || '.');
    forkJoin([this.fileService.list(path || '.'), this.folderService.list(path || '.')])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([files, folders]) => {
          this.files.set(files);
          this.folders.set(folders);
          this.loading.set(false);
        },
        error: (error: unknown) => {
          this.error.set(userErrorMessage(error, 'Unable to load this folder.'));
          this.loading.set(false);
        },
      });
  }

  openFolder(folder: FolderItem): void {
    this.search.set('');
    this.load(folder.path);
  }
  setLayout(layout: FileLayout): void {
    this.layout.set(layout);
  }
  openCreateFolder(): void {
    this.nameInput.set('');
    this.dialogMode.set('create-folder');
  }
  openRename(item: ManagedItem): void {
    this.editingItem.set(item);
    this.nameInput.set(item.name);
    this.dialogMode.set('rename');
  }
  closeDialog(): void {
    this.dialogMode.set(null);
    this.editingItem.set(null);
  }
  askDelete(item: ManagedItem): void {
    this.deleteTarget.set(item);
  }
  cancelDelete(): void {
    this.deleteTarget.set(null);
  }
  dismissNotice(): void {
    this.notice.set('');
  }
  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  submitDialog(): void {
    const name = this.nameInput().trim();
    if (!name || this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    const item = this.editingItem();
    const request: Observable<unknown> | null =
      this.dialogMode() === 'create-folder'
        ? this.folderService.create(name, this.path())
        : item?.type === 'folder'
          ? this.folderService.rename(item.id, name)
          : item?.type === 'file'
            ? this.fileService.rename(item.id, name)
            : null;
    if (!request) {
      this.busy.set(false);
      return;
    }
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        const message = this.dialogMode() === 'create-folder' ? 'Folder created.' : 'Name updated.';
        this.closeDialog();
        this.showNotice(message);
        this.busy.set(false);
        this.load(this.path());
      },
      error: (error: unknown) => {
        this.error.set(userErrorMessage(error, 'Unable to save these changes.'));
        this.busy.set(false);
      },
    });
  }

  confirmDelete(): void {
    const item = this.deleteTarget();
    if (!item || this.busy()) return;
    this.busy.set(true);
    const request =
      item.type === 'folder'
        ? this.folderService.delete(item.id)
        : this.fileService.delete(item.id);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.deleteTarget.set(null);
        this.showNotice(item.type === 'folder' ? 'Folder deleted.' : 'File deleted.');
        this.busy.set(false);
        this.load(this.path());
      },
      error: (error: unknown) => {
        this.error.set(userErrorMessage(error, 'Unable to delete this item.'));
        this.busy.set(false);
      },
    });
  }

  download(file: FileItem): void {
    this.busy.set(true);
    this.fileService
      .download(file.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (!response.body) {
            this.error.set('The download did not contain a file.');
            return;
          }
          const disposition = response.headers.get('content-disposition');
          const match = disposition?.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
          const filename = match?.[1] ? decodeURIComponent(match[1]) : (match?.[2] ?? file.name);
          const url = URL.createObjectURL(response.body);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = filename;
          anchor.click();
          window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
          this.showNotice('Download started.');
        },
        error: (error: unknown) =>
          this.error.set(userErrorMessage(error, 'Unable to download this file.')),
        complete: () => this.busy.set(false),
      });
  }

  selectFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.uploadFiles(input.files ? Array.from(input.files) : []);
    input.value = '';
  }

  dropFiles(event: DragEvent): void {
    event.preventDefault();
    this.uploadFiles(event.dataTransfer?.files ? Array.from(event.dataTransfer.files) : []);
  }

  uploadFiles(files: File[]): void {
    if (!files.length) return;
    const jobs = files.map((file, index) => ({ id: `${Date.now()}-${index}`, file }));
    this.uploadQueue.update((queue) => [
      ...queue.filter((task) => task.state === 'uploading'),
      ...jobs.map(({ id, file }) => ({
        id,
        name: file.name,
        progress: 0,
        state: 'uploading' as const,
      })),
    ]);
    from(jobs)
      .pipe(
        concatMap(({ id, file }) =>
          this.fileService.upload(file, this.path()).pipe(
            tap((event) => {
              if (event.type === HttpEventType.UploadProgress)
                this.updateUpload(id, {
                  progress: event.total ? Math.round((event.loaded / event.total) * 100) : 0,
                });
              if (event instanceof HttpResponse) {
                this.updateUpload(id, { progress: 100, state: 'complete' });
                this.showNotice(`${file.name} uploaded.`);
                this.load(this.path());
              }
            }),
            catchError((error: unknown) => {
              this.updateUpload(id, { state: 'error' });
              this.error.set(userErrorMessage(error, `Unable to upload ${file.name}.`));
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  extension(name: string): string {
    const extension = name.includes('.') ? (name.split('.').pop() ?? '') : 'FILE';
    return extension.slice(0, 4).toUpperCase() || 'FILE';
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const units = ['KB', 'MB', 'GB', 'TB'];
    let size = bytes / 1024;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(size < 10 ? 1 : 0)} ${units[unitIndex]}`;
  }

  private updateUpload(id: string, update: Partial<UploadStatus>): void {
    this.uploadQueue.update((queue) =>
      queue.map((task) => (task.id === id ? { ...task, ...update } : task)),
    );
  }

  trackById(_index: number, item: { id: string }): string {
    return item.id;
  }

  trackByPath(_index: number, breadcrumb: Breadcrumb): string {
    return breadcrumb.path;
  }

  trackByLoadingRow(_index: number, row: number): number {
    return row;
  }

  private showNotice(message: string): void {
    this.notice.set(message);
  }
}
