import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TeamDto } from '../../../core/models/team.model';
import { TeamService } from '../../../core/services/team.service';
import { AuthService } from '../../../core/services/auth.service';
import { JoinRequestService } from '../../../core/services/join-request.service';
import { ToastService } from '../../../core/services/toast.service';
import { sportTeamImage } from '../../../core/utils/sport-image.util';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <section class="mx-auto max-w-4xl px-4 py-10">
      @if (team(); as t) {
        <a routerLink="/teams" class="mb-6 inline-flex items-center gap-1 text-sm text-[var(--brand)] transition hover:gap-2">&larr; All teams</a>

        <div class="animate-fade-up relative mb-8 flex h-56 items-end overflow-hidden rounded-lg">
          <img [src]="sportTeamImage(t.type)" alt="" class="absolute inset-0 h-full w-full animate-scale-in object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div class="relative z-10 p-6">
            <h1 class="text-3xl font-black text-white">{{ t.name }}</h1>
            <p class="mt-1 font-semibold text-[var(--brand)]">{{ t.type }}</p>
          </div>
        </div>

        <div class="animate-fade-up animate-delay-100 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-8">
          <div class="grid gap-4 sm:grid-cols-3">
            <div class="hover-lift rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
              <p class="text-sm text-[var(--text-muted)]">Members</p>
              <p class="text-xl font-bold">{{ t.membersCount }}</p>
            </div>
            <div class="hover-lift rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
              <p class="text-sm text-[var(--text-muted)]">Coach</p>
              @if (t.coachId) {
                <a [routerLink]="['/coaches', t.coachId]" class="font-semibold text-[var(--brand)] hover:underline">{{ t.coachName || 'View coach' }}</a>
              } @else {
                <p class="font-semibold">TBA</p>
              }
            </div>
            <div class="hover-lift rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
              <p class="text-sm text-[var(--text-muted)]">Created</p>
              <p class="font-semibold">{{ t.createdAt | date:'MMM d, y' }}</p>
            </div>
          </div>

          @if (t.coachSpecialization) {
            <div class="hover-lift mt-4 rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
              <p class="text-sm text-[var(--text-muted)]">Coach specialization</p>
              <p class="font-semibold">{{ t.coachSpecialization }}</p>
            </div>
          }

          <div class="mt-8 flex gap-3">
            @if (auth.isAuthenticated()) {
              <button (click)="requestJoin()" class="hover-lift rounded-lg bg-[var(--brand)] px-6 py-3 font-bold text-white">Request to join</button>
            } @else {
              <a routerLink="/auth/login" class="hover-lift rounded-lg bg-[var(--brand)] px-6 py-3 font-bold text-white">Login to join</a>
            }
          </div>
        </div>
      } @else {
        <p class="text-center text-[var(--text-muted)]">Loading team...</p>
      }
    </section>
  `,
})
export class TeamDetailComponent {
  protected auth = inject(AuthService);
  protected sportTeamImage = sportTeamImage;
  private route = inject(ActivatedRoute);
  private service = inject(TeamService);
  private joinRequestService = inject(JoinRequestService);
  private toast = inject(ToastService);
  team = signal<TeamDto | null>(null);
  joining = signal(false);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(id).subscribe({ next: (r) => this.team.set(r.data ?? null) });
  }

  requestJoin(): void {
    const team = this.team();
    if (!team || this.joining()) return;
    this.joining.set(true);
    this.joinRequestService.create({ teamId: team.id }).subscribe({
      next: (r) => { this.joining.set(false); this.toast.fromApi(r, 'Join request sent!'); },
      error: () => { this.joining.set(false); this.toast.error('Failed to send request.'); },
    });
  }
}
