# Frontend Guide: Angular 21 + Tailwind for Club Backend

This guide is the implementation blueprint for building the frontend at:

```text
E:\ITI-intake46\Full-Stack-Project\Frontend
```

It is aligned with the backend at:

```text
E:\ITI-intake46\Full-Stack-Project\Backend\Club
```

The goal is a complete, polished, responsive, dark/light Angular application that consumes every backend endpoint, supports JWT authentication, separates Admin, Coach, and Member experiences, and feels like a premium sports club product rather than a generic generated dashboard.

## Backend Summary

Backend API project:

```text
Club.Api
```

Backend runtime URLs from `launchSettings.json`:

```text
HTTPS: https://localhost:7293
HTTP:  http://localhost:5281
Scalar:  https://localhost:7293/scalar
Swagger: https://localhost:7293/swagger
```

Recommended frontend API base URL:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7293',
};
```

Every backend response uses this wrapper:

```ts
export interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  data?: T | null;
  errors?: string[] | null;
}
```

Always handle `success`, `message`, `data`, and `errors` in the frontend. Do not assume a failed request always returns a raw error string.

## Important Backend Alignment Notes

1. The backend has JWT configured.
2. You said you will uncomment `[Authorize]` attributes in the controllers.
3. The frontend must send JWT tokens as:

```http
Authorization: Bearer <token>
```

4. Login returns `UserDto` with `username`, `email`, and `token`.
5. The login response does not return the role directly, so decode the JWT token on the frontend to get the role.
6. Because the backend uses `JsonStringEnumConverter`, send enum values as strings in JSON payloads.
7. The backend currently has these role names:

```text
Admin
Coach
Member
```

8. The backend uses these frontend development CORS origins:

```text
http://localhost:5173
https://localhost:5173
http://localhost:3000
https://localhost:3000
http://localhost:4200
https://localhost:4200
```

Run Angular on `http://localhost:4200` unless you intentionally change it.

## Frontend Creation

Create the Angular app inside:

```powershell
cd E:\ITI-intake46\Full-Stack-Project\Frontend
npm install -g @angular/cli@^21
ng new club-frontend --routing --style css --standalone --strict --test-runner vitest
cd club-frontend
```

Install Tailwind:

```powershell
npm install tailwindcss @tailwindcss/postcss postcss --force
```

Create `.postcssrc.json` in the Angular project root:

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

In `src/styles.css`:

```css
@import "tailwindcss";
```

Install recommended UI/runtime helpers:

```powershell
npm install jwt-decode lucide-angular ngx-toastr
```

Recommended optional packages:

```powershell
npm install date-fns clsx
```

Use `lucide-angular` for icons. Avoid custom random SVG icons unless the icon does not exist in the library.

## Application Experience

The website should feel like a premium, energetic sports club platform:

1. Landing pages should feel immersive and athletic.
2. Dashboards should feel fast, organized, and operational.
3. Public pages should sell the club experience.
4. Admin pages should prioritize scanning, tables, quick actions, and clean forms.
5. Coach pages should focus on schedule, teams, activities, and assigned bookings.
6. Member pages should focus on booking, subscriptions, teams, activities, and personal progress.
7. Dark and light modes must both feel designed, not like a simple color inversion.
8. Mobile layout must be first-class, especially member booking flows.

Avoid a generic "AI app" style:

1. Do not use huge purple gradients everywhere.
2. Do not build every section as floating cards inside cards.
3. Do not use empty dashboard widgets that look decorative only.
4. Do not use vague hero text like "Transform your experience".
5. Do not make the whole site one color family.
6. Use sport-specific surfaces: pitch availability strips, booking timelines, team roster rows, coach schedule bands, plan comparison panels.

## Visual Direction

Use a custom club identity with a balanced palette.

Light mode:

```css
:root {
  --bg: #f7f8f5;
  --surface: #ffffff;
  --surface-muted: #edf1ec;
  --text: #151714;
  --text-muted: #62685f;
  --line: #dce3d8;
  --brand: #0f7a5f;
  --brand-strong: #075c48;
  --accent: #e0b44b;
  --danger: #c2413a;
  --info: #2563eb;
}
```

Dark mode:

```css
.dark {
  --bg: #0d1210;
  --surface: #151c19;
  --surface-muted: #1e2925;
  --text: #f4f7f2;
  --text-muted: #aeb9ad;
  --line: #2a3933;
  --brand: #38c59b;
  --brand-strong: #6ee7bd;
  --accent: #f0c766;
  --danger: #f87171;
  --info: #60a5fa;
}
```

Tailwind can consume CSS variables with utility classes like:

```html
<main class="bg-[var(--bg)] text-[var(--text)]">
```

Recommended look:

1. Use deep green as the club identity.
2. Use gold only for highlights and premium actions.
3. Use neutral surfaces for dashboards.
4. Use pitch-like status visuals for bookings and availability.
5. Use strong typography and compact layouts.
6. Keep border radius around `8px` for cards and tables.
7. Use `12px` or `16px` spacing rhythm.
8. Use icon-only buttons for common actions where clear: edit, delete, view, calendar, save.
9. Add tooltips for icon-only actions.

## Angular Architecture

Use standalone Angular APIs. Avoid NgModules for new code.

Recommended structure:

