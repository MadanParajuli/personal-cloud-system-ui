import { HttpClient, HttpEvent, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FileItem } from '../core/models';
import { API_ENDPOINTS } from '../core/app-routes';

@Injectable({ providedIn: 'root' })
export class FileService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiBaseUrl}${API_ENDPOINTS.files}`;

  list(path: string): Observable<FileItem[]> {
    return this.http.get<FileItem[]>(this.endpoint, { params: { path } });
  }

  upload(file: File, path: string): Observable<HttpEvent<FileItem>> {
    const body = new FormData();
    body.append('file', file, file.name);
    body.append('path', path);
    return this.http.post<FileItem>(`${this.endpoint}/upload`, body, {
      observe: 'events',
      reportProgress: true,
    });
  }

  download(id: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.endpoint}/${encodeURIComponent(id)}/download`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  rename(id: string, name: string): Observable<FileItem> {
    const params = new HttpParams().set('name', name);
    return this.http.patch<FileItem>(`${this.endpoint}/${encodeURIComponent(id)}`, null, {
      params,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${encodeURIComponent(id)}`);
  }
}
