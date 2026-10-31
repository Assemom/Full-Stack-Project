import { LowerCasePipe } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { AppEmptyStateComponent } from '../app-empty-state/app-empty-state.component';
import { AppButtonComponent } from '../app-button/app-button.component';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: Record<string, unknown>) => string;
  badge?: boolean;
  hideOnMobile?: boolean;
}

export interface TableAction {
  label: string;
  icon?: string;
  kind?: 'icon' | 'text';
  danger?: boolean;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [AppEmptyStateComponent, AppButtonComponent, LowerCasePipe],
  template: `
    @if (searchable()) {
      <div class="relative mb-3">
        <input
          class="club-focus w-full rounded border border-[var(--line)] bg-[var(--surface)] px-3 py-2 pl-9 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
          placeholder="Search {{ title() | lowercase }}"
          (input)="updateSearch($any($event.target).value)"
        />
        <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/></svg>
      </div>
    }

    <div class="club-surface overflow-auto">
      @if (loading()) {
        <div class="grid gap-3 p-4">
          @for (row of [1,2,3,4]; track row) {
            <div class="flex animate-pulse gap-3">
              @for (col of columns(); track col.key) {
                <div class="h-5 flex-1 rounded bg-[var(--surface-muted)]"></div>
              }
            </div>
          }
        </div>
      } @else if (filteredData().length === 0) {
        <app-empty-state [title]="emptyTitle()" [message]="emptyMessage()" />
      } @else {
        <!-- Desktop table -->
        <table class="hidden w-full text-sm sm:table">
          <thead>
            <tr class="border-b border-[var(--line)] text-left">
              @for (col of columns(); track col.key) {
                <th
                  class="p-3 font-semibold text-[var(--text-muted)]"
                  [class.cursor-pointer]="col.sortable" [class.select-none]="col.sortable"
                  [class.hidden]="col.hideOnMobile"
                  (click)="col.sortable && toggleSort(col.key)"
                >
                  {{ col.label }}
                  @if (sortKey() === col.key) {
                    <span class="ml-1">{{ sortDir() === 'asc' ? '▲' : '▼' }}</span>
                  }
                </th>
              }
              @if (actions().length) {
                <th class="p-3 text-right font-semibold text-[var(--text-muted)]">Actions</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of filteredData(); track row) {
              <tr class="border-b border-[var(--line)] last:border-0 hover:bg-[var(--surface-muted)]">
                @for (col of columns(); track col.key) {
                  <td class="p-3" [class.hidden]="col.hideOnMobile" [class.font-semibold]="$first">
                    @if (col.render) {
                      {{ col.render(row[col.key], row) }}
                    } @else if (col.badge) {
                      <span class="inline-flex rounded px-2 py-1 text-xs font-semibold" [class]="badgeClass(String(row[col.key]))">{{ row[col.key] }}</span>
                    } @else {
                      {{ row[col.key] ?? '-' }}
                    }
                  </td>
                }
                @if (actions().length) {
                  <td class="p-3 text-right">
                    <div class="flex justify-end gap-1">
                      @for (action of actions(); track action.label) {
                        <app-button [variant]="action.danger ? 'danger' : 'icon'" (clicked)="actionRow.emit({ action: action.label, row })">{{ action.label }}</app-button>
                      }
                    </div>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>

        <!-- Mobile card view -->
        <div class="sm:hidden">
          @for (row of filteredData(); track row) {
            <div class="border-b border-[var(--line)] p-4 last:border-0">
              @for (col of columns(); track col.key) {
                <div class="flex items-center justify-between py-1">
                  <span class="text-xs font-medium text-[var(--text-muted)]">{{ col.label }}</span>
                  <span class="text-sm text-right">
                    @if (col.render) {
                      {{ col.render(row[col.key], row) }}
                    } @else if (col.badge) {
                      <span class="inline-flex rounded px-2 py-0.5 text-xs font-semibold" [class]="badgeClass(String(row[col.key]))">{{ row[col.key] }}</span>
                    } @else {
                      {{ row[col.key] ?? '-' }}
                    }
                  </span>
                </div>
              }
              @if (actions().length) {
                <div class="mt-2 flex justify-end gap-2 border-t border-[var(--line)] pt-2">
                  @for (action of actions(); track action.label) {
                    <app-button [variant]="action.danger ? 'danger' : 'icon'" (clicked)="actionRow.emit({ action: action.label, row })">{{ action.label }}</app-button>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AppTableComponent {
  columns = input.required<TableColumn[]>();
  data = input.required<Record<string, unknown>[]>();
  loading = input(false);
  searchable = input(false);
  title = input('');
  emptyTitle = input('Nothing here yet');
  emptyMessage = input('No data matches your criteria.');
  actions = input<TableAction[]>([]);
  actionRow = output<{ action: string; row: Record<string, unknown> }>();

  private searchQuery = signal('');
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  sortKey = signal('');
  sortDir = signal<'asc' | 'desc'>('asc');

  filteredData = computed(() => {
    let items = this.data();
    const query = this.searchQuery().toLowerCase();
    if (query) {
      items = items.filter((row) =>
        Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(query)),
      );
    }
    const key = this.sortKey();
    if (key) {
      items = [...items].sort((a, b) => {
        const av = String(a[key] ?? '');
        const bv = String(b[key] ?? '');
        const cmp = av.localeCompare(bv, undefined, { numeric: true });
        return this.sortDir() === 'asc' ? cmp : -cmp;
      });
    }
    return items;
  });

  toggleSort(key: string) {
    if (this.sortKey() === key) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }

  updateSearch(value: string) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.searchQuery.set(value), 250);
  }

  badgeClass(value: string): string {
    const v = value.toLowerCase();
    if (['active', 'paid', 'confirmed', 'available', 'true'].includes(v)) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
    if (['pending'].includes(v)) return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
    if (['cancelled', 'expired', 'unavailable', 'false'].includes(v)) return 'bg-red-500/15 text-red-700 dark:text-red-300';
    if (['inactive'].includes(v)) return 'bg-slate-500/15 text-slate-700 dark:text-slate-300';
    return 'bg-slate-500/15 text-slate-700 dark:text-slate-300';
  }

  String(v: unknown): string {
    return String(v ?? '');
  }
}
