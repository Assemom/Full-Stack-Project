import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    @if (totalPages() > 1) {
      <nav class="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-4">
        <p class="text-sm text-[var(--text-muted)]">
          Showing page {{ page() }} of {{ totalPages() }}
          &middot; {{ totalCount() }} total
        </p>
        <div class="flex items-center gap-1">
          <button
            type="button"
            (click)="goTo(page() - 1)"
            [disabled]="page() <= 1"
            class="flex h-8 w-8 items-center justify-center rounded text-sm font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            &lsaquo;
          </button>

          @for (p of visiblePages(); track p) {
            @if (p === '...') {
              <span class="flex h-8 w-8 items-center justify-center text-sm text-[var(--text-muted)]">&hellip;</span>
            } @else {
              <button
                type="button"
                (click)="goTo(+p)"
                class="flex h-8 w-8 items-center justify-center rounded text-sm font-medium transition"
                [class.bg-[var(--brand)]!]="+p === page()"
                [class.text-white]="+p === page()"
                [class.text-[var(--text-muted)]]="+p !== page()"
                [class.hover:bg-[var(--surface-muted)]]="+p !== page()"
              >
                {{ p }}
              </button>
            }
          }

          <button
            type="button"
            (click)="goTo(page() + 1)"
            [disabled]="page() >= totalPages()"
            class="flex h-8 w-8 items-center justify-center rounded text-sm font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            &rsaquo;
          </button>
        </div>
      </nav>
    }
  `,
})
export class AppPaginationComponent {
  page = input.required<number>();
  pageSize = input.required<number>();
  totalCount = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.page();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (current > 3) pages.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push('...');

    pages.push(total);

    return pages;
  });

  goTo(p: number): void {
    if (p < 1 || p > this.totalPages() || p === this.page()) return;
    this.pageChange.emit(p);
  }
}
