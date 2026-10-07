import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ShellComponent } from './shell.component';
import { AuthService } from '../../services/auth.service';
import { HealthService } from '../../services/health.service';

describe('ShellComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { username: signal('owner'), logout: () => of(undefined) },
        },
        { provide: HealthService, useValue: { check: () => of({ status: 'UP' }) } },
      ],
    }).compileComponents();
  });

  it('renders workspace navigation and the account name', () => {
    const fixture = TestBed.createComponent(ShellComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Dashboard');
    expect(fixture.nativeElement.textContent).toContain('My files');
    expect(fixture.nativeElement.textContent).toContain('owner');
  });
});
