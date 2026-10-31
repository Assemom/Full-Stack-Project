import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SubscriptionDto } from '../../../core/models/subscription.model';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppBadgeComponent } from '../../../shared/components/app-badge/app-badge.component';

import { AppConfirmDialogComponent } from '../../../shared/components/app-confirm-dialog/app-confirm-dialog.component';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';

@Component({
  selector: 'app-my-subscriptions',
  standalone: true,
  imports: [AppPageHeaderComponent, AppBadgeComponent, AppConfirmDialogComponent, MoneyPipe, DatePipe, RouterLink],
  template: `
    <app-page-header title="My subscriptions" eyebrow="Member" description="Manage your active and past subscriptions." />

    @if (loading()) {
      <div class="flex justify-center py-20">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    } @else if (items().length === 0) {
      <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface)] py-20">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand)]/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[var(--brand)]" fill="none" viewBox="0 0 24 24" stroke="currentcolor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-6-6h12" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-[var(--text)]">No subscriptions yet</h3>
        <p class="mt-1 text-sm text-[var(--text-muted)]">Subscribe to a plan and start your sport journey.</p>
        <a routerLink="/plans" class="mt-4 inline-block rounded-lg bg-[var(--brand)] px-6 py-2.5 font-bold text-white transition hover:brightness-110">Browse plans</a>
      </div>
    } @else {
      <div class="mb-5 flex items-center justify-between">
        <p class="text-sm text-[var(--text-muted)]">{{ items().length }} subscription{{ items().length !== 1 ? 's' : '' }}</p>
        <a routerLink="/plans" class="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-bold text-white transition hover:brightness-110">+ Subscribe to new plan</a>
      </div>

      <div class="grid gap-5 md:grid-cols-2">
        @for (item of items(); track item.id) {
          <div class="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 transition-shadow hover:shadow-md">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-lg font-bold text-[var(--text)]">{{ item.planName }}</h3>
                <p class="text-sm text-[var(--text-muted)]">{{ item.planType }} &middot; {{ item.durationMonths }} month{{ item.durationMonths > 1 ? 's' : '' }}</p>
              </div>
              <div class="flex shrink-0 gap-1.5">
                <app-badge [value]="item.status" />
                <app-badge [value]="item.paymentStatus" />
              </div>
            </div>

            <div class="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-[var(--surface-muted)] p-3 text-center text-sm">
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Start</p>
                <p class="mt-0.5 font-semibold text-[var(--text)]">{{ item.startDate | date:'mediumDate' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">End</p>
                <p class="mt-0.5 font-semibold text-[var(--text)]">{{ item.endDate | date:'mediumDate' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Amount</p>
                <p class="mt-0.5 font-semibold text-[var(--brand)]">{{ item.amountPaid | money }}</p>
              </div>
            </div>

            <div class="mt-4">
              @if (item.status === 'Active' || item.status === 'Pending') {
                <button (click)="confirmCancel.set(item.id)" class="club-focus w-full rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--danger)] hover:text-[var(--danger)]">Cancel subscription</button>
              }
            </div>
          </div>
        }
      </div>
    }

    <app-confirm-dialog
      [open]="showConfirm()"
      title="Cancel subscription?"
      message="Are you sure you want to cancel this subscription? You will lose access to the plan at the end of the current billing period."
      confirmText="Cancel subscription"
      (confirm)="cancel()"
      (cancel)="showConfirm.set(false)"
    />
  `,
})
export class MySubscriptionsComponent {
  private service = inject(SubscriptionService);
  private toast = inject(ToastService);
  private router = inject(Router);
  items = signal<SubscriptionDto[]>([]);
  loading = signal(true);
  showConfirm = signal(false);
  confirmCancel = signal<number | null>(null);

  constructor() {
    this.service.getMine().subscribe({
      next: (r) => { this.items.set(r.data ?? []); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  cancel(): void {
    const id = this.confirmCancel();
    if (!id) return;
    this.service.update(id, { status: 'Inactive' }).subscribe({
      next: (r) => {
        this.toast.fromApi(r, 'Subscription cancelled');
        this.showConfirm.set(false);
        this.confirmCancel.set(null);
        if (r.success) {
          this.items.update((list) => list.map((s) => s.id === id ? { ...s, status: 'Inactive' as const } : s));
        }
      },
      error: () => { this.showConfirm.set(false); this.confirmCancel.set(null); },
    });
  }
}
