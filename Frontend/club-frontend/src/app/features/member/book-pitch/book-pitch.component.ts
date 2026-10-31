import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PitchDto } from '../../../core/models/pitch.model';
import { AuthService } from '../../../core/services/auth.service';
import { BookingService } from '../../../core/services/booking.service';
import { PitchService } from '../../../core/services/pitch.service';
import { ToastService } from '../../../core/services/toast.service';
import { hoursBetween, isFutureOrToday } from '../../../core/utils/date-time.util';
import { AppPageHeaderComponent } from '../../../shared/components/app-page-header/app-page-header.component';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';

@Component({
  selector: 'app-book-pitch',
  standalone: true,
  imports: [ReactiveFormsModule, AppPageHeaderComponent, MoneyPipe],
  template: `
    <app-page-header title="Book a pitch" eyebrow="Member" description="Book a pitch for yourself." />
    <form class="club-surface grid gap-4 p-4 md:grid-cols-2" [formGroup]="form" (ngSubmit)="submit()">
      <select class="club-focus rounded border border-[var(--line)] bg-[var(--surface)] px-3 py-2" formControlName="pitchId">
        <option [ngValue]="0">Select pitch</option>
        @for (pitch of pitches(); track pitch.id) {
          <option [ngValue]="pitch.id">Pitch {{ pitch.number }} · {{ pitch.type }} · {{ pitch.pricePerHour | money }}/hour</option>
        }
      </select>
      <input class="club-focus rounded border border-[var(--line)] bg-[var(--surface)] px-3 py-2" type="date" formControlName="date" />
      <input class="club-focus rounded border border-[var(--line)] bg-[var(--surface)] px-3 py-2" type="time" formControlName="startTime" />
      <input class="club-focus rounded border border-[var(--line)] bg-[var(--surface)] px-3 py-2" type="time" formControlName="endTime" />
      @if (!auth.currentMemberId()) {
        <input class="club-focus rounded border border-[var(--line)] bg-[var(--surface)] px-3 py-2" type="number" placeholder="Member id" formControlName="memberId" />
      }
      <div class="flex items-center justify-between rounded bg-[var(--surface-muted)] px-3 py-2">
        <span class="text-sm text-[var(--text-muted)]">Estimated price</span>
        <strong>{{ estimatedPrice() | money }}</strong>
      </div>
      <button type="submit" class="club-focus rounded bg-[var(--brand)] px-4 py-3 font-bold text-white md:col-span-2" [disabled]="form.invalid">Confirm booking</button>
    </form>
  `,
})
export class BookPitchComponent {
  protected auth = inject(AuthService);
  private pitchesService = inject(PitchService);
  private bookings = inject(BookingService);
  private toast = inject(ToastService);
  pitches = signal<PitchDto[]>([]);
  form = new FormGroup({
    pitchId: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    date: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    startTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    endTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    memberId: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
  });

  constructor() {
    this.pitchesService.getAll().subscribe((r) => this.pitches.set((r.data ?? []).filter((p) => p.isAvailable)));
    effect(() => {
      const mid = this.auth.currentMemberId();
      if (mid != null) {
        this.form.controls.memberId.setValue(mid);
      }
    });
  }

  estimatedPrice(): number {
    const value = this.form.getRawValue();
    const pitch = this.pitches().find((p) => p.id === value.pitchId);
    return Math.max(0, hoursBetween(value.startTime || '00:00', value.endTime || '00:00')) * (pitch?.pricePerHour ?? 0);
  }

  submit(): void {
    const value = this.form.getRawValue();
    if (!isFutureOrToday(value.date) || hoursBetween(value.startTime, value.endTime) <= 0) {
      this.toast.error('Choose a future date and a valid time range');
      return;
    }
    this.bookings.create({ ...value, status: 'Pending' }).subscribe((r) => this.toast.fromApi(r, 'Booking requested'));
  }
}
