import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StorageService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('loads the backend capacity response', () => {
    service.getUsage().subscribe();
    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/storage`);

    expect(request.request.method).toBe('GET');
    request.flush({ totalBytes: 1000, usedBytes: 400, freeBytes: 600, usedPercentage: 40 });
  });
});
