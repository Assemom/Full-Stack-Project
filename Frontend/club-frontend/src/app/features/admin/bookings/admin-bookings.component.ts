import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateBookingDto, BookingDto, UpdateBookingDto } from '../../../core/models/booking.model';
import { BOOKING_STATUSES, BookingStatus } from '../../../core/models/enums.model';
import { BookingService } from '../../../core/services/booking.service';
import { MemberService } from '../../../core/services/member.service';
import { PitchService } from '../../../core/services/pitch.service';
import { ToastService } from '../../../core/services/toast.service';
import { hoursBetween, isFutureOrToday } from '../../../core/utils/date-time.util';
import { CurrencyPipe } from '@angular/common';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppConfirmDialogComponent } from '../../../shared/components/app-confirm-dialog/app-confirm-dialog.component';
import { AppDialogComponent } from '../../../shared/components/app-dialog/app-dialog.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppSelectComponent, SelectOption } from '../../../shared/components/app-select/app-select.component';
import { AppPaginationComponent } from '../../../shared/components/app-pagination/app-pagination.component';
import { AppTableComponent, TableColumn, TableAction } from '../../../shared/components/app-table/app-table.component';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [AppPageHeaderComponent, AppTableComponent, AppPaginationComponent, AppDialogComponent, AppInputComponent, AppSelectComponent, AppButtonComponent, AppConfirmDialogComponent, ReactiveFormsModule, CurrencyPipe],
  template: `
    <app-page-header title="Bookings" eyebrow="Admin" description="GET /api/bookings">
      <app-button (clicked)="openCreate()">+ Create booking</app-button>
    </app-page-header>

    <div class="mb-4 flex flex-wrap gap-2">
      <app-button [variant]="showToday() ? 'primary' : 'secondary'" (clicked)="toggleToday()">Today</app-button>
      <app-button [variant]="!showToday() ? 'primary' : 'secondary'" (clicked)="showAll()">All</app-button>
    </div>

    <app-table
      [columns]="cols"
      [data]="tableData()"
      [loading]="loading()"
      [searchable]="true"
      title="bookings"
      [actions]="rowActions"
      (actionRow)="handleAction($event)"
      emptyTitle="No bookings yet"
      emptyMessage="Create a booking to get started."
    />
    <app-pagination
      [page]="page()"
      [pageSize]="pageSize()"
      [totalCount]="totalCount()"
      [totalPages]="totalPages()"
      (pageChange)="onPageChange($event)"
    />

    <app-dialog [open]="dialogOpen()" [title]="editingId() ? 'Edit booking' : 'Create booking'" (close)="closeDialog()">
      <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4">
        <app-input label="Date" type="date" [control]="form.controls.date" />
        <app-input label="Start time" type="time" [control]="form.controls.startTime" />
        <app-input label="End time" type="time" [control]="form.controls.endTime" />
        <app-select label="Member" [options]="memberOptions()" placeholder="Select member" [control]="form.controls.memberId" />
        <app-select label="Pitch" [options]="pitchOptions()" placeholder="Select pitch" [control]="form.controls.pitchId" />
        <app-select label="Status" [options]="statusOptions" placeholder="Select status" [control]="form.controls.status" />
        @if (estimatedPrice() > 0) {
          <div class="rounded bg-[var(--surface-muted)] px-3 py-2 text-sm">Estimated price: <strong>{{ estimatedPrice() | currency:'USD':'symbol':'1.2-2' }}</strong></div>
        }
        <div class="flex justify-end gap-3">
          <app-button variant="secondary" type="button" (clicked)="closeDialog()">Cancel</app-button>
          <app-button type="submit" [disabled]="form.invalid" [loading]="submitting()">{{ editingId() ? 'Update' : 'Create' }}</app-button>
        </div>
      </form>
    </app-dialog>

    <app-confirm-dialog
      [open]="confirmOpen()"
      title="Delete booking?"
      message="Remove this booking? This cannot be undone."
      (confirm)="doDelete()"
      (cancel)="confirmOpen.set(false)"
    />
  `,
})
export class AdminBookingsComponent {
  private service = inject(BookingService);
  private members = inject(MemberService);
  private pitches = inject(PitchService);
  private toast = inject(ToastService);
  items = signal<BookingDto[]>([]);
  allItems = signal<BookingDto[]>([]);
  memberOptions = signal<SelectOption[]>([]);
  pitchOptions = signal<SelectOption[]>([]);
  statusOptions: SelectOption[] = BOOKING_STATUSES.map((s) => ({ label: s, value: s }));
  showToday = signal(false);
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
    { key: 'date', label: 'Date', sortable: true },
    { key: 'time', label: 'Time' },
    { key: 'pitch', label: 'Pitch', sortable: true },
    { key: 'member', label: 'Member', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'status', label: 'Status', badge: true },
  ];

  rowActions: TableAction[] = [
    { label: 'Edit', kind: 'icon' },
    { label: 'Delete', kind: 'icon', danger: true },
  ];

  tableData = signal<Record<string, unknown>[]>([]);

  form = new FormGroup({
    date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    startTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    endTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    memberId: new FormControl<number | null>(null, [Validators.required]),
    pitchId: new FormControl<number | null>(null, [Validators.required]),
    status: new FormControl<string | null>(null),
  });

  estimatedPrice = signal(0);

  constructor() {
    this.members.getAll().subscribe((r) => {
      this.memberOptions.set((r.data ?? []).map((m) => ({ label: m.fullName || m.userName || m.email, value: m.id })));
    });
    this.pitches.getAll().subscribe((r) => {
      this.pitchOptions.set((r.data ?? []).map((p) => ({ label: `#${p.number} ${p.type} - $${p.pricePerHour}/hr`, value: p.id })));
    });
    this.load();

    this.form.valueChanges.subscribe(() => this.calcPrice());
  }

  private calcPrice() {
    const raw = this.form.getRawValue();
    const pitch = this.pitchOptions().find((p) => p.value === raw.pitchId);
    const priceMatch = pitch?.label.match(/\$(\d+(\.\d+)?)\/hr/);
    const pricePerHour = priceMatch ? parseFloat(priceMatch[1]) : 0;
    const hours = hoursBetween(raw.startTime || '', raw.endTime || '');
    this.estimatedPrice.set(Math.max(0, Math.round(hours * pricePerHour * 100) / 100));
  }

  private load() {
    this.loading.set(true);
    if (this.showToday()) {
      this.service.getTodayForAdmin().subscribe((r) => {
        this.items.set(r.data ?? []);
        this.tableData.set((r.data ?? []).map((item) => ({
          _id: item.id,
          date: new Date(item.date).toLocaleDateString(),
          time: `${item.startTime}-${item.endTime}`,
          pitch: `#${item.pitchNumber} ${item.pitchType}`,
          member: item.memberName || `Member #${item.memberId}`,
          price: `$${item.totalPrice.toFixed(2)}`,
          status: item.status,
          _pitchId: item.pitchId,
          _pricePerHour: item.pricePerHour,
        })));
        this.loading.set(false);
      }, () => this.loading.set(false));
    } else {
      this.service.getAllPaged(this.page(), this.pageSize()).subscribe((r) => {
        const paged = r.data;
        if (paged) {
          this.items.set(paged.items);
          this.totalCount.set(paged.totalCount);
          this.totalPages.set(paged.totalPages);
          this.tableData.set(paged.items.map((item) => ({
            _id: item.id,
            date: new Date(item.date).toLocaleDateString(),
            time: `${item.startTime}-${item.endTime}`,
            pitch: `#${item.pitchNumber} ${item.pitchType}`,
            member: item.memberName || `Member #${item.memberId}`,
            price: `$${item.totalPrice.toFixed(2)}`,
            status: item.status,
            _pitchId: item.pitchId,
            _pricePerHour: item.pricePerHour,
          })));
        }
        this.loading.set(false);
      }, () => this.loading.set(false));
    }
  }

  onPageChange(p: number) {
    this.page.set(p);
    this.load();
  }

  toggleToday() {
    this.showToday.set(!this.showToday());
    this.load();
  }

  showAll() {
    this.showToday.set(false);
    this.load();
  }

  openCreate() {
    this.editingId.set(null);
    this.form.reset({ date: '', startTime: '', endTime: '', memberId: null, pitchId: null, status: null });
    this.dialogOpen.set(true);
  }

  openEdit(row: Record<string, unknown>) {
    const id = row['_id'] as number;
    const item = this.items().find((b) => b.id === id);
    if (!item) return;
    this.editingId.set(id);
    this.form.patchValue({
      date: item.date?.substring(0, 10) || '',
      startTime: item.startTime?.substring(0, 5) || '',
      endTime: item.endTime?.substring(0, 5) || '',
      memberId: item.memberId,
      pitchId: item.pitchId,
      status: item.status,
    });
    this.dialogOpen.set(true);
  }

  closeDialog() { this.dialogOpen.set(false); }

  submit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const raw = this.form.getRawValue();
    if (raw.date && !isFutureOrToday(raw.date)) {
      this.toast.error('Date must be today or in the future');
      this.submitting.set(false);
      return;
    }
    if (hoursBetween(raw.startTime || '', raw.endTime || '') <= 0) {
      this.toast.error('End time must be after start time');
      this.submitting.set(false);
      return;
    }

    if (this.editingId()) {
      const dto: UpdateBookingDto = {
        date: raw.date,
        startTime: raw.startTime,
        endTime: raw.endTime,
        memberId: raw.memberId ?? undefined,
        pitchId: raw.pitchId ?? undefined,
        status: raw.status as BookingStatus | undefined,
      };
      this.service.update(this.editingId()!, dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Booking updated'); this.submitting.set(false); this.closeDialog(); this.load(); },
        error: () => this.submitting.set(false),
      });
    } else {
      const dto: CreateBookingDto = {
        date: raw.date!,
        startTime: raw.startTime!,
        endTime: raw.endTime!,
        memberId: raw.memberId!,
        pitchId: raw.pitchId!,
        status: raw.status as BookingStatus | undefined,
      };
      this.service.create(dto).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Booking created'); this.submitting.set(false); this.closeDialog(); this.load(); },
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
      next: (r) => { this.toast.fromApi(r, 'Booking deleted'); this.confirmOpen.set(false); this.load(); },
      error: () => this.confirmOpen.set(false),
    });
  }
}
