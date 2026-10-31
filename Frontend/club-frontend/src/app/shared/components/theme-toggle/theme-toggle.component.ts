import { Component, inject } from '@angular/core';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [LucideMoon, LucideSun],
  template: `
    <button
      type="button"
      class="club-focus inline-flex h-10 w-10 items-center justify-center rounded border border-[var(--line)] bg-[var(--surface)] text-[var(--text)]"
      [attr.aria-label]="theme.theme() === 'dark' ? 'Use light mode' : 'Use dark mode'"
      title="Toggle theme"
      (click)="theme.toggle()"
    >
      @if (theme.theme() === 'dark') {
        <svg lucideMoon size="18"></svg>
      } @else {
        <svg lucideSun size="18"></svg>
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  theme = inject(ThemeService);
}
