import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { afterEach, vi } from 'vitest';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  const challenge = {
    twoFactorRequired: true as const,
    challengeId: 'challenge-1',
    maskedEmail: 'm***@example.com',
    expiresInSeconds: 300,
  };
  let auth: {
    login: ReturnType<typeof vi.fn>;
    verifyLogin: ReturnType<typeof vi.fn>;
    resendLoginCode: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    auth = {
      login: vi.fn(() => of(challenge)),
      verifyLogin: vi.fn(() => of({ accessToken: 'access', refreshToken: 'refresh', expiresInSeconds: 300 })),
      resendLoginCode: vi.fn(() => of(challenge)),
    };
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    }).compileComponents();
  });

  afterEach(() => vi.useRealTimers());

  it('renders username and password fields without registration', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('#username')).not.toBeNull();
    expect(element.querySelector('#password')).not.toBeNull();
    expect(element.textContent).not.toContain('Sign up');
  });

  it('shows the code step after login returns a challenge', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.form.setValue({ username: 'owner', password: 'secret' });
    component.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('We sent a 6 digit code to m***@example.com');
    expect(fixture.nativeElement.querySelector('#verification-code')).not.toBeNull();
    expect(component.form.controls.password.value).toBe('');
  });

  it('sends the challenge id and entered code for verification', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.form.setValue({ username: 'owner', password: 'secret' });
    component.submit();
    component.codeForm.controls.code.setValue('123456');
    component.verify();

    expect(auth.verifyLogin).toHaveBeenCalledWith('challenge-1', '123456', 'owner');
  });

  it('shows a generic verification error, clears the code, and refocuses the field', async () => {
    auth.verifyLogin.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.form.setValue({ username: 'owner', password: 'secret' });
    component.submit();
    component.codeForm.controls.code.setValue('123456');
    component.verify();
    fixture.detectChanges();
    await Promise.resolve();

    expect(component.error()).toBe('Unable to verify the code. Try again.');
    expect(component.codeForm.controls.code.value).toBe('');
    expect(fixture.nativeElement.textContent).toContain('Unable to verify the code. Try again.');
    expect(fixture.nativeElement.ownerDocument.activeElement).toBe(
      fixture.nativeElement.querySelector('#verification-code'),
    );
  });

  it('keeps resend disabled for 60 seconds', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.form.setValue({ username: 'owner', password: 'secret' });
    component.submit();
    fixture.detectChanges();
    const resend = fixture.nativeElement.querySelector('.resend-code') as HTMLButtonElement;

    expect(resend.disabled).toBe(true);
    expect(resend.textContent).toContain('60s');
    vi.advanceTimersByTime(60_000);
    fixture.detectChanges();

    expect(resend.disabled).toBe(false);
  });
});
