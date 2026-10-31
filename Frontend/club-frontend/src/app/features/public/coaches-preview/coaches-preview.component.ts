import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoachDto } from '../../../core/models/coach.model';
import { CoachService } from '../../../core/services/coach.service';
import { sportCourtImage } from '../../../core/utils/sport-image.util';

@Component({
  selector: 'app-coaches-preview',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Hero -->
    <section class="relative flex h-64 items-end overflow-hidden">
      <img src="/basketcourt.jpg" alt="" class="absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/75 to-black/20"></div>
      <div class="relative z-10 mx-auto w-full max-w-7xl px-4 py-10">
        <p class="animate-fade-up text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Team</p>
        <h1 class="animate-fade-up animate-delay-100 mt-1 text-4xl font-black text-white">Coaches</h1>
        <p class="animate-fade-up animate-delay-200 mt-2 max-w-xl text-white/70">Meet our professional coaching staff.</p>
      </div>
    </section>

    <!-- List -->
    <section class="mx-auto max-w-7xl px-4 py-10">
      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        @for (coach of coaches(); track coach.id; let i = $index) {
          <a [routerLink]="['/coaches', coach.id]" class="animate-fade-up hover-lift group relative flex h-56 items-end overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]" [class.animate-delay-100]="i===1" [class.animate-delay-200]="i===2" [class.animate-delay-300]="i>=3">
            <img [src]="sportCourtImage(coach.specialization)" alt="" class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="relative z-10 flex items-center gap-4 p-5">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl font-bold text-white transition group-hover:scale-110 group-hover:bg-[var(--brand)]">{{ (coach.fullName || coach.userName).charAt(0) }}</div>
              <div>
                <h2 class="font-bold text-white">{{ coach.fullName || coach.userName }}</h2>
                <p class="text-sm font-semibold text-[var(--brand)]">{{ coach.specialization }}</p>
                <p class="mt-1 text-xs text-white/50 line-clamp-2">{{ coach.bio || coach.email }}</p>
              </div>
            </div>
          </a>
        }
      </div>
    </section>
  `,
})
export class CoachesPreviewComponent {
  protected sportCourtImage = sportCourtImage;
  private service = inject(CoachService);
  coaches = signal<CoachDto[]>([]);

  constructor() {
    this.service.getAll().subscribe({ next: (r) => this.coaches.set(r.data ?? []) });
  }
}
