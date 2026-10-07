import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StorageComponent } from './storage.component';
import { HealthService } from '../../services/health.service';
import { StorageService } from '../../services/storage.service';

describe('StorageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageComponent],
      providers: [
        { provide: HealthService, useValue: { check: () => of({ status: 'UP' }) } },
        {
          provide: StorageService,
          useValue: {
            getUsage: () =>
              of({ totalBytes: 1024, usedBytes: 256, freeBytes: 768, usedPercentage: 25 }),
          },
        },
      ],
    }).compileComponents();
  });

  it('renders the backend capacity response', () => {
    const fixture = TestBed.createComponent(StorageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('25% used');
    expect(fixture.nativeElement.textContent).toContain('768 B');
    expect(fixture.nativeElement.textContent).toContain('Online');
  });
});
