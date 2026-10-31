import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { API_ROUTES } from '../../../core/config/api.config';
import { MemberDto } from '../../../core/models/member.model';
import { MemberService } from '../../../core/services/member.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { LucideUpload } from '@lucide/angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, AppPageHeaderComponent, AppInputComponent, AppButtonComponent, DatePipe, LucideUpload],
  template: `
    <app-page-header title="My profile" eyebrow="Member" description="View and update your personal information." />

    @if (loading()) {
      <div class="flex justify-center py-20">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    } @else if (member(); as m) {
      <div class="mx-auto max-w-3xl space-y-6">
        <!-- Avatar Card -->
        <div class="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
          <div class="flex flex-col items-center gap-5 sm:flex-row">
            <div class="group relative">
              <div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[var(--brand)]/10 text-4xl font-black text-[var(--brand)] ring-4 ring-[var(--brand)]/20">
                @if (m.imageUrl && !imgError()) {
                  <img [src]="m.imageUrl" alt="Profile" class="h-full w-full object-cover" (error)="imgError.set(true)" />
                } @else {
                  {{ (m.fullName || m.userName).charAt(0).toUpperCase() }}
                }
              </div>
              <button type="button" (click)="fileInput.click()" class="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-lg transition-transform hover:scale-110">
                <svg lucideUpload size="14"></svg>
              </button>
              <input #fileInput type="file" accept="image/*" class="hidden" (change)="uploadImage($event)" />
            </div>
            <div class="text-center sm:text-left">
              <h1 class="text-2xl font-black text-[var(--text)]">{{ m.fullName || m.userName }}</h1>
              <p class="text-[var(--text-muted)]">{{ m.email }}</p>
              <p class="mt-1 text-xs text-[var(--text-muted)]">Member since {{ m.joinedAt | date:'MMM yyyy' }}</p>
            </div>
          </div>
        </div>

        <!-- Profile Info Cards -->
        <div class="grid gap-4 sm:grid-cols-3">
          <div class="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Team</p>
            <p class="mt-1 text-lg font-bold text-[var(--text)]">{{ m.teamName || 'Not assigned' }}</p>
          </div>
          <div class="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Subscription</p>
            <p class="mt-1 text-lg font-bold text-[var(--text)]">{{ m.subscriptionStatus || 'None' }}</p>
          </div>
          <div class="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Member ID</p>
            <p class="mt-1 text-lg font-bold text-[var(--text)]">#{{ m.id }}</p>
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
            <div></div>
            <div class="sm:col-span-2">
              <app-input label="Address" placeholder="Enter your address" [control]="form.controls.address" />
            </div>
            <div class="flex items-center gap-3 sm:col-span-2">
              <app-button type="submit" [loading]="saving()" variant="primary">Save changes</app-button>
            </div>
          </form>
        </div>
      </div>
    } @else {
      <div class="flex justify-center py-20">
        <p class="text-[var(--text-muted)]">Could not load profile.</p>
      </div>
    }
  `,
})
export class ProfileComponent {
  private http = inject(HttpClient);
  private memberService = inject(MemberService);
  private toast = inject(ToastService);

  member = signal<MemberDto | null>(null);
  loading = signal(true);
  saving = signal(false);
  imgError = signal(false);
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  form = new FormGroup({
    fullName: new FormControl(''),
    phoneNumber: new FormControl(''),
    address: new FormControl(''),
  });

  constructor() {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading.set(true);
    this.memberService.getMe().subscribe({
      next: (r) => {
        if (r.data) {
          this.member.set(r.data);
          this.form.patchValue({
            fullName: r.data.fullName ?? '',
            phoneNumber: r.data.phoneNumber ?? '',
            address: r.data.address ?? '',
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
          this.member.update((m) => m ? { ...m, imageUrl: r.data } : m);
          this.toast.success('Profile picture updated');
        }
      },
      error: () => this.toast.error('Failed to upload image'),
    });
  }

  save(): void {
    this.saving.set(true);
    const raw = this.form.getRawValue();
    this.memberService.updateMyProfile({
      fullName: raw.fullName || null,
      phoneNumber: raw.phoneNumber || null,
      address: raw.address || null,
    }).subscribe({
      next: (r) => {
        this.toast.fromApi(r, 'Profile updated');
        this.saving.set(false);
        if (r.data) this.member.set(r.data);
      },
      error: () => this.saving.set(false),
    });
  }
}
