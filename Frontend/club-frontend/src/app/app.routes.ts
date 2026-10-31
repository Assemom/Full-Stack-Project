import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/public/landing/landing.component').then((m) => m.LandingComponent) },
      { path: 'plans', loadComponent: () => import('./features/public/plans-preview/plans-preview.component').then((m) => m.PlansPreviewComponent) },
      { path: 'coaches', loadComponent: () => import('./features/public/coaches-preview/coaches-preview.component').then((m) => m.CoachesPreviewComponent) },
      { path: 'coaches/:id', loadComponent: () => import('./features/public/coach-detail/coach-detail.component').then((m) => m.CoachDetailComponent) },
      { path: 'activities', loadComponent: () => import('./features/public/activities-list/activities-list.component').then((m) => m.ActivitiesListComponent) },
      { path: 'activities/:id', loadComponent: () => import('./features/public/activity-detail/activity-detail.component').then((m) => m.ActivityDetailComponent) },
      { path: 'teams', loadComponent: () => import('./features/public/teams-list/teams-list.component').then((m) => m.TeamsListComponent) },
      { path: 'teams/:id', loadComponent: () => import('./features/public/team-detail/team-detail.component').then((m) => m.TeamDetailComponent) },
      { path: 'pitches', loadComponent: () => import('./features/public/pitches-list/pitches-list.component').then((m) => m.PitchesListComponent) },
      { path: 'pitches/:id', loadComponent: () => import('./features/public/pitch-detail/pitch-detail.component').then((m) => m.PitchDetailComponent) },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent) },
    ],
  },
  {
    path: 'admin',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent) },
      { path: 'coaches', loadComponent: () => import('./features/admin/coaches/admin-coaches.component').then((m) => m.AdminCoachesComponent) },
      { path: 'members', loadComponent: () => import('./features/admin/members/admin-members.component').then((m) => m.AdminMembersComponent) },
      { path: 'teams', loadComponent: () => import('./features/admin/teams/admin-teams.component').then((m) => m.AdminTeamsComponent) },
      { path: 'plans', loadComponent: () => import('./features/admin/plans/admin-plans.component').then((m) => m.AdminPlansComponent) },
      { path: 'pitches', loadComponent: () => import('./features/admin/pitches/admin-pitches.component').then((m) => m.AdminPitchesComponent) },
      { path: 'subscriptions', loadComponent: () => import('./features/admin/subscriptions/admin-subscriptions.component').then((m) => m.AdminSubscriptionsComponent) },
      { path: 'bookings', loadComponent: () => import('./features/admin/bookings/admin-bookings.component').then((m) => m.AdminBookingsComponent) },
      { path: 'activities', loadComponent: () => import('./features/admin/activities/admin-activities.component').then((m) => m.AdminActivitiesComponent) },
      { path: 'join-requests', loadComponent: () => import('./features/admin/join-requests/admin-join-requests.component').then((m) => m.AdminJoinRequestsComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/users/admin-users.component').then((m) => m.AdminUsersComponent) },
    ],
  },
  {
    path: 'coach',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Coach'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/coach/dashboard/coach-dashboard.component').then((m) => m.CoachDashboardComponent) },
      { path: 'profile', loadComponent: () => import('./features/coach/profile/coach-profile.component').then((m) => m.CoachProfileComponent) },
      { path: 'activities', loadComponent: () => import('./features/coach/my-activities/my-activities.component').then((m) => m.MyActivitiesComponent) },
      { path: 'bookings', loadComponent: () => import('./features/coach/my-bookings/my-bookings.component').then((m) => m.MyBookingsComponent) },
      { path: 'teams', loadComponent: () => import('./features/coach/teams/coach-teams.component').then((m) => m.CoachTeamsComponent) },
      { path: 'join-requests', loadComponent: () => import('./features/coach/join-requests/coach-join-requests.component').then((m) => m.CoachJoinRequestsComponent) },
    ],
  },
  {
    path: 'member',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Member'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/member/dashboard/member-dashboard.component').then((m) => m.MemberDashboardComponent) },
      { path: 'profile', loadComponent: () => import('./features/member/profile/profile.component').then((m) => m.ProfileComponent) },
      { path: 'book', loadComponent: () => import('./features/member/book-pitch/book-pitch.component').then((m) => m.BookPitchComponent) },
      { path: 'bookings', loadComponent: () => import('./features/member/my-bookings/my-bookings.component').then((m) => m.MyBookingsComponent) },
      { path: 'subscriptions', loadComponent: () => import('./features/member/my-subscriptions/my-subscriptions.component').then((m) => m.MySubscriptionsComponent) },
      { path: 'activities', loadComponent: () => import('./features/member/activities/member-activities.component').then((m) => m.MemberActivitiesComponent) },
      { path: 'teams', loadComponent: () => import('./features/member/teams/member-teams.component').then((m) => m.MemberTeamsComponent) },
      { path: 'join-requests', loadComponent: () => import('./features/member/join-requests/member-join-requests.component').then((m) => m.MemberJoinRequestsComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
