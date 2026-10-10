import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { authInterceptor } from './auth.interceptor';
import { FileService } from '../../services/file.service';
import { FileItem, LoginResponse } from '../../core/models';
import { StorageService } from '../../services/storage.service';
import { API_ENDPOINTS, APP_ROUTES } from '../app-routes';

describe('authInterceptor', () => {
  let httpTesting: HttpTestingController;
  let auth: AuthService;
  let files: FileService;
  let storage: StorageService;

  const initialTokens: LoginResponse = {
    accessToken: 'access-one',
    refreshToken: 'refresh-one',
    expiresInSeconds: 300,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    files = TestBed.inject(FileService);
    storage = TestBed.inject(StorageService);
  });

  afterEach(() => httpTesting.verify());

  it('logs in without attaching a bearer token to the public endpoint', () => {
    auth.login({ username: 'owner', password: 'secret' }).subscribe();
    const request = httpTesting.expectOne(`${environment.apiBaseUrl}${API_ENDPOINTS.authLogin}`);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'owner', password: 'secret' });
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush(initialTokens);
    expect(auth.isAuthenticated()).toBe(true);
  });

  it('refreshes a rejected access token and retries the file request once', () => {
    auth.login({ username: 'owner', password: 'secret' }).subscribe();
    httpTesting.expectOne(`${environment.apiBaseUrl}${API_ENDPOINTS.authLogin}`).flush(initialTokens);

    const expectedFile: FileItem = {
      id: 'file-1',
      name: 'notes.txt',
      type: 'file',
      size: 10,
      contentType: 'text/plain',
      modifiedAt: '2026-10-07T10:00:00Z',
      path: 'notes.txt',
    };
    let result: FileItem[] | undefined;
    files.list('.').subscribe((items) => (result = items));

    const expiredRequest = httpTesting.expectOne(`${environment.apiBaseUrl}${API_ENDPOINTS.files}?path=.`);
    expect(expiredRequest.request.headers.get('Authorization')).toBe('Bearer access-one');
    expiredRequest.flush({}, { status: 401, statusText: 'Unauthorized' });

    const refreshRequest = httpTesting.expectOne(`${environment.apiBaseUrl}${API_ENDPOINTS.authRefresh}`);
    expect(refreshRequest.request.body).toEqual({ refreshToken: 'refresh-one' });
    refreshRequest.flush({
      accessToken: 'access-two',
      refreshToken: 'refresh-two',
      expiresInSeconds: 300,
    });

    const retriedRequest = httpTesting.expectOne(`${environment.apiBaseUrl}${API_ENDPOINTS.files}?path=.`);
    expect(retriedRequest.request.headers.get('Authorization')).toBe('Bearer access-two');
    retriedRequest.flush([expectedFile]);
    expect(result).toEqual([expectedFile]);
    expect(auth.getAccessToken()).toBe('access-two');
  });

  it('loads storage totals from the protected storage endpoint', () => {
    auth.login({ username: 'owner', password: 'secret' }).subscribe();
    httpTesting.expectOne(`${environment.apiBaseUrl}${API_ENDPOINTS.authLogin}`).flush(initialTokens);

    let result: unknown;
    storage.getUsage().subscribe((usage) => (result = usage));
    const request = httpTesting.expectOne(`${environment.apiBaseUrl}${API_ENDPOINTS.storage}`);
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-one');

    const usage = { totalBytes: 1000, usedBytes: 400, freeBytes: 600, usedPercentage: 40 };
    request.flush(usage);
    expect(result).toEqual(usage);
  });

  it('clears the expired session and navigates to cloud login when refresh fails', () => {
    auth.login({ username: 'owner', password: 'secret' }).subscribe();
    httpTesting.expectOne(`${environment.apiBaseUrl}${API_ENDPOINTS.authLogin}`).flush(initialTokens);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);

    files.list('.').subscribe({ error: () => undefined });
    httpTesting
      .expectOne(`${environment.apiBaseUrl}${API_ENDPOINTS.files}?path=.`)
      .flush({}, { status: 401, statusText: 'Unauthorized' });
    httpTesting
      .expectOne(`${environment.apiBaseUrl}${API_ENDPOINTS.authRefresh}`)
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(auth.isAuthenticated()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(APP_ROUTES.cloudLogin);
  });
});
