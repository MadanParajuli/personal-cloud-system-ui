import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { APP_ROUTES } from '../app-routes';
import { anonymousGuard, authGuard } from './auth.guard';

describe('cloud route guards', () => {
  let authenticated: boolean;

  beforeEach(() => {
    authenticated = false;
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { isAuthenticated: () => authenticated } },
      ],
    });
  });

  function runGuard(guard: typeof authGuard | typeof anonymousGuard): string {
    const result = TestBed.runInInjectionContext(() =>
      guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
    return TestBed.inject(Router).serializeUrl(result as UrlTree);
  }

  it('sends anonymous cloud visitors to sign-in', () => {
    expect(runGuard(authGuard)).toBe(APP_ROUTES.cloudLogin);
  });

  it('sends authenticated cloud visitors to the dashboard', () => {
    authenticated = true;
    expect(runGuard(anonymousGuard)).toBe(APP_ROUTES.cloudDashboard);
  });
});