import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { anonymousGuard, authGuard, cloudEntryGuard } from './auth.guard';

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

  function runGuard(guard: typeof cloudEntryGuard | typeof authGuard | typeof anonymousGuard): string {
    const result = TestBed.runInInjectionContext(() =>
      guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
    return TestBed.inject(Router).serializeUrl(result as UrlTree);
  }

  it('sends anonymous cloud visitors to sign-in', () => {
    expect(runGuard(cloudEntryGuard)).toBe('/cloud/login');
    expect(runGuard(authGuard)).toBe('/cloud/login');
  });

  it('sends authenticated cloud visitors to the dashboard', () => {
    authenticated = true;
    expect(runGuard(cloudEntryGuard)).toBe('/cloud/dashboard');
    expect(runGuard(anonymousGuard)).toBe('/cloud/dashboard');
  });
});