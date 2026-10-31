import { Component, inject, signal } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AppStatComponent } from '../../../shared/components/app-stat/app-stat.component';

@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [AppStatComponent],
  template: `
    <div class="relative mb-8 flex h-48 items-end overflow-hidden rounded-lg">
      <img src="/pool.jpg" alt="" class="absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div class="relative z-10 p-6">
        <p class="text-sm font-bold uppercase tracking-[0.12em] text-[var(--brand)]">Club</p>
        <h1 class="text-3xl font-black text-white">Member dashboard</h1>
        <p class="mt-1 text-sm text-white/60">Bookings, subscriptions, activities, and available pitches.</p>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <app-stat label="My bookings" [value]="stats().myBookings" />
      <app-stat label="Subscriptions" [value]="stats().mySubscriptions" />
      <app-stat label="Activities" [value]="stats().totalActivities" />
      <app-stat label="Available pitches" [value]="stats().availablePitches" />
    </div>
  `,
})
export class MemberDashboardComponent {
  private dashboard = inject(DashboardService);
  stats = signal({ myBookings: 0, mySubscriptions: 0, totalActivities: 0, availablePitches: 0 });

  constructor() {
    this.dashboard.getMemberStats().subscribe((r) => {
      if (r.data) this.stats.set(r.data);
    });
  }
}
