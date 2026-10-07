import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { FileService } from '../../services/file.service';
import { FolderService } from '../../services/folder.service';
import { HealthService } from '../../services/health.service';
import { StorageService } from '../../services/storage.service';

describe('DashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        { provide: FileService, useValue: { list: () => of([]) } },
        { provide: FolderService, useValue: { list: () => of([]) } },
        { provide: HealthService, useValue: { check: () => of({ status: 'UP' }) } },
        {
          provide: StorageService,
          useValue: {
            getUsage: () =>
              of({ totalBytes: 1000, usedBytes: 400, freeBytes: 600, usedPercentage: 40 }),
          },
        },
      ],
    }).compileComponents();
  });

  it('renders live file counts and capacity', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Files at top level');
    expect(fixture.nativeElement.textContent).toContain('600 B free');
    expect(fixture.nativeElement.textContent).toContain('Service online');
  });
});
