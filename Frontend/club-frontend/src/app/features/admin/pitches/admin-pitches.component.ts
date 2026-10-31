import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreatePitchDto, PitchDto, UpdatePitchDto } from '../../../core/models/pitch.model';
import { PITCH_TYPES } from '../../../core/models/enums.model';
import { PitchService } from '../../../core/services/pitch.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppBadgeComponent } from '../../../shared/components/app-badge/app-badge.component';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppPaginationComponent } from '../../../shared/components/app-pagination/app-pagination.component';
import { AppConfirmDialogComponent } from '../../../shared/components/app-confirm-dialog/app-confirm-dialog.component';
import { AppDialogComponent } from '../../../shared/components/app-dialog/app-dialog.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppSelectComponent, SelectOption } from '../../../shared/components/app-select/app-select.component';
import { AppTextareaComponent } from '../../../shared/components/app-textarea/app-textarea.component';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';

@Component({
  selector: 'app-admin-pitches',
  standalone: true,
  imports: [AppPageHeaderComponent, AppDialogComponent, AppInputComponent, AppSelectComponent, AppTextareaComponent, AppButtonComponent, AppBadgeComponent, AppPaginationComponent, AppConfirmDialogComponent, ReactiveFormsModule, MoneyPipe],
  template: `
    <app-page-header title="Pitches" eyebrow="Admin" description="GET /api/admin/pitches">
      <app-button (clicked)="openCreate()">+ Create pitch</app-button>
    </app-page-header>

    <div class="grid gap-4 md:grid-cols-3">
      @for (item of items(); track item.id) {
        <article class="club-surface p-4">
          <div class="flex items-start justify-between gap-3">
            <h2 class="font-bold">Pitch {{ item.number }}</h2>
            <app-badge [value]="item.isAvailable ? 'Available' : 'Unavailable'" />
          </div>
          <p class="mt-2 text-sm text-[var(--brand)]">{{ item.type }}</p>
          <p class="text-sm text-[var(--text-muted)]">{{ item.pricePerHour | money }}/hour · {{ item.bookingsCount }} bookings</p>
          @if (item.description) {
            <p class="mt-1 text-xs text-[var(--text-muted)]">{{ item.description }}</p>
          }
          <div class="mt-3 flex justify-end gap-2">
            <app-button variant="icon" (clicked)="openEdit(item)">Edit</app-button>
            <app-button variant="icon" [danger]="true" (clicked)="confirmDelete(item)">Delete</app-button>
          </div>
        </article>
      } @empty {
        @if (!loading()) {
          <div class="club-surface col-span-full p-6 text-center text-sm text-[var(--text-muted)]">No pitches yet. Create one to get started.</div>
        }
      }
    </div>
    <app-pagination
      [page]="page()"
      [pageSize]="pageSize()"
      [totalCount]="totalCount()"
      [totalPages]="totalPages()"
      (pageChange)="onPageChange($event)"
    />

    <app-dialog [open]="dialogOpen()" [title]="editingId() ? 'Edit pitch' : 'Create pitch'" (close)="closeDialog()">
      <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4">
        <app-input label="Pitch number" type="number" placeholder="e.g. 1" [control]="form.controls.number" />
        <app-select label="Pitch type" [options]="typeOptions" placeholder="Select type" [control]="form.controls.type" />
        <app-input label="Price per hour ($)" type="number" placeholder="0.00" [control]="form.controls.pricePerHour" />
        <app-textarea label="Description" placeholder="Optional" [control]="form.controls.description" />
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" [formControl]="form.controls.isAvailable" class="h-4 w-4 rounded border-[var(--line)] text-[var(--brand)]" />
          <span class="font-medium text-[var(--text)]">Available</span>
        </label>
        <div class="flex justify-end gap-3">
          <app-button variant="secondary" type="button" (clicked)="closeDialog()">Cancel</app-button>
          <app-button type="submit" [disabled]="form.invalid" [loading]="submitting()">{{ editingId() ? 'Update' : 'Create' }}</app-button>
        </div>
      </form>
    </app-dialog>

    <app-confirm-dialog
      [open]="confirmOpen()"
      title="Delete pitch?"
      [message]="'Remove pitch #' + (deletingNum() || '0') + '? This cannot be undone.'"
      (confirm)="doDelete()"
      (cancel)="confirmOpen.set(false)"
    />
  `,
})
export class AdminPitchesComponent {
  private service = inject(PitchService);
  private toast = inject(ToastService);
  items = signal<PitchDto[]>([]);
  typeOptions: SelectOption[] = PITCH_TYPES.map((t) => ({ label: t, value: t }));
  loading = signal(true);
  page = signal(1);
  pageSize = signal(20);
  totalCount = signal(0);
  totalPages = signal(0);
  dialogOpen = signal(false);
  confirmOpen = signal(false);
  submitting = signal(false);
  editingId = signal<number | null>(null);
  deletingId = signal<number | null>(null);
  deletingNum = signal(0);

  form = new FormGroup({
    number: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    type: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    pricePerHour: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0.01)] }),
    description: new FormControl<string | null>(null),
    isAvailable: new FormControl(true, { nonNullable: true }),
  });

  constructor() { this.load(); }

  private load() {
    this.loading.set(true);
    this.service.getAllPaged(this.page(), this.pageSize()).subscribe({
      next: (r) => {
        const paged = r.data;
        if (paged) {
          this.items.set(paged.items);
          this.totalCount.set(paged.totalCount);
          this.totalPages.set(paged.totalPages);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onPageChange(p: number) {
    this.page.set(p);
    this.load();
  }

  openCreate() {
    this.editingId.set(null);
    this.form.reset({ number: 0, type: '', pricePerHour: 0, description: null, isAvailable: true });
    this.dialogOpen.set(true);
  }

  openEdit(item: PitchDto) {
    this.editingId.set(item.id);
    this.form.patchValue({ number: item.number, type: item.type, pricePerHour: item.pricePerHour, description: item.description, isAvailable: item.isAvailable });
    this.dialogOpen.set(true);
  }

  closeDialog() { this.dialogOpen.set(false); }

  submit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const raw = this.form.getRawValue();

    if (this.editingId()) {
      const dto: UpdatePitchDto = { number: raw.number, type: raw.type as any, pricePerHour: raw.pricePerHour, description: raw.description, isAvailable: raw.isAvailable };
      this.service.update(this.editingId()!, dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Pitch updated'); this.submitting.set(false); this.closeDialog(); this.load(); },
        error: () => this.submitting.set(false),
      });
    } else {
      const dto: CreatePitchDto = { number: raw.number!, type: raw.type as any, pricePerHour: raw.pricePerHour!, description: raw.description, isAvailable: raw.isAvailable };
      this.service.create(dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Pitch created'); this.submitting.set(false); this.closeDialog(); this.load(); },
        error: () => this.submitting.set(false),
      });
    }
  }

  confirmDelete(item: PitchDto) {
    this.deletingId.set(item.id);
    this.deletingNum.set(item.number);
    this.confirmOpen.set(true);
  }

  doDelete() {
    const id = this.deletingId();
    if (!id) return;
    this.service.delete(id).subscribe({
      next: (r) => { this.toast.fromApi(r, 'Pitch deleted'); this.confirmOpen.set(false); this.load(); },
      error: () => this.confirmOpen.set(false),
    });
  }
}
