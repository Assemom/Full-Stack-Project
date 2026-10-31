import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideChevronDown, LucideCircle, LucideClipboardList, LucideMail, LucideMapPin, LucidePhone, LucideSettings, LucideUsers, LucideWaves } from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';
import { CoachService } from '../../../core/services/coach.service';
import { ContactService } from '../../../core/services/contact.service';
import { PlanService } from '../../../core/services/plan.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { ToastService } from '../../../core/services/toast.service';
import { CoachDto } from '../../../core/models/coach.model';
import { PlanDto } from '../../../core/models/plan.model';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';
import { sportCourtImage } from '../../../core/utils/sport-image.util';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, MoneyPipe, LucideCircle, LucideWaves, LucidePhone, LucideMail, LucideMapPin, LucideUsers, LucideClipboardList, LucideSettings, LucideChevronDown],
  template: `
    <main>
      <!-- ─── Hero ─────────────────────────────────────── -->
      <section class="relative flex min-h-[90vh] items-center overflow-hidden">
        <img src="/bigfootballpitch.jpg" alt="" class="absolute inset-0 h-full w-full object-cover animate-scale-in" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        <div class="relative z-10 mx-auto w-full max-w-7xl px-4 py-20">
          <div class="max-w-2xl">
            <p class="animate-fade-up text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Sport Club platform</p>
            <h1 class="animate-fade-up animate-delay-100 mt-4 text-5xl font-black leading-tight text-white md:text-7xl">Train.<br>Book.<br><span class="text-[var(--brand)]">Compete.</span></h1>
            <p class="animate-fade-up animate-delay-200 mt-5 max-w-2xl text-lg text-white/70">Premium football, basketball, swimming, and padel facilities. Book pitches, join teams, track activities — all from one dashboard.</p>
            <div class="animate-fade-up animate-delay-300 mt-8 flex flex-wrap gap-3">
              @if (auth.isAuthenticated() && auth.currentRole() === 'Member') {
                <a routerLink="/member/book" class="hover-lift rounded bg-[var(--brand)] px-6 py-3 font-bold text-white">Book a pitch now</a>
              } @else {
                <a routerLink="/auth/register" class="hover-lift rounded bg-[var(--accent)] px-6 py-3 font-bold text-[#151714]">Join the club</a>
                <a routerLink="/auth/login" class="hover-lift rounded bg-white px-6 py-3 font-bold text-[#151714]">Login</a>
              }
            </div>
          </div>
        </div>
        <!-- scroll hint -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex animate-bounce items-center gap-1 text-white/40 text-sm">Explore <svg lucideChevronDown size="16"></svg></div>
      </section>

      <!-- ─── Sports showcase ──────────────────────────── -->
      <section class="border-b border-[var(--line)]">
        <div class="mx-auto max-w-7xl px-4 py-16">
          <p class="animate-fade-up text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Our disciplines</p>
          <h2 class="animate-fade-up animate-delay-100 mt-2 text-3xl font-black">Choose your sport</h2>
          <div class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            @for (s of sports; track s.name; let i = $index) {
              <a [routerLink]="s.link" class="animate-fade-up hover-lift group relative flex h-64 items-end overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]" [class.animate-delay-100]="i===1" [class.animate-delay-200]="i===2" [class.animate-delay-300]="i===3">
                <img [src]="s.image" [alt]="s.name" class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div class="relative z-10 p-5">
                  @if (s.icon === 'football') { <svg lucideCircle class="text-emerald-400" size="28" fill="currentColor" stroke-width="1.5"></svg> }
                  @else if (s.icon === 'basketball') { <svg lucideCircle class="text-orange-400" size="28" fill="currentColor" stroke-width="1.5"></svg> }
                  @else if (s.icon === 'swimming') { <svg lucideWaves class="text-cyan-400" size="28" stroke-width="1.5"></svg> }
                  @else if (s.icon === 'padel') { <svg lucideCircle class="text-violet-400" size="28" fill="currentColor" stroke-width="1.5"></svg> }
                  <h3 class="mt-2 text-xl font-bold text-white">{{ s.name }}</h3>
                  <p class="mt-1 text-sm text-white/60">{{ s.desc }}</p>
                </div>
              </a>
            }
          </div>
        </div>
      </section>

      <!-- ─── About + Features ─────────────────────────── -->
      <section class="border-b border-[var(--line)]">
        <div class="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2">
          <div class="animate-fade-up group relative overflow-hidden rounded-lg">
            <img src="/pool.jpg" alt="" class="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-0 p-6">
              <p class="text-sm text-white/60">Sport Club since 2020</p>
              <p class="text-xl font-bold text-white">More than just a club</p>
            </div>
          </div>
          <div class="animate-fade-up animate-delay-100">
            <h2 class="text-3xl font-black">About Sport Club</h2>
            <p class="mt-4 text-[var(--text-muted)]">
              Sport Club brings together members, coaches, and staff in one place. Book pitches, join teams,
              track activities, and manage your subscriptions — all without the paperwork.
            </p>
            <div class="mt-8 grid grid-cols-2 gap-6">
              @for (stat of stats; track stat.label; let i = $index) {
                <div class="animate-fade-up" [class.animate-delay-200]="i===0" [class.animate-delay-300]="i===1" [class.animate-delay-400]="i===2">
                  <strong class="text-3xl font-black text-[var(--brand)]">{{ stat.value }}{{ stat.suffix }}</strong>
                  <p class="text-sm text-[var(--text-muted)]">{{ stat.label }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- ─── Features grid ────────────────────────────── -->
      <section class="border-b border-[var(--line)] bg-[var(--surface-muted)]/50">
        <div class="mx-auto max-w-7xl px-4 py-16">
          <p class="animate-fade-up text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Platform</p>
          <h2 class="animate-fade-up animate-delay-100 mt-2 text-3xl font-black">Everything you need</h2>
          <div class="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            @for (f of features; track f.title; let i = $index) {
              <div class="animate-fade-up hover-lift rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5" [class.animate-delay-100]="i===1" [class.animate-delay-200]="i===2" [class.animate-delay-300]="i===3">
                <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--brand)]/10 transition duration-300 hover:scale-110 hover:bg-[var(--brand)]/20">
                  @if (f.icon === 'booking') { <svg lucideCircle size="22" class="text-[var(--brand)]" fill="currentColor" stroke-width="1.5"></svg> }
                  @else if (f.icon === 'members') { <svg lucideUsers size="22" class="text-[var(--brand)]" stroke-width="1.5"></svg> }
                  @else if (f.icon === 'coach') { <svg lucideClipboardList size="22" class="text-[var(--brand)]" stroke-width="1.5"></svg> }
                  @else if (f.icon === 'admin') { <svg lucideSettings size="22" class="text-[var(--brand)]" stroke-width="1.5"></svg> }
                </div>
                <h3 class="mt-4 font-bold">{{ f.title }}</h3>
                <p class="mt-1 text-sm text-[var(--text-muted)]">{{ f.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ─── Plans ────────────────────────────────────── -->
      <section class="mx-auto max-w-7xl px-4 py-16">
        <p class="animate-fade-up text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Pricing</p>
        <h2 class="animate-fade-up animate-delay-100 mt-2 text-3xl font-black">Featured plans</h2>
        <div class="mt-8 grid gap-5 md:grid-cols-3">
          @for (plan of plans().slice(0, 3); track plan.id; let i = $index) {
            <article class="animate-fade-up hover-lift rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 hover:border-[var(--brand)]" [class.animate-delay-100]="i===1" [class.animate-delay-200]="i===2">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <h3 class="font-bold">{{ plan.name }}</h3>
                  <p class="text-sm text-[var(--text-muted)]">{{ plan.type }} &middot; {{ plan.durationMonths }} months</p>
                </div>
                <strong class="text-xl text-[var(--brand)]">{{ plan.price | money }}</strong>
              </div>
              <div class="mt-6">
                @if (auth.isAuthenticated() && auth.currentRole() === 'Member') {
                  <button (click)="subscribe(plan)" [disabled]="submitting()" class="w-full rounded bg-[var(--brand)] px-3 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50">Subscribe</button>
                } @else if (!auth.isAuthenticated()) {
                  <a routerLink="/auth/login" class="block w-full rounded border border-[var(--line)] px-3 py-2 text-center text-sm font-bold transition hover:bg-[var(--surface-muted)] hover:border-[var(--brand)]">Login to subscribe</a>
                }
              </div>
            </article>
          } @empty {
            <p class="text-sm text-[var(--text-muted)]">Loading plans...</p>
          }
        </div>
      </section>

      <!-- ─── Coaches ──────────────────────────────────── -->
      <section class="border-t border-[var(--line)] bg-[var(--surface-muted)]/30">
        <div class="mx-auto max-w-7xl px-4 py-16">
          <p class="animate-fade-up text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Team</p>
          <h2 class="animate-fade-up animate-delay-100 mt-2 text-3xl font-black">Our coaches</h2>
          <div class="mt-8 grid gap-5 md:grid-cols-3">
            @for (coach of coaches().slice(0, 3); track coach.id; let i = $index) {
              <a [routerLink]="['/coaches', coach.id]" class="animate-fade-up hover-lift group relative flex h-56 items-end overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)]" [class.animate-delay-100]="i===1" [class.animate-delay-200]="i===2">
                <img [src]="sportCourtImage(coach.specialization)" alt="" class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div class="relative z-10 p-5">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white transition group-hover:scale-110 group-hover:bg-[var(--brand)]">{{ (coach.fullName || coach.userName).charAt(0) }}</div>
                  <h3 class="mt-2 font-bold text-white">{{ coach.fullName || coach.userName }}</h3>
                  <p class="text-sm text-white/60">{{ coach.specialization }}</p>
                </div>
              </a>
            } @empty {
              <p class="text-sm text-[var(--text-muted)]">Loading coaches...</p>
            }
          </div>
        </div>
      </section>

      <!-- ─── Contact ──────────────────────────────────── -->
      <section class="border-t border-[var(--line)] bg-[var(--surface-muted)]/30">
        <div class="mx-auto max-w-7xl px-4 py-20">
          <div class="mx-auto max-w-2xl text-center">
            <p class="animate-fade-up text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Contact</p>
            <h2 class="animate-fade-up animate-delay-100 mt-2 text-3xl font-black">Get in touch</h2>
            <p class="animate-fade-up animate-delay-200 mt-3 text-[var(--text-muted)]">Have a question? We'd love to hear from you.</p>
          </div>

          <div class="mx-auto mt-12 grid max-w-4xl gap-10 md:grid-cols-[1fr_1.2fr]">
            <!-- Contact info cards -->
            <div class="animate-fade-up animate-delay-100 flex flex-col gap-4">
              <div class="hover-lift flex items-center gap-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--brand)]/10 text-lg transition hover:bg-[var(--brand)]/20"><svg lucidePhone size="20" class="text-[var(--brand)]" stroke-width="2"></svg></div>
                <div>
                  <p class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Phone</p>
                  <p class="font-bold">+1 (555) 123-4567</p>
                </div>
              </div>
              <div class="hover-lift flex items-center gap-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--brand)]/10 text-lg transition hover:bg-[var(--brand)]/20"><svg lucideMail size="20" class="text-[var(--brand)]" stroke-width="2"></svg></div>
                <div>
                  <p class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Email</p>
                  <p class="font-bold">hello&#64;sportclub.com</p>
                </div>
              </div>
              <div class="hover-lift flex items-center gap-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--brand)]/10 transition hover:bg-[var(--brand)]/20"><svg lucideMapPin size="20" class="text-[var(--brand)]" stroke-width="2"></svg></div>
                <div>
                  <p class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Location</p>
                  <p class="font-bold">42 Sports Avenue, NY</p>
                </div>
              </div>
            </div>

            <!-- Form -->
            <form [formGroup]="contactForm" (ngSubmit)="sendMessage()" class="animate-fade-up animate-delay-200 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
              <h3 class="text-lg font-bold">Send a message</h3>
              <div class="mt-5 grid gap-4">
                <input class="rounded-lg border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20" type="text" placeholder="Your name" formControlName="name" />
                <input class="rounded-lg border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20" type="email" placeholder="Your email" formControlName="email" />
                <textarea class="rounded-lg border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20" rows="4" placeholder="Your message" formControlName="message"></textarea>
                <button type="submit" [disabled]="contactForm.invalid || sending()" class="hover-lift rounded-lg bg-[var(--brand)] px-5 py-3 font-bold text-white transition disabled:opacity-50">
                  {{ sending() ? 'Sending...' : 'Send message' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  `,
})
export class LandingComponent {
  protected auth = inject(AuthService);
  protected sportCourtImage = sportCourtImage;
  private plansService = inject(PlanService);
  private coachesService = inject(CoachService);
  private contactService = inject(ContactService);
  private subscriptions = inject(SubscriptionService);
  private toast = inject(ToastService);
  plans = signal<PlanDto[]>([]);
  coaches = signal<CoachDto[]>([]);
  submitting = signal(false);

