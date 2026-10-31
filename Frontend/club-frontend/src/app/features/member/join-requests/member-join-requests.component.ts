import { Component, inject, signal } from '@angular/core';
import { JoinRequestDto } from '../../../core/models/join-request.model';
import { JoinRequestService } from '../../../core/services/join-request.service';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppTableComponent, TableColumn } from '../../../shared/components/app-table/app-table.component';

@Component({
  selector: 'app-member-join-requests',
  standalone: true,
  imports: [AppPageHeaderComponent, AppTableComponent],
  template: `
    <app-page-header title="My Join Requests" eyebrow="Member" description="Status of your requests" />

    <app-table
      [columns]="cols"
      [data]="tableData()"
      [loading]="loading()"
      title="join requests"
      emptyTitle="No requests yet"
      emptyMessage="Browse activities or teams and request to join!"
    />
  `,
})
export class MemberJoinRequestsComponent {
  private service = inject(JoinRequestService);
  loading = signal(true);
  tableData = signal<Record<string, unknown>[]>([]);

  cols: TableColumn[] = [
    { key: 'target', label: 'Target' },
    { key: 'status', label: 'Status', badge: true },
    { key: 'note', label: 'Response' },
    { key: 'created', label: 'Requested', sortable: true },
  ];

  constructor() {
    this.loading.set(true);
    this.service.getMine().subscribe({
      next: (r) => {
        this.tableData.set((r.data ?? []).map((item) => ({
          target: item.teamName ? `Team: ${item.teamName}` : item.activityName ? `Activity: ${item.activityName}` : '-',
          status: item.status,
          note: item.responseNote || '-',
          created: new Date(item.createdAt).toLocaleDateString(),
        })));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
