import { Component, inject, signal } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AppStatComponent } from '../../../shared/components/app-stat/app-stat.component';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AppStatComponent, MoneyPipe],
  template: `
    <div class="relative mb-8 flex h-48 items-end overflow-hidden rounded-lg">
      <img src="/bigfootballpitch.jpg" alt="" class="absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div class="relative z-10 p-6">
        <p class="text-sm font-bold uppercase tracking-[0.12em] text-[var(--brand)]">Operations</p>
        <h1 class="text-3xl font-black text-white">Admin dashboard</h1>
        <p class="mt-1 text-sm text-white/60">Live counts from every backend collection.</p>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <app-stat label="Members" [value]="stats().totalMembers" />
      <app-stat label="Active subscriptions" [value]="stats().activeSubscriptions" />
      <app-stat label="Today bookings" [value]="stats().todayBookings" />
      <app-stat label="Available pitches" [value]="stats().availablePitches" />
      <app-stat label="Coaches" [value]="stats().totalCoaches" />
      <app-stat label="Teams" [value]="stats().totalTeams" />
      <app-stat label="Activities" [value]="stats().totalActivities" />
      <app-stat label="Revenue preview" [value]="stats().revenue | money" />
    </div>
  `,
})
export class AdminDashboardComponent {
  private dashboard = inject(DashboardService);
  stats = signal({ totalMembers: 0, activeSubscriptions: 0, todayBookings: 0, availablePitches: 0, totalCoaches: 0, totalTeams: 0, totalActivities: 0, revenue: 0 });

  constructor() {
    this.dashboard.getAdminStats().subscribe((r) => {
      if (r.data) this.stats.set(r.data);
    });
  }
}
