import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const isPublicEndpoint = /\/auth\/(login|refresh|logout)(\?|$)|\/health(\?|$)/.test(request.url);
  const token = auth.getAccessToken();
  const authenticatedRequest =
    token && !isPublicEndpoint
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || isPublicEndpoint) {
        return throwError(() => error);
      }

      const latestToken = auth.getAccessToken();
      if (latestToken && latestToken !== token) {
        return next(request.clone({ setHeaders: { Authorization: `Bearer ${latestToken}` } }));
      }

      return auth.refreshSession().pipe(
        switchMap(() => {
          const refreshed = request.clone({
            setHeaders: { Authorization: `Bearer ${auth.getAccessToken() ?? ''}` },
          });
          return next(refreshed);
        }),
        catchError((refreshError: unknown) => {
          auth.clearSession();
          void router.navigateByUrl('/cloud/login');
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
