import { Component, input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <label class="grid gap-1.5 text-sm">
      <span class="font-medium text-[var(--text)]">{{ label() }}</span>
      <textarea
        class="club-focus w-full resize-y rounded border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--text-muted)]"
        [placeholder]="placeholder()"
        [rows]="rows()"
        [formControl]="control()"
      ></textarea>
      @if (hint() && !error()) {
        <span class="text-xs text-[var(--text-muted)]">{{ hint() }}</span>
      }
      @if (error()) {
        <span class="text-xs text-[var(--danger)]">{{ error() }}</span>
      }
    </label>
  `,
})
export class AppTextareaComponent {
  label = input.required<string>();
  placeholder = input('');
  rows = input(3);
  hint = input('');
  error = input<string | null>(null);
  control = input.required<FormControl>();
}
