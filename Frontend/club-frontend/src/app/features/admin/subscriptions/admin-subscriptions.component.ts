import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateSubscriptionDto, SubscriptionDto, UpdateSubscriptionDto } from '../../../core/models/subscription.model';
import { SUBSCRIPTION_STATUSES, PAYMENT_STATUSES, SubscriptionStatus, PaymentStatus } from '../../../core/models/enums.model';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { MemberService } from '../../../core/services/member.service';
import { PlanService } from '../../../core/services/plan.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppConfirmDialogComponent } from '../../../shared/components/app-confirm-dialog/app-confirm-dialog.component';
import { AppDialogComponent } from '../../../shared/components/app-dialog/app-dialog.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppSelectComponent, SelectOption } from '../../../shared/components/app-select/app-select.component';
import { AppPaginationComponent } from '../../../shared/components/app-pagination/app-pagination.component';
import { AppTableComponent, TableColumn, TableAction } from '../../../shared/components/app-table/app-table.component';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [AppPageHeaderComponent, AppTableComponent, AppPaginationComponent, AppDialogComponent, AppInputComponent, AppSelectComponent, AppButtonComponent, AppConfirmDialogComponent, ReactiveFormsModule],
  template: `
    <app-page-header title="Subscriptions" eyebrow="Admin" description="GET /api/subscriptions">
      <app-button (clicked)="openCreate()">+ Create subscription</app-button>
    </app-page-header>

    <div class="mb-4 flex flex-wrap gap-2">
      @for (s of statusFilters; track s) {
        <app-button [variant]="activeFilter() === s ? 'primary' : 'secondary'" (clicked)="filterBy(s)">{{ s === 'all' ? 'All' : s }}</app-button>
      }
    </div>

    <app-table
      [columns]="cols"
      [data]="tableData()"
      [loading]="loading()"
      [searchable]="true"
      title="subscriptions"
      [actions]="rowActions"
      (actionRow)="handleAction($event)"
      emptyTitle="No subscriptions yet"
      emptyMessage="Create a subscription to get started."
    />
    <app-pagination
      [page]="page()"
      [pageSize]="pageSize()"
      [totalCount]="totalCount()"
      [totalPages]="totalPages()"
      (pageChange)="onPageChange($event)"
    />

    <app-dialog [open]="dialogOpen()" [title]="editingId() ? 'Edit subscription' : 'Create subscription'" (close)="closeDialog()">
      <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4">
        <app-select label="Member" [options]="memberOptions()" placeholder="Select member" [control]="form.controls.memberId" />
        <app-select label="Plan" [options]="planOptions()" placeholder="Select plan" [control]="form.controls.planId" />
        <app-input label="Start date" type="date" [control]="form.controls.startDate" />
        <app-input label="Amount paid ($)" type="number" placeholder="0.00" [control]="form.controls.amountPaid" />
        <app-select label="Status" [options]="statusOptions" placeholder="Select status" [control]="form.controls.status" />
        <app-select label="Payment status" [options]="paymentOptions" placeholder="Select payment" [control]="form.controls.paymentStatus" />
        <div class="flex justify-end gap-3">
          <app-button variant="secondary" type="button" (clicked)="closeDialog()">Cancel</app-button>
          <app-button type="submit" [disabled]="form.invalid" [loading]="submitting()">{{ editingId() ? 'Update' : 'Create' }}</app-button>
        </div>
      </form>
    </app-dialog>

    <app-confirm-dialog
      [open]="confirmOpen()"
      title="Delete subscription?"
      message="Remove this subscription? This cannot be undone."
      (confirm)="doDelete()"
      (cancel)="confirmOpen.set(false)"
    />
  `,
})
export class AdminSubscriptionsComponent {
  private service = inject(SubscriptionService);
  private members = inject(MemberService);
  private plans = inject(PlanService);
  private toast = inject(ToastService);
  items = signal<SubscriptionDto[]>([]);
  memberOptions = signal<SelectOption[]>([]);
  planOptions = signal<SelectOption[]>([]);
  statusOptions: SelectOption[] = SUBSCRIPTION_STATUSES.map((s) => ({ label: s, value: s }));
  paymentOptions: SelectOption[] = PAYMENT_STATUSES.map((p) => ({ label: p, value: p }));
  statusFilters = ['all', ...SUBSCRIPTION_STATUSES] as const;
  activeFilter = signal<string>('all');
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

