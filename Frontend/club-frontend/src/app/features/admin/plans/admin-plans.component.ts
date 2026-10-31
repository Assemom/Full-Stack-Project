import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreatePlanDto, PlanDto, UpdatePlanDto } from '../../../core/models/plan.model';
import { PLAN_TYPES } from '../../../core/models/enums.model';
import { PlanService } from '../../../core/services/plan.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppBadgeComponent } from '../../../shared/components/app-badge/app-badge.component';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppPaginationComponent } from '../../../shared/components/app-pagination/app-pagination.component';
import { AppConfirmDialogComponent } from '../../../shared/components/app-confirm-dialog/app-confirm-dialog.component';
import { AppDialogComponent } from '../../../shared/components/app-dialog/app-dialog.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppSelectComponent, SelectOption } from '../../../shared/components/app-select/app-select.component';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';

@Component({
  selector: 'app-admin-plans',
  standalone: true,
  imports: [AppPageHeaderComponent, AppDialogComponent, AppInputComponent, AppSelectComponent, AppButtonComponent, AppBadgeComponent, AppPaginationComponent, AppConfirmDialogComponent, ReactiveFormsModule, MoneyPipe],
  template: `
    <app-page-header title="Plans" eyebrow="Admin" description="GET /api/admin/plans">
      <app-button (clicked)="openCreate()">+ Create plan</app-button>
    </app-page-header>

    <div class="grid gap-4 md:grid-cols-3">
      @for (item of items(); track item.id) {
        <article class="club-surface p-4">
          <div class="flex items-start justify-between gap-3">
            <h2 class="font-bold">{{ item.name }}</h2>
            <app-badge [value]="item.isActive ? 'Active' : 'Inactive'" />
          </div>
          <p class="mt-2 text-2xl font-black">{{ item.price | money }}</p>
          <p class="text-sm text-[var(--text-muted)]">{{ item.type }} · {{ item.durationMonths }} months · {{ item.subscriptionsCount }} subscriptions</p>
          <div class="mt-3 flex justify-end gap-2">
            <app-button variant="icon" (clicked)="openEdit(item)">Edit</app-button>
            <app-button variant="icon" [danger]="true" (clicked)="confirmDelete(item)">Delete</app-button>
          </div>
        </article>
      } @empty {
        @if (!loading()) {
          <div class="club-surface col-span-full p-6 text-center text-sm text-[var(--text-muted)]">No plans yet. Create one to get started.</div>
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

    <app-dialog [open]="dialogOpen()" [title]="editingId() ? 'Edit plan' : 'Create plan'" (close)="closeDialog()">
      <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4">
        <app-input label="Plan name" placeholder="e.g. Premium Monthly" [control]="form.controls.name" />
        <app-select label="Plan type" [options]="typeOptions" placeholder="Select type" [control]="form.controls.type" />
        <app-input label="Price ($)" type="number" placeholder="0.00" [control]="form.controls.price" />
        <app-input label="Duration (months)" type="number" placeholder="e.g. 1, 3, 12" [control]="form.controls.durationMonths" />
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" [formControl]="form.controls.isActive" class="h-4 w-4 rounded border-[var(--line)] text-[var(--brand)]" />
          <span class="font-medium text-[var(--text)]">Active</span>
        </label>
        <div class="flex justify-end gap-3">
          <app-button variant="secondary" type="button" (clicked)="closeDialog()">Cancel</app-button>
          <app-button type="submit" [disabled]="form.invalid" [loading]="submitting()">{{ editingId() ? 'Update' : 'Create' }}</app-button>
        </div>
      </form>
    </app-dialog>

    <app-confirm-dialog
      [open]="confirmOpen()"
      title="Delete plan?"
      [message]="'Remove ' + (deletingName() || 'this plan') + '? This cannot be undone.'"
      (confirm)="doDelete()"
      (cancel)="confirmOpen.set(false)"
    />
  `,
})
export class AdminPlansComponent {
  private service = inject(PlanService);
  private toast = inject(ToastService);
  items = signal<PlanDto[]>([]);
  typeOptions: SelectOption[] = PLAN_TYPES.map((t) => ({ label: t, value: t }));
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
  deletingName = signal('');

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0.01)] }),
    durationMonths: new FormControl(1, { nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(120)] }),
    isActive: new FormControl(true, { nonNullable: true }),
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
    this.form.reset({ name: '', type: '', price: 0, durationMonths: 1, isActive: true });
    this.dialogOpen.set(true);
  }

  openEdit(item: PlanDto) {
    this.editingId.set(item.id);
    this.form.patchValue({ name: item.name, type: item.type, price: item.price, durationMonths: item.durationMonths, isActive: item.isActive });
    this.dialogOpen.set(true);
  }

  closeDialog() { this.dialogOpen.set(false); }

  submit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const raw = this.form.getRawValue();

    if (this.editingId()) {
      const dto: UpdatePlanDto = { name: raw.name, type: raw.type, price: raw.price, durationMonths: raw.durationMonths, isActive: raw.isActive };
      this.service.update(this.editingId()!, dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Plan updated'); this.submitting.set(false); this.closeDialog(); this.load(); },
        error: () => this.submitting.set(false),
      });
    } else {
      const dto: CreatePlanDto = { name: raw.name!, type: raw.type!, price: raw.price!, durationMonths: raw.durationMonths!, isActive: raw.isActive };
      this.service.create(dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Plan created'); this.submitting.set(false); this.closeDialog(); this.load(); },
        error: () => this.submitting.set(false),
      });
    }
  }

  confirmDelete(item: PlanDto) {
    this.deletingId.set(item.id);
    this.deletingName.set(item.name);
    this.confirmOpen.set(true);
  }

  doDelete() {
    const id = this.deletingId();
    if (!id) return;
    this.service.delete(id).subscribe({
      next: (r) => { this.toast.fromApi(r, 'Plan deleted'); this.confirmOpen.set(false); this.load(); },
      error: () => this.confirmOpen.set(false),
    });
  }
}
