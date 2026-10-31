import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PitchDto } from '../../../core/models/pitch.model';
import { PitchService } from '../../../core/services/pitch.service';
import { AppBadgeComponent } from '../../../shared/components/app-badge/app-badge.component';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';
import { sportPitchImage } from '../../../core/utils/sport-image.util';

@Component({
  selector: 'app-pitches-list',
  standalone: true,
  imports: [RouterLink, AppBadgeComponent, MoneyPipe],
  template: `
    <!-- Hero -->
    <section class="relative flex h-64 items-end overflow-hidden">
      <img src="/pool.jpg" alt="" class="absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/75 to-black/20"></div>
      <div class="relative z-10 mx-auto w-full max-w-7xl px-4 py-10">
        <p class="animate-fade-up text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Facilities</p>
        <h1 class="animate-fade-up animate-delay-100 mt-1 text-4xl font-black text-white">Pitches</h1>
        <p class="animate-fade-up animate-delay-200 mt-2 max-w-xl text-white/70">Browse our available pitches and courts.</p>
      </div>
    </section>

    <!-- List -->
    <section class="mx-auto max-w-7xl px-4 py-10">
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        @for (p of pitches(); track p.id; let i = $index) {
          <a [routerLink]="['/pitches', p.id]" class="animate-fade-up hover-lift group relative flex h-56 items-end overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]" [class.animate-delay-100]="i===1" [class.animate-delay-200]="i===2" [class.animate-delay-300]="i>=3">
            <img [src]="sportPitchImage(p.type)" alt="" class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="relative z-10 w-full p-5">
              <div class="flex items-center justify-between gap-3">
                <h3 class="font-bold text-white">Pitch {{ p.number }}</h3>
                <app-badge [value]="p.isAvailable ? 'Available' : 'Unavailable'" />
              </div>
              <p class="mt-1 text-sm font-semibold text-[var(--brand)]">{{ p.type }}</p>
              <p class="mt-2 text-lg font-black text-white">{{ p.pricePerHour | money }}<span class="text-sm font-normal text-white/50"> / hour</span></p>
              @if (p.description) {
                <p class="mt-1 text-xs text-white/50 line-clamp-2">{{ p.description }}</p>
              }
            </div>
          </a>
        } @empty {
          <p class="col-span-full py-20 text-center text-[var(--text-muted)]">No pitches available.</p>
        }
      </div>
    </section>
  `,
})
export class PitchesListComponent {
  protected sportPitchImage = sportPitchImage;
  private service = inject(PitchService);
  pitches = signal<PitchDto[]>([]);

  constructor() {
    this.service.getAll().subscribe({ next: (r) => this.pitches.set(r.data ?? []) });
  }
}
