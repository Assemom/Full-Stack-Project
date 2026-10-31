import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityDto } from '../../../core/models/activity.model';
import { ActivityService } from '../../../core/services/activity.service';

function sportImage(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('basket')) return '/basketcourt.jpg';
  if (lower.includes('football') || lower.includes('soccer')) return '/bigfootballpitch.jpg';
  if (lower.includes('swim')) return '/pool.jpg';
  if (lower.includes('padel')) return '/padelcourt.jpg';
  return '/bigfootballpitch.jpg';
}

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="relative flex h-64 items-end overflow-hidden">
      <img src="/bigfootballpitch.jpg" alt="" class="absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/75 to-black/20"></div>
      <div class="relative z-10 mx-auto w-full max-w-7xl px-4 py-10">
        <p class="animate-fade-up text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Club</p>
        <h1 class="animate-fade-up animate-delay-100 mt-1 text-4xl font-black text-white">Activities</h1>
        <p class="animate-fade-up animate-delay-200 mt-2 max-w-xl text-white/70">All club activities and training sessions.</p>
      </div>
    </section>

    <!-- List -->
    <section class="mx-auto max-w-7xl px-4 py-10">
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        @for (a of activities(); track a.id; let i = $index) {
          <a [routerLink]="['/activities', a.id]" class="animate-fade-up hover-lift group relative flex h-56 items-end overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]" [class.animate-delay-100]="i===1" [class.animate-delay-200]="i===2" [class.animate-delay-300]="i>=3">
            <img [src]="sportImage(a.name)" alt="" class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="relative z-10 w-full p-5">
              <div class="flex items-start justify-between gap-3">
                <h3 class="font-bold text-white">{{ a.name }}</h3>
                <span class="shrink-0 rounded bg-[var(--brand)]/20 px-2 py-0.5 text-xs font-semibold text-[var(--brand)]">{{ a.isActive ? 'Active' : 'Inactive' }}</span>
              </div>
              <p class="mt-2 text-sm text-white/60">{{ a.schedule }}</p>
              <div class="mt-2 flex items-center gap-2 text-xs text-white/50">
                <span>Coach: {{ a.coachName || 'TBA' }}</span>
                <span>·</span>
                <span>{{ a.teamMembersCount }}/{{ a.maxCapacity }} members</span>
              </div>
            </div>
          </a>
        } @empty {
          <p class="col-span-full py-20 text-center text-[var(--text-muted)]">No activities available right now.</p>
        }
      </div>
    </section>
  `,
})
export class ActivitiesListComponent {
  protected sportImage = sportImage;
  private service = inject(ActivityService);
  activities = signal<ActivityDto[]>([]);

  constructor() {
    this.service.getAll().subscribe({ next: (r) => this.activities.set(r.data ?? []) });
  }
}
