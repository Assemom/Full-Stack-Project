import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateMemberDto, MemberDto, UpdateMemberDto } from '../../../core/models/member.model';
import { MemberService } from '../../../core/services/member.service';
import { TeamService } from '../../../core/services/team.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppConfirmDialogComponent } from '../../../shared/components/app-confirm-dialog/app-confirm-dialog.component';
import { AppDialogComponent } from '../../../shared/components/app-dialog/app-dialog.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppPaginationComponent } from '../../../shared/components/app-pagination/app-pagination.component';
import { AppSelectComponent, SelectOption } from '../../../shared/components/app-select/app-select.component';
import { AppTableComponent, TableColumn, TableAction } from '../../../shared/components/app-table/app-table.component';

@Component({
  selector: 'app-admin-members',
  standalone: true,
  imports: [AppPageHeaderComponent, AppTableComponent, AppPaginationComponent, AppDialogComponent, AppInputComponent, AppSelectComponent, AppButtonComponent, AppConfirmDialogComponent, ReactiveFormsModule],
  template: `
    <app-page-header title="Members" eyebrow="Admin" description="GET /api/Member">
      <app-button (clicked)="openCreate()">+ Create member</app-button>
    </app-page-header>

    <app-table
      [columns]="cols"
      [data]="tableData()"
      [loading]="loading()"
      [searchable]="true"
      title="members"
      [actions]="rowActions"
      (actionRow)="handleAction($event)"
      emptyTitle="No members yet"
      emptyMessage="Create a member to get started."
    />
    <app-pagination
      [page]="page()"
      [pageSize]="pageSize()"
      [totalCount]="totalCount()"
      [totalPages]="totalPages()"
      (pageChange)="onPageChange($event)"
    />

    <app-dialog [open]="dialogOpen()" [title]="editingId() ? 'Edit member' : 'Create member'" (close)="closeDialog()">
      <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4">
        @if (!editingId()) {
          <app-input label="Email" type="email" placeholder="member@club.com" [control]="form.controls.email" />
          <app-input label="Password" type="password" placeholder="Min 8 characters" [control]="form.controls.password" />
        }
        <app-input label="Full name" placeholder="Optional" [control]="form.controls.fullName" />
        <app-input label="Username" placeholder="Optional" [control]="form.controls.userName" />
        <app-input label="Phone" type="tel" placeholder="Optional" [control]="form.controls.phoneNumber" />
        <app-input label="Address" placeholder="Optional" [control]="form.controls.address" />
        <app-select label="Team" [options]="teamOptions()" placeholder="No team" [control]="form.controls.teamId" />
        <div class="flex justify-end gap-3">
          <app-button variant="secondary" type="button" (clicked)="closeDialog()">Cancel</app-button>
          <app-button type="submit" [disabled]="form.invalid" [loading]="submitting()">{{ editingId() ? 'Update' : 'Create' }}</app-button>
        </div>
      </form>
    </app-dialog>

    <app-confirm-dialog
      [open]="confirmOpen()"
      title="Delete member?"
      [message]="'Remove ' + (deletingName() || 'this member') + '? This cannot be undone.'"
      (confirm)="doDelete()"
      (cancel)="confirmOpen.set(false)"
    />
  `,
})
export class AdminMembersComponent {
  private service = inject(MemberService);
  private teams = inject(TeamService);
  private toast = inject(ToastService);
  items = signal<MemberDto[]>([]);
  teamOptions = signal<SelectOption[]>([]);
  loading = signal(true);
  dialogOpen = signal(false);
  confirmOpen = signal(false);
  submitting = signal(false);
  editingId = signal<number | null>(null);
  deletingId = signal<number | null>(null);
  deletingName = signal('');
  page = signal(1);
  pageSize = signal(20);
  totalCount = signal(0);
  totalPages = signal(0);

  cols: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'team', label: 'Team' },
    { key: 'status', label: 'Subscription', badge: true },
    { key: 'joined', label: 'Joined', sortable: true },
  ];

  rowActions: TableAction[] = [
    { label: 'Edit', kind: 'icon' },
    { label: 'Delete', kind: 'icon', danger: true },
  ];

  tableData = signal<Record<string, unknown>[]>([]);

  form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
    fullName: new FormControl<string | null>(null),
    userName: new FormControl<string | null>(null),
    phoneNumber: new FormControl<string | null>(null),
    address: new FormControl<string | null>(null),
    teamId: new FormControl<number | null>(null),
  });

  constructor() {
    this.teams.getAll().subscribe((r) => {
      this.teamOptions.set((r.data ?? []).map((t) => ({ label: `${t.name} (${t.type})`, value: t.id })));
    });
    this.load();
  }

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
          team: item.teamName || '-',
          status: item.subscriptionStatus || 'Inactive',
          joined: new Date(item.joinedAt).toLocaleDateString(),
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
    this.form.reset({ email: '', password: '', fullName: null, userName: null, phoneNumber: null, address: null, teamId: null });
    this.form.controls.email.enable();
    this.form.controls.password.enable();
    this.dialogOpen.set(true);
  }

  openEdit(row: Record<string, unknown>) {
    const id = row['_id'] as number;
    const item = this.items().find((m) => m.id === id);
    if (!item) return;
    this.editingId.set(id);
    this.form.patchValue({
      email: item.email,
      password: '',
      fullName: item.fullName,
      userName: item.userName,
      phoneNumber: item.phoneNumber,
      address: item.address,
      teamId: item.teamId ?? null,
    });
    this.form.controls.email.disable();
    this.form.controls.password.disable();
    this.dialogOpen.set(true);
  }

  closeDialog() { this.dialogOpen.set(false); }

  submit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const raw = this.form.getRawValue();

    if (this.editingId()) {
      const dto: UpdateMemberDto = {
        fullName: raw.fullName,
        address: raw.address,
        phoneNumber: raw.phoneNumber,
        teamId: raw.teamId ?? null,
      };
      this.service.update(this.editingId()!, dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Member updated'); this.submitting.set(false); this.closeDialog(); this.load(); },
        error: () => this.submitting.set(false),
      });
    } else {
      const dto: CreateMemberDto = {
        email: raw.email!,
        password: raw.password!,
        userName: raw.userName,
        fullName: raw.fullName,
        phoneNumber: raw.phoneNumber,
        address: raw.address,
        teamId: raw.teamId ?? null,
      };
      this.service.create(dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Member created'); this.submitting.set(false); this.closeDialog(); this.load(); },
        error: () => this.submitting.set(false),
      });
    }
  }

  handleAction(e: { action: string; row: Record<string, unknown> }) {
    if (e.action === 'Edit') this.openEdit(e.row);
    if (e.action === 'Delete') {
      this.deletingId.set(e.row['_id'] as number);
      this.deletingName.set(e.row['name'] as string || 'this member');
      this.confirmOpen.set(true);
    }
  }

  doDelete() {
    const id = this.deletingId();
    if (!id) return;
    this.service.delete(id).subscribe({
      next: (r) => { this.toast.fromApi(r, 'Member deleted'); this.confirmOpen.set(false); this.load(); },
      error: () => this.confirmOpen.set(false),
    });
  }
}
