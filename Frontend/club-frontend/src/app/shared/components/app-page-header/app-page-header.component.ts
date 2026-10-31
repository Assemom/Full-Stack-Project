import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <header class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--brand)]">{{ eyebrow() }}</p>
        <h1 class="text-2xl font-bold md:text-3xl">{{ title() }}</h1>
        @if (description()) {
          <p class="mt-1 max-w-3xl text-sm text-[var(--text-muted)]">{{ description() }}</p>
        }
      </div>
      <ng-content />
    </header>
  `,
})
export class AppPageHeaderComponent {
  eyebrow = input('Club');
  title = input.required<string>();
  description = input('');
}
