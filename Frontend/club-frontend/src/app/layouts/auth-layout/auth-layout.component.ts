import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ThemeToggleComponent],
  template: `
    <main class="grid min-h-screen bg-[var(--bg)] text-[var(--text)] lg:grid-cols-[0.9fr_1.1fr]">
      <section class="hidden bg-[#075c48] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <a routerLink="/" class="text-xl font-black">Sport<span class="text-[var(--accent)]">Club</span></a>
        <div>
          <p class="text-sm uppercase tracking-[0.18em] text-white/70">Your sports club</p>
          <h1 class="mt-4 max-w-xl text-5xl font-black leading-tight">Book smarter. Train better. Run the club without chaos.</h1>
        </div>
        <p class="text-sm text-white/70">Everything your club needs — members, coaches, bookings, and activities in one place.</p>
      </section>
      <section class="flex min-h-screen flex-col">
        <div class="flex items-center justify-between p-4">
          <a routerLink="/" class="font-black lg:hidden">Sport<span class="text-[var(--brand)]">Club</span></a>
          <app-theme-toggle />
        </div>
        <div class="mx-auto grid w-full flex-1 place-items-center px-8 py-8">
          <router-outlet />
        </div>
      </section>
    </main>
  `,
})
export class AuthLayoutComponent {}
