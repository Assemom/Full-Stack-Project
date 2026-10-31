import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { API_ROUTES } from '../../../core/config/api.config';
import { CoachDto } from '../../../core/models/coach.model';
import { CoachService } from '../../../core/services/coach.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppTextareaComponent } from '../../../shared/components/app-textarea/app-textarea.component';
import { LucideUpload } from '@lucide/angular';

@Component({
  selector: 'app-coach-profile',
  standalone: true,
  imports: [ReactiveFormsModule, AppPageHeaderComponent, AppInputComponent, AppTextareaComponent, AppButtonComponent, DatePipe, LucideUpload],
  template: `
    <app-page-header title="My profile" eyebrow="Coach" description="View and update your personal information." />

    @if (loading()) {
      <div class="flex justify-center py-20">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    } @else if (coach(); as c) {
      <div class="mx-auto max-w-3xl space-y-6">
        <!-- Avatar Card -->
        <div class="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
          <div class="flex flex-col items-center gap-5 sm:flex-row">
            <div class="group relative">
              <div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[var(--brand)]/10 text-4xl font-black text-[var(--brand)] ring-4 ring-[var(--brand)]/20">
                @if (c.imageUrl && !imgError()) {
                  <img [src]="c.imageUrl" alt="Profile" class="h-full w-full object-cover" (error)="imgError.set(true)" />
                } @else {
                  {{ (c.fullName || c.userName).charAt(0).toUpperCase() }}
                }
              </div>
              <button type="button" (click)="fileInput.click()" class="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-lg transition-transform hover:scale-110">
                <svg lucideUpload size="14"></svg>
              </button>
              <input #fileInput type="file" accept="image/*" class="hidden" (change)="uploadImage($event)" />
            </div>
            <div class="text-center sm:text-left">
              <h1 class="text-2xl font-black text-[var(--text)]">{{ c.fullName || c.userName }}</h1>
              <p class="text-[var(--text-muted)]">{{ c.email }}</p>
              <p class="mt-1 text-xs text-[var(--text-muted)]">Coach since {{ c.hireDate | date:'MMM yyyy' }}</p>
            </div>
          </div>
        </div>

        <!-- Info Cards -->
        <div class="grid gap-4 sm:grid-cols-3">
          <div class="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Specialization</p>
            <p class="mt-1 text-lg font-bold text-[var(--text)]">{{ c.specialization }}</p>
          </div>
          <div class="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Coach ID</p>
            <p class="mt-1 text-lg font-bold text-[var(--text)]">#{{ c.id }}</p>
          </div>
          <div class="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Status</p>
            <p class="mt-1 text-lg font-bold text-[var(--text)]">Active</p>
          </div>
        </div>

        <!-- Edit Form -->
        <div class="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
          <h2 class="mb-6 text-lg font-bold text-[var(--text)]">Edit Information</h2>
          <form [formGroup]="form" (ngSubmit)="save()" class="grid gap-5 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <app-input label="Full name" placeholder="Enter your full name" [control]="form.controls.fullName" />
            </div>
            <app-input label="Phone number" placeholder="Enter your phone number" type="tel" [control]="form.controls.phoneNumber" />
            <app-input label="Specialization" placeholder="e.g. Football, Swimming" [control]="form.controls.specialization" />
            <div class="sm:col-span-2">
              <app-input label="Address" placeholder="Enter your address" [control]="form.controls.address" />
            </div>
            <div class="sm:col-span-2">
              <app-textarea label="Bio" placeholder="Tell us about yourself and your coaching experience" [control]="form.controls.bio" />
            </div>
            <div class="flex items-center gap-3 sm:col-span-2">
              <app-button type="submit" [loading]="saving()" variant="primary">Save changes</app-button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class CoachProfileComponent {
  private http = inject(HttpClient);
  private coachService = inject(CoachService);
  private toast = inject(ToastService);

  coach = signal<CoachDto | null>(null);
  loading = signal(true);
  saving = signal(false);
  imgError = signal(false);
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  form = new FormGroup({
    fullName: new FormControl(''),
    phoneNumber: new FormControl(''),
    address: new FormControl(''),
    specialization: new FormControl(''),
    bio: new FormControl(''),
  });

  constructor() {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading.set(true);
    this.coachService.getMyProfile().subscribe({
      next: (r) => {
        if (r.data) {
          this.coach.set(r.data);
          this.form.patchValue({
            fullName: r.data.fullName ?? '',
            phoneNumber: r.data.phoneNumber ?? '',
            address: r.data.address ?? '',
            specialization: r.data.specialization ?? '',
            bio: r.data.bio ?? '',
          });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  uploadImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);

    this.http.post<any>(`${environment.apiBaseUrl}${API_ROUTES.uploadProfileImage}`, fd).subscribe({
      next: (r) => {
        if (r.success && r.data) {
          this.coach.update((c) => c ? { ...c, imageUrl: r.data } : c);
          this.toast.success('Profile picture updated');
        }
      },
      error: () => this.toast.error('Failed to upload image'),
    });
  }

  save(): void {
    this.saving.set(true);
    const raw = this.form.getRawValue();
    this.coachService.updateMyProfile({
      fullName: raw.fullName || null,
      phoneNumber: raw.phoneNumber || null,
      address: raw.address || null,
      specialization: raw.specialization || null,
      bio: raw.bio || null,
    }).subscribe({
      next: (r) => {
        this.toast.fromApi(r, 'Profile updated');
        this.saving.set(false);
        if (r.data) this.coach.set(r.data);
      },
      error: () => this.saving.set(false),
    });
  }
}