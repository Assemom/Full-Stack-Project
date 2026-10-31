import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" (click)="close.emit()">
        <section class="club-surface max-h-[90vh] w-full max-w-2xl overflow-auto p-5 shadow-xl" (click)="$event.stopPropagation()">
          <div class="mb-4 flex items-center justify-between gap-4">
            <h2 class="text-lg font-bold">{{ title() }}</h2>
            <button type="button" class="club-focus rounded px-2 py-1 text-xl" (click)="close.emit()" aria-label="Close dialog">×</button>
          </div>
          <ng-content />
        </section>
      </div>
    }
  `,
})
export class AppDialogComponent {
  open = input(false);
  title = input('');
  close = output<void>();
}
