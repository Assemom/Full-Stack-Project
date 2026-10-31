import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CoachDto } from '../../../core/models/coach.model';
import { CoachService } from '../../../core/services/coach.service';
import { sportPitchImage } from '../../../core/utils/sport-image.util';

@Component({
  selector: 'app-coach-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <section class="mx-auto max-w-4xl px-4 py-10">
      @if (coach(); as c) {
        <a routerLink="/coaches" class="mb-6 inline-flex items-center gap-1 text-sm text-[var(--brand)] transition hover:gap-2">&larr; All coaches</a>

        <div class="animate-fade-up relative mb-8 flex h-56 items-end overflow-hidden rounded-lg">
          <img [src]="sportPitchImage(c.specialization)" alt="" class="absolute inset-0 h-full w-full animate-scale-in object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div class="relative z-10 flex items-center gap-5 p-6">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-black text-white">{{ (c.fullName || c.userName).charAt(0) }}</div>
            <div>
              <h1 class="text-3xl font-black text-white">{{ c.fullName || c.userName }}</h1>
              <p class="mt-1 font-semibold text-[var(--brand)]">{{ c.specialization }}</p>
            </div>
          </div>
        </div>

        <div class="animate-fade-up animate-delay-100 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-8">
          @if (c.bio) {
            <p class="mb-6 text-[var(--text-muted)]">{{ c.bio }}</p>
          }
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="hover-lift rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
              <p class="text-sm text-[var(--text-muted)]">Email</p>
              <p class="font-semibold">{{ c.email }}</p>
            </div>
            @if (c.phoneNumber) {
              <div class="hover-lift rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
                <p class="text-sm text-[var(--text-muted)]">Phone</p>
                <p class="font-semibold">{{ c.phoneNumber }}</p>
              </div>
            }
            <div class="hover-lift rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
              <p class="text-sm text-[var(--text-muted)]">Hired</p>
              <p class="font-semibold">{{ c.hireDate | date }}</p>
            </div>
            @if (c.address) {
              <div class="hover-lift rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
                <p class="text-sm text-[var(--text-muted)]">Location</p>
                <p class="font-semibold">{{ c.address }}</p>
              </div>
            }
          </div>
        </div>
      } @else {
        <p class="text-center text-[var(--text-muted)]">Loading coach profile...</p>
      }
    </section>
  `,
})
export class CoachDetailComponent {
  protected sportPitchImage = sportPitchImage;
  private route = inject(ActivatedRoute);
  private service = inject(CoachService);
  coach = signal<CoachDto | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(id).subscribe({ next: (r) => this.coach.set(r.data ?? null) });
  }
}
