import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ActivityDto } from '../../../core/models/activity.model';
import { ActivityService } from '../../../core/services/activity.service';
import { AuthService } from '../../../core/services/auth.service';
import { JoinRequestService } from '../../../core/services/join-request.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppBadgeComponent } from '../../../shared/components/app-badge/app-badge.component';

function guessSportImage(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('basket')) return '/basketcourt.jpg';
  if (lower.includes('football') || lower.includes('soccer')) return '/bigfootballpitch.jpg';
  if (lower.includes('swim')) return '/pool.jpg';
  if (lower.includes('padel')) return '/padelcourt.jpg';
  return '/bigfootballpitch.jpg';
}

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [RouterLink, AppBadgeComponent],
  template: `
    <section class="mx-auto max-w-4xl px-4 py-10">
      @if (activity(); as a) {
        <a routerLink="/activities" class="mb-6 inline-flex items-center gap-1 text-sm text-[var(--brand)] transition hover:gap-2">&larr; All activities</a>

        <div class="animate-fade-up relative mb-8 flex h-56 items-end overflow-hidden rounded-lg">
          <img [src]="sportImage" alt="" class="absolute inset-0 h-full w-full animate-scale-in object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div class="relative z-10 p-6">
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-black text-white">{{ a.name }}</h1>
              <app-badge [value]="a.isActive ? 'Active' : 'Inactive'" />
            </div>
          </div>
        </div>

        <div class="animate-fade-up animate-delay-100 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-8">
          @if (a.description) {
            <p class="mb-6 text-[var(--text-muted)]">{{ a.description }}</p>
          }

          <div class="grid gap-4 sm:grid-cols-3">
            <div class="hover-lift rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
              <p class="text-sm text-[var(--text-muted)]">Schedule</p>
              <p class="font-semibold">{{ a.schedule }}</p>
            </div>
            <div class="hover-lift rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
              <p class="text-sm text-[var(--text-muted)]">Capacity</p>
              <p class="font-semibold">{{ a.teamMembersCount }} / {{ a.maxCapacity }}</p>
            </div>
            <div class="hover-lift rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
              <p class="text-sm text-[var(--text-muted)]">Coach</p>
              <a [routerLink]="['/coaches', a.coachId]" class="font-semibold text-[var(--brand)] hover:underline">{{ a.coachName || 'View coach' }}</a>
            </div>
          </div>

          <div class="hover-lift mt-4 rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
            <p class="text-sm text-[var(--text-muted)]">Team</p>
            <a [routerLink]="['/teams', a.teamId]" class="font-semibold text-[var(--brand)] hover:underline">{{ a.teamName || 'View team' }}</a>
          </div>

          <div class="mt-8 flex gap-3">
            @if (auth.isAuthenticated()) {
              <button (click)="requestJoin()" class="hover-lift rounded-lg bg-[var(--brand)] px-6 py-3 font-bold text-white">Request to join</button>
            } @else {
              <a routerLink="/auth/login" class="hover-lift rounded-lg bg-[var(--brand)] px-6 py-3 font-bold text-white">Login to join</a>
            }
          </div>
        </div>
      } @else {
        <p class="text-center text-[var(--text-muted)]">Loading activity...</p>
      }
    </section>
  `,
})
export class ActivityDetailComponent {
  protected auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private service = inject(ActivityService);
  private joinRequestService = inject(JoinRequestService);
  private toast = inject(ToastService);
  activity = signal<ActivityDto | null>(null);
  joining = signal(false);
  sportImage = '';

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(id).subscribe({ next: (r) => {
      this.activity.set(r.data ?? null);
      if (r.data) this.sportImage = guessSportImage(r.data.name);
    }});
  }

  requestJoin(): void {
    const activity = this.activity();
    if (!activity || this.joining()) return;
    this.joining.set(true);
    this.joinRequestService.create({ activityId: activity.id }).subscribe({
      next: (r) => { this.joining.set(false); this.toast.fromApi(r, 'Join request sent!'); },
      error: () => { this.joining.set(false); this.toast.error('Failed to send request.'); },
    });
  }
}
