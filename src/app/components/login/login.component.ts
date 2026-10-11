import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { userErrorMessage } from '../../core/error-message';
import { NavigationService } from '../../core/navigation.service';
import { LoginChallengeResponse } from '../../core/models';
import { PortfolioHeaderComponent } from '../portfolio/header/portfolio-header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, PortfolioHeaderComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly navigation = inject(NavigationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private pendingUsername: string | null = null;
  private challengeId: string | null = null;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;
  @ViewChild('codeInput') private codeInput?: ElementRef<HTMLInputElement>;
  readonly loading = signal(false);
  readonly error = signal('');
  readonly step = signal<'credentials' | 'code'>('credentials');
  readonly maskedEmail = signal('');
  readonly codeExpiresInSeconds = signal(0);
  readonly resendCountdown = signal(0);
  readonly codeExpired = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  readonly codeForm = this.formBuilder.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.stopCountdown());
  }

  submit(): void {
    if (this.step() !== 'credentials' || this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }
    const credentials = this.form.getRawValue();
    this.loading.set(true);
    this.error.set('');
    this.auth
      .login(credentials)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (result) => {
          if ('twoFactorRequired' in result && result.twoFactorRequired) {
            this.pendingUsername = credentials.username;
            this.form.controls.password.setValue('');
            this.openChallenge(result);
            return;
          }
          this.navigation.goToCloudDashboard();
        },
        error: (error: unknown) =>
          this.error.set(userErrorMessage(error, 'Unable to sign in. Check your credentials.')),
      });
  }

  onCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 6);
    input.value = digits;
    this.codeForm.controls.code.setValue(digits);
  }

  verify(): void {
    if (
      this.loading() ||
      this.codeExpired() ||
      this.codeForm.invalid ||
      !this.challengeId ||
      !this.pendingUsername
    ) {
      this.codeForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.auth
      .verifyLogin(this.challengeId, this.codeForm.controls.code.value, this.pendingUsername)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.navigation.goToCloudDashboard(),
        error: (error: unknown) => {
          this.error.set(userErrorMessage(error, 'Unable to verify the code. Try again.'));
          this.codeForm.controls.code.setValue('');
          this.focusCodeInput();
        },
      });
  }

  resendCode(): void {
    if (this.loading() || this.resendCountdown() > 0 || !this.challengeId) {
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.auth
      .resendLoginCode(this.challengeId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (challenge) => this.openChallenge(challenge),
        error: (error: unknown) => {
          this.error.set(
            error instanceof HttpErrorResponse && error.status === 429
              ? 'Please wait before asking for another code.'
              : userErrorMessage(error, 'Unable to resend the code. Try again.'),
          );
          if (error instanceof HttpErrorResponse && error.status === 429) {
            this.resendCountdown.set(60);
            this.startCountdownTimer();
          }
        },
      });
  }

  backToLogin(): void {
    this.stopCountdown();
    this.challengeId = null;
    this.pendingUsername = null;
    this.maskedEmail.set('');
    this.codeExpiresInSeconds.set(0);
    this.resendCountdown.set(0);
    this.codeExpired.set(false);
    this.codeForm.reset({ code: '' });
    this.error.set('');
    this.step.set('credentials');
  }

  private openChallenge(challenge: LoginChallengeResponse): void {
    this.challengeId = challenge.challengeId;
    this.maskedEmail.set(challenge.maskedEmail);
    this.codeExpiresInSeconds.set(Math.max(0, challenge.expiresInSeconds));
    this.codeExpired.set(challenge.expiresInSeconds <= 0);
    this.resendCountdown.set(60);
    this.codeForm.reset({ code: '' });
    this.error.set('');
    this.step.set('code');
    this.startCountdownTimer();
    this.focusCodeInput();
  }

  private startCountdownTimer(): void {
    if (!isPlatformBrowser(this.platformId) || this.countdownInterval !== null) {
      return;
    }
    this.countdownInterval = setInterval(() => {
      const expiry = this.codeExpiresInSeconds();
      if (expiry > 0) {
        this.codeExpiresInSeconds.set(expiry - 1);
        this.codeExpired.set(expiry <= 1);
      }
      if (this.resendCountdown() > 0) {
        this.resendCountdown.update((remaining) => remaining - 1);
      }
      if (this.codeExpiresInSeconds() <= 0 && this.resendCountdown() <= 0) {
        this.stopCountdown();
      }
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.countdownInterval !== null) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  private focusCodeInput(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    queueMicrotask(() => {
      if (this.step() === 'code') {
        this.codeInput?.nativeElement.focus();
      }
    });
  }
}
