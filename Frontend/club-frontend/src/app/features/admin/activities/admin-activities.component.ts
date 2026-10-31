import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityDto, CreateActivityDto, UpdateActivityDto } from '../../../core/models/activity.model';
import { ActivityService } from '../../../core/services/activity.service';
import { CoachService } from '../../../core/services/coach.service';
import { TeamService } from '../../../core/services/team.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppConfirmDialogComponent } from '../../../shared/components/app-confirm-dialog/app-confirm-dialog.component';
import { AppDialogComponent } from '../../../shared/components/app-dialog/app-dialog.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppSelectComponent, SelectOption } from '../../../shared/components/app-select/app-select.component';
import { AppTextareaComponent } from '../../../shared/components/app-textarea/app-textarea.component';
import { AppPaginationComponent } from '../../../shared/components/app-pagination/app-pagination.component';
import { AppTableComponent, TableColumn, TableAction } from '../../../shared/components/app-table/app-table.component';


@Component({
  selector: 'app-admin-activities',
  standalone: true,
  imports: [AppPageHeaderComponent, AppTableComponent, AppPaginationComponent, AppDialogComponent, AppInputComponent, AppSelectComponent, AppTextareaComponent, AppButtonComponent, AppConfirmDialogComponent, ReactiveFormsModule],
  template: `
    <app-page-header title="Activities" eyebrow="Admin" description="GET /api/activities">
      <app-button (clicked)="openCreate()">+ Create activity</app-button>
    </app-page-header>

    <app-table
      [columns]="cols"
      [data]="tableData()"
      [loading]="loading()"
      [searchable]="true"
      title="activities"
      [actions]="rowActions"
      (actionRow)="handleAction($event)"
      emptyTitle="No activities yet"
      emptyMessage="Create an activity to get started."
    />
    <app-pagination
      [page]="page()"
      [pageSize]="pageSize()"
      [totalCount]="totalCount()"
      [totalPages]="totalPages()"
      (pageChange)="onPageChange($event)"
    />

    <app-dialog [open]="dialogOpen()" [title]="editingId() ? 'Edit activity' : 'Create activity'" (close)="closeDialog()">
      <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4">
        <app-input label="Activity name" placeholder="e.g. Morning Football" [control]="form.controls.name" />
        <app-textarea label="Description" placeholder="Optional" [control]="form.controls.description" />
        <app-input label="Schedule" type="datetime-local" [control]="form.controls.schedule" />
        <app-input label="Max capacity" type="number" placeholder="e.g. 20" [control]="form.controls.maxCapacity" />
        <app-select label="Coach" [options]="coachOptions()" placeholder="Select coach" [control]="form.controls.coachId" />
        <app-select label="Team" [options]="teamOptions()" placeholder="Select team" [control]="form.controls.teamId" />
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
      title="Delete activity?"
      [message]="'Remove ' + (deletingName() || 'this activity') + '? This cannot be undone.'"
      (confirm)="doDelete()"
      (cancel)="confirmOpen.set(false)"
    />
  `,
})
export class AdminActivitiesComponent {
  private service = inject(ActivityService);
  private coaches = inject(CoachService);
  private teams = inject(TeamService);
  private toast = inject(ToastService);
  items = signal<ActivityDto[]>([]);
  coachOptions = signal<SelectOption[]>([]);
  teamOptions = signal<SelectOption[]>([]);
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
    { key: 'schedule', label: 'Schedule', sortable: true },
    { key: 'coach', label: 'Coach', sortable: true },
    { key: 'team', label: 'Team', sortable: true },
    { key: 'capacity', label: 'Capacity', sortable: true },
    { key: 'status', label: 'Status', badge: true },
  ];

  rowActions: TableAction[] = [
    { label: 'Edit', kind: 'icon' },
    { label: 'Delete', kind: 'icon', danger: true },
  ];

  tableData = signal<Record<string, unknown>[]>([]);

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string | null>(null),
    schedule: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    maxCapacity: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    coachId: new FormControl<number | null>(null, [Validators.required]),
    teamId: new FormControl<number | null>(null, [Validators.required]),
    isActive: new FormControl(true, { nonNullable: true }),
  });

  constructor() {
    this.coaches.getAll().subscribe((r) => {
      this.coachOptions.set((r.data ?? []).map((c) => ({ label: c.fullName || c.userName, value: c.id })));
    });
    this.teams.getAll().subscribe((r) => {
      this.teamOptions.set((r.data ?? []).map((t) => ({ label: `${t.name} (${t.type})`, value: t.id })));
    });
    this.load();
  }

  private load() {
    this.loading.set(true);
    this.service.getAll().subscribe((r) => {
      this.items.set(r.data ?? []);
      this.tableData.set((r.data ?? []).map((item) => ({
        _id: item.id,
        name: item.name,
        schedule: new Date(item.schedule).toLocaleString(),
        coach: item.coachName || '-',
        team: item.teamName || '-',
        capacity: `${item.teamMembersCount}/${item.maxCapacity}`,
        status: item.isActive ? 'Active' : 'Inactive',
        _coachId: item.coachId,
        _teamId: item.teamId,
      })));
      this.loading.set(false);
    }, () => this.loading.set(false));
  }

  openCreate() {
    this.editingId.set(null);
    this.form.reset({ name: '', description: null, schedule: '', maxCapacity: 0, coachId: null, teamId: null, isActive: true });
    this.dialogOpen.set(true);
  }

  openEdit(row: Record<string, unknown>) {
    const id = row['_id'] as number;
    const item = this.items().find((a) => a.id === id);
    if (!item) return;
    this.editingId.set(id);
    this.form.patchValue({
      name: item.name,
      description: item.description,
      schedule: item.schedule?.substring(0, 16) || '',
      maxCapacity: item.maxCapacity,
      coachId: item.coachId,
      teamId: item.teamId,
      isActive: item.isActive,
    });
    this.dialogOpen.set(true);
  }

  closeDialog() { this.dialogOpen.set(false); }

  submit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const raw = this.form.getRawValue();

    if (this.editingId()) {
      const dto: UpdateActivityDto = { name: raw.name, description: raw.description, schedule: raw.schedule, maxCapacity: raw.maxCapacity, coachId: raw.coachId ?? undefined, teamId: raw.teamId ?? undefined, isActive: raw.isActive };
      this.service.update(this.editingId()!, dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Activity updated'); this.submitting.set(false); this.closeDialog(); this.load(); },
        error: () => this.submitting.set(false),
      });
    } else {
      const dto: CreateActivityDto = { name: raw.name!, description: raw.description, schedule: raw.schedule!, maxCapacity: raw.maxCapacity!, coachId: raw.coachId!, teamId: raw.teamId! };
      this.service.create(dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Activity created'); this.submitting.set(false); this.closeDialog(); this.load(); },
        error: () => this.submitting.set(false),
      });
    }
  }

  handleAction(e: { action: string; row: Record<string, unknown> }) {
    if (e.action === 'Edit') this.openEdit(e.row);
    if (e.action === 'Delete') {
      this.deletingId.set(e.row['_id'] as number);
      this.deletingName.set(e.row['name'] as string || 'this activity');
      this.confirmOpen.set(true);
    }
  }

  onPageChange(page: number) {
    this.page.set(page);
    this.load();
  }

  doDelete() {
    const id = this.deletingId();
    if (!id) return;
    this.service.delete(id).subscribe({
      next: (r) => { this.toast.fromApi(r, 'Activity deleted'); this.confirmOpen.set(false); this.load(); },
      error: () => this.confirmOpen.set(false),
    });
  }
}