  cols: TableColumn[] = [
    { key: 'member', label: 'Member', sortable: true },
    { key: 'plan', label: 'Plan', sortable: true },
    { key: 'start', label: 'Start' },
    { key: 'end', label: 'End' },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'status', label: 'Status', badge: true },
    { key: 'payment', label: 'Payment', badge: true },
  ];

  rowActions: TableAction[] = [
    { label: 'Edit', kind: 'icon' },
    { label: 'Delete', kind: 'icon', danger: true },
  ];

  tableData = signal<Record<string, unknown>[]>([]);

  form = new FormGroup({
    memberId: new FormControl<number | null>(null, [Validators.required]),
    planId: new FormControl<number | null>(null, [Validators.required]),
    startDate: new FormControl(''),
    amountPaid: new FormControl<number | null>(null),
    status: new FormControl<string | null>(null),
    paymentStatus: new FormControl<string | null>(null),
  });

  constructor() {
    this.members.getAll().subscribe((r) => {
      this.memberOptions.set((r.data ?? []).map((m) => ({ label: m.fullName || m.userName || m.email, value: m.id })));
    });
    this.plans.getAll().subscribe((r) => {
      this.planOptions.set((r.data ?? []).map((p) => ({ label: `${p.name} (${p.type} - $${p.price})`, value: p.id })));
    });
    this.load();
  }

  private load() {
    this.loading.set(true);
    const filter = this.activeFilter();
    if (filter === 'all') {
      this.service.getAllPaged(this.page(), this.pageSize()).subscribe((r) => {
        const paged = r.data;
        if (paged) {
          this.items.set(paged.items);
          this.totalCount.set(paged.totalCount);
          this.totalPages.set(paged.totalPages);
          this.tableData.set(paged.items.map((item) => ({
            _id: item.id,
            member: item.memberName || `Member #${item.memberId}`,
            plan: item.planName,
            start: new Date(item.startDate).toLocaleDateString(),
            end: new Date(item.endDate).toLocaleDateString(),
            amount: `$${item.amountPaid.toFixed(2)}`,
            status: item.status,
            payment: item.paymentStatus,
          })));
        }
        this.loading.set(false);
      }, () => this.loading.set(false));
    } else {
      this.service.getByStatus(filter as SubscriptionStatus).subscribe((r) => {
        this.items.set(r.data ?? []);
        this.tableData.set((r.data ?? []).map((item) => ({
          _id: item.id,
          member: item.memberName || `Member #${item.memberId}`,
          plan: item.planName,
          start: new Date(item.startDate).toLocaleDateString(),
          end: new Date(item.endDate).toLocaleDateString(),
          amount: `$${item.amountPaid.toFixed(2)}`,
          status: item.status,
          payment: item.paymentStatus,
        })));
        this.loading.set(false);
      }, () => this.loading.set(false));
    }
  }

  onPageChange(p: number) {
    this.page.set(p);
    this.load();
  }

  filterBy(status: string) {
    this.activeFilter.set(status);
    this.load();
  }

  openCreate() {
    this.editingId.set(null);
    this.form.reset({ memberId: null, planId: null, startDate: '', amountPaid: null, status: null, paymentStatus: null });
    this.dialogOpen.set(true);
  }

  openEdit(row: Record<string, unknown>) {
    const id = row['_id'] as number;
    const item = this.items().find((s) => s.id === id);
    if (!item) return;
    this.editingId.set(id);
    this.form.patchValue({
      memberId: item.memberId,
      planId: item.planId,
      startDate: item.startDate?.substring(0, 10) || '',
      amountPaid: item.amountPaid,
      status: item.status,
      paymentStatus: item.paymentStatus,
    });
    this.dialogOpen.set(true);
  }

  closeDialog() { this.dialogOpen.set(false); }

  submit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const raw = this.form.getRawValue();

    if (this.editingId()) {
      const dto: UpdateSubscriptionDto = {
        memberId: raw.memberId ?? undefined,
        planId: raw.planId ?? undefined,
        startDate: raw.startDate || undefined,
        amountPaid: raw.amountPaid ?? undefined,
        status: raw.status as SubscriptionStatus | undefined,
        paymentStatus: raw.paymentStatus as PaymentStatus | undefined,
      };
      this.service.update(this.editingId()!, dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Subscription updated'); this.submitting.set(false); this.closeDialog(); this.load(); },
        error: () => this.submitting.set(false),
      });
    } else {
      const dto: CreateSubscriptionDto = {
        memberId: raw.memberId!,
        planId: raw.planId!,
        startDate: raw.startDate || undefined,
        amountPaid: raw.amountPaid ?? undefined,
        status: raw.status as SubscriptionStatus | undefined,
        paymentStatus: raw.paymentStatus as PaymentStatus | undefined,
      };
      this.service.create(dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Subscription created'); this.submitting.set(false); this.closeDialog(); this.load(); },
        error: () => this.submitting.set(false),
      });
    }
  }

  handleAction(e: { action: string; row: Record<string, unknown> }) {
    if (e.action === 'Edit') this.openEdit(e.row);
    if (e.action === 'Delete') {
      this.deletingId.set(e.row['_id'] as number);
      this.confirmOpen.set(true);
    }
  }

  doDelete() {
    const id = this.deletingId();
    if (!id) return;
    this.service.delete(id).subscribe({
      next: (r) => { this.toast.fromApi(r, 'Subscription deleted'); this.confirmOpen.set(false); this.load(); },
      error: () => this.confirmOpen.set(false),
    });
  }
}
