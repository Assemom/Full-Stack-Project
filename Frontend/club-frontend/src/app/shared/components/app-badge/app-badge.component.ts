import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span class="inline-flex rounded px-2 py-1 text-xs font-semibold" [class]="classes()">{{ value() }}</span>`,
})
export class AppBadgeComponent {
  value = input.required<string | boolean | null | undefined>();

  classes = computed(() => {
    const value = String(this.value()).toLowerCase();
    if (['active', 'paid', 'confirmed', 'available', 'true'].includes(value)) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
    if (['pending'].includes(value)) return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
    if (['cancelled', 'expired', 'unavailable', 'false'].includes(value)) return 'bg-red-500/15 text-red-700 dark:text-red-300';
    return 'bg-slate-500/15 text-slate-700 dark:text-slate-300';
  });
}
