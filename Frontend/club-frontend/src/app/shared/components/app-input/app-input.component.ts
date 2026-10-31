import { Component, input, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <label class="grid gap-1.5 text-sm">
      @if (label()) {
        <span class="font-medium text-[var(--text)]">{{ label() }}</span>
      }
      <div class="relative">
        @if (icon()) {
          <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">{{ icon() }}</span>
        }
        <input
          class="club-focus w-full rounded border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--text-muted)]"
          [class.pl-9]="!!icon()"
          [class.pr-10]="type() === 'password'"
          [type]="showPassword() ? 'text' : type()"
          [placeholder]="placeholder()"
          [formControl]="control()"
        />
        @if (type() === 'password') {
          <button type="button" class="club-focus absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-sm text-[var(--text-muted)] hover:text-[var(--text)]" (click)="showPassword.set(!showPassword())">
            {{ showPassword() ? 'Hide' : 'Show' }}
          </button>
        }
      </div>
      @if (hint() && !error()) {
        <span class="text-xs text-[var(--text-muted)]">{{ hint() }}</span>
      }
      @if (error()) {
        <span class="text-xs text-[var(--danger)]">{{ error() }}</span>
      }
    </label>
  `,
})
export class AppInputComponent {
  label = input('');
  placeholder = input('');
  type = input('text');
  icon = input('');
  hint = input('');
  error = input<string | null>(null);
  control = input.required<FormControl>();
  showPassword = signal(false);
}
