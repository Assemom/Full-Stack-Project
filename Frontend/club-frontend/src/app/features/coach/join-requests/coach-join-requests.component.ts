import { Component, inject, signal } from '@angular/core';
import { JoinRequestDto } from '../../../core/models/join-request.model';
import { JoinRequestService } from '../../../core/services/join-request.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppTableComponent, TableColumn, TableAction } from '../../../shared/components/app-table/app-table.component';

@Component({
  selector: 'app-coach-join-requests',
  standalone: true,
  imports: [AppPageHeaderComponent, AppTableComponent],
  template: `
    <app-page-header title="Join Requests" eyebrow="Coach" description="Requests for your teams & activities" />

    <app-table
      [columns]="cols"
      [data]="tableData()"
      [loading]="loading()"
      [searchable]="true"
      title="join requests"
      [actions]="rowActions"
      (actionRow)="handleAction($event)"
      emptyTitle="No pending requests"
      emptyMessage="Join requests for your teams and activities will appear here."
    />
  `,
})
export class CoachJoinRequestsComponent {
  private service = inject(JoinRequestService);
  private toast = inject(ToastService);
  items = signal<JoinRequestDto[]>([]);
  loading = signal(true);
  tableData = signal<Record<string, unknown>[]>([]);

  cols: TableColumn[] = [
    { key: 'member', label: 'Member', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'target', label: 'Target' },
    { key: 'status', label: 'Status', badge: true },
    { key: 'created', label: 'Date', sortable: true },
  ];

  rowActions: TableAction[] = [
    { label: 'Approve', kind: 'text' },
    { label: 'Reject', kind: 'text', danger: true },
  ];

  constructor() { this.load(); }

  private load() {
    this.loading.set(true);
    this.service.getPending().subscribe({
      next: (r) => {
        this.items.set(r.data ?? []);
        this.tableData.set((r.data ?? []).map((item) => ({
          _id: item.id,
          member: item.memberName,
          email: item.memberEmail,
          target: item.teamName ? `Team: ${item.teamName}` : item.activityName ? `Activity: ${item.activityName}` : '-',
          status: item.status,
          created: new Date(item.createdAt).toLocaleDateString(),
        })));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  handleAction(e: { action: string; row: Record<string, unknown> }) {
    const id = e.row['_id'] as number;
    if (e.action === 'Approve') {
      this.service.respond(id, { status: 'Approved' }).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Request approved'); this.load(); },
      });
    }
    if (e.action === 'Reject') {
      this.service.respond(id, { status: 'Rejected' }).subscribe({
        next: (r) => { this.toast.fromApi(r, 'Request rejected'); this.load(); },
      });
    }
  }
}
