import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { userErrorMessage } from '../../core/error-message';
import { NavigationService } from '../../core/navigation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly navigation = inject(NavigationService);
  readonly cloudHref = this.navigation.cloudUrl();
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly form = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  openPersonalCloud(event: Event): void {
    if (this.navigation.shouldUseNativeNavigation(event)) return;
    event.preventDefault();
    this.navigation.goToCloud();
  }

  backToHome(): void {
    this.navigation.goHome();
  }

  submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.navigation.goToCloudDashboard(),
        error: (error: unknown) =>
          this.error.set(userErrorMessage(error, 'Unable to sign in. Check your credentials.')),
      });
  }
}
