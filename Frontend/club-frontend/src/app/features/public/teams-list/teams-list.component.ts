import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeamDto } from '../../../core/models/team.model';
import { TeamService } from '../../../core/services/team.service';
import { sportTeamImage } from '../../../core/utils/sport-image.util';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="relative flex h-64 items-end overflow-hidden">
      <img src="/basketteam.jpg" alt="" class="absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/75 to-black/20"></div>
      <div class="relative z-10 mx-auto w-full max-w-7xl px-4 py-10">
        <p class="animate-fade-up text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Club</p>
        <h1 class="animate-fade-up animate-delay-100 mt-1 text-4xl font-black text-white">Teams</h1>
        <p class="animate-fade-up animate-delay-200 mt-2 max-w-xl text-white/70">All club teams and their rosters.</p>
      </div>
    </section>

    <!-- List -->
    <section class="mx-auto max-w-7xl px-4 py-10">
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        @for (t of teams(); track t.id; let i = $index) {
          <a [routerLink]="['/teams', t.id]" class="animate-fade-up hover-lift group relative flex h-56 items-end overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]" [class.animate-delay-100]="i===1" [class.animate-delay-200]="i===2" [class.animate-delay-300]="i>=3">
            <img [src]="sportTeamImage(t.type)" alt="" class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="relative z-10 w-full p-5">
              <h3 class="text-xl font-bold text-white">{{ t.name }}</h3>
              <p class="mt-1 text-sm font-semibold text-[var(--brand)]">{{ t.type }}</p>
              <p class="mt-2 text-sm text-white/50">Coach: {{ t.coachName || 'TBA' }} · {{ t.membersCount }} members</p>
            </div>
          </a>
        } @empty {
          <p class="col-span-full py-20 text-center text-[var(--text-muted)]">No teams available right now.</p>
        }
      </div>
    </section>
  `,
})
export class TeamsListComponent {
  protected sportTeamImage = sportTeamImage;
  private service = inject(TeamService);
  teams = signal<TeamDto[]>([]);

  constructor() {
    this.service.getAll().subscribe({ next: (r) => this.teams.set(r.data ?? []) });
  }
}
