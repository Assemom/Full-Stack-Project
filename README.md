# 🏋️ Sport Club Management Platform — Full-Stack Project

<div align="center">

![Angular](https://img.shields.io/badge/Angular-21-dd0031?logo=angular&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-10-512bd4?logo=dotnet&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-cc2927?logo=microsoft-sql-server&logoColor=white)
![SignalR](https://img.shields.io/badge/SignalR-realtime-9b009b)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

A complete **Sport Club Management Platform** built with an **ASP.NET Core 10 REST API** (Clean Architecture) and an **Angular 21** single-page application. Members browse and book activities, pitches, teams, and subscriptions; coaches manage their activities and approve join requests; admins get full control with a statistics dashboard — all with **real-time notifications via SignalR**.

> 🎓 Developed as a Full-Stack graduation/ITI project.

---

## ✨ Features

### 👤 Members
- Register / login with **JWT authentication & role-based access**
- Browse public activities, coaches, pitches, teams, and subscription plans
- Join teams and request club subscriptions
- **Book pitches** and manage personal bookings
- Personal dashboard, profile, and profile-image upload

### 🏃 Coaches
- Coach dashboard with assigned activities and bookings
- Manage their teams and **approve / reject member join requests**
- Profile management

### 🛠️ Admins
- Full CRUD over users, members, coaches, activities, pitches, plans, subscriptions, teams, and bookings
- Statistics dashboard, contact inbox, and join-request review
- Seeded admin account with roles: `Admin`, `Coach`, `Member`

### ⚡ Cross-cutting
- **Real-time notifications** pushed to the SPA over a SignalR hub (`/hubs/notifications`)
- Swagger UI **and** Scalar API documentation (dev only)
- Rate-limited login endpoint, global exception-handling middleware, CORS policy for the dev SPA

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Angular 21 (standalone components), TypeScript, Tailwind CSS 4, RxJS |
| **Real-time** | `@microsoft/signalr` client ↔ SignalR `NotificationHub` |
| **Backend** | ASP.NET Core Web API (.NET 10), EF Core 10, ASP.NET Identity |
| **Auth** | JWT Bearer tokens (`jwt-decode` on the client) + role-based authorization |
| **Mapping** | AutoMapper |
| **Database** | SQL Server (`SportClub`) |
| **API docs** | Swagger (Swashbuckle) + Scalar |

---

## 🏛️ Backend Architecture (Clean Architecture)

```
Backend/Club/
├── Club.Api          # API entry point — controllers, hubs, middleware, Program.cs
├── Club.Service      # Business logic — DTOs, services, AutoMapper profiles
├── Club.Repository   # Data access — EF Core, generic repositories, UnitOfWork
└── Club.Core         # Shared kernel — entities, enums, interfaces, contracts
```

Dependencies flow inward: `Api → Service → Repository → Core`, keeping business logic independent of EF Core and HTTP concerns.

### API Endpoints (14 controllers)

`Account` · `Activity` · `Booking` · `Coach` · `Contact` · `Dashboard` · `JoinRequest` · `Member` · `Pitch` · `Plan` · `Subscription` · `Team` · `Upload` · `User`

---

## 🖼️ Frontend Structure

```
Frontend/club-frontend/src/app/
├── core/            # Guards, HTTP interceptors, services, models
├── public/          # Landing page + listing/detail pages for activities, coaches, pitches, teams, plans
├── auth/            # Login & register
├── admin/           # Admin dashboard modules (users, bookings, pitches, plans, …)
├── coach/           # Coach dashboard modules (activities, teams, join requests, …)
├── member/          # Member dashboard modules (bookings, subscriptions, teams, …)
└── shared/          # Reusable UI kit: table, input, select, button, dialog,
                     # confirm-dialog, pagination, stat, loader, theme-toggle
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| [.NET SDK](https://dotnet.microsoft.com/download) | 10.0 |
| [Node.js](https://nodejs.org/) | 20+ |
| [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) | LocalDB / SQL Express / any instance |
| Angular CLI | `npm i -g @angular/cli` |

### 1️⃣ Backend

```bash
cd Backend/Club/Club.Api

# 1. Configure your connection string in appsettings.json
#    "ConnectionStrings": { "defaultconnection": "Server=.\\SQLexpress;Database=SportClub;..." }
#
# 2. ⚠️ Move the JWT secret out of source control:
#    dotnet user-secrets init
#    dotnet user-secrets set "Jwt:Key" "<your-strong-secret>"
#
# 3. Run (applies migrations & seeds roles + admin on startup)
dotnet run
```

The API is served at **`https://localhost:7293`** with:
- Swagger UI → `https://localhost:7293/swagger`
- Scalar docs → `https://localhost:7293/scalar`
- SignalR hub → `https://localhost:7293/hubs/notifications`

### 2️⃣ Frontend

```bash
cd Frontend/club-frontend
npm install
npm start        # angular dev server on http://localhost:4200
```

The SPA talks to the API via `src/environments/environment.ts` → `apiBaseUrl: 'https://localhost:7293'` (already set to the default backend port).

Open **http://localhost:4200** and log in with the seeded admin credentials, or register as a new member.

---

## 🔐 Security Notes

- **JWT secret** is currently in `appsettings.json` for local demo purposes — move it to **user secrets** (`dotnet user-secrets`) or environment variables before any real deployment.
- Connection string uses Windows Integrated Security and contains no passwords; still, keep per-environment values outside source control.
- Login endpoint is rate-limited to help brute-force resistance.

---

## 📸 Screenshots

*(Add screenshots of the landing page, admin dashboard, and member booking flow here.)*

---

## 🛣️ Roadmap

- [ ] Refresh tokens & logout revocation
- [ ] Payment integration for subscriptions
- [ ] Email verification & password reset flows
- [ ] Docker Compose for one-command startup
- [ ] CI/CD pipeline (GitHub Actions)

---

<div align="center">

**Assem Omar** — Full-Stack Developer

</div>
