import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { FolderService } from './folder.service';

describe('FolderService', () => {
  let service: FolderService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FolderService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('creates a folder with its backend request format', () => {
    service.create('Projects', 'Documents').subscribe();
    const request = httpTesting.expectOne(`${environment.apiBaseUrl}/folders`);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: 'Projects', parentPath: 'Documents' });
    request.flush({ id: 'folder-1', name: 'Projects', type: 'folder', path: 'Documents/Projects' });
  });
});
