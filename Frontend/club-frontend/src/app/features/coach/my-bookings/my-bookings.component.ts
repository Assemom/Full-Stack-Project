import { Component, inject, signal } from '@angular/core';
import { BookingDto } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/booking.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppTableComponent, TableAction, TableColumn } from '../../../shared/components/app-table/app-table.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [AppPageHeaderComponent, AppTableComponent],
  template: `
    <app-page-header title="My bookings" eyebrow="Coach" description="Manage assigned bookings." />
    <app-table
      [columns]="cols"
      [data]="tableData()"
      [actions]="tableActions"
      [loading]="loading()"
      [searchable]="true"
      title="bookings"
      emptyTitle="No bookings assigned"
      emptyMessage="Bookings will appear here when assigned."
      (actionRow)="handleAction($event)"
    />
  `,
})
export class MyBookingsComponent {
  private service = inject(BookingService);
  private toast = inject(ToastService);
  items = signal<BookingDto[]>([]);
  loading = signal(true);
  loadingId = signal<number | null>(null);

  cols: TableColumn[] = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'time', label: 'Time' },
    { key: 'pitch', label: 'Pitch' },
    { key: 'member', label: 'Member', sortable: true },
    { key: 'status', label: 'Status', badge: true },
  ];

  tableActions: TableAction[] = [
    { label: 'Confirm', kind: 'icon' },
    { label: 'Cancel', kind: 'icon', danger: true },
  ];

  tableData = signal<Record<string, unknown>[]>([]);

  constructor() {
    this.service.getMineForCoach().subscribe((r) => {
      this.items.set(r.data ?? []);
      this.tableData.set(
        (r.data ?? []).map((item) => ({
          id: item.id,
          date: new Date(item.date).toLocaleDateString(),
          time: `${item.startTime}-${item.endTime}`,
          pitch: `#${item.pitchNumber}`,
          member: item.memberName || `Member #${item.memberId}`,
          status: item.status,
        })),
      );
      this.loading.set(false);
    }, () => this.loading.set(false));
  }

  handleAction(e: { action: string; row: Record<string, unknown> }): void {
    const id = e.row['id'] as number;
    if (!id) return;

    const status = e.action === 'Confirm' ? 'Confirmed' : 'Cancelled';
    this.loadingId.set(id);
    this.service.update(id, { status }).subscribe({
      next: (r) => {
        this.toast.fromApi(r, `Booking ${status.toLowerCase()}`);
        this.loadingId.set(null);
        if (r.success) {
          this.tableData.update((list) =>
            list.map((row) => (row['id'] === id ? { ...row, status } : row)),
          );
        }
      },
      error: () => this.loadingId.set(null),
    });
  }
}
