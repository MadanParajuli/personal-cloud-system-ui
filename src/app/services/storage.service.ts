import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageInfo } from '../core/models';
import { API_ENDPOINTS } from '../core/app-routes';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly http = inject(HttpClient);

  getUsage(): Observable<StorageInfo> {
    return this.http.get<StorageInfo>(`${environment.apiBaseUrl}${API_ENDPOINTS.storage}`);
  }
}
