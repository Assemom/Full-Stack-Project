import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { firstError } from '../../../core/utils/form-errors.util';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AppButtonComponent, AppInputComponent],
  template: `
    <form class="club-surface grid w-full gap-4 p-6" [formGroup]="form" (ngSubmit)="submit()">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Welcome back</p>
        <h1 class="text-2xl font-black">Login</h1>
      </div>
      <app-input label="Email" type="email" placeholder="your@email.com" [control]="form.controls.email" [error]="firstError(form.controls.email, 'Email')" />
      <app-input label="Password" type="password" placeholder="Enter your password" [control]="form.controls.password" [error]="firstError(form.controls.password, 'Password')" />
      <app-button type="submit" [disabled]="form.invalid || loading()" [loading]="loading()">
        {{ loading() ? 'Signing in...' : 'Login' }}
      </app-button>
      <p class="text-sm text-[var(--text-muted)]">No account? <a routerLink="/auth/register" class="font-bold text-[var(--brand)]">Join as member</a></p>
    </form>
  `,
})
export class LoginComponent {
  protected firstError = firstError;
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  loading = signal(false);
  form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success) {
          this.toast.success(response.message || 'Logged in');
          this.auth.redirectHome();
        }
      },
      error: () => this.loading.set(false),
    });
  }
}