```text
src/
  app/
    app.config.ts
    app.routes.ts
    core/
      config/
        api.config.ts
      guards/
        auth.guard.ts
        guest.guard.ts
        role.guard.ts
      interceptors/
        auth.interceptor.ts
        error.interceptor.ts
      models/
        api-response.model.ts
        auth.model.ts
        activity.model.ts
        booking.model.ts
        coach.model.ts
        member.model.ts
        pitch.model.ts
        plan.model.ts
        subscription.model.ts
        team.model.ts
        enums.model.ts
      services/
        api.service.ts
        auth.service.ts
        activity.service.ts
        booking.service.ts
        coach.service.ts
        member.service.ts
        pitch.service.ts
        plan.service.ts
        subscription.service.ts
        team.service.ts
        theme.service.ts
        toast.service.ts
      utils/
        jwt.util.ts
        form-errors.util.ts
        date-time.util.ts
    layouts/
      public-layout/
      dashboard-layout/
      auth-layout/
    shared/
      components/
        app-button/
        app-input/
        app-select/
        app-textarea/
        app-dialog/
        app-table/
        app-badge/
        app-empty-state/
        app-page-header/
        app-confirm-dialog/
        app-stat/
        app-loader/
        theme-toggle/
      pipes/
        enum-label.pipe.ts
        money.pipe.ts
    features/
      public/
        landing/
        plans-preview/
        coaches-preview/
      auth/
        login/
        register/
      admin/
        dashboard/
        coaches/
        members/
        teams/
        plans/
        pitches/
        subscriptions/
        bookings/
        activities/
      coach/
        dashboard/
        my-activities/
        my-bookings/
        teams/
      member/
        dashboard/
        book-pitch/
        my-bookings/
        my-subscriptions/
        activities/
        teams/
  environments/
    environment.ts
    environment.prod.ts
```

## Routing Plan

Public routes:

```ts
export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/public/landing/landing.component').then(m => m.LandingComponent) },
      { path: 'plans', loadComponent: () => import('./features/public/plans-preview/plans-preview.component').then(m => m.PlansPreviewComponent) },
      { path: 'coaches', loadComponent: () => import('./features/public/coaches-preview/coaches-preview.component').then(m => m.CoachesPreviewComponent) },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
    ],
  },
  {
    path: 'admin',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'coaches', loadComponent: () => import('./features/admin/coaches/admin-coaches.component').then(m => m.AdminCoachesComponent) },
      { path: 'members', loadComponent: () => import('./features/admin/members/admin-members.component').then(m => m.AdminMembersComponent) },
      { path: 'teams', loadComponent: () => import('./features/admin/teams/admin-teams.component').then(m => m.AdminTeamsComponent) },
      { path: 'plans', loadComponent: () => import('./features/admin/plans/admin-plans.component').then(m => m.AdminPlansComponent) },
      { path: 'pitches', loadComponent: () => import('./features/admin/pitches/admin-pitches.component').then(m => m.AdminPitchesComponent) },
      { path: 'subscriptions', loadComponent: () => import('./features/admin/subscriptions/admin-subscriptions.component').then(m => m.AdminSubscriptionsComponent) },
      { path: 'bookings', loadComponent: () => import('./features/admin/bookings/admin-bookings.component').then(m => m.AdminBookingsComponent) },
      { path: 'activities', loadComponent: () => import('./features/admin/activities/admin-activities.component').then(m => m.AdminActivitiesComponent) },
    ],
  },
  {
    path: 'coach',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Coach'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/coach/dashboard/coach-dashboard.component').then(m => m.CoachDashboardComponent) },
      { path: 'activities', loadComponent: () => import('./features/coach/my-activities/my-activities.component').then(m => m.MyActivitiesComponent) },
      { path: 'bookings', loadComponent: () => import('./features/coach/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent) },
      { path: 'teams', loadComponent: () => import('./features/coach/teams/coach-teams.component').then(m => m.CoachTeamsComponent) },
    ],
  },
  {
    path: 'member',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Member'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/member/dashboard/member-dashboard.component').then(m => m.MemberDashboardComponent) },
      { path: 'book', loadComponent: () => import('./features/member/book-pitch/book-pitch.component').then(m => m.BookPitchComponent) },
      { path: 'bookings', loadComponent: () => import('./features/member/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent) },
      { path: 'subscriptions', loadComponent: () => import('./features/member/my-subscriptions/my-subscriptions.component').then(m => m.MySubscriptionsComponent) },
      { path: 'activities', loadComponent: () => import('./features/member/activities/member-activities.component').then(m => m.MemberActivitiesComponent) },
      { path: 'teams', loadComponent: () => import('./features/member/teams/member-teams.component').then(m => m.MemberTeamsComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
```

After login:

```ts
if (role === 'Admin') router.navigateByUrl('/admin/dashboard');
if (role === 'Coach') router.navigateByUrl('/coach/dashboard');
if (role === 'Member') router.navigateByUrl('/member/dashboard');
```

## Core Models

Create these interfaces in `src/app/core/models`.

### API Response

```ts
export interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  data?: T | null;
  errors?: string[] | null;
}
```

### Auth

```ts
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  phoneNumber?: string | null;
  address?: string | null;
  userName?: string | null;
}

export interface UserDto {
  username?: string | null;
  email?: string | null;
  token?: string | null;
}

export type UserRole = 'Admin' | 'Coach' | 'Member';

export interface AuthUser {
  username?: string | null;
  email?: string | null;
  token: string;
  role: UserRole;
  expiresAt?: number;
}
```

### Enums

