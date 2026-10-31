# 🏋️ Club Frontend — Angular 21 SPA

The Angular client for the **Sport Club Management Platform**. It talks to the ASP.NET Core 10 API (`https://localhost:7293`) and receives real-time notifications over SignalR.

![Angular](https://img.shields.io/badge/Angular-21-dd0031?logo=angular&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)

## ✨ Highlights

- **Angular 21 standalone components** — no NgModules
- **Role-based routing** with guards: separate dashboards for **Admin**, **Coach**, and **Member**
- **Admin** — full management tables for users, members, coaches, activities, bookings, pitches, plans, subscriptions, teams, and join requests + statistics dashboard
- **Coach** — assigned activities, bookings, teams, join-request approvals, profile
- **Member** — browse activities/coaches/pitches/teams/plans, book pitches, manage bookings & subscriptions, profile
- **Shared UI kit** — `app-table`, `app-input`, `app-select`, `app-button`, `app-dialog`, `app-confirm-dialog`, `app-pagination`, `app-stat`, `app-loader`, `theme-toggle`
- **Real-time** — interactive notifications via `@microsoft/signalr` (`/hubs/notifications`)
- **Auth** — JWT stored client-side, HTTP interceptor attaches tokens, `jwt-decode` for role claims
- **Toasts** — `ngx-toastr`; **Icons** — `@lucide/angular`

## 🚀 Getting Started

```bash
npm install
npm start        # dev server → http://localhost:4200
```

Other scripts:

| Command | Description |
|---|---|
| `npm run build` | Production build to `dist/` |
| `npm test` | Unit tests (Vitest) |
| `npm run format` | Prettier formatting |

### Configuration

API base URL lives in `src/environments/environment.ts` (and `environment.prod.ts` for production builds):

```ts
apiBaseUrl: 'https://localhost:7293'
```

The backend must be running first — see the [root README](../../README.md#-getting-started) for backend setup.

## 🗂️ Project Structure

```
src/app/
├── core/        # Guards, interceptors, services, models
├── public/      # Landing + public listing/detail pages
├── auth/        # Login & register
├── admin/       # Admin dashboard modules
├── coach/       # Coach dashboard modules
├── member/      # Member dashboard modules
└── shared/      # Reusable UI kit components
```

## 📖 More Docs

- `GUIDE.md` — frontend-specific developer guide
- [`FRONTEND_GUIDE.md`](../FRONTEND_GUIDE.md) — broader frontend conventions
