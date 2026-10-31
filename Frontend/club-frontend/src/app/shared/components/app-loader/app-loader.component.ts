import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="flex items-center gap-3 text-sm text-[var(--text-muted)]">
      <span class="h-4 w-4 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--brand)]"></span>
      <span>{{ label() }}</span>
    </div>
  `,
})
export class AppLoaderComponent {
  label = input('Loading');
}