```ts
export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid';
export type PitchType = 'Football' | 'Basketball' | 'Padel';
export type SubscriptionStatus = 'Pending' | 'Active' | 'Inactive' | 'Expired';

export const BOOKING_STATUSES: BookingStatus[] = ['Pending', 'Confirmed', 'Cancelled'];
export const PAYMENT_STATUSES: PaymentStatus[] = ['Pending', 'Paid'];
export const PITCH_TYPES: PitchType[] = ['Football', 'Basketball', 'Padel'];
export const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = ['Pending', 'Active', 'Inactive', 'Expired'];
export const TEAM_TYPES = ['Football', 'Basketball', 'Swimming', 'Padel'] as const;
export const PLAN_TYPES = ['Monthly', 'Yearly'] as const;
```

### Coach

```ts
export interface CoachDto {
  id: number;
  appUserId: string;
  userName: string;
  email: string;
  phoneNumber?: string | null;
  fullName?: string | null;
  address?: string | null;
  specialization: string;
  bio?: string | null;
  hireDate: string;
}

export interface CreateCoachDto {
  email: string;
  password: string;
  userName: string;
  phoneNumber?: string | null;
  fullName?: string | null;
  address?: string | null;
  specialization: string;
  bio?: string | null;
}

export interface UpdateCoachDto {
  fullName?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  specialization?: string | null;
  bio?: string | null;
}
```

### Member

```ts
export interface MemberDto {
  id: number;
  appUserId: string;
  userName: string;
  email: string;
  phoneNumber?: string | null;
  fullName?: string | null;
  address?: string | null;
  teamId?: number | null;
  teamName?: string | null;
  subscriptionStatus?: string | null;
  joinedAt: string;
}

export interface CreateMemberDto {
  email: string;
  password: string;
  userName?: string | null;
  phoneNumber?: string | null;
  fullName?: string | null;
  address?: string | null;
  teamId?: number | null;
}

export interface UpdateMemberDto {
  fullName?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  teamId?: number | null;
}
```

### Team

```ts
export interface TeamDto {
  id: number;
  name: string;
  type: string;
  createdAt: string;
  coachId?: number | null;
  coachName?: string | null;
  coachSpecialization?: string | null;
  membersCount: number;
}

export interface CreateTeamDto {
  name: string;
  type: string;
  coachId?: number | null;
}

export interface UpdateTeamDto {
  name?: string | null;
  type?: string | null;
  coachId?: number | null;
}
```

### Plan

```ts
export interface PlanDto {
  id: number;
  name: string;
  type: string;
  price: number;
  durationMonths: number;
  isActive: boolean;
  subscriptionsCount: number;
}

export interface CreatePlanDto {
  name: string;
  type: string;
  price: number;
  durationMonths: number;
  isActive?: boolean | null;
}

export interface UpdatePlanDto {
  name?: string | null;
  type?: string | null;
  price?: number | null;
  durationMonths?: number | null;
  isActive?: boolean | null;
}
```

### Pitch

```ts
export interface PitchDto {
  id: number;
  number: number;
  type: PitchType;
  pricePerHour: number;
  isAvailable: boolean;
  description?: string | null;
  bookingsCount: number;
}

export interface CreatePitchDto {
  number: number;
  type: PitchType;
  pricePerHour: number;
  isAvailable?: boolean | null;
  description?: string | null;
}

export interface UpdatePitchDto {
  number?: number | null;
  type?: PitchType | null;
  pricePerHour?: number | null;
  isAvailable?: boolean | null;
  description?: string | null;
}
```

### Subscription

```ts
export interface SubscriptionDto {
  id: number;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  memberId: number;
  memberName?: string | null;
  planId: number;
  planName: string;
  planType: string;
  planPrice: number;
  durationMonths: number;
}

export interface CreateSubscriptionDto {
  memberId: number;
  planId: number;
  startDate?: string | null;
  amountPaid?: number | null;
  status?: SubscriptionStatus | null;
  paymentStatus?: PaymentStatus | null;
}

export interface UpdateSubscriptionDto {
  memberId?: number | null;
  planId?: number | null;
  startDate?: string | null;
  amountPaid?: number | null;
  status?: SubscriptionStatus | null;
  paymentStatus?: PaymentStatus | null;
}
```

### Activity

```ts
export interface ActivityDto {
  id: number;
  name: string;
  description?: string | null;
  schedule: string;
  maxCapacity: number;
  isActive: boolean;
  coachId: number;
  coachName?: string | null;
  teamId: number;
  teamName?: string | null;
  teamMembersCount: number;
}

export interface CreateActivityDto {
  name: string;
  description?: string | null;
  schedule: string;
  maxCapacity: number;
  isActive?: boolean | null;
  coachId: number;
  teamId: number;
}

export interface UpdateActivityDto {
  name?: string | null;
  description?: string | null;
  schedule?: string | null;
  maxCapacity?: number | null;
  isActive?: boolean | null;
  coachId?: number | null;
  teamId?: number | null;
}
```

### Booking

The backend expects `TimeSpan`, so send time strings like `09:00:00`, not just `09:00`.

```ts
export interface BookingDto {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
  memberId: number;
  memberName?: string | null;
  pitchId: number;
  pitchNumber: number;
  pitchType: string;
  pricePerHour: number;
  coachId?: number | null;
  coachName?: string | null;
}

export interface CreateBookingDto {
  date: string;
  startTime: string;
  endTime: string;
  memberId: number;
  pitchId: number;
  coachId?: number | null;
  status?: BookingStatus | null;
}

export interface UpdateBookingDto {
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  memberId?: number | null;
  pitchId?: number | null;
  coachId?: number | null;
  status?: BookingStatus | null;
}
```

