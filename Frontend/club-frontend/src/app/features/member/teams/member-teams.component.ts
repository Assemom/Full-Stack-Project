import { Component, inject, signal } from '@angular/core';
import { TeamDto } from '../../../core/models/team.model';
import { TeamService } from '../../../core/services/team.service';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';

@Component({
  selector: 'app-member-teams',
  standalone: true,
  imports: [AppPageHeaderComponent],
  template: `<app-page-header title="Teams" eyebrow="Member" description="GET /api/admin/teams if backend policy allows member visibility." /><div class="grid gap-4 md:grid-cols-3">@for (item of items(); track item.id) {<article class="club-surface p-4"><h2 class="font-bold">{{ item.name }}</h2><p class="text-sm text-[var(--brand)]">{{ item.type }}</p><p class="text-sm text-[var(--text-muted)]">{{ item.coachName || 'Coach TBD' }} · {{ item.membersCount }} members</p></article>}</div>`,
})
export class MemberTeamsComponent {
  private service = inject(TeamService);
  items = signal<TeamDto[]>([]);
  constructor() { this.service.getAll().subscribe((r) => this.items.set(r.data ?? [])); }
}
