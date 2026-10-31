import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideBell, LucideMenu } from '@lucide/angular';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { ScrollTopComponent } from '../../shared/components/scroll-top/scroll-top.component';
import { avatarColor, avatarInitial } from '../../core/utils/avatar.util';

interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggleComponent, LucideMenu, LucideBell, ScrollTopComponent],
  template: `
    <div class="min-h-screen bg-[var(--bg)] text-[var(--text)] lg:grid lg:grid-cols-[250px_1fr]">
      <!-- Sidebar (desktop) / Drawer (mobile) -->
      @if (mobileOpen()) {
        <div class="fixed inset-0 z-40 bg-black/45 lg:hidden" (click)="mobileOpen.set(false)"></div>
      }
      <aside
        class="fixed inset-y-0 left-0 z-50 w-[250px] -translate-x-full border-r border-[var(--line)] bg-[var(--surface)] transition-transform lg:static lg:z-auto lg:translate-x-0"
        [class.translate-x-0]="mobileOpen()"
      >
        <div class="flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-4">
          <a [routerLink]="auth.homeRoute()" class="font-black">Sport<span class="text-[var(--brand)]">Club</span></a>
          <button type="button" class="club-focus rounded px-2 py-1 text-xl lg:hidden" (click)="mobileOpen.set(false)">×</button>
        </div>
        <nav class="grid gap-1 px-3 py-3">
          @for (item of navItems(); track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-[var(--brand)] text-white"
              class="club-focus rounded px-3 py-2 text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
              (click)="mobileOpen.set(false)"
            >
              {{ item.label }}
            </a>
          }
        </nav>
      </aside>

      <main class="flex min-w-0 flex-col pb-16 lg:pb-0">
        <header class="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] px-4 py-3">
          <div class="flex items-center gap-3">
            <button type="button" class="club-focus rounded px-2 py-1 lg:hidden" (click)="mobileOpen.set(true)"><svg lucideMenu size="22"></svg></button>
            @let user = auth.currentUser();
            <div class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-sm font-bold text-white" [style.background]="avatarColor(user?.username || user?.email || '')">
              @if (user?.username || user?.email) {
                {{ avatarInitial(user?.username || user?.email || '') }}
              } @else {
                <svg lucideMenu size="14"></svg>
              }
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.14em] text-[var(--brand)]">{{ auth.currentRole() }} workspace</p>
              <p class="font-semibold">{{ user?.email || user?.username || 'Signed in' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <app-theme-toggle />
            <button type="button" (click)="notification.markAllRead()" class="club-focus relative rounded p-2 text-[var(--text-muted)] hover:bg-[var(--surface-muted)]">
              <svg lucideBell size="18"></svg>
              @if (notification.unreadCount() > 0) {
                <span class="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{{ notification.unreadCount() }}</span>
              }
            </button>
            <button type="button" class="club-focus hidden rounded border border-[var(--line)] px-3 py-2 text-sm font-semibold sm:inline-block" (click)="auth.logout()">Logout</button>
          </div>
        </header>

        <section class="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
          <router-outlet />
        </section>
      </main>

      <app-scroll-top />

      <!-- Bottom nav (mobile) -->
      <nav class="fixed bottom-0 z-30 flex w-full overflow-auto border-t border-[var(--line)] bg-[var(--surface)] lg:hidden">
        @for (item of navItems().slice(0, 5); track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="text-[var(--brand)]"
            class="flex shrink-0 flex-col items-center gap-0.5 px-3 py-2 text-xs font-semibold text-[var(--text-muted)]"
          >
            {{ item.label }}
          </a>
        }
      </nav>
    </div>
  `,
})
export class DashboardLayoutComponent implements OnInit {
  auth = inject(AuthService);
  notification = inject(NotificationService);
  mobileOpen = signal(false);
  protected avatarColor = avatarColor;
  protected avatarInitial = avatarInitial;

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.notification.start();
    }
  }

  navItems = computed<NavItem[]>(() => {
    const role = this.auth.currentRole();
    if (role === 'Admin') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard' },
        { label: 'Coaches', path: '/admin/coaches' },
        { label: 'Members', path: '/admin/members' },
        { label: 'Teams', path: '/admin/teams' },
        { label: 'Plans', path: '/admin/plans' },
        { label: 'Pitches', path: '/admin/pitches' },
        { label: 'Subscriptions', path: '/admin/subscriptions' },
        { label: 'Bookings', path: '/admin/bookings' },
        { label: 'Activities', path: '/admin/activities' },
        { label: 'Join Requests', path: '/admin/join-requests' },
        { label: 'Users', path: '/admin/users' },
      ];
    }

    if (role === 'Coach') {
      return [
        { label: 'Dashboard', path: '/coach/dashboard' },
        { label: 'Profile', path: '/coach/profile' },
        { label: 'Activities', path: '/coach/activities' },
        { label: 'Bookings', path: '/coach/bookings' },
        { label: 'Teams', path: '/coach/teams' },
        { label: 'Join Requests', path: '/coach/join-requests' },
      ];
    }

    return [
      { label: 'Dashboard', path: '/member/dashboard' },
      { label: 'Profile', path: '/member/profile' },
      { label: 'Book Pitch', path: '/member/book' },
      { label: 'Bookings', path: '/member/bookings' },
      { label: 'Subscriptions', path: '/member/subscriptions' },
      { label: 'Activities', path: '/member/activities' },
      { label: 'Teams', path: '/member/teams' },
      { label: 'Join Requests', path: '/member/join-requests' },
    ];
  });
}
