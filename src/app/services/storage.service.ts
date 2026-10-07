import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageInfo } from '../core/models';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly http = inject(HttpClient);

  getUsage(): Observable<StorageInfo> {
    return this.http.get<StorageInfo>(`${environment.apiBaseUrl}/storage`);
  }
}
