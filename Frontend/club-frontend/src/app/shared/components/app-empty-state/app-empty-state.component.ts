import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="club-surface grid gap-2 p-6 text-center">
      <h3 class="font-semibold">{{ title() }}</h3>
      <p class="text-sm text-[var(--text-muted)]">{{ message() }}</p>
    </div>
  `,
})
export class AppEmptyStateComponent {
  title = input('Nothing here yet');
  message = input('When backend data is available, it will show up here.');
}
