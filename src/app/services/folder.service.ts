import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FolderItem } from '../core/models';

@Injectable({ providedIn: 'root' })
export class FolderService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}/folders`;

  list(path: string): Observable<FolderItem[]> {
    return this.http.get<FolderItem[]>(this.endpoint, { params: { path } });
  }

  create(name: string, parentPath: string): Observable<FolderItem> {
    return this.http.post<FolderItem>(this.endpoint, { name, parentPath });
  }

  rename(id: string, name: string): Observable<FolderItem> {
    return this.http.patch<FolderItem>(`${this.endpoint}/${encodeURIComponent(id)}`, { name });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${encodeURIComponent(id)}`);
  }
}
