import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoachDto, CreateCoachDto, UpdateCoachDto } from '../../../core/models/coach.model';
import { CoachService } from '../../../core/services/coach.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppConfirmDialogComponent } from '../../../shared/components/app-confirm-dialog/app-confirm-dialog.component';
import { AppDialogComponent } from '../../../shared/components/app-dialog/app-dialog.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppPaginationComponent } from '../../../shared/components/app-pagination/app-pagination.component';
import { AppTableComponent, TableColumn, TableAction } from '../../../shared/components/app-table/app-table.component';
import { AppTextareaComponent } from '../../../shared/components/app-textarea/app-textarea.component';

@Component({
  selector: 'app-admin-coaches',
  standalone: true,
  imports: [AppPageHeaderComponent, AppTableComponent, AppPaginationComponent, AppDialogComponent, AppInputComponent, AppTextareaComponent, AppButtonComponent, AppConfirmDialogComponent, ReactiveFormsModule],
  template: `
    <app-page-header title="Coaches" eyebrow="Admin" description="GET /api/admin/coaches">
      <app-button (clicked)="openCreate()">+ Create coach</app-button>
    </app-page-header>

    <app-table
      [columns]="cols"
      [data]="tableData()"
      [loading]="loading()"
      [searchable]="true"
      title="coaches"
      [actions]="rowActions"
      (actionRow)="handleAction($event)"
      emptyTitle="No coaches yet"
      emptyMessage="Create a coach to get started."
    />
    <app-pagination
      [page]="page()"
      [pageSize]="pageSize()"
      [totalCount]="totalCount()"
      [totalPages]="totalPages()"
      (pageChange)="onPageChange($event)"
    />

    <app-dialog [open]="dialogOpen()" [title]="editingId() ? 'Edit coach' : 'Create coach'" (close)="closeDialog()">
      <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4">
        @if (!editingId()) {
          <app-input label="Email" type="email" placeholder="coach@club.com" [control]="form.controls.email" />
          <app-input label="Password" type="password" placeholder="Min 8 characters" [control]="form.controls.password" />
          <app-input label="Username" placeholder="Display name" [control]="form.controls.userName" />
        }
        <app-input label="Full name" placeholder="Optional" [control]="form.controls.fullName" />
        <app-input label="Phone" type="tel" placeholder="Optional" [control]="form.controls.phoneNumber" />
        <app-input label="Address" placeholder="Optional" [control]="form.controls.address" />
        <app-input label="Specialization" placeholder="e.g. Football, Basketball" [control]="form.controls.specialization" />
        <app-textarea label="Bio" placeholder="Optional" [control]="form.controls.bio" />
        <div class="flex justify-end gap-3">
          <app-button variant="secondary" type="button" (clicked)="closeDialog()">Cancel</app-button>
          <app-button type="submit" [disabled]="form.invalid" [loading]="submitting()">{{ editingId() ? 'Update' : 'Create' }}</app-button>
        </div>
      </form>
    </app-dialog>

    <app-confirm-dialog
      [open]="confirmOpen()"
      title="Delete coach?"
      [message]="'Remove ' + (deletingName() || 'this coach') + '? This cannot be undone.'"
      (confirm)="doDelete()"
      (cancel)="confirmOpen.set(false)"
    />
  `,
})
export class AdminCoachesComponent {
  private service = inject(CoachService);
  private toast = inject(ToastService);
  items = signal<CoachDto[]>([]);
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

  cols: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'specialization', label: 'Specialization', sortable: true },
    { key: 'hireDate', label: 'Hire date', sortable: true },
  ];

  rowActions: TableAction[] = [
    { label: 'Edit', kind: 'icon' },
    { label: 'Delete', kind: 'icon', danger: true },
  ];

  tableData = signal<Record<string, unknown>[]>([]);

  form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    userName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    fullName: new FormControl<string | null>(null),
    phoneNumber: new FormControl<string | null>(null),
    address: new FormControl<string | null>(null),
    specialization: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    bio: new FormControl<string | null>(null),
  });

  constructor() { this.load(); }

  private load() {
    this.loading.set(true);
    this.service.getAllPaged(this.page(), this.pageSize()).subscribe((r) => {
      const paged = r.data;
      if (paged) {
        this.items.set(paged.items);
        this.totalCount.set(paged.totalCount);
        this.totalPages.set(paged.totalPages);
        this.tableData.set(paged.items.map((item) => ({
          _id: item.id,
          name: item.fullName || item.userName || item.email,
          email: item.email,
          phone: item.phoneNumber || '-',
          specialization: item.specialization,
          hireDate: new Date(item.hireDate).toLocaleDateString(),
        })));
      }
      this.loading.set(false);
    }, () => this.loading.set(false));
  }

  onPageChange(p: number) {
    this.page.set(p);
    this.load();
  }

  openCreate() {
    this.editingId.set(null);
    this.form.reset({ email: '', password: '', userName: '', fullName: null, phoneNumber: null, address: null, specialization: '', bio: null });
    this.form.controls.email.enable();
    this.form.controls.password.enable();
    this.form.controls.userName.enable();
    this.dialogOpen.set(true);
  }

  openEdit(row: Record<string, unknown>) {
    const id = row['_id'] as number;
    const item = this.items().find((c) => c.id === id);
    if (!item) return;
    this.editingId.set(id);
    this.form.patchValue({
      email: item.email,
      password: '',
      userName: item.userName,
      fullName: item.fullName,
      phoneNumber: item.phoneNumber,
      address: item.address,
      specialization: item.specialization,
      bio: item.bio,
    });
    this.form.controls.email.disable();
    this.form.controls.password.disable();
    this.form.controls.userName.disable();
    this.dialogOpen.set(true);
  }

  closeDialog() { this.dialogOpen.set(false); }

  submit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const raw = this.form.getRawValue();

    if (this.editingId()) {
      const dto: UpdateCoachDto = {
        fullName: raw.fullName,
        address: raw.address,
        phoneNumber: raw.phoneNumber,
        specialization: raw.specialization,
        bio: raw.bio,
      };
      this.service.update(this.editingId()!, dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Coach updated'); this.submitting.set(false); this.closeDialog(); this.load(); },
        error: () => this.submitting.set(false),
      });
    } else {
      const dto: CreateCoachDto = {
        email: raw.email!,
        password: raw.password!,
        userName: raw.userName!,
        phoneNumber: raw.phoneNumber,
        fullName: raw.fullName,
        address: raw.address,
        specialization: raw.specialization!,
        bio: raw.bio,
      };
      this.service.create(dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Coach created'); this.submitting.set(false); this.closeDialog(); this.load(); },
        error: () => this.submitting.set(false),
      });
    }
  }

  handleAction(e: { action: string; row: Record<string, unknown> }) {
    if (e.action === 'Edit') this.openEdit(e.row);
    if (e.action === 'Delete') {
      this.deletingId.set(e.row['_id'] as number);
      this.deletingName.set(e.row['name'] as string || 'this coach');
      this.confirmOpen.set(true);
    }
  }

  doDelete() {
    const id = this.deletingId();
    if (!id) return;
    this.service.delete(id).subscribe({
      next: (r) => { this.toast.fromApi(r, 'Coach deleted'); this.confirmOpen.set(false); this.load(); },
      error: () => this.confirmOpen.set(false),
    });
  }
}
