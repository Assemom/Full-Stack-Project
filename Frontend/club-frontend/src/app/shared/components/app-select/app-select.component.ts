import { Component, input } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string | number | boolean | null;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <label class="grid gap-1.5 text-sm">
      <span class="font-medium text-[var(--text)]">{{ label() }}</span>
      <select class="club-focus w-full rounded border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--text)]" [formControl]="control()">
        @if (placeholder()) {
          <option [ngValue]="null">{{ placeholder() }}</option>
        }
        @for (option of options(); track option.label) {
          <option [ngValue]="option.value">{{ option.label }}</option>
        }
      </select>
      @if (error()) {
        <span class="text-xs text-[var(--danger)]">{{ error() }}</span>
      }
    </label>
  `,
})
export class AppSelectComponent {
  label = input.required<string>();
  placeholder = input('');
  options = input<SelectOption[]>([]);
  error = input<string | null>(null);
  control = input.required<FormControl>();
}