  sports = [
    { name: 'Football', icon: 'football', desc: 'Train like a pro on our premium pitches.', image: '/footballteam.jpg', link: '/activities' },
    { name: 'Basketball', icon: 'basketball', desc: 'Full-court action with top coaches.', image: '/basketcourt.jpg', link: '/activities' },
    { name: 'Swimming', icon: 'swimming', desc: 'Olympic-size pool with guided sessions.', image: '/swimmingteam.jpg', link: '/activities' },
    { name: 'Padel', icon: 'padel', desc: 'Fast-paced matches on exclusive courts.', image: '/padelcourt.jpg', link: '/activities' },
  ];

  stats = [
    { value: '500+', suffix: '', label: 'Active members' },
    { value: '15', suffix: '', label: 'Coaches' },
    { value: '6', suffix: '', label: 'Pitches' },
    { value: '98', suffix: '%', label: 'Satisfaction' },
  ];

  features = [
    { icon: 'booking', title: 'Pitch booking', desc: 'Reserve football, basketball, swimming, and padel courts in real time.' },
    { icon: 'members', title: 'Member management', desc: 'Track subscriptions, team assignments, and activity participation.' },
    { icon: 'coach', title: 'Coach tools', desc: 'Manage schedules, view bookings, and lead team activities.' },
    { icon: 'admin', title: 'Admin control', desc: 'Full CRUD for coaches, members, teams, plans, pitches, and more.' },
  ];