Helper:

```ts
export function toBackendTime(value: string): string {
  return value.length === 5 ? `${value}:00` : value;
}
```

## API Endpoint Map

Use these exact backend routes.

### Account

| Method | Endpoint | Access | Body | Response |
|---|---|---|---|---|
| POST | `/api/Account/login` | Public | `LoginDto` | `ApiResponse<UserDto>` |
| POST | `/api/Account/register` | Public | `RegisterDto` | `ApiResponse<UserDto>` |

### Coaches

| Method | Endpoint | Access | Body | Response |
|---|---|---|---|---|
| POST | `/api/admin/coaches` | Admin | `CreateCoachDto` | `ApiResponse<CoachDto>` |
| GET | `/api/admin/coaches` | Admin | none | `ApiResponse<CoachDto[]>` |
| GET | `/api/admin/coaches/{id}` | Admin | none | `ApiResponse<CoachDto>` |
| PUT | `/api/admin/coaches/{id}` | Admin | `UpdateCoachDto` | `ApiResponse<CoachDto>` |
| DELETE | `/api/admin/coaches/{id}` | Admin | none | `ApiResponse<boolean>` |

### Members

Important: the backend route is currently capitalized as `/api/Member`.

| Method | Endpoint | Access | Body | Response |
|---|---|---|---|---|
| POST | `/api/Member` | Admin | `CreateMemberDto` | `ApiResponse<MemberDto>` |
| GET | `/api/Member` | Admin | none | `ApiResponse<MemberDto[]>` |
| GET | `/api/Member/{id}` | Admin | none | `ApiResponse<MemberDto>` |
| PUT | `/api/Member/{id}` | Admin | `UpdateMemberDto` | `ApiResponse<MemberDto>` |
| DELETE | `/api/Member/{id}` | Admin | none | `ApiResponse<boolean>` |

Recommended backend improvement later: change route to `[Route("api/admin/members")]` for consistency. Until then, use `/api/Member`.

### Teams

| Method | Endpoint | Access | Body | Response |
|---|---|---|---|---|
| POST | `/api/admin/teams` | Admin | `CreateTeamDto` | `ApiResponse<TeamDto>` |
| GET | `/api/admin/teams` | Admin | none | `ApiResponse<TeamDto[]>` |
| GET | `/api/admin/teams/{id}` | Admin | none | `ApiResponse<TeamDto>` |
| PUT | `/api/admin/teams/{id}` | Admin | `UpdateTeamDto` | `ApiResponse<TeamDto>` |
| DELETE | `/api/admin/teams/{id}` | Admin | none | `ApiResponse<boolean>` |

### Plans

| Method | Endpoint | Access | Body | Response |
|---|---|---|---|---|
| POST | `/api/admin/plans` | Admin | `CreatePlanDto` | `ApiResponse<PlanDto>` |
| GET | `/api/admin/plans` | Admin/Public preview if allowed | none | `ApiResponse<PlanDto[]>` |
| GET | `/api/admin/plans/{id}` | Admin | none | `ApiResponse<PlanDto>` |
| PUT | `/api/admin/plans/{id}` | Admin | `UpdatePlanDto` | `ApiResponse<PlanDto>` |
| DELETE | `/api/admin/plans/{id}` | Admin | none | `ApiResponse<boolean>` |

### Pitches

| Method | Endpoint | Access | Body | Response |
|---|---|---|---|---|
| POST | `/api/admin/pitches` | Admin | `CreatePitchDto` | `ApiResponse<PitchDto>` |
| GET | `/api/admin/pitches` | Admin/Member booking page if allowed | none | `ApiResponse<PitchDto[]>` |
| GET | `/api/admin/pitches/{id}` | Admin | none | `ApiResponse<PitchDto>` |
| PUT | `/api/admin/pitches/{id}` | Admin | `UpdatePitchDto` | `ApiResponse<PitchDto>` |
| DELETE | `/api/admin/pitches/{id}` | Admin | none | `ApiResponse<boolean>` |

### Subscriptions

| Method | Endpoint | Access | Body/Query | Response |
|---|---|---|---|---|
| POST | `/api/subscriptions` | Admin | `CreateSubscriptionDto` | `ApiResponse<SubscriptionDto>` |
| GET | `/api/subscriptions` | Admin | none | `ApiResponse<SubscriptionDto[]>` |
| GET | `/api/admin/subscriptions?status=Active` | Admin | query status or `all` | `ApiResponse<SubscriptionDto[]>` |
| GET | `/api/subscriptions/{id}` | Admin | none | `ApiResponse<SubscriptionDto>` |
| GET | `/api/member/subscriptions/mine` | Member | JWT | `ApiResponse<SubscriptionDto[]>` |
| PUT | `/api/subscriptions/{id}` | Admin | `UpdateSubscriptionDto` | `ApiResponse<SubscriptionDto>` |
| DELETE | `/api/subscriptions/{id}` | Admin | none | `ApiResponse<boolean>` |

### Activities

| Method | Endpoint | Access | Body | Response |
|---|---|---|---|---|
| POST | `/api/activities` | Admin/Coach | `CreateActivityDto` | `ApiResponse<ActivityDto>` |
| GET | `/api/activities` | Authenticated | none | `ApiResponse<ActivityDto[]>` |
| GET | `/api/coach/activities/mine` | Coach | JWT | `ApiResponse<ActivityDto[]>` |
| GET | `/api/activities/{id}` | Authenticated | none | `ApiResponse<ActivityDto>` |
| PUT | `/api/activities/{id}` | Admin/Coach | `UpdateActivityDto` | `ApiResponse<ActivityDto>` |
| DELETE | `/api/activities/{id}` | Admin/Coach | none | `ApiResponse<boolean>` |

