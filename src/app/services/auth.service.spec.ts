import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('stores backend tokens from a successful login', () => {
    service.login({ username: 'owner', password: 'secret' }).subscribe();
    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/auth/login`);
    request.flush({ accessToken: 'access', refreshToken: 'refresh', expiresInSeconds: 300 });

    expect(service.isAuthenticated()).toBe(true);
    expect(service.getAccessToken()).toBe('access');
    expect(service.username()).toBe('owner');
  });
});
