# SportClub — Full System Guide

A full-stack sports club management system built with **Angular 21** (standalone components) and **ASP.NET Core 10** (clean architecture / 4-layer).

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [How to Run](#how-to-run)
3. [Default Credentials](#default-credentials)
4. [Roles Overview](#roles-overview)
5. [Public Features (no login required)](#public-features-no-login-required)
6. [Member Flow](#member-flow)
7. [Coach Flow](#coach-flow)
8. [Admin Flow](#admin-flow)
9. [Feature Inventory](#feature-inventory)
10. [API Endpoint Reference](#api-endpoint-reference)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 21, standalone components, Signals, RxJS |
| **Styling** | Tailwind CSS, ngx-toastr, Lucide icons |
| **Backend** | ASP.NET Core 10 (.NET 10) |
| **Architecture** | Clean architecture: Core → Repository → Service → Api |
| **ORM** | Entity Framework Core with SQL Server |
| **Auth** | ASP.NET Core Identity + JWT Bearer tokens |
| **Real-time** | SignalR (notifications) |
| **Maps** | AutoMapper |
| **Docs** | Scalar API Reference + Swagger UI |

---

## How to Run

### Backend

```bash
cd Backend/Club/Club.Api
dotnet run
```

The API starts at `https://localhost:7293`.  
Swagger UI: `https://localhost:7293/swagger`  
Scalar: `https://localhost:7293/scalar/v1`

### Frontend

```bash
cd Frontend/club-frontend
npm install
ng serve
```

Opens at `http://localhost:4200`.

### Database

Connection string is in `Club.Api/appsettings.json`. The app seeds an Admin user on first run.  
Run `Update-Database` in `Club.Repository` if migrations are pending.

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@gmail.com` | `Admin123@` |

There are no pre-seeded Coach or Member accounts — create them from the Admin dashboard, or register via the public register page.

---

## Roles Overview

Three roles, each with a dedicated dashboard:

| Role | Dashboard Route | Description |
|------|----------------|-------------|
| **Admin** | `/admin/dashboard` | Full control — manage coaches, members, teams, plans, pitches, bookings, subscriptions, activities, join requests, users |
| **Coach** | `/coach/dashboard` | Assigned activities, bookings, team management |
| **Member** | `/member/dashboard` | Book pitches, manage subscriptions, browse activities/teams, send join requests |

---

## Public Features (no login required)

Anyone visiting the landing page (`/`) can:

- Browse the **hero** section with a call to action
- See **sports showcase** (Football, Basketball, Swimming, Padel)
- View **about stats** (500+ members, 15 coaches, etc.)
- Browse **plans** (`/plans`) — see pricing, subscribe if logged in
- Browse **coaches** (`/coaches`) — view profiles, specializations
- Browse **activities** (`/activities`) — see scheduled activities
- Browse **teams** (`/teams`) — see available teams
- Browse **pitches** (`/pitches`) — see available pitches
- Use the **contact form** to send inquiries
- **Register** (`/auth/register`) or **Login** (`/auth/login`)

---

## Member Flow

### First-time setup
1. Register at `/auth/register` with email + password.
2. On first login, the system auto-creates your Member profile.
3. You land on the **Member dashboard** (`/member/dashboard`) with stats.

### Navigation (sidebar)
| Page | Path | Purpose |
|------|------|---------|
| **Dashboard** | `/member/dashboard` | Overview — my bookings, subscriptions, activities, available pitches |
| **Profile** | `/member/profile` | View/edit personal info, upload profile picture |
| **Book Pitch** | `/member/book` | Select a pitch, date, and time slot to create a booking |
| **My Bookings** | `/member/bookings` | View your bookings, cancel pending/confirmed bookings |
| **My Subscriptions** | `/member/subscriptions` | View active/past subscriptions, browse plans, cancel subscriptions |
| **Activities** | `/member/activities` | Browse activities, request to join |
| **Teams** | `/member/teams` | Browse teams, request to join |
| **Join Requests** | `/member/join-requests` | Track your join request statuses |

### Subscription flow (end-to-end)
1. Browse plans at `/plans` or click **"Subscribe to new plan"** from `/member/subscriptions`.
2. Click **Subscribe** on any active plan.
3. After success, you're redirected to `/member/subscriptions` where your new subscription appears as a card.
4. To cancel, click the **"Cancel subscription"** button on any Active or Pending subscription card.
5. Confirm in the dialog — the status changes to Inactive.

### Booking flow
1. Go to `/member/book`.
2. Select a pitch from the dropdown (only available pitches shown).
3. Pick a date (today or future).
4. Set start and end times.
5. See the estimated price calculated live.
6. Submit — a booking is created with Pending status.
7. View/manage your bookings at `/member/bookings`.

---

## Coach Flow

### Getting started
1. An admin must create your coach account from `/admin/coaches`.
2. Log in with the provided credentials.
3. Land on the **Coach dashboard** (`/coach/dashboard`) with stats.

### Navigation (sidebar)
| Page | Path | Purpose |
|------|------|---------|
| **Dashboard** | `/coach/dashboard` | Overview — my activities, bookings, teams |
| **Profile** | `/coach/profile` | View/edit personal info, upload profile picture |
| **Activities** | `/coach/activities` | View activities assigned to you |
| **My Bookings** | `/coach/bookings` | View bookings assigned to you, **Confirm** or **Cancel** them |
| **Teams** | `/coach/teams` | View teams you coach |
| **Join Requests** | `/coach/join-requests` | Review and respond to team/activity join requests |

### Booking management
- On the **My Bookings** page, each booking row has **Confirm** and **Cancel** action buttons.
- Click **Confirm** to change booking status to Confirmed.
- Click **Cancel** to change status to Cancelled.
- Status changes trigger a real-time notification to the affected member via SignalR.

---

## Admin Flow

### Getting started
1. Use the default admin credentials: `admin@gmail.com` / `Admin123@`.
2. Land on the **Admin dashboard** (`/admin/dashboard`) with full system stats.

### Navigation (sidebar)
| Page | Path | Purpose |
|------|------|---------|
| **Dashboard** | `/admin/dashboard` | Live counts — members, subscriptions, bookings, coaches, teams, activities, revenue |
| **Coaches** | `/admin/coaches` | CRUD — create/edit/delete coach accounts |
| **Members** | `/admin/members` | CRUD — create/edit/delete member accounts |
| **Teams** | `/admin/teams` | CRUD — create/edit/delete teams, assign coaches |
| **Plans** | `/admin/plans` | CRUD — create/edit/delete subscription plans |
| **Pitches** | `/admin/pitches` | CRUD — create/edit/delete pitches |
| **Subscriptions** | `/admin/subscriptions` | View all subscriptions, filter by status, edit/delete |
| **Bookings** | `/admin/bookings` | View all bookings, edit/delete |
| **Activities** | `/admin/activities` | CRUD — create/edit/delete activities, assign coaches/teams |
| **Join Requests** | `/admin/join-requests` | View all join requests, approve/reject |
| **Users** | `/admin/users` | View all registered users, their roles, and account status |

### Admin capabilities
- All list pages support **pagination**, **search**, and **sorting**.
- Create/Edit dialogs for all entities.
- Delete with confirmation dialog.
- Manage user accounts from the **Users** page.

---

## Feature Inventory

### Authentication & Authorization
- [x] Register / Login
- [x] JWT-based authentication
- [x] Role-based access (Admin, Coach, Member)
- [x] Auth guards (route protection)
- [x] Rate limiting on login (10 req/min)

### User Profiles
- [x] Profile page for Members and Coaches
- [x] Edit personal info (name, phone, address, bio, specialization)
- [x] Profile picture upload (shared endpoint)
- [x] Image error fallback (shows initial letter with colored background)

### Bookings
- [x] Create booking with date/time slot selection
- [x] Overlap detection (backend)
- [x] Auto price calculation (hours × pitch rate)
- [x] Member view: list + cancel own bookings
- [x] Coach view: list assigned bookings + confirm/cancel
- [x] Admin view: all bookings CRUD
- [x] Pagination + search

### Subscriptions
- [x] Plans CRUD (admin)
- [x] Public plans page with pricing
- [x] Subscribe button for authenticated members
- [x] Post-subscribe redirect to subscription list
- [x] Rich card view (plan name, type, dates, amount, status badges)
- [x] Cancel subscription with confirmation
- [x] Active-scope sorted (active first)

### Teams & Activities
- [x] Public browse + detail pages
- [x] CRUD (admin)
- [x] Request to join (from team/activity detail pages)
- [x] Join request management (approve/reject)

### Real-time Notifications (SignalR)
- [x] Notification hub (`/hubs/notifications`)
- [x] Connection with auth token
- [x] Automatic reconnect
- [x] Unread count badge
- [x] Toast notifications on receive
- [x] Mark all as read
- [x] Notifications triggered on: booking confirmed/cancelled, subscription created, join request approved/rejected

### Contact & Inquiries
- [x] Public contact form on landing page
- [x] Submits to API, stored in database

### UI/UX Polish
- [x] Dark/light theme toggle (persisted to localStorage)
- [x] Responsive layout (mobile sidebar, bottom nav)
- [x] Loading spinners
- [x] Empty states with CTAs
- [x] Error handling with toasts
- [x] Confirmation dialogs for destructive actions
- [x] Search debouncing (250ms)
- [x] Back-to-top scroll button
- [x] Avatar initials with consistent colors
- [x] Global CSS custom properties for theming
- [x] Animations (fade-up, scale-in)

### Admin Tools
- [x] Dashboard with key metrics
- [x] Paginated CRUD for all entities
- [x] User management (view all users with roles)
- [x] Status filtering on subscriptions, join requests

---

## API Endpoint Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/Account/login` | No | Login, returns JWT |
| POST | `/api/Account/register` | No | Register new user |
| POST | `/api/upload/profile-image` | Yes | Upload profile picture |
| POST | `/api/contact` | No | Submit contact inquiry |
| GET | `/api/admin/users` | Admin | List all users with roles |
| GET | `/api/admin/coaches` | No* | List coaches (paginated) |
| POST | `/api/admin/coaches` | Admin | Create coach |
| PUT | `/api/admin/coaches/{id}` | Admin | Update coach |
| DELETE | `/api/admin/coaches/{id}` | Admin | Delete coach |
| GET | `/api/coach/profile` | Coach | Get own coach profile |
| PUT | `/api/coach/profile` | Coach | Update own coach profile |
| GET | `/api/member/profile` | Member | Get own member profile |
| PUT | `/api/member/profile` | Member | Update own member profile |
| GET | `/api/admin/members` | Admin | List members |
| GET | `/api/admin/teams` | No* | List teams |
| GET | `/api/admin/plans` | No* | List plans |
| GET | `/api/admin/pitches` | No* | List pitches |
| POST | `/api/subscriptions` | Yes | Create subscription |
| GET | `/api/member/subscriptions/mine` | Member | Get own subscriptions |
| GET | `/api/bookings` | Yes | List bookings |
| POST | `/api/bookings` | Yes | Create booking |
| GET | `/api/coach/bookings/mine` | Coach | Get own coach bookings |
| GET | `/api/member/bookings/mine` | Member | Get own member bookings |
| GET | `/api/activities` | No | List activities |
| GET | `/api/JoinRequest/mine` | Yes | Get own join requests |
| POST | `/api/JoinRequest` | Yes | Create join request |
| PUT | `/api/JoinRequest/respond` | Coach/Admin | Approve/reject request |
| GET | `/api/Dashboard/admin` | Admin | Admin dashboard stats |
| GET | `/api/Dashboard/member` | Member | Member dashboard stats |
| GET | `/api/Dashboard/coach` | Coach | Coach dashboard stats |

> `*` Some GET endpoints are `[AllowAnonymous]` — they return data without auth on public pages.

---

## Key Architecture Decisions

- **Clean Architecture**: `Club.Core` (entities/DTOs) → `Club.Repository` (EF/unit of work) → `Club.Service` (business logic) → `Club.Api` (controllers)
- **NotificationService** lives in the API layer because it depends on `IHubContext<NotificationHub>`, but its interface `INotificationService` stays in `Club.Service` (Dependency Inversion)
- **EmailService** is registered but currently logs to console — ready for MailKit integration when SMTP credentials are configured
- **Pagination** uses `page=0` sentinel value for "return all" — existing callers without pagination params work unchanged
- **JWT** issuer/audience validation is currently disabled (`ValidateIssuer = false`, `ValidateAudience = false`) — enable for production
- **CORS** allows `localhost:4200`, `localhost:5173`, `localhost:3000` — configure for production
