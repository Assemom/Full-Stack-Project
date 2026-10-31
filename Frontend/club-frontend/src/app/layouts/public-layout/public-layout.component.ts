import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggleComponent],
  template: `
    <div class="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <nav class="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/92 backdrop-blur">
        <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <a routerLink="/" class="text-lg font-black">Sport<span class="text-[var(--brand)]">Club</span></a>
          <div class="hidden items-center gap-5 text-sm font-semibold md:flex">
            <a routerLink="/plans" routerLinkActive="text-[var(--brand)]">Plans</a>
            <a routerLink="/coaches" routerLinkActive="text-[var(--brand)]">Coaches</a>
            <a routerLink="/activities" routerLinkActive="text-[var(--brand)]">Activities</a>
            <a routerLink="/teams" routerLinkActive="text-[var(--brand)]">Teams</a>
            <a routerLink="/pitches" routerLinkActive="text-[var(--brand)]">Pitches</a>
            @if (auth.isAuthenticated() && auth.currentRole() === 'Member') {
              <a routerLink="/member/book" class="text-[var(--brand)]">Book a pitch</a>
            }
            @if (auth.isAuthenticated() && auth.currentRole() === 'Admin') {
              <a routerLink="/admin/dashboard" class="text-[var(--brand)]">Dashboard</a>
            }
            @if (auth.isAuthenticated() && auth.currentRole() === 'Coach') {
              <a routerLink="/coach/dashboard" class="text-[var(--brand)]">Dashboard</a>
            }
          </div>
          <div class="flex items-center gap-2">
            <app-theme-toggle />
            @if (auth.isAuthenticated()) {
              <button (click)="auth.logout()" class="club-focus rounded bg-[var(--danger)] px-3 py-2 text-sm font-bold text-white">Logout</button>
            } @else {
              <a routerLink="/auth/login" class="club-focus rounded px-3 py-2 text-sm font-semibold hover:bg-[var(--surface-muted)]">Login</a>
              <a routerLink="/auth/register" class="club-focus rounded bg-[var(--accent)] px-3 py-2 text-sm font-bold text-[#151714]">Join</a>
            }
          </div>
        </div>
      </nav>
      <router-outlet />
      <footer class="mt-16 border-t border-[var(--line)] bg-[var(--surface-muted)]/50">
        <div class="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
          <div>
            <p class="text-lg font-black">Sport<span class="text-[var(--brand)]">Club</span></p>
            <p class="mt-2 text-sm text-[var(--text-muted)]">Book pitches, join teams, play more. Your club, simplified.</p>
          </div>
          <div>
            <p class="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Quick links</p>
            <div class="flex flex-col gap-2 text-sm">
              <a routerLink="/plans" class="hover:text-[var(--brand)]">Plans</a>
              <a routerLink="/coaches" class="hover:text-[var(--brand)]">Coaches</a>
              <a routerLink="/activities" class="hover:text-[var(--brand)]">Activities</a>
              <a routerLink="/teams" class="hover:text-[var(--brand)]">Teams</a>
            </div>
          </div>
          <div>
            <p class="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Hours</p>
            <div class="text-sm text-[var(--text-muted)]">
              <p>Mon–Fri: 6 AM – 10 PM</p>
              <p>Sat: 7 AM – 9 PM</p>
              <p>Sun: 8 AM – 6 PM</p>
            </div>
          </div>
          <div>
            <p class="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Contact</p>
            <div class="text-sm text-[var(--text-muted)]">
              <p>42 Sports Avenue</p>
              <p>New York, NY 10001</p>
              <p class="mt-2">+1 (555) 123-4567</p>
              <p>hello&#64;sportclub.com</p>
            </div>
          </div>
        </div>
        <div class="border-t border-[var(--line)] py-4 text-center text-sm text-[var(--text-muted)]">
          &copy; 2026 Sport Club. All rights reserved.
        </div>
      </footer>
    </div>
  `,
})
export class PublicLayoutComponent {
  protected auth = inject(AuthService);
}
