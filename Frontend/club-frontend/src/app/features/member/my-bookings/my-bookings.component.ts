import { Component, inject, signal } from '@angular/core';
import { BookingDto } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/booking.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppTableComponent, TableAction, TableColumn } from '../../../shared/components/app-table/app-table.component';

@Component({
  selector: 'app-member-my-bookings',
  standalone: true,
  imports: [AppPageHeaderComponent, AppTableComponent],
  template: `
    <app-page-header title="My bookings" eyebrow="Member" description="Manage your pitch bookings." />
    <app-table
      [columns]="cols"
      [data]="tableData()"
      [loading]="loading()"
      [searchable]="true"
      title="bookings"
      emptyTitle="No bookings yet"
      emptyMessage="Book a pitch to get started."
      [actions]="rowActions"
      (actionRow)="handleAction($event)"
    />
  `,
})
export class MyBookingsComponent {
  private service = inject(BookingService);
  private toast = inject(ToastService);
  items = signal<BookingDto[]>([]);
  loading = signal(true);

  cols: TableColumn[] = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'time', label: 'Time' },
    { key: 'pitch', label: 'Pitch', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'status', label: 'Status', badge: true },
  ];

  rowActions: TableAction[] = [{ label: 'Cancel', danger: true }];

  tableData = signal<Record<string, unknown>[]>([]);

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.service.getMineForMember().subscribe((r) => {
      this.items.set(r.data ?? []);
      this.tableData.set(
        (r.data ?? []).map((item) => ({
          _id: item.id,
          date: new Date(item.date).toLocaleDateString(),
          time: `${item.startTime}-${item.endTime}`,
          pitch: `#${item.pitchNumber} ${item.pitchType}`,
          price: `$${item.totalPrice.toFixed(2)}`,
          status: item.status,
        })),
      );
      this.loading.set(false);
    }, () => this.loading.set(false));
  }

  handleAction(e: { action: string; row: Record<string, unknown> }): void {
    if (e.action === 'Cancel') {
      const id = e.row['_id'] as number;
      this.service.delete(id).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Booking cancelled'); this.load(); },
      });
    }
  }
}