### Bookings

| Method | Endpoint | Access | Body | Response |
|---|---|---|---|---|
| POST | `/api/bookings` | Admin/Coach/Member | `CreateBookingDto` | `ApiResponse<BookingDto>` |
| GET | `/api/bookings` | Admin | none | `ApiResponse<BookingDto[]>` |
| GET | `/api/admin/bookings/today` | Admin | none | `ApiResponse<BookingDto[]>` |
| GET | `/api/coach/bookings/mine` | Coach | JWT | `ApiResponse<BookingDto[]>` |
| GET | `/api/member/bookings/mine` | Member | JWT | `ApiResponse<BookingDto[]>` |
| GET | `/api/bookings/{id}` | Authenticated | none | `ApiResponse<BookingDto>` |
| PUT | `/api/bookings/{id}` | Admin/Member | `UpdateBookingDto` | `ApiResponse<BookingDto>` |
| DELETE | `/api/bookings/{id}` | Admin/Coach/Member | none | `ApiResponse<boolean>` |

## Generic API Service

Create a small wrapper around `HttpClient`.

```ts
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  get<T>(url: string, params?: Record<string, string | number | boolean>) {
    return this.http.get<ApiResponse<T>>(`${environment.apiBaseUrl}${url}`, { params });
  }

  post<T, B>(url: string, body: B) {
    return this.http.post<ApiResponse<T>>(`${environment.apiBaseUrl}${url}`, body);
  }

  put<T, B>(url: string, body: B) {
    return this.http.put<ApiResponse<T>>(`${environment.apiBaseUrl}${url}`, body);
  }

  delete<T>(url: string) {
    return this.http.delete<ApiResponse<T>>(`${environment.apiBaseUrl}${url}`);
  }
}
```

## Feature Services

Example pattern:

```ts
@Injectable({ providedIn: 'root' })
export class CoachService {
  private api = inject(ApiService);
  private base = '/api/admin/coaches';

  getAll() {
    return this.api.get<CoachDto[]>(this.base);
  }

  getById(id: number) {
    return this.api.get<CoachDto>(`${this.base}/${id}`);
  }

  create(dto: CreateCoachDto) {
    return this.api.post<CoachDto, CreateCoachDto>(this.base, dto);
  }

  update(id: number, dto: UpdateCoachDto) {
    return this.api.put<CoachDto, UpdateCoachDto>(`${this.base}/${id}`, dto);
  }

  delete(id: number) {
    return this.api.delete<boolean>(`${this.base}/${id}`);
  }
}
```

Create equivalent services:

```text
AuthService
CoachService
MemberService
TeamService
PlanService
PitchService
SubscriptionService
ActivityService
BookingService
ThemeService
ToastService
```

Use route constants to avoid typos:

```ts
export const API_ROUTES = {
  auth: {
    login: '/api/Account/login',
    register: '/api/Account/register',
  },
  coaches: '/api/admin/coaches',
  members: '/api/Member',
  teams: '/api/admin/teams',
  plans: '/api/admin/plans',
  pitches: '/api/admin/pitches',
  subscriptions: '/api/subscriptions',
  adminSubscriptions: '/api/admin/subscriptions',
  memberSubscriptionsMine: '/api/member/subscriptions/mine',
  activities: '/api/activities',
  coachActivitiesMine: '/api/coach/activities/mine',
  bookings: '/api/bookings',
  adminBookingsToday: '/api/admin/bookings/today',
  coachBookingsMine: '/api/coach/bookings/mine',
  memberBookingsMine: '/api/member/bookings/mine',
} as const;
```

## Auth Service

Responsibilities:

1. Login.
2. Register.
3. Store token.
4. Decode token.
5. Expose current user.
6. Redirect by role.
7. Logout.
8. Check expiration.

JWT role extraction:

```ts
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp?: number;
  email?: string;
  role?: string | string[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
}

export function getRoleFromToken(token: string): UserRole | null {
  const payload = jwtDecode<JwtPayload>(token);
  const rawRole =
    payload.role ??
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  const role = Array.isArray(rawRole) ? rawRole[0] : rawRole;
  return role === 'Admin' || role === 'Coach' || role === 'Member' ? role : null;
}
```

Token storage:

```ts
const TOKEN_KEY = 'club_token';
```

Prefer `localStorage` for a student/full-stack project. For production, HTTP-only cookies would be stronger.

## Auth Interceptor

Attach the token to backend requests:

```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('club_token');

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
};
```

