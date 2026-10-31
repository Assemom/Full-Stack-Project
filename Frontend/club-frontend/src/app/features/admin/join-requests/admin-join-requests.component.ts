import { Component, inject, signal } from '@angular/core';
import { JoinRequestDto, RespondJoinRequestDto } from '../../../core/models/join-request.model';
import { JoinRequestService } from '../../../core/services/join-request.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppPaginationComponent } from '../../../shared/components/app-pagination/app-pagination.component';
import { AppTableComponent, TableColumn, TableAction } from '../../../shared/components/app-table/app-table.component';

@Component({
  selector: 'app-admin-join-requests',
  standalone: true,
  imports: [AppPageHeaderComponent, AppTableComponent, AppPaginationComponent],
  template: `
    <app-page-header title="Join Requests" eyebrow="Admin" description="GET /api/JoinRequest" />

    <app-table
      [columns]="cols"
      [data]="tableData()"
      [loading]="loading()"
      [searchable]="true"
      title="join requests"
      [actions]="rowActions"
      (actionRow)="handleAction($event)"
      emptyTitle="No requests yet"
      emptyMessage="Members can submit join requests from activity or team pages."
    />
    <app-pagination
      [page]="page()"
      [pageSize]="pageSize()"
      [totalCount]="totalCount()"
      [totalPages]="totalPages()"
      (pageChange)="onPageChange($event)"
    />
  `,
})
export class AdminJoinRequestsComponent {
  private service = inject(JoinRequestService);
  private toast = inject(ToastService);
  items = signal<JoinRequestDto[]>([]);
  loading = signal(true);
  page = signal(1);
  pageSize = signal(20);
  totalCount = signal(0);
  totalPages = signal(0);
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
    this.service.getAllPaged(this.page(), this.pageSize()).subscribe({
      next: (r) => {
        const paged = r.data;
        if (paged) {
          this.items.set(paged.items);
          this.totalCount.set(paged.totalCount);
          this.totalPages.set(paged.totalPages);
          this.tableData.set(paged.items.map((item) => ({
            _id: item.id,
            member: item.memberName,
            email: item.memberEmail,
            target: item.teamName ? `Team: ${item.teamName}` : item.activityName ? `Activity: ${item.activityName}` : '-',
            status: item.status,
            created: new Date(item.createdAt).toLocaleDateString(),
          })));
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
