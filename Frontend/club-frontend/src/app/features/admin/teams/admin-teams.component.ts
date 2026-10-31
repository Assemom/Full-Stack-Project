import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateTeamDto, TeamDto, UpdateTeamDto } from '../../../core/models/team.model';
import { TEAM_TYPES } from '../../../core/models/enums.model';
import { TeamService } from '../../../core/services/team.service';
import { CoachService } from '../../../core/services/coach.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppBadgeComponent } from '../../../shared/components/app-badge/app-badge.component';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppPaginationComponent } from '../../../shared/components/app-pagination/app-pagination.component';
import { AppConfirmDialogComponent } from '../../../shared/components/app-confirm-dialog/app-confirm-dialog.component';
import { AppDialogComponent } from '../../../shared/components/app-dialog/app-dialog.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppSelectComponent, SelectOption } from '../../../shared/components/app-select/app-select.component';

@Component({
  selector: 'app-admin-teams',
  standalone: true,
  imports: [AppPageHeaderComponent, AppDialogComponent, AppInputComponent, AppSelectComponent, AppButtonComponent, AppBadgeComponent, AppPaginationComponent, AppConfirmDialogComponent, ReactiveFormsModule],
  template: `
    <app-page-header title="Teams" eyebrow="Admin" description="GET /api/admin/teams">
      <app-button (clicked)="openCreate()">+ Create team</app-button>
    </app-page-header>

    <div class="grid gap-4 md:grid-cols-3">
      @for (item of items(); track item.id) {
        <article class="club-surface p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="font-bold">{{ item.name }}</h2>
              <p class="text-sm text-[var(--brand)]">{{ item.type }}</p>
            </div>
            <app-badge [value]="item.membersCount + ' members'" />
          </div>
          <p class="mt-2 text-sm text-[var(--text-muted)]">{{ item.coachName || 'No coach' }}</p>
          <div class="mt-3 flex justify-end gap-2">
            <app-button variant="icon" (clicked)="openEdit(item)">Edit</app-button>
            <app-button variant="icon" [danger]="true" (clicked)="confirmDelete(item)">Delete</app-button>
          </div>
        </article>
      } @empty {
        @if (!loading()) {
          <div class="club-surface col-span-full p-6 text-center text-sm text-[var(--text-muted)]">No teams yet. Create one to get started.</div>
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

    <app-dialog [open]="dialogOpen()" [title]="editingId() ? 'Edit team' : 'Create team'" (close)="closeDialog()">
      <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4">
        <app-input label="Team name" placeholder="e.g. Eagles" [control]="form.controls.name" />
        <app-select label="Sport type" [options]="typeOptions" placeholder="Select type" [control]="form.controls.type" />
        <app-select label="Coach" [options]="coachOptions()" placeholder="No coach" [control]="form.controls.coachId" />
        <div class="flex justify-end gap-3">
          <app-button variant="secondary" type="button" (clicked)="closeDialog()">Cancel</app-button>
          <app-button type="submit" [disabled]="form.invalid" [loading]="submitting()">{{ editingId() ? 'Update' : 'Create' }}</app-button>
        </div>
      </form>
    </app-dialog>

    <app-confirm-dialog
      [open]="confirmOpen()"
      title="Delete team?"
      [message]="'Remove ' + (deletingName() || 'this team') + '? This cannot be undone.'"
      (confirm)="doDelete()"
      (cancel)="confirmOpen.set(false)"
    />
  `,
})
export class AdminTeamsComponent {
  private service = inject(TeamService);
  private coaches = inject(CoachService);
  private toast = inject(ToastService);
  items = signal<TeamDto[]>([]);
  coachOptions = signal<SelectOption[]>([]);
  typeOptions: SelectOption[] = TEAM_TYPES.map((t) => ({ label: t, value: t }));
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
    coachId: new FormControl<number | null>(null),
  });

  constructor() {
    this.coaches.getAll().subscribe((r) => {
      this.coachOptions.set((r.data ?? []).map((c) => ({ label: c.fullName || c.userName, value: c.id })));
    });
    this.load();
  }

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
    this.form.reset({ name: '', type: '', coachId: null });
    this.dialogOpen.set(true);
  }

  openEdit(item: TeamDto) {
    this.editingId.set(item.id);
    this.form.patchValue({ name: item.name, type: item.type, coachId: item.coachId ?? null });
    this.dialogOpen.set(true);
  }

  closeDialog() { this.dialogOpen.set(false); }

  submit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const raw = this.form.getRawValue();

    if (this.editingId()) {
      const dto: UpdateTeamDto = { name: raw.name, type: raw.type, coachId: raw.coachId ?? null };
      this.service.update(this.editingId()!, dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Team updated'); this.submitting.set(false); this.closeDialog(); this.load(); },
        error: () => this.submitting.set(false),
      });
    } else {
      const dto: CreateTeamDto = { name: raw.name!, type: raw.type!, coachId: raw.coachId ?? null };
      this.service.create(dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Team created'); this.submitting.set(false); this.closeDialog(); this.load(); },
        error: () => this.submitting.set(false),
      });
    }
  }

  confirmDelete(item: TeamDto) {
    this.deletingId.set(item.id);
    this.deletingName.set(item.name);
    this.confirmOpen.set(true);
  }

  doDelete() {
    const id = this.deletingId();
    if (!id) return;
    this.service.delete(id).subscribe({
      next: (r) => { this.toast.fromApi(r, 'Team deleted'); this.confirmOpen.set(false); this.load(); },
      error: () => this.confirmOpen.set(false),
    });
  }
}
