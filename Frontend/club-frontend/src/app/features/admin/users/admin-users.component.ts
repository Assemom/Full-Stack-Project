import { Component, inject, signal } from '@angular/core';
import { AdminUserDto } from '../../../core/models/admin-user.model';
import { UserService } from '../../../core/services/user.service';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { AppTableComponent, TableColumn } from '../../../shared/components/app-table/app-table.component';
import { avatarColor, avatarInitial } from '../../../core/utils/avatar.util';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [AppPageHeaderComponent, AppTableComponent],
  template: `
    <app-page-header title="Users" eyebrow="Admin" description="Manage registered user accounts." />

    <app-table
      [columns]="cols"
      [data]="tableData()"
      [loading]="loading()"
      [searchable]="true"
      title="users"
      emptyTitle="No users found"
      emptyMessage="No user accounts registered yet."
    />
  `,
})
export class AdminUsersComponent {
  private service = inject(UserService);
  loading = signal(true);

  cols: TableColumn[] = [
    { key: 'user', label: 'User', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'roles', label: 'Roles' },
    { key: 'status', label: 'Status', badge: true },
  ];

  tableData = signal<Record<string, unknown>[]>([]);

  constructor() {
    this.service.getAll().subscribe({
      next: (r) => {
        this.tableData.set(
          (r.data ?? []).map((u) => ({
            user: this.renderUser(u),
            email: u.email,
            roles: u.roles.join(', '),
            status: u.isLockedOut ? 'Locked' : 'Active',
          })),
        );
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private renderUser(u: AdminUserDto): string {
    const name = u.fullName || u.userName;
    return `${avatarInitial(name)}\u00A0\u00A0${name}`;
  }
}
