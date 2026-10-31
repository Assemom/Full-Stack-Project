import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat',
  standalone: true,
  template: `
    <article class="club-surface p-4">
      <p class="text-sm text-[var(--text-muted)]">{{ label() }}</p>
      <strong class="mt-2 block text-2xl">{{ value() }}</strong>
      @if (detail()) {
        <span class="text-xs text-[var(--text-muted)]">{{ detail() }}</span>
      }
    </article>
  `,
})
export class AppStatComponent {
  label = input.required<string>();
  value = input.required<string | number>();
  detail = input('');
}
