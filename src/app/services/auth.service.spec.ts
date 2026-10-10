import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { environment } from '../../environments/environment';
import { API_ENDPOINTS, APP_ROUTES } from '../core/app-routes';
import { AuthService } from './auth.service';
import { routes } from '../app.routes';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('stores backend tokens from a successful login', () => {
    service.login({ username: 'owner', password: 'secret' }).subscribe();
    const request = httpTesting.expectOne(`${environment.apiBaseUrl}${API_ENDPOINTS.authLogin}`);
    request.flush({ accessToken: 'access', refreshToken: 'refresh', expiresInSeconds: 300 });

    expect(service.isAuthenticated()).toBe(true);
    expect(service.getAccessToken()).toBe('access');
    expect(service.username()).toBe('owner');
  });

  it('navigates to cloud login after logout', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(APP_ROUTES.home);

    service.logout().subscribe();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(APP_ROUTES.cloudLogin);
  });
});
