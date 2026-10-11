import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { API_ENDPOINTS, APP_ROUTES } from '../core/app-routes';
import {
  LoginChallengeResponse,
  LoginRequest,
  LoginResponse,
  LoginResult,
  RefreshRequest,
} from '../core/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private refreshRequest: Observable<LoginResponse> | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  readonly username = signal<string | null>(null);

  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  login(credentials: LoginRequest): Observable<LoginResult> {
    return this.http
      .post<LoginResult>(`${environment.apiBaseUrl}${API_ENDPOINTS.authLogin}`, credentials)
      .pipe(
        tap((result) => {
          if ('accessToken' in result) {
            this.saveSession(result, credentials.username);
          }
        }),
      );
  }

  verifyLogin(challengeId: string, code: string, username: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}${API_ENDPOINTS.authLoginVerify}`, {
        challengeId,
        code,
      })
      .pipe(tap((tokens) => this.saveSession(tokens, username)));
  }

  resendLoginCode(challengeId: string): Observable<LoginChallengeResponse> {
    return this.http.post<LoginChallengeResponse>(
      `${environment.apiBaseUrl}${API_ENDPOINTS.authLoginResend}`,
      { challengeId },
    );
  }

  refreshSession(): Observable<LoginResponse> {
    if (!this.refreshToken) {
      return throwError(() => new Error('No refresh token is available.'));
    }
    if (this.refreshRequest) {
      return this.refreshRequest;
    }

    const request = this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}${API_ENDPOINTS.authRefresh}`, {
        refreshToken: this.refreshToken,
      } satisfies RefreshRequest)
      .pipe(
        tap((tokens) => this.saveSession(tokens, this.username() ?? '')),
        catchError((error: unknown) => {
          this.clearSession();
          return throwError(() => error);
        }),
        finalize(() => (this.refreshRequest = null)),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    this.refreshRequest = request;
    return request;
  }

  logout(): Observable<void> {
    const request = this.refreshToken
      ? this.http.post<void>(`${environment.apiBaseUrl}${API_ENDPOINTS.authLogout}`, {
          refreshToken: this.refreshToken,
        } satisfies RefreshRequest)
      : of(undefined);

    return request.pipe(
      catchError(() => of(undefined)),
      tap(() => this.clearSession()),
      tap(() => void this.router.navigateByUrl(APP_ROUTES.cloudLogin)),
    );
  }

  clearSession(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.username.set(null);
  }

  private saveSession(tokens: LoginResponse, username: string): void {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    this.username.set(username);
  }
}
