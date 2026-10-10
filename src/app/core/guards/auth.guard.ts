import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated() || inject(Router).createUrlTree(['/cloud/login']);
};

export const anonymousGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return !auth.isAuthenticated() || inject(Router).createUrlTree(['/cloud/dashboard']);
};

export const cloudEntryGuard: CanActivateFn = () => {
  const destination = inject(AuthService).isAuthenticated() ? '/cloud/dashboard' : '/cloud/login';
  return inject(Router).createUrlTree([destination]);
};
