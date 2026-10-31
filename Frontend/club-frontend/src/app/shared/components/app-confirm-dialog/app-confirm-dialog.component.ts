import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" (click)="cancel.emit()">
        <section class="club-surface w-full max-w-md p-5 shadow-xl" (click)="$event.stopPropagation()">
          <h2 class="text-lg font-bold">{{ title() }}</h2>
          <p class="mt-2 text-sm text-[var(--text-muted)]">{{ message() }}</p>
          <div class="mt-5 flex justify-end gap-3">
            <button type="button" class="club-focus rounded border border-[var(--line)] px-4 py-2 text-sm font-semibold" (click)="cancel.emit()">{{ cancelText() }}</button>
            <button type="button" class="club-focus rounded px-4 py-2 text-sm font-semibold text-white" [class]="confirmClass()" (click)="confirm.emit()">{{ confirmText() }}</button>
          </div>
        </section>
      </div>
    }
  `,
})
export class AppConfirmDialogComponent {
  open = input(false);
  title = input('Are you sure?');
  message = input('This action cannot be undone.');
  confirmText = input('Confirm');
  cancelText = input('Cancel');
  kind = input<'danger' | 'primary'>('danger');
  confirm = output<void>();
  cancel = output<void>();

  confirmClass(): string {
    return this.kind() === 'danger'
      ? 'bg-[var(--danger)] hover:opacity-90'
      : 'bg-[var(--brand)] hover:bg-[var(--brand-strong)]';
  }
}
