import { Component, inject, signal } from '@angular/core';
import { ActivityDto } from '../../../core/models/activity.model';
import { ActivityService } from '../../../core/services/activity.service';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppTableComponent, TableColumn } from '../../../shared/components/app-table/app-table.component';

@Component({
  selector: 'app-my-activities',
  standalone: true,
  imports: [AppPageHeaderComponent, AppTableComponent],
  template: `
    <app-page-header title="My activities" eyebrow="Coach" description="GET /api/coach/activities/mine" />
    <app-table
      [columns]="cols"
      [data]="tableData()"
      [loading]="loading()"
      [searchable]="true"
      title="activities"
      emptyTitle="No activities assigned"
      emptyMessage="Activities will appear here when assigned."
    />
  `,
})
export class MyActivitiesComponent {
  private service = inject(ActivityService);
  items = signal<ActivityDto[]>([]);
  loading = signal(true);

  cols: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'schedule', label: 'Schedule', sortable: true },
    { key: 'team', label: 'Team', sortable: true },
    { key: 'capacity', label: 'Capacity' },
    { key: 'status', label: 'Status', badge: true },
  ];

  tableData = signal<Record<string, unknown>[]>([]);

  constructor() {
    this.service.getMineForCoach().subscribe((r) => {
      this.items.set(r.data ?? []);
      this.tableData.set(
        (r.data ?? []).map((item) => ({
          name: item.name,
          schedule: new Date(item.schedule).toLocaleString(),
          team: item.teamName || '-',
          capacity: `${item.teamMembersCount}/${item.maxCapacity}`,
          status: item.isActive ? 'Active' : 'Inactive',
        })),
      );
      this.loading.set(false);
    }, () => this.loading.set(false));
  }
}
