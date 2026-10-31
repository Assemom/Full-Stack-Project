import { Component, computed, input, output } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold' | 'icon';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button [type]="type()" class="club-focus inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60" [class]="classes()" [disabled]="disabled() || loading()" (click)="clicked.emit()">
      @if (loading()) {
        <span class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
      }
      <ng-content />
    </button>
  `,
})
export class AppButtonComponent {
  variant = input<ButtonVariant>('primary');
  disabled = input(false);
  loading = input(false);
  danger = input(false);
  type = input<string>('button');
  clicked = output<void>();

  classes = computed(() => {
    if (this.danger()) return 'bg-[var(--danger)] text-white hover:opacity-90';
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-[var(--brand)] text-white hover:bg-[var(--brand-strong)]',
      secondary: 'border border-[var(--line)] bg-[var(--surface-muted)] text-[var(--text)] hover:border-[var(--brand)]',
      ghost: 'text-[var(--text)] hover:bg-[var(--surface-muted)]',
      danger: 'bg-[var(--danger)] text-white hover:opacity-90',
      gold: 'bg-[var(--accent)] text-[#151714] hover:brightness-95',
      icon: 'h-9 w-9 border border-[var(--line)] bg-[var(--surface)] p-0 text-[var(--text)] hover:bg-[var(--surface-muted)]',
    };
    return variants[this.variant()];
  });
}
