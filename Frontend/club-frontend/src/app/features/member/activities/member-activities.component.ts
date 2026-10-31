import { Component, inject, signal } from '@angular/core';
import { ActivityDto } from '../../../core/models/activity.model';
import { ActivityService } from '../../../core/services/activity.service';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppTableComponent, TableColumn } from '../../../shared/components/app-table/app-table.component';

@Component({
  selector: 'app-member-activities',
  standalone: true,
  imports: [AppPageHeaderComponent, AppTableComponent],
  template: `
    <app-page-header title="Activities" eyebrow="Member" description="GET /api/activities" />
    <app-table
      [columns]="cols"
      [data]="tableData()"
      [loading]="loading()"
      [searchable]="true"
      title="activities"
      emptyTitle="No activities yet"
      emptyMessage="Activities will appear here."
    />
  `,
})
export class MemberActivitiesComponent {
  private service = inject(ActivityService);
  items = signal<ActivityDto[]>([]);
  loading = signal(true);

  cols: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'schedule', label: 'Schedule', sortable: true },
    { key: 'coach', label: 'Coach', sortable: true },
    { key: 'team', label: 'Team' },
    { key: 'status', label: 'Status', badge: true },
  ];

  tableData = signal<Record<string, unknown>[]>([]);

  constructor() {
    this.service.getAll().subscribe((r) => {
      this.items.set(r.data ?? []);
      this.tableData.set(
        (r.data ?? []).map((item) => ({
          name: item.name,
          schedule: new Date(item.schedule).toLocaleString(),
          coach: item.coachName || '-',
          team: item.teamName || '-',
          status: item.isActive ? 'Active' : 'Inactive',
        })),
      );
      this.loading.set(false);
    }, () => this.loading.set(false));
  }
}
