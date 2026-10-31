import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PlanDto } from '../../../core/models/plan.model';
import { PlanService } from '../../../core/services/plan.service';
import { AuthService } from '../../../core/services/auth.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppBadgeComponent } from '../../../shared/components/app-badge/app-badge.component';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';

@Component({
  selector: 'app-plans-preview',
  standalone: true,
  imports: [RouterLink, AppBadgeComponent, MoneyPipe],
  template: `
    <!-- Hero -->
    <section class="relative flex h-64 items-end overflow-hidden">
      <img src="/footballteam.jpg" alt="" class="absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/75 to-black/20"></div>
      <div class="relative z-10 mx-auto w-full max-w-7xl px-4 py-10">
        <p class="animate-fade-up text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Membership</p>
        <h1 class="animate-fade-up animate-delay-100 mt-1 text-4xl font-black text-white">Plans</h1>
        <p class="animate-fade-up animate-delay-200 mt-2 max-w-xl text-white/70">Choose the perfect plan for your sport journey.</p>
      </div>
    </section>

    <!-- List -->
    <section class="mx-auto max-w-7xl px-4 py-10">
      <div class="grid gap-6 md:grid-cols-3">
        @for (plan of plans(); track plan.id; let i = $index) {
          <article class="animate-fade-up hover-lift rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 hover:border-[var(--brand)]" [class.animate-delay-100]="i===1" [class.animate-delay-200]="i===2">
            <div class="flex items-start justify-between gap-3">
              <h2 class="text-xl font-black">{{ plan.name }}</h2>
              <app-badge [value]="plan.isActive ? 'Active' : 'Inactive'" />
            </div>
            <p class="mt-4 text-4xl font-black text-[var(--brand)]">{{ plan.price | money }}</p>
            <p class="text-sm text-[var(--text-muted)]">{{ plan.type }} · {{ plan.durationMonths }} month{{ plan.durationMonths > 1 ? 's' : '' }}</p>
            <p class="mt-2 text-sm text-[var(--text-muted)]">{{ plan.subscriptionsCount }} subscriber{{ plan.subscriptionsCount !== 1 ? 's' : '' }}</p>
            <div class="mt-6">
              @if (auth.isAuthenticated() && auth.currentRole() === 'Member') {
                <button (click)="subscribe(plan)" [disabled]="submitting()" class="w-full rounded-lg bg-[var(--brand)] px-4 py-2.5 font-bold text-white transition hover:brightness-110 disabled:opacity-50">Subscribe</button>
              } @else if (!auth.isAuthenticated()) {
                <a routerLink="/auth/login" class="block w-full rounded-lg border border-[var(--line)] px-4 py-2.5 text-center font-bold transition hover:border-[var(--brand)] hover:bg-[var(--surface-muted)]">Login to subscribe</a>
              }
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class PlansPreviewComponent {
  protected auth = inject(AuthService);
  private router = inject(Router);
  private service = inject(PlanService);
  private subscriptions = inject(SubscriptionService);
  private toast = inject(ToastService);
  plans = signal<PlanDto[]>([]);
  submitting = signal(false);

  constructor() {
    this.service.getAll().subscribe({ next: (r) => this.plans.set(r.data ?? []) });
  }

  subscribe(plan: PlanDto): void {
    const memberId = this.auth.currentMemberId();
    if (!memberId) {
      this.toast.error('Member profile not found. Contact support.');
      return;
    }

    this.submitting.set(true);
    this.subscriptions.create({
      memberId,
      planId: plan.id,
      startDate: new Date().toISOString().split('T')[0],
      amountPaid: plan.price,
      status: 'Pending',
      paymentStatus: 'Pending',
    }).subscribe({
      next: (r) => {
        this.toast.fromApi(r, 'Subscription created');
        this.submitting.set(false);
        if (r.success) {
          this.router.navigate(['/member/subscriptions']);
        }
      },
      error: () => this.submitting.set(false),
    });
  }
}
