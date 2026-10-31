import { Component, inject, signal } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AppStatComponent } from '../../../shared/components/app-stat/app-stat.component';

@Component({
  selector: 'app-coach-dashboard',
  standalone: true,
  imports: [AppStatComponent],
  template: `
    <div class="relative mb-8 flex h-48 items-end overflow-hidden rounded-lg">
      <img src="/basketcourt.jpg" alt="" class="absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div class="relative z-10 p-6">
        <p class="text-sm font-bold uppercase tracking-[0.12em] text-[var(--brand)]">Schedule</p>
        <h1 class="text-3xl font-black text-white">Coach dashboard</h1>
        <p class="mt-1 text-sm text-white/60">Assigned activities, bookings, and team context.</p>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <app-stat label="My activities" [value]="stats().myActivities" />
      <app-stat label="My bookings" [value]="stats().myBookings" />
      <app-stat label="My teams" [value]="stats().myTeams" />
    </div>
  `,
})
export class CoachDashboardComponent {
  private dashboard = inject(DashboardService);
  stats = signal({ myActivities: 0, myBookings: 0, myTeams: 0 });

  constructor() {
    this.dashboard.getCoachStats().subscribe((r) => {
      if (r.data) this.stats.set(r.data);
    });
  }
}
