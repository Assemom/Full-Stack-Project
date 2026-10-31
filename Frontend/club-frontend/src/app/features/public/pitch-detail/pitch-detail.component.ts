import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PitchDto } from '../../../core/models/pitch.model';
import { PitchService } from '../../../core/services/pitch.service';
import { AppBadgeComponent } from '../../../shared/components/app-badge/app-badge.component';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';
import { sportPitchImage } from '../../../core/utils/sport-image.util';

@Component({
  selector: 'app-pitch-detail',
  standalone: true,
  imports: [RouterLink, AppBadgeComponent, MoneyPipe],
  template: `
    <section class="mx-auto max-w-4xl px-4 py-10">
      @if (pitch(); as p) {
        <a routerLink="/" class="mb-6 inline-flex items-center gap-1 text-sm text-[var(--brand)] transition hover:gap-2">&larr; Home</a>

        <div class="animate-fade-up relative mb-8 flex h-56 items-end overflow-hidden rounded-lg">
          <img [src]="sportPitchImage(p.type)" alt="" class="absolute inset-0 h-full w-full animate-scale-in object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div class="relative z-10 flex items-end justify-between w-full p-6">
            <div>
              <h1 class="text-3xl font-black text-white">Pitch {{ p.number }}</h1>
              <p class="mt-1 font-semibold text-[var(--brand)]">{{ p.type }}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-black text-white">{{ p.pricePerHour | money }}</p>
              <p class="text-sm text-white/60">per hour</p>
            </div>
          </div>
        </div>

        <div class="animate-fade-up animate-delay-100 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-8">
          @if (p.description) {
            <p class="mb-6 text-[var(--text-muted)]">{{ p.description }}</p>
          }

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="hover-lift rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
              <p class="text-sm text-[var(--text-muted)]">Availability</p>
              <app-badge [value]="p.isAvailable ? 'Available' : 'Unavailable'" />
            </div>
            <div class="hover-lift rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] p-4">
              <p class="text-sm text-[var(--text-muted)]">Total bookings</p>
              <p class="font-semibold">{{ p.bookingsCount }}</p>
            </div>
          </div>

          <div class="mt-8 flex gap-3">
            <a routerLink="/member/book" class="hover-lift rounded-lg bg-[var(--brand)] px-5 py-3 font-bold text-white">Book this pitch</a>
          </div>
        </div>
      } @else {
        <p class="text-center text-[var(--text-muted)]">Loading pitch details...</p>
      }
    </section>
  `,
})
export class PitchDetailComponent {
  protected sportPitchImage = sportPitchImage;
  private route = inject(ActivatedRoute);
  private service = inject(PitchService);
  pitch = signal<PitchDto | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(id).subscribe({ next: (r) => this.pitch.set(r.data ?? null) });
  }
}