Register it in `app.config.ts`:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
  ],
};
```

## Guards

Auth guard:

```ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
```

Guest guard:

```ts
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree([auth.homeRoute()]);
};
```

Role guard:

```ts
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as UserRole[];
  const role = auth.currentRole();

  if (role && allowedRoles.includes(role)) {
    return true;
  }

  return router.createUrlTree([auth.homeRoute()]);
};
```

## Error Interceptor

Handle backend error shape:

```ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('club_token');
        router.navigateByUrl('/auth/login');
      }

      const apiError = error.error as ApiResponse<unknown> | undefined;
      const message =
        apiError?.errors?.join(', ') ||
        apiError?.message ||
        error.message ||
        'Something went wrong';

      console.error(message);
      return throwError(() => error);
    })
  );
};
```

## Form Validation Rules

Mirror backend validation in Angular forms.

### Login

```text
email: required, email
password: required
```

### Register

```text
email: required, email
password: required, minLength 6, maxLength 100
phoneNumber: optional, phone-like
address: optional, maxLength 200
userName: optional, minLength 3, maxLength 50
```

### Create Coach

```text
email: required, email
password: required, minLength 8
userName: required
phoneNumber: optional, phone-like
specialization: required
fullName: optional
address: optional
bio: optional
```

### Create Member

```text
email: required, email
password: required, minLength 8
userName: optional
phoneNumber: optional, phone-like
fullName: optional
address: optional
teamId: optional
```

### Team

```text
name: required
type: required, one of Football, Basketball, Swimming, Padel
coachId: optional
```

### Plan

```text
name: required
type: required, Monthly or Yearly
price: required, min 0.01
durationMonths: required, min 1, max 120
isActive: optional
```

### Pitch

```text
number: required
type: required, Football, Basketball, Padel
pricePerHour: required, min 0.01
isAvailable: optional
description: optional
```

### Subscription

```text
memberId: required
planId: required
startDate: optional
amountPaid: optional, min 0
status: optional, Pending, Active, Inactive, Expired
paymentStatus: optional, Pending, Paid
```

### Activity

```text
name: required
description: optional
schedule: required
maxCapacity: required, min 1
isActive: optional
coachId: required
teamId: required
```

### Booking

```text
date: required
startTime: required, HH:mm in UI, convert to HH:mm:ss for backend
endTime: required, HH:mm in UI, convert to HH:mm:ss for backend
memberId: required for Admin, backend fills member from token for Member role if implemented this way
pitchId: required
coachId: optional
status: optional, Pending, Confirmed, Cancelled
```

Frontend booking validation:

1. `endTime` must be after `startTime`.
2. Date should not be in the past for new bookings.
3. Pitch must be available.
4. For Member booking page, hide `memberId` and use the logged-in member context.
5. Show computed duration before submit.
6. Show estimated price using selected pitch `pricePerHour`.

## UI Components

Build these shared components first:

### App Button

Variants:

```text
primary
secondary
ghost
danger
gold
icon
```

States:

```text
default
hover
active
disabled
loading
```

### App Input

Supports:

```text
label
placeholder
icon
error
hint
password visibility toggle
```

### App Select

Use for:

```text
roles
team types
plan types
pitch types
booking statuses
subscription statuses
payment statuses
coach selection
team selection
member selection
plan selection
pitch selection
```

### App Table

Features:

```text
search
client-side filtering
empty state
loading rows
row actions
status badges
responsive stacked rows on mobile
```

### App Dialog

Use for create/edit forms and delete confirmation.

### App Badge

Status mapping:

```text
Active: green
Pending: amber
Inactive: gray
Expired: red
Paid: green
Cancelled: red
Confirmed: green
Available: green
Unavailable: red
```

## Layouts

### Public Layout

Sections:

1. Top navigation with logo, plans, coaches, login, join button.
2. Landing page first viewport with real club feeling.
3. Sport strips for Football, Basketball, Swimming, Padel.
4. Plan preview.
5. Coach preview.
6. Pitch booking teaser.
7. Footer.

Hero idea:

```text
ClubPulse
Train. Book. Compete. Belong.
```

Do not use a plain gradient hero. Use a full-width athletic layout with layered pitch lines, schedule tiles, live availability chips, and action buttons integrated into the scene.

### Dashboard Layout

Desktop:

```text
left sidebar
top command bar
main content
```

Mobile:

```text
top bar
bottom navigation for core actions
slide-over menu for secondary actions
```

Sidebar should change by role.

Admin nav:

```text
Dashboard
Coaches
Members
Teams
Plans
Pitches
Subscriptions
Bookings
Activities
```

Coach nav:

```text
Dashboard
My Activities
My Bookings
Teams
```

Member nav:

```text
Dashboard
Book Pitch
My Bookings
Subscriptions
Activities
Teams
```

## Page Plan

### Public Landing

Needs:

1. Premium hero.
2. Clear login/join actions.
3. Featured plans from `/api/admin/plans`.
4. Featured coaches from `/api/admin/coaches` if public access is allowed.
5. Club sports list.
6. Responsive mobile layout.
7. Dark/light toggle.

If backend auth blocks public access to plans/coaches, either:

1. Create public backend endpoints later, or
2. Use static landing content until the user logs in.

### Auth Pages

Login:

1. Email/password.
2. Submit to `/api/Account/login`.
3. Store token.
4. Decode role.
5. Redirect to role dashboard.
6. Show API validation errors.

Register:

1. Public member registration with `/api/Account/register`.
2. After success, store token and redirect if token exists.
3. If role is not available in token, redirect to login with success message.

### Admin Dashboard

Data sources:

```text
GET /api/admin/coaches
GET /api/Member
GET /api/admin/teams
GET /api/admin/plans
GET /api/admin/pitches
GET /api/subscriptions
GET /api/bookings
GET /api/admin/bookings/today
GET /api/activities
```

Widgets:

1. Total members.
2. Active subscriptions.
3. Today bookings.
4. Available pitches.
5. Coaches count.
6. Revenue preview from `amountPaid`.
7. Booking timeline.
8. Team capacity snapshot.

Make it useful, not decorative. Every card should help admin decide something.

### Admin Coaches

Use:

```text
GET /api/admin/coaches
POST /api/admin/coaches
PUT /api/admin/coaches/{id}
DELETE /api/admin/coaches/{id}
```

UI:

1. Table with name, email, phone, specialization, hire date.
2. Create coach dialog.
3. Edit profile dialog.
4. Delete confirmation.
5. Filter by specialization.

### Admin Members

Use:

```text
GET /api/Member
POST /api/Member
PUT /api/Member/{id}
DELETE /api/Member/{id}
```

UI:

1. Table with member name, email, team, subscription status, joined date.
2. Create member dialog.
3. Edit member dialog.
4. Assign team.
5. Subscription status badge.

### Admin Teams

Use:

```text
GET /api/admin/teams
POST /api/admin/teams
PUT /api/admin/teams/{id}
DELETE /api/admin/teams/{id}
```

UI:

1. Team grid or table.
2. Type filters.
3. Coach assignment.
4. Members count.
5. Create/edit dialogs.

### Admin Plans

Use:

```text
GET /api/admin/plans
POST /api/admin/plans
PUT /api/admin/plans/{id}
DELETE /api/admin/plans/{id}
```

UI:

1. Plan cards with price and duration.
2. Active/inactive toggle.
3. Subscription count.
4. Create/edit dialogs.

### Admin Pitches

Use:

```text
GET /api/admin/pitches
POST /api/admin/pitches
PUT /api/admin/pitches/{id}
DELETE /api/admin/pitches/{id}
```

UI:

1. Pitch availability board.
2. Pitch type filter.
3. Price per hour.
4. Booking count.
5. Available/unavailable toggle.

### Admin Subscriptions

Use:

```text
GET /api/subscriptions
GET /api/admin/subscriptions?status=all
GET /api/admin/subscriptions?status=Active
POST /api/subscriptions
PUT /api/subscriptions/{id}
DELETE /api/subscriptions/{id}
```

UI:

1. Status tabs: all, pending, active, inactive, expired.
2. Payment status filter.
3. Member and plan names.
4. Start/end dates.
5. Create/edit dialogs.

### Admin Bookings

Use:

```text
GET /api/bookings
GET /api/admin/bookings/today
POST /api/bookings
PUT /api/bookings/{id}
DELETE /api/bookings/{id}
```

UI:

1. Calendar-like list.
2. Today view.
3. Pitch filter.
4. Status filter.
5. Booking create/edit dialog.
6. Show price calculation before submit.

### Admin Activities

Use:

```text
GET /api/activities
POST /api/activities
PUT /api/activities/{id}
DELETE /api/activities/{id}
```

UI:

1. Activity schedule.
2. Coach and team assignment.
3. Capacity display.
4. Active/inactive filter.

### Coach Dashboard

Use:

```text
GET /api/coach/activities/mine
GET /api/coach/bookings/mine
GET /api/admin/teams
```

UI:

1. Today schedule.
2. Assigned activities.
3. Upcoming bookings.
4. Team cards.
5. Quick status overview.

### Coach Activities

Use:

```text
GET /api/coach/activities/mine
GET /api/activities/{id}
PUT /api/activities/{id}
```

If coaches should create activities, keep:

```text
POST /api/activities
```

Only allow the frontend route if backend role policy allows it.

### Coach Bookings

Use:

```text
GET /api/coach/bookings/mine
GET /api/bookings/{id}
DELETE /api/bookings/{id}
```

UI:

1. Upcoming list.
2. Cancel/delete if backend policy allows.
3. Pitch and member info.

### Member Dashboard

Use:

```text
GET /api/member/bookings/mine
GET /api/member/subscriptions/mine
GET /api/activities
GET /api/admin/pitches
```

UI:

1. Next booking.
2. Active subscription.
3. Recommended activities.
4. Quick book pitch action.
5. Subscription status.

### Member Book Pitch

Use:

```text
GET /api/admin/pitches
GET /api/admin/coaches
POST /api/bookings
```

UI flow:

1. Select pitch type.
2. Pick date.
3. Pick time range.
4. Optional coach.
5. Confirm price.
6. Submit booking.

Important:

The backend `CreateBookingDto` requires `memberId`. In `BookingService`, if the user is in role `Member`, it replaces `dto.MemberId` with the logged-in member id. Still send a safe placeholder such as `0` only if backend validation allows it. Better backend improvement: make `MemberId` nullable for member-created bookings or add a dedicated `/api/member/bookings` endpoint.

For now, recommended frontend approach:

1. If Admin creates booking, require `memberId`.
2. If Member creates booking, send current member id if you can resolve it.
3. To resolve current member id, backend currently has no `/api/member/me` endpoint. Add this backend endpoint if possible.

Recommended backend endpoint to add later:

```http
GET /api/member/me
```

Response:

```ts
ApiResponse<MemberDto>
```

This will make member booking fully clean.

### Member My Bookings

Use:

```text
GET /api/member/bookings/mine
PUT /api/bookings/{id}
DELETE /api/bookings/{id}
```

UI:

1. Upcoming bookings.
2. Booking history.
3. Status badges.
4. Cancel only before start time.

### Member Subscriptions

Use:

```text
GET /api/member/subscriptions/mine
```

UI:

1. Current subscription card.
2. History table.
3. Payment status.
4. Plan details.

## Backend Gaps To Consider Before Final Frontend

The frontend can be built now, but these backend improvements would make it cleaner:

1. Add `/api/member/me`.
2. Add `/api/coach/me`.
3. Return `role` in `UserDto` after login/register.
4. Change `/api/Member` to `/api/admin/members`.
5. Add public read endpoints for landing page:

```text
GET /api/public/plans
GET /api/public/coaches
GET /api/public/pitches
```

6. Add response types to controller actions for better OpenAPI generation.
7. Decide exactly which activity endpoints Coach can create/update/delete.
8. Decide whether Member can update bookings or only cancel them.

## Dark And Light Mode

Use class strategy:

```ts
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private key = 'club_theme';
  theme = signal<'light' | 'dark'>('light');

  init() {
    const saved = localStorage.getItem(this.key) as 'light' | 'dark' | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.setTheme(saved ?? preferred);
  }

  setTheme(theme: 'light' | 'dark') {
    this.theme.set(theme);
    localStorage.setItem(this.key, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

  toggle() {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }
}
```

Call `themeService.init()` in the root component.

## Responsive Rules

Breakpoints:

```text
mobile: < 640px
tablet: 640px - 1024px
desktop: > 1024px
```

Mobile:

1. Tables become stacked list rows.
2. Dialogs become full-screen sheets.
3. Sidebar becomes drawer or bottom nav.
4. Forms use one column.
5. Primary action remains sticky at the bottom for booking flow.

Desktop:

1. Admin pages use tables with dense spacing.
2. Dashboards use 12-column grids.
3. Forms can use two columns.
4. Main content width should be constrained where readability matters.

## Loading And Error States

Every data page must implement:

```text
loading
loaded
empty
error
submitting
deleting
```

Do not leave blank pages while loading. Use skeleton rows for tables and muted blocks for cards.

## Toast Strategy

Success:

```text
Created successfully
Updated successfully
Deleted successfully
Booking confirmed
```

Error:

Use backend `message` first, then `errors`, then fallback.

```ts
function getApiMessage<T>(response: ApiResponse<T>): string {
  return response.errors?.join(', ') || response.message || 'Done';
}
```

## Implementation Order

Build in this order:

1. Create Angular 21 app.
2. Install Tailwind and helper packages.
3. Add theme variables and base layout styles.
4. Add environment API base URL.
5. Add core models.
6. Add API route constants.
7. Add `ApiService`.
8. Add `AuthService`.
9. Add auth/error interceptors.
10. Add guards.
11. Add public/auth/dashboard layouts.
12. Add shared UI components.
13. Build login/register.
14. Build admin CRUD pages.
15. Build coach dashboard and pages.
16. Build member dashboard and booking flow.
17. Add responsive polish.
18. Add dark mode polish.
19. Add final testing checklist.

## Testing Checklist

### Backend Running

Start backend:

```powershell
cd E:\ITI-intake46\Full-Stack-Project\Backend\Club
dotnet run --project Club.Api\Club.Api.csproj
```

Check:

```text
https://localhost:7293/swagger
https://localhost:7293/scalar
```

### Frontend Running

Start frontend:

```powershell
cd E:\ITI-intake46\Full-Stack-Project\Frontend\club-frontend
ng serve
```

Visit:

```text
http://localhost:4200
```

### Auth Tests

1. Login with admin.
2. Token is stored.
3. Token is attached to requests.
4. Admin goes to `/admin/dashboard`.
5. Coach cannot access `/admin`.
6. Member cannot access `/admin` or `/coach`.
7. Logout clears token and redirects to login.
8. Expired token redirects to login.

### Admin Tests

1. Create coach.
2. Update coach.
3. Delete coach.
4. Create member.
5. Assign member to team.
6. Create team.
7. Create plan.
8. Create pitch.
9. Create subscription.
10. Create booking.
11. Create activity.
12. Filter subscriptions by status.
13. View today's bookings.

### Coach Tests

1. Login as coach.
2. See own activities.
3. See own bookings.
4. Cannot see admin pages.

### Member Tests

1. Login as member.
2. See own bookings.
3. See own subscriptions.
4. Book a pitch.
5. Cannot book with end time before start time.
6. Cannot access admin pages.

### Responsive Tests

Test:

```text
360px mobile
430px mobile
768px tablet
1024px laptop
1440px desktop
```

Make sure:

1. No text overlaps.
2. Tables are usable on mobile.
3. Dialogs fit mobile screens.
4. Sidebar does not crush content.
5. Booking flow stays clear.
6. Dark mode is readable everywhere.

## Suggested Final Product Name

Use one of these or create your own:

```text
ClubPulse
ArenaHub
Sportiva Club
CourtFlow
ClubMotion
```

Recommended: `ClubPulse`.

It sounds active, premium, and product-like without being generic.

## Final Frontend Definition Of Done

The frontend is ready when:

1. All backend endpoints are represented by Angular services.
2. All DTOs have matching TypeScript interfaces.
3. JWT login works.
4. Role dashboards are separated.
5. Admin can manage coaches, members, teams, plans, pitches, subscriptions, bookings, and activities.
6. Coach can see assigned activities and bookings.
7. Member can see subscriptions and bookings.
8. Booking form validates date/time/pitch/price.
9. Dark and light modes are polished.
10. Layout is responsive on mobile, tablet, and desktop.
11. API errors are shown cleanly.
12. Empty/loading states exist on every page.
13. The UI feels like a sports club product, not a generic dashboard.

## Official References

1. Angular CLI `ng new`: https://angular.dev/cli/new
2. Angular standalone recommendation: https://angular.dev/guide/ngmodules/overview
3. Angular routing: https://angular.dev/guide/routing
4. Angular file structure: https://angular.dev/reference/configs/file-structure
5. Tailwind CSS with Angular: https://tailwindcss.com/docs/guides/angular
