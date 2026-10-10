import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { of, tap } from 'rxjs';
import { vi } from 'vitest';
import { APP_ROUTES } from './core/app-routes';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { FileService } from './services/file.service';
import { FolderService } from './services/folder.service';
import { HealthService } from './services/health.service';
import { StorageService } from './services/storage.service';
import { LoginComponent } from './components/login/login.component';

describe('application routes', () => {
  let authenticated: boolean;
  let healthCheck: ReturnType<typeof vi.fn>;
  let listFiles: ReturnType<typeof vi.fn>;
  let listFolders: ReturnType<typeof vi.fn>;
  let getStorage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    authenticated = false;
    healthCheck = vi.fn(() => of({ status: 'UP' }));
    listFiles = vi.fn(() => of([]));
    listFolders = vi.fn(() => of([]));
    getStorage = vi.fn(() =>
      of({ totalBytes: 1000, usedBytes: 400, freeBytes: 600, usedPercentage: 40 }),
    );

    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        {
          provide: AuthService,
          useValue: {
            username: signal('owner'),
            isAuthenticated: () => authenticated,
            getAccessToken: () => (authenticated ? 'access' : null),
            clearSession: () => (authenticated = false),
            login: () => of({ accessToken: 'access', refreshToken: 'refresh', expiresInSeconds: 300 }).pipe(
              tap(() => (authenticated = true)),
            ),
            logout: () =>
              of(undefined).pipe(
                tap(() => {
                  authenticated = false;
                  void TestBed.inject(Router).navigateByUrl(APP_ROUTES.cloudLogin);
                }),
              ),
          },
        },
        { provide: HealthService, useValue: { check: healthCheck } },
        { provide: FileService, useValue: { list: listFiles } },
        { provide: FolderService, useValue: { list: listFolders } },
        { provide: StorageService, useValue: { getUsage: getStorage } },
      ],
    });
  });

  it('redirects / to the canonical /home page', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(APP_ROUTES.root);

    expect(TestBed.inject(Router).url).toBe(APP_ROUTES.home);
    expect(harness.routeNativeElement?.textContent).toContain('Building reliable systems');
  });

  it('redirects unknown and legacy root URLs to Home', async () => {
    const harness = await RouterTestingHarness.create();

    for (const url of ['/abc', '/cloud/xyz', APP_ROUTES.legacyLogin, APP_ROUTES.legacyDashboard]) {
      await harness.navigateByUrl(url);
      expect(TestBed.inject(Router).url).toBe(APP_ROUTES.home);
    }
  });

  it('opens public publications without calling backend services', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(APP_ROUTES.publications);

    expect(harness.routeNativeElement?.textContent).toContain('Publications');
    expect(healthCheck).not.toHaveBeenCalled();
    expect(listFiles).not.toHaveBeenCalled();
    expect(listFolders).not.toHaveBeenCalled();
    expect(getStorage).not.toHaveBeenCalled();
  });

  it('routes anonymous /cloud visitors to cloud login', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(APP_ROUTES.cloud);

    expect(TestBed.inject(Router).url).toBe(APP_ROUTES.cloudLogin);
  });

  it('routes authenticated /cloud visitors to the dashboard', async () => {
    authenticated = true;
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(APP_ROUTES.cloud);

    expect(TestBed.inject(Router).url).toBe(APP_ROUTES.cloudDashboard);
    expect(harness.routeNativeElement?.textContent).toContain('A little more room to think.');
  });

  it('protects cloud files from anonymous visitors', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(APP_ROUTES.cloudFiles);

    expect(TestBed.inject(Router).url).toBe(APP_ROUTES.cloudLogin);
  });

  it('sends authenticated visitors away from cloud login to the dashboard', async () => {
    authenticated = true;
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(APP_ROUTES.cloudLogin);

    expect(TestBed.inject(Router).url).toBe(APP_ROUTES.cloudDashboard);
  });

  it('navigates to the dashboard after login succeeds', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(APP_ROUTES.cloudLogin);
    const login = harness.routeDebugElement!.injector.get(LoginComponent);
    login.form.setValue({ username: 'owner', password: 'secret' });
    login.submit();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(APP_ROUTES.cloudDashboard);
  });

  it('navigates to cloud login after logout', async () => {
    authenticated = true;
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(APP_ROUTES.cloudDashboard);
    TestBed.inject(AuthService).logout().subscribe();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(APP_ROUTES.cloudLogin);
  });
});