  constructor() {
    this.plansService.getAll().subscribe({ next: (r) => this.plans.set(r.data ?? []), error: () => this.plans.set([]) });
    this.coachesService.getAll().subscribe({ next: (r) => this.coaches.set(r.data ?? []), error: () => this.coaches.set([]) });
  }

  contactForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
  });
  sending = signal(false);

  sendMessage(): void {
    if (this.contactForm.invalid) return;
    this.sending.set(true);
    const raw = this.contactForm.getRawValue();
    this.contactService.submitInquiry({
      name: raw.name ?? '',
      email: raw.email ?? '',
      phone: null,
      message: raw.message ?? '',
    }).subscribe({
      next: (r) => {
        this.toast.fromApi(r, 'Message sent!');
        if (r.success) this.contactForm.reset();
        this.sending.set(false);
      },
      error: () => { this.toast.error('Failed to send message. Please try again.'); this.sending.set(false); },
    });
  }

  subscribe(plan: PlanDto): void {
    const memberId = this.auth.currentMemberId();
    if (!memberId) {
      this.toast.error('Member profile not found. Contact support.');
      return;
    }
    this.submitting.set(true);
    this.subscriptions.create({
      memberId,
      planId: plan.id,
      startDate: new Date().toISOString().split('T')[0],
      amountPaid: plan.price,
      status: 'Pending',
      paymentStatus: 'Pending',
    }).subscribe({
      next: (r) => { this.toast.fromApi(r, 'Subscription created'); this.submitting.set(false); },
      error: () => this.submitting.set(false),
    });
  }
}
