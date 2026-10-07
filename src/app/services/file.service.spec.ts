import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FileService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('lists files for a path', () => {
    service.list('Documents').subscribe();
    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/files?path=Documents`);

    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});
