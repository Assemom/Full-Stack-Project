import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { firstError } from '../../../core/utils/form-errors.util';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AppButtonComponent, AppInputComponent],
  template: `
    <form class="club-surface grid w-full gap-4 p-6" [formGroup]="form" (ngSubmit)="submit()">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Member access</p>
        <h1 class="text-2xl font-black">Create account</h1>
      </div>
      <app-input label="Email" type="email" placeholder="your@email.com" [control]="form.controls.email" [error]="firstError(form.controls.email, 'Email')" />
      <app-input label="Password" type="password" placeholder="Min 6 characters" [control]="form.controls.password" [error]="firstError(form.controls.password, 'Password')" />
      <app-input label="Username (optional)" placeholder="Display name" [control]="form.controls.userName" [error]="firstError(form.controls.userName, 'Username')" />
      <app-input label="Phone (optional)" type="tel" placeholder="+1 234 567 890" [control]="form.controls.phoneNumber" />
      <app-input label="Address (optional)" placeholder="Street, city" [control]="form.controls.address" />
      <app-button type="submit" variant="gold" [disabled]="form.invalid || loading()" [loading]="loading()">
        {{ loading() ? 'Creating...' : 'Join' }}
      </app-button>
      <p class="text-sm text-[var(--text-muted)]">Already joined? <a routerLink="/auth/login" class="font-bold text-[var(--brand)]">Login</a></p>
    </form>
  `,
})
export class RegisterComponent {
  protected firstError = firstError;
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  loading = signal(false);
  form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6), Validators.maxLength(100)] }),
    userName: new FormControl<string | null>(null, [Validators.minLength(3), Validators.maxLength(50)]),
    phoneNumber: new FormControl<string | null>(null),
    address: new FormControl<string | null>(null, [Validators.maxLength(200)]),
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.auth.register(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.toast.fromApi(response, 'Account created');
        if (this.auth.isAuthenticated()) this.auth.redirectHome();
        else this.router.navigateByUrl('/auth/login');
      },
      error: () => this.loading.set(false),
    });
  }
}
